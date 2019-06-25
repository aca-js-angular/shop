import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Config } from '../../../interfaces/config.Interface';
import { Product } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnChanges, OnInit, OnDestroy {

  constructor(private ps: ProductService) {};

  /* --- Variables --- */

  @Input() productCollection: Product[];
  @Input() listRatio: number = 4;
  initialRatio: number;

  get listConfig(): Config {
    return {ratio: this.listRatio, likeable: true, info: true};
  }

  packages: Product[][];
  currentPage: number = 0;

  /* --- Methods --- */

  toTop(): void{
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  resizeHandler = () => {
    const width = window.innerWidth;
    if(width < 700){
      this.listRatio = this.initialRatio - 2;
    }else if(width < 1000){
      this.listRatio = this.initialRatio - 1;
    }else{
      this.listRatio = this.initialRatio;
    }
  }

  /* --- LC hooks --- */

  ngOnChanges(){
    if(this.productCollection){
      this.packages = this.ps.generatePackages(this.productCollection,24);
      this.currentPage = 0;
    }
  }

  ngOnInit(){
    this.initialRatio = this.listRatio;
    this.resizeHandler();
    window.addEventListener('resize',this.resizeHandler)
  }
  ngOnDestroy(){
    window.removeEventListener('resize',this.resizeHandler)
  }

}
