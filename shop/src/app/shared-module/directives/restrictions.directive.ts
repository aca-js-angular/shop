import { Directive, ElementRef, HostListener } from '@angular/core';

function isThereError(){
  if(this.native.tagName !== 'INPUT'){
    throw new Error(`\n restriction directive binded on ${this.native.tagName} \n restrictions are bindable only on INPUT Elements `)
  }
}

const anyDigit = new RegExp(/\d/)
const otherThanDigit = new RegExp(/\D/)
const otherThanAlphabet = new RegExp(/[^A-Za-z]/)

@Directive({
  selector: '[_noDigits]'
})

export class NoDigitsDirective {

  native: HTMLInputElement;
  constructor(private ref: ElementRef) {
    this.native = this.ref.nativeElement
    isThereError.call(this)
  }

  @HostListener('input')whileTyping(){  
    if(this.native.value.match(anyDigit)){
      this.native.value = this.native.value.slice(0,-1)
    }
  }
}

@Directive({
  selector: '[_onlyDigits]'
})

export class OnlyDigitsDirective {

  native: HTMLInputElement;
  constructor(private ref: ElementRef) {
    this.native = this.ref.nativeElement
    isThereError.call(this)
  }

  @HostListener('input')whileTyping(){
    if(this.native.value.match(otherThanDigit)){
      this.native.value = this.native.value.slice(0,-1)
    }
  }
}

@Directive({
  selector: '[_onlyAlphabet]'
})

export class OnlyAlphabetDirective {

  native: HTMLInputElement;
  constructor(private ref: ElementRef) {
    this.native = this.ref.nativeElement
    isThereError.call(this)
  }

  @HostListener('input')whileTyping(){
    if(this.native.value.match(otherThanAlphabet)){
      this.native.value = this.native.value.slice(0,-1)
    }
  }
}
