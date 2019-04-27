import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { BasketService } from '../basket.service';
import { Order } from '../order.constructor';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent {

  constructor(
    private location: Location,
    private bs: BasketService,
  ){}

  get basket(): Order[]{
    return this.bs.basket
  }

  get basketSize(): number{
    return this.bs.basket.length
  }

  clear(): void{
    this.bs.clearBasket()
  }

  back(){
    this.location.back()
  }

  remove(index: number){
    this.bs.removeOrderFromBasket(index)
  }

}
