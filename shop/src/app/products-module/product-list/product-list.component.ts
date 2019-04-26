import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ProductService } from '../product.service';
import { Config } from '../single-product/configInterface';
import { Product } from '../product-interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnChanges {

  @Input() productCollection: Product[];
  @Input() config: Config;

  packages: Array<Product[]>;
  currentPage: number = 0;

  constructor(private ps: ProductService) { }

  ngOnInit() {
  }

  toTop(): void{
    window.scrollTo(0,0)
  }

  ngOnChanges(){
    if(this.productCollection){
      this.packages = this.ps.generatePackages(this.productCollection,15);
      this.currentPage = 0;
    }
  }

}
