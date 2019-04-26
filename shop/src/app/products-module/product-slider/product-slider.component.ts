import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
import { SlideService } from './slide.service';
import { Config } from '../single-product/configInterface';
import { Product } from '../product-interface';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss'],
  providers: [SlideService]
})
export class ProductSliderComponent implements OnInit, AfterViewInit {

  constructor(private ss: SlideService) { }

  @Input() productCollection: Product[]
  @Input() title: string;
  @Input() config: Config;
  @Input() href: string[];

  sliderRefNative: HTMLElement;
  @ViewChild('sliderRef')sliderRef: ElementRef;

  ngAfterViewInit(){
    this.sliderRefNative = this.sliderRef.nativeElement
  }

  next(){
    this.ss.slide(this.sliderRefNative,this.productCollection,4,true)
  }
  previous(){
    this.ss.slide(this.sliderRefNative,this.productCollection,4,false)
  }

  ngOnInit() {
  }

}
