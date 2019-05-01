import { Component } from '@angular/core';
import { Product } from 'src/app/interfaces and constructors/product.interface';
import { ProductService } from 'src/app/products-module/services/product.service';

@Component({
  selector: 'app-top-products',
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.scss']
})
export class TopProductsComponent {

  /* --- Variables --- */

  topProducts: Product[]

  constructor(private ps: ProductService) {
    this.ps.getTopProducts().subscribe(res => this.topProducts = res)
  }


}
