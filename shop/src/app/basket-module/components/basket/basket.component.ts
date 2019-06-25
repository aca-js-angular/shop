import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common'
import { BasketService } from '../../services/basket.service';
import { decodedOrder } from 'src/app/interfaces/decoded-order.interface';
import { OpenDialogService } from 'src/app/fa-module/services/open-dialog.service';
import { removeBasketItem, clearBasket } from '../../../constants/popup-messages.constant'
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/products-module/services/product.service';
import { BasketListAnimation } from '../../animations/basket-list.animation';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss','./basket.media.scss'],
  animations: BasketListAnimation,
  
})

export class BasketComponent implements OnDestroy {

  /* --- Variables --- */

  randomCollectionSubscription: Subscription;
  randomCollection: Product[];

  constructor(
    private location: Location,
    private bs: BasketService,
    private dialog: OpenDialogService,
    private ps: ProductService,
  ){}


  /* --- Getters --- */

  get basketSize(): number{
    return this.bs.basket.length
  }
  
  get basket(): decodedOrder[]{
    return this.bs.basket
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
    }
    else{
      this.dialog.openAlertMessage({
        message: ['Basket is empty'],
        after: null,
      })
    }
  }

  removeAnimation(ind: number){
    
  }

  remove(ind: number){
    const quantity = this.basket[ind].quantity
    this.dialog.openConfirmMessage({
      message: removeBasketItem(quantity),
      accept: () => this.bs.removeOrderFromBasket(ind)
    });
  }

  back(){
    this.location.back()
  }

  /* --- LC hooks --- */

  ngOnInit(){
    this.randomCollectionSubscription = this.ps.getRandomCollection().subscribe(res => this.randomCollection = res);
  }

  ngOnDestroy(){
    this.bs.updateCredit();
    this.randomCollectionSubscription.unsubscribe();
  }


}
