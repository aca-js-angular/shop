import { Directive, ElementRef, AfterViewChecked, AfterViewInit, Input } from '@angular/core';
import { StylesService } from '../styles.service';

@Directive({
  selector: '[anim-fork-on-changes]'
})
export class ForkOnChangesDirective implements AfterViewChecked, AfterViewInit {

  native: HTMLElement;
  previousView: string;
  initStyles: [string,string][];

  @Input() blink: boolean;
  @Input('anim-fork-on-changes') forkAmount: number = 20;

  constructor(private ref: ElementRef, private ss: StylesService) {
    this.native = this.ref.nativeElement;
  }

  ngAfterViewChecked(){ 
    if(this.native.textContent && this.previousView && this.native.textContent !== this.previousView){
      if(this.blink){
        this.ss.blink(this.native,this.initStyles,0.5)
      }
      this.ss.fork(this.native,this.forkAmount,0.5)
      this.previousView = this.native.textContent;
    }
  }
  
  ngAfterViewInit(){
    this.previousView = this.native.textContent;
    this.initStyles = this.ss.getStyles(this.native,['color','background-color'])
  }

}
