import { Component, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
import { SlideService } from '../../services/slide.service';
import { Config } from '../../../interfaces and constructors/config.Interface';
import { Product } from '../../../interfaces and constructors/product.interface';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss'],
  providers: [SlideService]
})
export class ProductSliderComponent implements AfterViewInit {

  constructor(private ss: SlideService) {}

  /* --- Variables --- */

  @Input() productCollection: Product[]
  @Input() title: string;
  @Input() config: Config;
  @Input() href: string[];
  @ViewChild('sliderRef')sliderRef: ElementRef;

  sliderRefNative: HTMLElement;

  /* --- Methods --- */

  next(){
    this.ss.slide(this.sliderRefNative,this.productCollection,4,true)
  }
  previous(){
    this.ss.slide(this.sliderRefNative,this.productCollection,4,false)
  }

  /* --- LC hooks --- */

  ngAfterViewInit(){
    this.sliderRefNative = this.sliderRef.nativeElement
  }

}
