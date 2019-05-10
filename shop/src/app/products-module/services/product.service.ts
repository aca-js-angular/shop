import { Injectable } from '@angular/core';
import { DatabaseFireService } from '../../database-fire.service';
import { Observable, zip } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Order } from 'src/app/interfaces/order.interface';
import { Vendor } from 'src/app/interfaces/vendor.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private db: DatabaseFireService,
    private auth: AngularFireAuth,
    private router: Router,
  ) {}

  /* --- Methods --- */

  getProductById(id: string): Promise<Product>{
    return new Promise(resolve => {
      this.db.getDocumentById<Product>('products',id).subscribe(product => {
        if(!product){
          this.router.navigate(['/','not-found'])
          return;
        }
        const category: Observable<{name: string}> = this.db.getDocumentById<{name: string}>('categories',product.category)
        const vendor: Observable<Vendor> = this.db.getDocumentById<Vendor>('vendors',product.vendor.toString())
        zip(category,vendor).subscribe(res => {
          product.category = res[0].name;
          product.vendor = res[1];
          resolve(product)
        })
      })
    })
  }

  private getCategoryNameById(id: string,array: {id: string, name: string}[]): string{
    return array.find(item => item.id === id).name
  }

  private getVendorById(id: string | Vendor, array: Vendor[]): Vendor {
    return array.find(item => item.id === id)
  }

  getAllProducts(): Promise<Product[]> {
    return new Promise(resolve => {
      zip(
        this.db.getCollection<Product>('products'),
        this.db.getCollectionWithIds<{name: string}>('categories'),
        this.db.getCollectionWithIds<Vendor>('vendors')
      ).subscribe(res => {
        res[0].forEach((product,index,array) => {
          array[index].category = this.getCategoryNameById(array[index].category,res[1])
          array[index].vendor = this.getVendorById(array[index].vendor,res[2])
        })
        resolve(res[0])
      })
    })
  }

  generatePackages(sourceArray: any[], fraction: number): any[]{
    const packages = []
    let i = 0
    while(i < sourceArray.length){
      packages.push(sourceArray.slice(i , i + fraction))
      i += fraction
    }
    return packages
  }

  

  goToProductDetails(productId: string){
    this.router.navigate(['/','product',productId])
  }

  getIdByName(productName: string): Promise<string> {
    return this.db.getDocumentIdByUniqueProperty('products','name',productName)
  }

  getLatestProducts(): Observable<Product[]>{
    return this.db.getSortedCollectionByProperty('products','postDate',30,true)
  }

  getTopProducts(): Observable<Product[]>{
    return this.db.getSortedCollectionByProperty('products','rating',45,true)
  }

  getBestDeals(): Observable<Product[]>{
    return this.db.getCollection<Product>('products').pipe(map(products => {
      return products.filter(product => {
        return product.rating >= 4 && product.price < 800
      })
    }))
  }

  getSimilarProducts(source: Product): Promise<Product[]>{

    return new Promise(resolve => {
      this.getAllProducts().then(products => {
        resolve(products.filter(product => {
          return (
                  product.details.colors.main.every(color => source.details.colors.main.includes(color)) &&
                  product.details.material.includes(source.details.material[0]) &&
                  product.category === source.category &&
                  product.name !== source.name
                )
              }).slice(0,15))
        })
    })
  }

  getProductsByBrand(brand: string): Promise<Product[]> {
    return this.db.dynamicQueryFilter<Product>('products',{brand})
  }

  pushToCard(order: Order, currentUserId: string){
    this.db.pushData<Order>('users',currentUserId,'credit',order)
  }

  isInBasket(productId: string): Promise<boolean>{
    return new Promise(resolve => {
      this.auth.authState.subscribe(() => {
        const currentUser = this.auth.auth.currentUser
        if(currentUser){
          this.db.getExtractedProperty<Order[]>('users',currentUser.uid,['credit']).subscribe(credit => {
            resolve(credit.some(order => order.productId === productId))
          })
        }
      })
    }) 
  }
}
