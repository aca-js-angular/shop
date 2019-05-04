
import { Component, OnInit, AfterViewInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { Product } from '../../../interfaces and constructors/product.interface';
import { ProductService } from '../../services/product.service';
import { JQueryZoomService } from '../../services/j-query-zoom.service';

const ZOOM_IMG_CLASSNAME: string = 'main-img'

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})

export class ProductDetailComponent implements OnInit, OnDestroy {

  constructor(
    private active: ActivatedRoute,
    private db: DatabaseFireService,
    private ps: ProductService,
    private jQuery: JQueryZoomService,
  ) {}

  /* --- Variables --- */

  thisProduct: Product;
  moreFromThisBrand: Product[] = [];
  similarProducts: Product[] = [];

  currentSrc: string;
  currentId: string;

  isInBasket: boolean;
  startAnimation: boolean = false;
 
  quantity: number = 1;

  bsItem: HTMLDivElement

  



  /* --- Methods --- */

  toDate(seconds: number): Date {
    return new Date(seconds)
  }

  addToBasket(currentUser: any) {
    this.ps.pushToCard({ productId: this.currentId, quantity: this.quantity }, currentUser.uid)
    window.scrollTo(0, 0)
    this.startAnimation = true
    this.isInBasket = true
  }


  /* --- LC hooks --- */

  ngOnInit() {

    this.active.params.subscribe(next => {

      this.currentId = next.id
      this.startAnimation = false
      this.ps.isInBasket(this.currentId).then(res => this.isInBasket = res)

      this.db.getDocumentById<Product>('products', this.currentId).subscribe(response => {

        this.thisProduct = response;

        this.currentSrc = this.thisProduct.images[0];

        this.jQuery.clearjQueryZoomScreans()

        this.jQuery.jQueryZoomImg(ZOOM_IMG_CLASSNAME)

        this.db.dynamicQueryFilter('products', { brand: response.brand }, res => this.moreFromThisBrand = res);

        this.ps.getSimilarProducts(response).subscribe(res => this.similarProducts = res)

      })
    })
  }

  ngOnDestroy(){
    this.jQuery.clearjQueryZoomScreans()
  }

}
