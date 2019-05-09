import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { decodedOrder } from '../../../interfaces and constructors/decoded-order.interface';
import { FormControl } from '@angular/forms';
import { DatabaseFireService } from 'src/app/database-fire.service';

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.scss']
})
export class BasketItemComponent implements OnInit {

  constructor(private db: DatabaseFireService) { }

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
