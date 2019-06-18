
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { JQueryZoomService } from '../../services/j-query.service';
import { SlideService } from '../../services/slide.service';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { Vendor } from 'src/app/interfaces/vendor.interface';

export const chatEmitVendor = new EventEmitter();
export const openChatSearchBox = new EventEmitter<boolean>();
const ZOOM_IMG_CLASSNAME: string = 'main-img'

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})

export class ProductDetailComponent implements OnInit, OnDestroy {

  constructor(
    private active: ActivatedRoute,
    private ps: ProductService,
    private jQuery: JQueryZoomService,
    private additionalAuth: AdditionalService,
  ) {}

  /* --- Variables --- */

  thisProduct: Product;
  moreFromThisBrand: Product[] = [];
  similarProducts: Product[] = [];

  currentSrc: string;
  currentId: string;
  currentUser: object;
  isInBasket: boolean;
  startAnimation: boolean = false;
 
  quantity: number = 1;

  bsItem: HTMLDivElement

  

  /* --- Methods --- */

  openChatSearch(){
    openChatSearchBox.emit()
  }

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
    
    this.additionalAuth.autoState().then(user => this.currentUser = user)
    
    this.active.params.subscribe(next => {

      this.currentId = next.id
      this.startAnimation = false
      this.ps.isInBasket(this.currentId).then(res => this.isInBasket = res)

      this.ps.getProductById(this.currentId).then(response => {

        this.thisProduct = response;

        this.currentSrc = this.thisProduct.images[0];

        chatEmitVendor.emit(this.thisProduct.vendor as Vendor);

        this.jQuery.clearjQueryZoomScreans()

        this.jQuery.jQueryZoomImg(ZOOM_IMG_CLASSNAME)

        this.ps.getProductsByBrand(this.thisProduct.brand,this.thisProduct.name).then(res => this.moreFromThisBrand = res)

        this.ps.getSimilarProducts(this.thisProduct).then(res => this.similarProducts = res)

      })
    })
  }

  ngOnDestroy(){
    this.jQuery.clearjQueryZoomScreans();
  }

}
