import { Directive, ElementRef } from '@angular/core';
import { StylesService } from '../styles.service';
import { fromEvent } from 'rxjs';
import { pairwise, map } from 'rxjs/operators';

@Directive({
  selector: '[anim-blink-on-value-changes]'
})
export class BlinkOnValueChangesDirective {

  native: HTMLInputElement;
  previousView: string;
  initStyles: [string,string][]

  constructor(private ref: ElementRef, private ss: StylesService) {
    this.native = this.ref.nativeElement;
    this.initStyles = this.ss.getStyles(this.native,['color','background-color'])
    let now = Date.now()
    fromEvent(this.native,'input').subscribe(next => {
      const passed = Date.now() - now
      now = Date.now()
      if(passed > 100){
        this.ss.fork(this.native,10,0.3)
      }
      
    })
    
  }


  // ngAfterViewChecked(){ 
  //   if(this.native.textContent && this.previousView && this.native.textContent !== this.previousView){
  //     this.ss.blink(this.native,this.initStyles,0.5)
  //     this.ss.fork(this.native,20,0.5)
  //     this.previousView = this.native.textContent;
  //   }
  // }
  
  // ngAfterViewInit(){
  //   this.previousView = this.native.textContent
  // }

}
