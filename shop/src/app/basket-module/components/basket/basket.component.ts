import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common'
import { BasketService } from '../../services/basket.service';
import { decodedOrder } from 'src/app/interfaces/decoded-order.interface';
import { OpenDialogService } from 'src/app/fa-module/services/open-dialog.service';
import { removeBasketItem, clearBasket } from '../../../constants/popup-messages.constant'
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/products-module/services/product.service';
declare var $: any;

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
  animations: [
    trigger('list', [
      transition(':enter', [
        query('@items', stagger(80, animateChild()))
      ]),
    ]),
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)', 
         style({ 
           transform: 'scale(0.5)', opacity: 0, 
           height: '0px', margin: '0px' 
         })) 
      ]),
    ]),
  ],
  
})

export class BasketComponent implements OnDestroy {

  constructor(
    private location: Location,
    private bs: BasketService,
    private dialog: OpenDialogService,
    private ps: ProductService,
  ){}

  randomCollection: Product[];

  /* --- Getters --- */

  get basket(): decodedOrder[]{
    return this.bs.basket
  }

  get basketSize(): number{
    return this.bs.basket.length
  }

  get totalQuantuty(): number {
    return this.bs.getTotalQuantity()
  }

  /* --- Methods --- */

  clear(): void{

    if(this.basketSize){
      this.dialog.openConfirmMessage({
        message: clearBasket(this.basketSize),
        accept: () => this.bs.clearBasket()
      })
    }else{
      this.dialog.openAlertMessage({
        message: ['Basket is empty'],
        after: null,
      })
    }
  
  }

  remove(index: number){
    const quantity = this.basket[index].quantity
    this.dialog.openConfirmMessage({
      message: removeBasketItem(quantity),
      accept: () => this.bs.removeOrderFromBasket(index),
    });
  }

  back(){
    this.location.back()
  }

  /* --- LC hooks --- */

  ngOnInit(){
    this.ps.getRandomCollection().subscribe(res => this.randomCollection = res)
  }

  ngOnDestroy(){
    this.bs.updateCredit()
  }


}
