import { Component, OnInit } from '@angular/core';
import { slideInAnimation } from '../../basket-route.animation';

@Component({
  selector: 'app-basket-root',
  templateUrl: './basket-root.component.html',
  styleUrls: ['./basket-root.component.scss'],
  animations: [slideInAnimation]
})
export class BasketRootComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
