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
  // productId: string;

  toDate(arg: number): Date{
    return new Date(arg)
  }

  constructor(private ps: ProductService, private pd: ProfileDataService){}

  ngOnInit(){
    this.lastProduct = this.pd.getLastActivity(this.products);
    // this.ps.getIdByName(this.lastProduct.name).then(id => this.productId = id);
  }
}
