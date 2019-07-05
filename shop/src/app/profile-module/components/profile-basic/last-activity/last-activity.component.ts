import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/products-module/services/product.service';
import { ProfileDataService } from 'src/app/profile-module/services/profile-data.service';

@Component({
  selector: 'app-last-activity',
  templateUrl: './last-activity.component.html',
  styleUrls: ['./last-activity.component.scss','../profile-basic.component.scss']
})
export class LastActivityComponent implements OnInit {


  @Input() products: Product[];
  lastProduct: Product;

  constructor(private ps: ProductService, private pd: ProfileDataService){}

  toDate(arg: number): Date{
    return new Date(arg)
  }

  get tooltipContent(): string{

    let products = this.products
    .map(product => product.name)
    .slice(5)

    if(products.length > 10){
      products = products.slice(0,10)
      products[products.length - 1] += ' ...'
    }
    
    return products.join('\n')
  }

  ngOnInit(){

    this.lastProduct = this.pd.getLastActivity(this.products)
    this.products = this.products.filter(item => item.id !== this.lastProduct.id);
  }
}
