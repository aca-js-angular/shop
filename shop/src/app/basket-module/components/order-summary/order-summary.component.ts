import { Component, Input } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { decodedOrder } from 'src/app/interfaces/decoded-order.interface';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent {

  constructor(
    private router: Router,
    private bs: BasketService
  ) {}

  /* --- Variables --- */

  @Input() action: string;
  @Input() basket: decodedOrder[];
  @Input() currentForm: FormGroup;

  /* --- Getters --- */

  get totalQuantity(): number{
    return this.bs.getTotalQuantity()
  }
  get totalPrice(): number{
    return this.bs.getTotalPrice()
  }
  get totalWeight(): number{
    return this.bs.getTotalWeight()
  }
  get totalShipping(): number{
    return this.bs.getTotalShipping()
  }

  /* --- Methods --- */

  nextRoute(){
    switch(this.action){
      case 'CHECKOUT':
      this.router.navigate(['/','basket','checkout']);
      break;
      case 'CONTINUE TO PAYMENT':
      this.router.navigate(['/','basket','checkout','payment']);
      break;
      case 'PLACE ORDER':
      this.bs.clearBasket()
      this.router.navigate(['/','home'])
    }
  }

}
