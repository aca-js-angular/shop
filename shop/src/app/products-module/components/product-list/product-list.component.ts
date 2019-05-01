import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Config } from '../../../interfaces and constructors/config.Interface';
import { Product } from '../../../interfaces and constructors/product.interface';

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
    window.scrollTo(0,0)
  }

  /* --- LC hooks --- */

  ngOnChanges(){
    
    if(this.productCollection){
      this.packages = this.ps.generatePackages(this.productCollection,15);
      this.currentPage = 0;
    }
  }

}
