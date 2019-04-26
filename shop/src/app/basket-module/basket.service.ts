import { Injectable, OnInit } from '@angular/core';
import { Product } from '../products-module/product-interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatabaseFireService } from '../databaseFire.service';
import { Order } from './order.constructor';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  basket: Order[] = [];
  currentUid: string;

  constructor(
    private fireAuth: AngularFireAuth,
    private db: DatabaseFireService,
  ) {

    this.fireAuth.authState.subscribe(() => {
      const currentUser = this.fireAuth.auth.currentUser
      if(currentUser){
      this.currentUid = currentUser.uid

      this.db.getExtractedProperty<string[]>('users',this.currentUid,['creditCard']).subscribe(idArray => {

        this.db.getDucumentsArray<Product>('products',idArray).subscribe(products => {
          const basketContent = []
          products.forEach(product => basketContent.push(new Order(product,1)))
          this.basket = basketContent
        })
      })
      }
    })
    
  }

  

  removeFromBasket(index: number){
    this.basket.splice(index,1)
  }

  getTotalQuantity(): number{
    return this.basket.reduce((sum,order) => sum + order.quantity,0)
  }

  getTotalPrice(): number{
    return this.basket.reduce((sum,order) => sum + order.product.price * order.quantity,0)
  }

  getTotalWeight(): number{
    return this.basket.reduce((sum,order) => sum + order.product.details.weight * order.quantity,0)
  }

  getTotalShipping(): number{
    return this.getTotalWeight() * 22.5 / 1000
  }

  isInBasket(name: string): boolean {
    return this.basket.some(order => order.product.name === name)
  }

  clearBasket(): void {
    this.db.clearDocumentArray('users',this.currentUid,'creditCard').then(_ => this.basket = [])
  }

}