import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/interfaces/product.interface';

@Component({
  selector: 'app-posted-products',
  templateUrl: './posted-products.component.html',
  styleUrls: ['./posted-products.component.scss']
})
export class PostedProductsComponent implements OnInit {

  @Input() postedProducts: Product[] = [];

  constructor() {}

  ngOnInit() {
  }

}
