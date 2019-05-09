import { Component, AfterViewInit, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { SlideService } from '../../services/slide.service';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
  providers: [SlideService]
})
export class ImageSliderComponent implements AfterViewInit {

  constructor(private ss: SlideService) {}

  /* --- Variables --- */

  @Input() imageCollection: string[]
  @Output() setSrc = new EventEmitter<string>()
  @ViewChild('sliderRef')sliderRef: ElementRef;

  sliderRefNative: HTMLElement;
  
  /* --- Methods --- */

  next(){
    this.ss.slide(this.sliderRefNative,this.imageCollection,2,true)
  }
  previous(){
    this.ss.slide(this.sliderRefNative,this.imageCollection,2,false)
  }

  /* --- LC hooks --- */

  ngAfterViewInit(){
    this.sliderRefNative = this.sliderRef.nativeElement
  }

}
