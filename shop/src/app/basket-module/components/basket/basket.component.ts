import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { BasketService } from '../../services/basket.service';
import { ConfirmDialogService } from 'src/app/comfirm-module/services/confirm-dialog.service';
import { decodedOrder } from 'src/app/interfaces and constructors/decoded-order.interface';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent {

  constructor(
    private location: Location,
    private bs: BasketService,
    private confirm: ConfirmDialogService,
  ){}

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
    const isEmpty = this.basketSize === 0;
    const message = isEmpty ? 
    ['Basket is empty'] :
    [`You are about to remove ${this.totalQuantuty} ${this.totalQuantuty > 1 ? 'items' : 'item'}.`, `This action can't be undone`]
    const accept = isEmpty ? () => {return} : () => this.bs.clearBasket()
    this.confirm.openDialogMessage({
      message: message,
      accept: accept,
      skipCancel: (isEmpty ? true : false)
    });
  
  }

  remove(index: number){
    const quantity = this.basket[index].quantity
    const message = [`You are about to remove ${quantity} ${quantity > 1 ? 'items' : 'item'}.`]
    this.confirm.openDialogMessage({
      message: message,
      accept: () => this.bs.removeOrderFromBasket(index),
    });
  }

  back(){
    this.location.back()
  }

  /* --- LC hooks --- */

  ngOnDestroy(){
    this.bs.updateCredit()
  }

}