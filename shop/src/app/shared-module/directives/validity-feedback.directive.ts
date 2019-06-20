import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[_feedback]'
})
export class ValidityFeedbackDirective {

  @Input('_feedback') control: FormControl;

  native: HTMLInputElement;

  constructor(private ref: ElementRef) {
    this.native = this.ref.nativeElement
    this.native.style.borderLeftWidth = '3.5px'
    this.native.style.transition = 'border-left-color 1s'
  }
  
  @HostListener('blur')onblur(){
    if(this.control.invalid){
      this.native.style.borderLeftColor = 'rgb(167, 107, 107)'
    }
  }

  @HostListener('input')onInput(){
    if(this.control.valid && this.control.value){
      this.native.style.borderLeftColor = 'rgb(112, 184, 185)'
    }
  }

}
