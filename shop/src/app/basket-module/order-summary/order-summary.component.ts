import { Component, OnInit, Input } from '@angular/core';
import { BasketService } from '../basket.service';
import { Product } from 'src/app/products-module/product-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {

  @Input() action: string;
  @Input() basket: Product[];

  nextRoute(){
    switch(this.action){
      case 'CHECKOUT':
      this.router.navigate(['/','checkout']);
      break;
      case 'CONTINUE TO PAYMENT':
      this.router.navigate(['/','checkout','payment']);
      break;
      case 'PLACE ORDER':
      this.router.navigate(['/','home'])
    }
  }

  constructor(private router: Router, private bs: BasketService) { }

  ngOnInit() {
  }

}
