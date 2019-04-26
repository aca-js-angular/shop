import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[_format]'
})
export class ForcedFormatDirective {

  @Input('_format') formatType: string;

  native: HTMLInputElement;
  constructor(private ref: ElementRef) {
    this.native = this.ref.nativeElement
    if(this.native.tagName !== 'INPUT'){
      throw new Error(`\n "_format" directive binded on ${this.native.tagName} \n "_format" directive bindable only on INPUT Elements `)
    }
  }

  @HostListener('blur')formatValueOnBlur(){

    let value = this.native.value as string
    if(!value)return;

    switch(this.formatType){

      case 'capital':
        value = value[0].toUpperCase() + value.slice(1);
        break;

      case 'capital-each':
      value = value.split(' ').map(item => {
        if(item){
          return item[0].toUpperCase() + item.slice(1)
        }
      }).join(' ');
      break;

      case 'lowercase':
        value = value.toLowerCase();
        break;

      case 'uppercase':
        value = value.toUpperCase();
        break;

      case 'trim':
        value = value.trim();
        break;
      
      case 'combine':
        for(let _ of value){
          value = value.replace(' ','')
        }
        break;
      
      default:
        console.warn
        (`unexpected input "${this.formatType}" of "_format" directive. \n Data won't be formatted in any way.`)
    }

    this.native.value = value
  }

}
