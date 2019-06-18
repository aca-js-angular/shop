import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/products-module/services/product.service';

@Component({
  selector: 'app-best-deals',
  templateUrl: './best-deals.component.html',
  styleUrls: ['./best-deals.component.scss']
})
export class BestDealsComponent {

  /* --- Variables --- */
  sliderConfig;
  bestDeals: Product[];

  constructor(private ps: ProductService) {
    this.ps.getBestDeals().subscribe(res => this.bestDeals = res);
    window.addEventListener('resize',(e) => {
      const window = e.target as Window;
      const width = window.innerWidth;
      if(width < 700){
        this.sliderConfig = {ratio: 2, likeable: true, info: true};
      }else if((width < 900)){
        this.sliderConfig = {ratio: 3, likeable: true, info: true};
      }else{
        this.sliderConfig = {ratio: 4, likeable: true, info: true};
      }
    },false)
  }

  ngOnInit(){
    const width = window.innerWidth;
    if(width < 700){
      this.sliderConfig = {ratio: 2, likeable: true, info: true};
    }else if((width < 900)){
      this.sliderConfig = {ratio: 3, likeable: true, info: true};
    }else{
      this.sliderConfig = {ratio: 4, likeable: true, info: true};
    }
  }

}
