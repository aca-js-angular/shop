import { Component, OnInit, Input } from '@angular/core';
import { BasketService } from '../basket.service';
import { Router } from '@angular/router';
import { Order } from '../order.constructor';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {

  @Input() action: string;
  @Input() basket: Order[];
  @Input() currentForm: FormGroup;

  constructor(
    private router: Router,
    private bs: BasketService
  ) {}

  nextRoute(){
    switch(this.action){
      case 'CHECKOUT':
      this.router.navigate(['/','checkout']);
      break;
      case 'CONTINUE TO PAYMENT':
      this.router.navigate(['/','checkout','payment']);
      break;
      case 'PLACE ORDER':
      this.bs.clearBasket()
      this.router.navigate(['/','home'])
    }
  }

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

  ngOnInit() {
  }

}
