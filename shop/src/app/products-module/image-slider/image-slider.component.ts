import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { SlideService } from './slide.service';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
  providers: [SlideService]
})
export class ImageSliderComponent implements OnInit, AfterViewInit {

  constructor(private ss: SlideService) { }

  @Input() imageCollection: string[]
  @Output() setSrc = new EventEmitter<string>()

  sliderRefNative: HTMLElement;
  @ViewChild('sliderRef')sliderRef: ElementRef;

  ngAfterViewInit(){
    this.sliderRefNative = this.sliderRef.nativeElement
  }

  next(){
    this.ss.slide(this.sliderRefNative,this.imageCollection,2,true)
  }
  previous(){
    this.ss.slide(this.sliderRefNative,this.imageCollection,2,false)
  }

  ngOnInit() {
  }

}
