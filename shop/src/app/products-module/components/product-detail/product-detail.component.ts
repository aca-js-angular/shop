
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { JQueryZoomService } from '../../services/j-query.service';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { StylesService } from 'src/app/animation-module/styles.service';

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
    private ss: StylesService,
  ) {}

  /* --- Variables --- */

  thisProduct: Product;
  moreFromThisBrand: Product[] = [];
  similarProducts: Product[] = [];

  currentSrc: string;
  currentId: string;
  currentUser: object;
  isInBasket: boolean;
 
  quantity: number = 1;


  /* --- Methods --- */

  mouseListener = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const elems = document.elementsFromPoint(x,y);
    if(elems.some(elem => elem.id === 'sticky-header')){
      if(this.zoomed){
        this.jQuery.clearjQueryZoomScreans();
        this.zoomed = false;
      } 
    }else{
      if(!this.zoomed){
        this.jQuery.jQueryZoomImg(ZOOM_IMG_CLASSNAME);
        this.zoomed = true;
      }
    }
  }

  @ViewChild('originalImage') originalImage: ElementRef;

  throwToBasket(callback){

    let callbackInvoked = false;
    let initialQuantity = this.quantity;
    if(initialQuantity > 5){
      initialQuantity = 5;
    }
    let temporaryQuantity = initialQuantity;

    const original = this.originalImage.nativeElement as HTMLImageElement;
    const basketIcon = document.getElementById('basket') as HTMLImageElement;
    const distanceBetween = this.ss.getDistanceBetweenElements(original,basketIcon);

    const throwFn = () => {
      if(!temporaryQuantity){
        clearInterval(intervalId);
        return;
      }
      temporaryQuantity--;

      const ghost = document.createElement('img');
      ghost.setAttribute('src',original.getAttribute('src'));
      document.body.append(ghost);
      this.ss.copyGeometry(original,ghost);
      getComputedStyle(ghost).height;

  
      this.ss.setStyles(ghost,[
        ['transition','all 1s'],
        ['width','20px'],
        ['height','20px'],
        ['position','absolute'],
        ['boxShadow','0 0 20px rgb(131, 131, 131)'],
        ['borderRadius','50%'],
        ['zIndex','1000'],
        ['transform',`translate(${distanceBetween.left}px,${-distanceBetween.top}px)`],
        
      ])
  
      let animationHandler = () => {
        if(!callbackInvoked){
          callback();
        }
        callbackInvoked = true;
        ghost.remove(); 
        ghost.removeEventListener('transitionend',animationHandler);
      }
      ghost.addEventListener('transitionend',animationHandler)
    }

    throwFn();
    const intervalId = setInterval(() => throwFn(), 1000 / initialQuantity);

  };

  openChatSearch(){
    openChatSearchBox.emit()
  }

  toDate(seconds: number): Date {
    return new Date(seconds)
  }

  addToBasket(currentUser: any) {
    window.scroll(0,0);
    this.throwToBasket(() => this.ps.pushToCard({ productId: this.currentId, quantity: this.quantity }, currentUser.uid));
    this.isInBasket = true;
  }

  /* --- LC hooks --- */

  zoomed = false;

  ngOnInit() {
    document.addEventListener('mousemove',this.mouseListener);
    this.additionalAuth.autoState().then(user => this.currentUser = user)
    
    this.active.params.subscribe(next => {

      this.currentId = next.id

      this.ps.isInBasket(this.currentId).then(res => this.isInBasket = res)

      this.ps.getProductById(this.currentId).then(response => {

        this.thisProduct = response;

        this.currentSrc = this.thisProduct.images[0];

        chatEmitVendor.emit(this.thisProduct.vendor)

        this.jQuery.clearjQueryZoomScreans();
        this.zoomed = false;

        this.jQuery.jQueryZoomImg(ZOOM_IMG_CLASSNAME);
        this.zoomed = true;

        this.ps.getProductsByBrand(this.thisProduct.brand,this.thisProduct.name).then(res => this.moreFromThisBrand = res)

        this.ps.getSimilarProducts(this.thisProduct).then(res => this.similarProducts = res)

      })
    })
  }

  ngOnDestroy(){
    this.jQuery.clearjQueryZoomScreans();
    this.zoomed = false;
    document.removeEventListener('mousemove',this.mouseListener);
  }

}
