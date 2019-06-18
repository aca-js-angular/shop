import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, zip, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/auth';

/* --- Error throwing functions */

function throwNotUniqueError(options: object, quantity: number, collectionName: string){
  throw new Error(`
            
    DYNAMIC_QUERY_UNIQUE: ERROR.
    NOT_UNIQUE:
    
    The options you passed ${JSON.stringify(options)} are not unique.
    There are ${quantity} documents in collection ${collectionName.toUpperCase()} matching to these requirements.

    DYNAMIC_QUERY_UNIQUE is optimised to return Promise of unique item itself , not an Array of items.
    So options should match only to one unique item or at least none of them. In that case you will receive a warning in console with appropriate message.
  `);
}

function showNoMatchWarning(options: object, collectionName: string){
  console.warn(`
    DYNAMIC_QUERY_UNIQUE: WARNING.

    None of documents in collection ${collectionName.toUpperCase()} matches the options you passed ${JSON.stringify(options)}.
    There are no conflicts in such scenario, just a warning to be aware.
  `);
}

@Injectable({
  providedIn: 'root'
})

export class DatabaseFireService {

  constructor(
    private fire: AngularFirestore,
  ) {
    // this.fire.firestore.disableNetwork()
  }


  /* ------ Methods ------ */


  getCollection<T>(collectionName: string): Observable<T[]> {
    return this.fire.collection<T>(collectionName).valueChanges()
  }


  getDocumentById<T>(collectionName: string, id: string): Observable<T> {
    return this.fire.collection<T>(collectionName).doc<T>(id).valueChanges()
  }


  getDucumentsArray<T>(collectionName: string, ids: string[]): Observable<T[]> {

    const documents: Observable<T>[] = []
    ids.forEach(id => {
      documents.push(this.getDocumentById<T>(collectionName, id))
    })
    return zip(...documents)
  }


  getCollectionWithIds<T>(collectionName: string): Observable<any[]> {

    return this.fire.collection<T[]>(collectionName).snapshotChanges().pipe(
      map(collection => {
        return collection.map(document => {
          return Object.assign({}, document.payload.doc.data(), { id: document.payload.doc.id })
        })
      })
    )
  }


  getIdArray(collectionName: string): Observable<string[]> {
    return this.fire.collection(collectionName).snapshotChanges().pipe(
      map(collection => collection.map(document => document.payload.doc.id))
    )
  }


  dynamicQueryFilter<T>(collectionName: string, options: object): Promise<T[]> {
    return new Promise(resolve => {

      const targetCollection = this.fire.collection(collectionName).ref
      const optionPairs = Object.entries(options)
  
      let queryMap = targetCollection.where(optionPairs[0][0], '==', optionPairs[0][1])
  
      optionPairs.slice(1).forEach(item => {
        queryMap = queryMap.where(item[0], '==', item[1])
      })
  
      queryMap.get()
      .then(querySnapshots => {

        const documents: T[] = []
        querySnapshots.forEach(doc => documents.push(doc.data() as T))
        
        resolve(documents)

      })
    })
  }


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
            throwNotUniqueError(options,documents.size,collectionName)
          }
          else if (!documents.size) {
            showNoMatchWarning(options,collectionName)
            return;
          }
          else {
            documents.forEach(doc => resolve(doc.data() as T))
          }
        })
    })
  }


  getExtractedProperty<T>(collectionName: string, id: string, targetPropertyMap: string[]): Observable<T> {
    return this.fire.collection(collectionName).doc(id).valueChanges().pipe(
      map<T,T>(response => {
        let extractedProperty = response
        targetPropertyMap.forEach(property => {
          extractedProperty = extractedProperty[property]
        })
        return extractedProperty as T
      })
    )
  }


  postData<T>(collectionName: string, payload: T): Promise<DocumentReference> {
    return this.fire.collection(collectionName).add(payload)
  }

  
  postDataWithId<T>(collectionName: string,id: string, payload: T): Promise<void> {
    return this.fire.collection(collectionName).doc(id).set(payload)
  }


  updateData<T>(collectionName: string, id: string, payload: object): Promise<void> {
    return this.fire.collection<T>(collectionName).doc<T>(id).update(payload)
  }


  pushData<T>(collectionName: string, id: string, targetArrayName: string, payload: T): Promise<T[]> {

    return new Promise(resolve => {
      let subscr = this.getExtractedProperty<any[]>(collectionName, id, [targetArrayName]).subscribe(array => {
        array.push(payload)
        this.updateData(collectionName, id, { [targetArrayName]: array }).then(() => resolve(array))
        subscr.unsubscribe()
      })
    })


  }


  getDocumentIdByUniqueProperty(collectionName: string, key: string, value: any): Promise<string> {
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


  getCollectionByCategory<T>(collectionName: string, categoryName: string, documCategoriesName: string = 'categories'): Observable<T[]> {
    return this.fire.collection<T>(documCategoriesName, ref => ref.where('name', '==', categoryName)).stateChanges()
      .pipe(map(data =>
        data.map(res => Object.assign({}, res.payload.doc.data(), { id: res.payload.doc.id }))),
        switchMap(categoryData => this.fire.collection<T>(collectionName, ref => ref.where('category', '==', categoryData[0].id)).valueChanges())
      )
  }


  getCollectionByCategoryAndQuantity<T>(collectionName: string, categoryName: string, quantity: number, documCategoriesName: string = 'categories'): Observable<T[]> {
    return this.fire.collection<T>(documCategoriesName, ref => ref.where('name', '==', categoryName)).stateChanges()
      .pipe(map(data =>
        data.map(res => Object.assign({}, res.payload.doc.data(), { id: res.payload.doc.id }))),
        switchMap(categoryData => this.fire.collection<T>(collectionName, ref => ref.limit(quantity).where('category', '==', categoryData[0].id)).valueChanges())
      )
  }


  getSortedCollectionByProperty<T>(collectionName: string, sortProperty: string, limit: number = Infinity, orderType: boolean = false): Observable<T[]> {
    if(!orderType){
      return this.fire.collection<T>(collectionName, ref => ref.orderBy(sortProperty, 'asc').limit(limit)).valueChanges()
    }
    else{
      return this.fire.collection<T>(collectionName, ref => ref.orderBy(sortProperty, 'desc').limit(limit)).valueChanges()
    }  
  }


  getCollectionByQuantity<T>(collectionName: string, quantity: number): Observable<T[]> {
    return this.fire.collection<T>(collectionName, ref => ref.limit(quantity)).valueChanges()
  }


}
