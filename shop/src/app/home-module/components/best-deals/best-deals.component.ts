import { Component } from '@angular/core';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/products-module/services/product.service';

@Component({
  selector: 'app-best-deals',
  templateUrl: './best-deals.component.html',
  styleUrls: ['./best-deals.component.scss']
})
export class BestDealsComponent {

  /* --- Variables --- */
  bestDeals: Product[];

  constructor(private ps: ProductService) {
    this.ps.getBestDeals().subscribe(res => this.bestDeals = res);
  }

}
