import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/products-module/product-interface';
import { FormControl } from '@angular/forms';
import { BasketService } from '../basket.service';
import { Order } from '../order.constructor';

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.scss']
})
export class BasketItemComponent implements OnInit {

  constructor(private bs: BasketService) { }

  @Input() thisOrder: Order;
  @Output() removeOrder = new EventEmitter<void>()

  quantity: FormControl;

  ngOnInit() {
    this.quantity = new FormControl(1)
    this.quantity.valueChanges.subscribe(next => {
      this.thisOrder.quantity = +next
    })
  }

}
