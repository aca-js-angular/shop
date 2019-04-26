import { Component, OnInit, Input } from '@angular/core';
import { Config } from '../single-product/configInterface';

@Component({
  selector: 'app-product-list-page',
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.scss']
})
export class ProductListPageComponent implements OnInit {

  @Input() productsPackage: any[];
  @Input() config: Config;

  constructor() {}

  ngOnInit() {
  }

}
