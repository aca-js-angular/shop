
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { JQueryZoomService } from '../../services/j-query.service';
import { AdditionalService, UDataType } from 'src/app/fa-module/services/additional.service';
import { StylesService } from 'src/app/animation-module/styles.service';
import { ZoomConfig } from 'src/app/interfaces/zoom-config.interface';
import { ZOOM_MAX, ZOOM_MID, ZOOM_MIN } from 'src/app/constants/zoom-static-config.constant';
import { Subscription, fromEvent } from 'rxjs';

export const chatEmitVendor = new EventEmitter();
export const openChatBox = new EventEmitter();
const ZOOM_IMG_CLASSNAME: string = 'main-img';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss','./product-detail.media.scss']
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

  computedConfig: ZoomConfig = {};

  thisProduct: Product;
  moreFromThisBrand: Product[] = [];
  similarProducts: Product[] = [];

  currentSrc: string;
  currentId: string;
  currentUser: UDataType;
  isInBasket: boolean;
  showMore: boolean = true;
 
  quantity: number = 1;
  resizeListener$: Subscription;


  /* --- Methods --- */
  
  resetZoom(){
    this.jQuery.clearjQueryZoomScreans();
    this.jQuery.jQueryZoomImg(ZOOM_IMG_CLASSNAME,this.computedConfig)
  }

  setZoomConfig = () => {
    const width = window.innerWidth;
    if(width < 700){
      this.computedConfig = ZOOM_MIN
    }else if(width < 1000){
      this.computedConfig = ZOOM_MID;
    }else{
      this.computedConfig = ZOOM_MAX
    }
    this.resetZoom();
  }

  mouseListener = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    let elems = document.elementsFromPoint(x,y) as HTMLElement[];
    elems = elems.filter(elem => {
      return elem.className !== 'zoomLens' && elem.className !== 'zoomContainer'
    })
    if(elems[0] && !elems[0].dataset.identity){
      if(this.zoomed){
        this.jQuery.clearjQueryZoomScreans();
        this.zoomed = false;
      } 
    }else{
      if(!this.zoomed){
        this.jQuery.jQueryZoomImg(ZOOM_IMG_CLASSNAME,this.computedConfig);
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
    const basketIcon = Array.from(document.getElementsByClassName('_basket')) as HTMLImageElement[];
    const target = basketIcon.find(icon => {
      const container = icon.closest('.auth-action-box');
      console.log(container);
      return getComputedStyle(container).display !== 'none';
    })

    const distanceBetween = this.ss.getDistanceBetweenElements(original,target);

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


  toDate(seconds: number): Date {
    return new Date(seconds)
  }

  addToBasket(currentUser: any) {
    window.scroll(0,0);
    this.throwToBasket(() => this.ps.pushToCard({ productId: this.currentId, quantity: this.quantity }, currentUser.uid));
    this.isInBasket = true;
  }

  /* --- Chat Fields --- */
  get $currentUser(){ 
    return this.additionalAuth.$autoState;
  }

  openChat(){
    openChatBox.emit()
  }

  /* --- LC hooks --- */

  zoomed = false;

  ngOnInit() {

    this.setZoomConfig();
    document.addEventListener('mousemove',this.mouseListener);
    window.addEventListener('resize',this.setZoomConfig);
    this.resizeListener$ = fromEvent(window,'resize').subscribe(_ => {
      if(window.innerWidth > 700){
        this.showMore = true;
      }
    })
    
    

    this.additionalAuth.autoState().then(user => this.currentUser = user)
    
    this.active.params.subscribe(next => {

      this.currentId = next.id

      this.ps.isInBasket(this.currentId).then(res => this.isInBasket = res)

      this.ps.getProductById(this.currentId).then(response => {

        this.thisProduct = response;

        this.currentSrc = this.thisProduct.images[0];

        chatEmitVendor.emit(this.thisProduct.vendor)

        this.resetZoom();

        this.ps.getProductsByBrand(this.thisProduct.brand,this.thisProduct.name).then(res => this.moreFromThisBrand = res)

        this.ps.getSimilarProducts(this.thisProduct).then(res => this.similarProducts = res)

      })
    })
  }

  

  ngOnDestroy(){
    this.jQuery.clearjQueryZoomScreans();
    this.zoomed = false;
    this.resizeListener$.unsubscribe();
    document.removeEventListener('mousemove',this.mouseListener);
    window.removeEventListener('resize',this.setZoomConfig);
  }

}
