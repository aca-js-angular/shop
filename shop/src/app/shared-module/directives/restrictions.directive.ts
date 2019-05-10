import { Directive, HostListener, ElementRef } from '@angular/core';

const NUMBERS = [48,49,50,51,52,53,54,55,56,57,8,9]
const ONLY_NUMBERS = [48,49,50,51,52,53,54,55,56,57]
const ALPHABET = [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,8,9,32,222]

@Directive({
  selector: '[_noDigits]'
})

export class NoDigitsDirective {

  @HostListener('keydown',['$event'])whileTyping(e){  
    if(ONLY_NUMBERS.includes(e.keyCode)){
      return false
    }
  }
}

@Directive({
  selector: '[_onlyDigits]'
})

export class OnlyDigitsDirective {

  @HostListener('keydown',['$event'])whileTyping(e){
    if(!NUMBERS.includes(e.keyCode)){
      return false
    } 
  }
}

@Directive({
  selector: '[_onlyAlphabet]'
})

export class OnlyAlphabetDirective {

  @HostListener('keydown',['$event'])whileTyping(e){
    if(!ALPHABET.includes(e.keyCode)){
      return false
    }
  }
}

@Directive({
  selector: '[_naturalNumbers]'
})

export class NaturalNumbersDirective {

  native: HTMLInputElement
  constructor(private ref: ElementRef){
    this.native = this.ref.nativeElement
  }

  @HostListener('keydown',['$event'])whileTyping(e){

    if(this.native.value === '0' && e.keyCode !== 8 && e.keyCode !== 9){
      return false
    }
    if(!NUMBERS.includes(e.keyCode)){
      return false
    }
  }
}
