import { Component, AfterViewInit, ViewChild, Input, ElementRef, OnDestroy } from '@angular/core';
import { SlideService } from '../../services/slide.service';
import { Config } from '../../../interfaces/config.Interface';
import { Product } from '../../../interfaces/product.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss'],
})
export class ProductSliderComponent implements AfterViewInit, OnDestroy {

  constructor(private ss: SlideService, private router: Router) {}

  /* --- Variables --- */

  @Input() productCollection: Product[];
  @Input() title: string;
  @Input() href: string[];
  @ViewChild('sliderRef')sliderRef: ElementRef;
  @ViewChild('leftArrRef')leftArrRef: ElementRef;
  @ViewChild('rightArrRef')rightArrRef: ElementRef;

  sliderRefNative: HTMLElement;
  leftArrRefNative: HTMLElement;
  rightArrRefNative: HTMLElement;

  overed: boolean = false;

  sliderRtio: number;

  get sliderConfig(): Config{
    return {ratio: this.sliderRtio, likeable: true, info: true}
  }

  /* --- Methods --- */

  divideArr(arg: any[]): any[]{
    return arg.slice(0,Math.floor(arg.length / 2))
  }

  next(){
    if(this.overed){
      this.router.navigate(this.href);
      return;
    }
    let isOvered = this.ss.slide(this.sliderRefNative,this.leftArrRefNative,this.rightArrRefNative,this.divideArr(this.productCollection).length,this.sliderRtio,true) as boolean
    this.overed = isOvered;
  }
  previous(){
    this.ss.slide(this.sliderRefNative,this.leftArrRefNative,this.rightArrRefNative,this.divideArr(this.productCollection).length,this.sliderRtio,false);
    this.overed = false;
  }

  resizeHandler = () => {
    const width = window.innerWidth;
    if(width < 700){
      this.sliderRtio = 2;
    }else if(width < 1000){
      this.sliderRtio = 3;
    }else{
      this.sliderRtio = 4;
    }
  }

  resetOnResize = () => {
    this.ss.resetSlide(this.sliderRefNative,this.leftArrRefNative,this.rightArrRefNative);
    this.overed = false;
  }

  /* --- LC hooks --- */

  ngOnInit(){
    this.resizeHandler();
    window.addEventListener('resize',this.resizeHandler)
  }
  

  ngAfterViewInit(){
    this.sliderRefNative = this.sliderRef.nativeElement
    this.leftArrRefNative = this.leftArrRef.nativeElement
    this.rightArrRefNative = this.rightArrRef.nativeElement
    window.addEventListener('resize',this.resetOnResize);
  }

  ngOnDestroy(){
    window.removeEventListener('resize',this.resizeHandler);
    window.removeEventListener('resize',this.resetOnResize);
  }

}
