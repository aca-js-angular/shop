import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Config } from '../../../interfaces/config.Interface';
import { Product } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnChanges {

  constructor(private ps: ProductService) { }

  /* --- Variables --- */

  @Input() productCollection: Product[];
  @Input() config: Config;

  packages: Product[][];
  currentPage: number = 0;

  /* --- Methods --- */

  toTop(): void{
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  /* --- LC hooks --- */

  ngOnChanges(){
    
    if(this.productCollection){
      this.packages = this.ps.generatePackages(this.productCollection,16);
      this.currentPage = 0;
    }
  }

}
