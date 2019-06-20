import { Injectable } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatabaseFireService } from '../../database-fire.service';
import { Order } from '../../interfaces/order.interface';
import { decodedOrder } from 'src/app/interfaces/decoded-order.interface';

@Injectable({
  providedIn: 'root'
})

export class BasketService {

  constructor(
    private fireAuth: AngularFireAuth,
    private db: DatabaseFireService,
  ) 
  {
    this.fireAuth.authState.subscribe(() => {
      const currentUser = this.fireAuth.auth.currentUser
      if(currentUser){
        this.currentUid = currentUser.uid
        this.db.getExtractedProperty<Order[]>('users',this.currentUid,['credit']).subscribe(orderArray => {      
          this.decodeOrders(orderArray).then(res => this.basket = res)
        })
      }
    })
  }

  /* --- Variables --- */

  basket: decodedOrder[] = [];
  credit: Order[] = [];
  currentUid: string;

  /* --- Methods --- */

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
    this.basket = [];
  }

  removeOrderFromBasket(index: number): void {
    this.basket.splice(index,1)
  }

  updateCredit(){
    this.db.updateData('users',this.currentUid,{credit: this.reDecodeOrders(this.basket)})
  }

  
  /* --- Private Implementations --- */

  private decodeOrders(orders: Order[]): Promise<decodedOrder[]> {
    const productIds: string[] = []
    orders.forEach(order => productIds.push(order.productId))
    return new Promise(resolve => {
      this.db.getDucumentsArray<Product>('products',productIds).subscribe(products => {
        const decoded = products.map((item,index) => {
          return {product: item, quantity: orders[index].quantity, productId: productIds[index]}
        })
        resolve(decoded)
      })
    })
  }

  private reDecodeOrders(decodedOrders: decodedOrder[]): Order[]{
    const orders: Order[] = []
    decodedOrders.forEach(item => {
      orders.push({productId: item.productId, quantity: item.quantity})
    })
    return orders
  }

  

}