import { Component, AfterViewInit, ViewChild, Input, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { SlideService } from '../../services/slide.service';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent implements OnInit, AfterViewInit {

  constructor(private ss: SlideService, private active: ActivatedRoute) {}

  /* --- Variables --- */

  @Input() imageCollection: string[]
  @Output() setSrc = new EventEmitter<string>()
  @ViewChild('sliderRef')sliderRef: ElementRef;
  @ViewChild('leftArrRef')leftArrRef: ElementRef;
  @ViewChild('rightArrRef')rightArrRef: ElementRef;

  sliderRefNative: HTMLElement;
  leftArrRefNative: HTMLElement;
  rightArrRefNative: HTMLElement;

  paramListener: Subscription;
  resizeListener: Subscription;
  
  /* --- Methods --- */

  next(){
    this.ss.slide(this.sliderRefNative,this.leftArrRefNative,this.rightArrRefNative,this.imageCollection.length,2,true)
  }
  previous(){
    this.ss.slide(this.sliderRefNative,this.leftArrRefNative,this.rightArrRefNative,this.imageCollection.length,2,false)
  }

  /* --- LC hooks --- */

  ngOnInit(){
    
  }

  ngAfterViewInit(){
    
    this.sliderRefNative = this.sliderRef.nativeElement;
    this.leftArrRefNative = this.leftArrRef.nativeElement;
    this.rightArrRefNative = this.rightArrRef.nativeElement;

    this.paramListener = this.active.params.subscribe(_ => {
      this.ss.resetSlide(this.sliderRefNative,this.leftArrRefNative,this.rightArrRefNative)
    })
    this.resizeListener = fromEvent(window,'resize').subscribe(_ => {
      this.ss.resetSlide(this.sliderRefNative,this.leftArrRefNative,this.rightArrRefNative)
    })
  }

  ngOnDestroy(){
    this.paramListener.unsubscribe();
    this.resizeListener.unsubscribe();
  }

}
