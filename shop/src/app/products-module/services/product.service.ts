import { Injectable } from '@angular/core';
import { DatabaseFireService } from '../../database-fire.service';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces and constructors/product.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Order } from 'src/app/interfaces and constructors/order.interface';

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

  getAllProducts(): Observable<Product[]> {
    return this.db.getCollection<Product>('products')
  }

  getLatestProducts(): Observable<Product[]>{
    return this.db.getSortedCollectionByProperty('products','postDate',20,true)
  }

  getTopProducts(): Observable<Product[]>{
    return this.db.getSortedCollectionByProperty('products','rating',20,true)
  }

  getBestDeals(): Observable<Product[]>{
    return this.db.getCollection<Product>('products').pipe(map(products => {
      return products.filter(product => {
        return parseInt(product.rating) >= 4 && product.price < 700
      }).slice(0,20)
    }))
  }

  getSimilarProducts(source: Product): Observable<Product[]>{
    return this.db.getCollection<Product>('products').pipe(map(products => {
      return products.filter(product => {
        return (
          product.details.colors.includes(source.details.colors[0]) &&
          product.details.material.includes(source.details.material[0]) &&
          product.category === source.category &&
          product.name !== source.name
        )
      }).slice(0,15)
    }))
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
