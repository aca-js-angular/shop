import { Directive, ElementRef, HostListener } from '@angular/core';
import { StylesService } from '../styles.service';

@Directive({
  selector: '[anim-soft-click]'
})
export class AnimSoftClickDirective {

  native: HTMLElement;
  closureFn: Function;
  constructor(private ref: ElementRef, private ss: StylesService) {
    this.native = this.ref.nativeElement;
    // this.closureFn = this.ss.getClosureFn(this.native,{color: 'aliceblue', background: 'gray'},200);
  }

  @HostListener('click')onclick(){
    this.closureFn()
  }


}
