import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/products-module/product-interface';
import { DatabaseFireService } from 'src/app/databaseFire.service';
import { ProductService } from 'src/app/products-module/product.service';

@Component({
  selector: 'app-latest-products',
  templateUrl: './latest-products.component.html',
  styleUrls: ['./latest-products.component.scss']
})
export class LatestProductsComponent implements OnInit {

  latestCollection: Product[];

  constructor(
    private ps: ProductService
  ) { }

  ngOnInit() {
    this.ps.getLatestProducts().subscribe(response => {
      this.latestCollection = response
    })
  }

}
