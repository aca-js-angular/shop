import { Component, Input } from '@angular/core';
import { Config } from '../../../interfaces and constructors/config.Interface';

@Component({
  selector: 'app-product-list-page',
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.scss']
})
export class ProductListPageComponent {

  constructor(){}
  
  /* --- Variables --- */

  @Input() productsPackage: any[];
  @Input() config: Config;

}
