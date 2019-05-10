import { Component, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
import { SlideService } from '../../services/slide.service';
import { Config } from '../../../interfaces/config.Interface';
import { Product } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss'],
})
export class ProductSliderComponent implements AfterViewInit {

  constructor(private ss: SlideService) {}

  /* --- Variables --- */

  @Input() productCollection: Product[];
  @Input() title: string;
  @Input() config: Config;
  @Input() href: string[];
  @ViewChild('sliderRef')sliderRef: ElementRef;
  @ViewChild('leftArrRef')leftArrRef: ElementRef;
  @ViewChild('rightArrRef')rightArrRef: ElementRef;

  sliderRefNative: HTMLElement;
  leftArrRefNative: HTMLElement;
  rightArrRefNative: HTMLElement;

  overed: boolean = false;

  /* --- Methods --- */

  divideArr(arg: any[]): any[]{
    return arg.slice(0,Math.floor(arg.length / 2))
  }

  next(){
    let isOvered = this.ss.slide(this.sliderRefNative,this.leftArrRefNative,this.rightArrRefNative,this.divideArr(this.productCollection).length,4,true)
    this.overed = isOvered ? true : false
  }
  previous(){
    this.ss.slide(this.sliderRefNative,this.leftArrRefNative,this.rightArrRefNative,this.divideArr(this.productCollection).length,4,false);
    this.overed = false;
  }

  /* --- LC hooks --- */

  ngAfterViewInit(){
    this.sliderRefNative = this.sliderRef.nativeElement
    this.leftArrRefNative = this.leftArrRef.nativeElement
    this.rightArrRefNative = this.rightArrRef.nativeElement
  }

}
