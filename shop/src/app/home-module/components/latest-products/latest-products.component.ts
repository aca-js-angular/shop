import { Component } from '@angular/core';
import { Product } from 'src/app/interfaces and constructors/product.interface';
import { ProductService } from 'src/app/products-module/services/product.service';

@Component({
  selector: 'app-latest-products',
  templateUrl: './latest-products.component.html',
  styleUrls: ['./latest-products.component.scss']
})
export class LatestProductsComponent {

  /* --- Variables --- */

  latestCollection: Product[];

  constructor(private ps: ProductService) {
    this.ps.getLatestProducts().subscribe(response => {
      this.latestCollection = response
    })
  }

}
