import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { Observable, Subscription, zip, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'
import { Product } from './products-module/product-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseFireService {

  constructor(
    private fire: AngularFirestore,
    private http: HttpClient,
  ) { 
    // this.fire.firestore.disableNetwork()
  }






  // GET COLLECTION BY NAME 
  // __OBSERVABLE__

  getCollection<T>(collectionName: string): Observable<T[]> {
    return this.fire.collection<T>(collectionName).valueChanges()
  }



  getDocumentById<T>(collectionName: string, id: string): Observable<T> {

    return this.fire.collection<T>(collectionName).doc<T>(id).valueChanges()

  }

  // GET DOCUMENTS ARRAY BY ARRAY OF ID
  // __OBSERVABLE__

  getDucumentsArray<T>(collectionName: string, idArray: string[]): Observable<T[]> {

    const documents: Array<Observable<T>> = []
    idArray.forEach(id => {
      documents.push(this.getDocumentById<T>(collectionName, id))
    })
    return zip(...documents)

  }



  // GET COLLECTION WITH DOCUMENTS' ID
  // __OBSERVABLE__

  getCollectionWithIds<T>(collectionName: string): Observable<any[]> {

    return this.fire.collection<T[]>(collectionName).snapshotChanges().pipe(
      map(collection => {
        return collection.map(document => {
          return Object.assign({}, document.payload.doc.data(), { id: document.payload.doc.id })
        })
      })
    )

  }








  // GET ARRAY FROM DOCUMENTS ID IN COLLECTION
  // __OBSERVABLE__

  getIdArray(collectionName: string): Observable<string[]> {
    return this.fire.collection(collectionName).snapshotChanges().pipe(
      map(collection => collection.map(document => document.payload.doc.id))
    )
  }





  // GET FILTERED COLLECTION BY ANY FIELDS SPECIFIED IN OPTIONS OBJECT, RESPONSE HANDLED BY CALLBACK
  // __VOID__

  dynamicQueryFilter<T>(collectionName: string, options: object, callbackFn: Function): void {

    const bindedCallback: Function = callbackFn.bind(this)

    const targetCollection = this.fire.collection(collectionName).ref
    const optionPairs = Object.entries(options)

    let queryMap = targetCollection.where(optionPairs[0][0], '==', optionPairs[0][1])

    optionPairs.slice(1).forEach(item => {
      queryMap = queryMap.where(item[0], '==', item[1])
    })

    queryMap.get()
      .then(resolve2 => {
        const documents = []
        resolve2.forEach(doc => documents.push(doc.data() as T))
        bindedCallback(documents)

      })
  }





  // GET UNIQUE ITEM FROM COLLECTION PASSING ALL OPTIONS REQUIREMENTS
  // __PROMISE__ | __ERROR THROWING__

  dynamicQueryUnique<T>(collectionName: string, options: object): Promise<T> {

    return new Promise(resolve => {

      const targetCollection = this.fire.collection(collectionName).ref
      const optionPairs = Object.entries(options)

      let queryMap = targetCollection.where(optionPairs[0][0], '==', optionPairs[0][1])

      optionPairs.slice(1).forEach(item => {
        queryMap = queryMap.where(item[0], '==', item[1])
      })

      queryMap.get()
        .then(documents => {
          if (documents.size > 1) {
            throw new Error(`
            
            DYNAMIC_QUERY_UNIQUE: ERROR.
            NOT_UNIQUE:
            
            The options you passed ${JSON.stringify(options)} are not unique.
            There are ${documents.size} documents in collection ${collectionName.toUpperCase()} matching to these requirements.

            DYNAMIC_QUERY_UNIQUE is optimised to return Promise of unique item itself , not an Array of items.
            So options should match only to one unique item or at least none of them. In that case you will receive a warning in console with appropriate message.
          `);
          }

          else if (!documents.size) {
            console.warn(`
            DYNAMIC_QUERY_UNIQUE: WARNING.

            None of documents in collection ${collectionName.toUpperCase()} matches the options you passed ${JSON.stringify(options)}.
            There are no conflicts in such scenario, just a warning to be aware.
            `);
            return;
          }
          else {
            documents.forEach(doc => resolve(doc.data() as T))
          }

        })

    })

  }





  // GET PROPERTIES OF ANY DEPTH SPECIFYING TARGET DOCUMENT AND PROPERTY PATH IN ARRAY
  // __OBSERVABLE__

  getExtractedProperty<T>(collectionName: string, id: string, targetPropertyMap: string[]): Observable<T> {
    return this.fire.collection(collectionName).doc(id).valueChanges().pipe(
      map<T, T>(response => {
        let extractedProperty = response
        targetPropertyMap.forEach(property => {
          extractedProperty = extractedProperty[property]
        })
        return extractedProperty as T
      })
    )
  }





  // POST NEW DOCUMENT IN SPECIFIED COLLECTION, RETURNS NEW DOCUMENT'S REFERENCE
  // __PROMISE__

  postData<T>(collectionName: string, payload: T): Promise<DocumentReference> {
    return this.fire.collection(collectionName).add(payload)
  }





  // POST NEW DOCUMENT IN SPECIFIED COLLECTION, RETURNS NEW DOCUMENT'S CONTENT
  // __PROMISE__

  postDataWithFeedback<T>(collectionName: string, payload: T): Promise<T> {
    return new Promise(resolve => {
      this.fire.collection(collectionName).add(payload).then(documentRef => {
        return new Promise(() => {
          documentRef.get().then(document => {
            resolve(document.data() as T)
          })
        })
      })
    })
  }





  // UPDATE SPECIFIED DOCUMENT WITH SPECIFIED PAYLOAD
  // __PROMISE<VOID>__

  updateData<T>(collectionName: string, id: string, payload: object): Promise<void> {
    return this.fire.collection<T>(collectionName).doc<T>(id).update(payload)
  }





  // PUSH DATA INTO NESTED ARRAY , RESOLVES ARRAY AFTER PUSH
  // __PROMISE__

  pushData<T>(collectionName: string, id: string, targetArrayName: string, payload: T): Promise<T[]> {

    return new Promise(resolve => {
      let subscr = this.getExtractedProperty<any[]>(collectionName, id, [targetArrayName]).subscribe(array => {
        array.push(payload)
        this.updateData(collectionName, id, { [targetArrayName]: array }).then(() => resolve(array))
        subscr.unsubscribe()
      })
    })


  }



  // GET DOCUMENT ID BY UNIQUE PROPERTY

  getDocumentIdByUnqieProperty(collectionName: string, key: string, value: any): Promise<string> {
    return new Promise(resolve => {
      return this.fire.collection(collectionName, ref => ref.where(key, '==', value))
        .snapshotChanges()
        .subscribe(res => {
          resolve(res[0].payload.doc.id)
        })
    })
  }


  getDocumentsBySearchValue<T>(collectionName: string, searchValue: string): Observable<T[] | null> {

    if (!searchValue) return of(null);

    return this.getCollectionWithIds(collectionName).pipe(
      map(data =>
        data.filter(dataF => {
          return dataF['name'].toLowerCase().includes(searchValue) ||
            dataF['brand'].toLowerCase().includes(searchValue)
        })

      )
    )
  }



  clearDocumentArray(collectionName: string, id: string, targetArrayName: string): Promise<void> {
    return this.fire.collection(collectionName).doc(id).update({ [targetArrayName]: [] })
  }








  //--------------------------------------------------------



  getCollectionByCategory<T>(collectionName: string, categoryName: string, documCategoriesName: string = 'categories'): Observable<T[]> {
    return this.fire.collection<T>(documCategoriesName, ref => ref.where('name', '==', categoryName)).stateChanges()
      .pipe(map(data =>
        data.map(res => Object.assign({}, res.payload.doc.data(), { id: res.payload.doc.id }))),
        switchMap(categoryData => this.fire.collection<T>(collectionName, ref => ref.where('category', '==', categoryData[0].id)).valueChanges())
      )
  }

  //Get Collection by Category And Quantity
  getCollectionByCategoryAndQuantity<T>(collectionName: string, categoryName: string, quantity: number, documCategoriesName: string = 'categories'): Observable<T[]> {
    return this.fire.collection<T>(documCategoriesName, ref => ref.where('name', '==', categoryName)).stateChanges()
      .pipe(map(data =>
        data.map(res => Object.assign({}, res.payload.doc.data(), { id: res.payload.doc.id }))),
        switchMap(categoryData => this.fire.collection<T>(collectionName, ref => ref.limit(quantity).where('category', '==', categoryData[0].id)).valueChanges())
      )
  }



  // Get Sorted Array By Property 
  // orderType -3-argument = 'asc' (min-nax)  ||  'desc' (max-min) 

  getSortedCollectionByPrice<T>(collectionName: string, orderByType: boolean = false, sortProperty: string = 'price'): Observable<T[]> {
    let sortType: any;
    orderByType ? sortType = 'desc' : sortType = 'asc';
    return this.fire.collection<T>(collectionName, ref => ref.limit(15).orderBy(sortProperty, sortType)).valueChanges()
  }


  // GetCollectionByQuantity []
  // OBSERVABLE
  getCollectionByQuantity<T>(collectionName: string, quantity: number): Observable<T[]> {
    return this.fire.collection<T>(collectionName, ref => ref.limit(quantity)).valueChanges()
  }


  httpGet<T>(url: string): Observable<T>{
    return this.http.get<T>(url)
  }

}
