import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/products-module/product-interface';
import { ProductService } from 'src/app/products-module/product.service';

@Component({
  selector: 'app-top-products',
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.scss']
})
export class TopProductsComponent implements OnInit {

  topProducts: Product[]

  constructor(private ps: ProductService) { }

  ngOnInit() {
    this.ps.getTopProducts().subscribe(res => this.topProducts = res)
  }

}
