import { Injectable } from '@angular/core';
import { DatabaseFireService } from '../databaseFire.service';
import { Observable } from 'rxjs';
import { Product } from './product-interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private db: DatabaseFireService,
    private auth: AngularFireAuth,
  ) {}

  generatePackages(sourceArray: any[], fraction: number): any[]{
    const packages = []
    let i = 0
    while(i < sourceArray.length){
      packages.push(sourceArray.slice(i , i + fraction))
      i += fraction
    }
    return packages
  }

  getAllProducts(): Observable<Product[]> {
    return this.db.getCollection<Product>('products')
  }

  getLatestProducts(): Observable<Product[]>{
    return this.db.getCollection<Product>('products').pipe(map(products => {
      return products.filter(product => product.postDate >= new Date('2019-01-01').getTime())
    }))
  }

  getTopProducts(): Observable<Product[]>{
    return this.db.getCollection<Product>('products').pipe(map(products => {
      return products.filter(product => parseInt(product.rating) === 5)
    }))
  }

  getBestDeals(): Observable<Product[]>{
    return this.db.getCollection<Product>('products').pipe(map(products => {
      return products.filter(product => parseInt(product.rating) >= 4 && product.price < 700)
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
      }).slice(0,12)
    }))
  }

  pushToCard(productId: string, currentUser: any){
        this.db.pushData<string>('users',currentUser,'creditCard',productId)
        .then(console.log)
  }

  isInBasket(id: string): Promise<boolean>{
    return new Promise(resolve => {
      this.auth.authState.subscribe(() => {
        const currentUser = this.auth.auth.currentUser
        if(currentUser){ 
          this.db.getExtractedProperty<string[]>('users',currentUser.uid,['creditCard']).subscribe(res => {
            resolve(res.includes(id))
          })
        }
      })
    }) 
  }
}
