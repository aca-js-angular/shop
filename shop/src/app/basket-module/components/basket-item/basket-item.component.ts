import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { decodedOrder } from '../../../interfaces/decoded-order.interface';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.scss','./basket-item.media.scss']
})
export class BasketItemComponent implements OnInit {

  constructor() { }

  /* --- Variables --- */

  @Input() thisOrder: decodedOrder;
  @Output() removeOrder = new EventEmitter<void>()

  quantity: FormControl;

  /* --- LC hooks --- */

  ngOnInit() {
    this.quantity = new FormControl(this.thisOrder.quantity);
    this.quantity.valueChanges.subscribe(next => {
      this.thisOrder.quantity = +next
    })
  }

}
