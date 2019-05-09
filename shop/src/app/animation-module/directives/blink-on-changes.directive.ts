import { Directive, ElementRef, HostListener, OnInit, AfterContentInit, AfterViewInit, DoCheck, OnChanges, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { StylesService } from '../styles.service';

@Directive({
  selector: '[anim-blink-on-changes]'
})
export class BlinkOnChangesDirective implements AfterViewChecked {

  native: HTMLElement;
  previousView: string;
  initStyles: [string,string][]

  constructor(private ref: ElementRef, private ss: StylesService) {
    this.native = this.ref.nativeElement;
    
    
  }


  ngAfterViewChecked(){ 
    if(this.native.textContent && this.previousView && this.native.textContent !== this.previousView){
      this.ss.blink(this.native,this.initStyles,0.5)
      this.ss.fork(this.native,20,0.5)
      this.previousView = this.native.textContent;
    }
  }
  
  ngAfterViewInit(){
    this.previousView = this.native.textContent;
    this.initStyles = this.ss.getStyles(this.native,['color','background-color'])
  }

}
