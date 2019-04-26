import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/products-module/product-interface';
import { ProductService } from 'src/app/products-module/product.service';

@Component({
  selector: 'app-best-deals',
  templateUrl: './best-deals.component.html',
  styleUrls: ['./best-deals.component.scss']
})
export class BestDealsComponent implements OnInit {


  bestDeals: Product[];

  constructor(private ps: ProductService) { }

  ngOnInit() {
    this.ps.getBestDeals().subscribe(res => this.bestDeals = res)
  }

}
