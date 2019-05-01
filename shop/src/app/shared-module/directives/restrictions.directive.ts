import { Directive, HostListener } from '@angular/core';

const anyDigit = new RegExp(/\d/)
const otherThanDigit = new RegExp(/\D/)
const otherThanAlphabet = new RegExp(/[^A-Za-z\s]/)

@Directive({
  selector: '[_noDigits]'
})

export class NoDigitsDirective {

  @HostListener('keydown',['$event'])whileTyping(e){  
    if(e.key.match(anyDigit) && e.key !== 'Backspace'){
      return false
    }
  }
}

@Directive({
  selector: '[_onlyDigits]'
})

export class OnlyDigitsDirective {

  @HostListener('keydown',['$event'])whileTyping(e){
    if(e.key.match(otherThanDigit) && e.key !== 'Backspace'){
      return false
    } 
  }
}

@Directive({
  selector: '[_onlyAlphabet]'
})

export class OnlyAlphabetDirective {

  @HostListener('keydown',['$event'])whileTyping(e){
    if(e.key.match(otherThanAlphabet) && e.key !== 'Backspace'){
      return false
    }
  }
}
