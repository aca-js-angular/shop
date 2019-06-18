import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common'
import { BasketService } from '../../services/basket.service';
import { decodedOrder } from 'src/app/interfaces/decoded-order.interface';
import { OpenDialogService } from 'src/app/fa-module/services/open-dialog.service';
import { removeBasketItem, clearBasket } from '../../../constants/popup-messages.constant'
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/products-module/services/product.service';
import { bsAnimation } from './bs-animation';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
  animations: [bsAnimation],
  
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
  
  // drop(event: CdkDragDrop<decodedOrder[]>) {
  //  moveItemInArray(this.basket, event.previousIndex, event.currentIndex);
  // }
  

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
