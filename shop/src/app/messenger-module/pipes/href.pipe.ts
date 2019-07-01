import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isHref'
})
export class HrefPipe implements PipeTransform {

  transform(message: string, arg: string): any {


    let hrefStart;

    const a = message.indexOf('http://');
    const b = message.indexOf('https://');
    a === -1 && b === -1 
    ? hrefStart = -1 : b !== -1  
    ? hrefStart = b: hrefStart = a;

    const hrefEnd = message.indexOf('#');
      
    const [textStart,href,textEnd ] = [

      message.slice(0,hrefStart),
      message.slice(hrefStart,
      hrefEnd),message.slice(hrefEnd, message.length-2)
    ]

    console.log(textStart,href,textEnd)
    switch (arg) {
      case 'start-href': return textStart;
      case 'href': return href;
      case 'href-end': return textEnd;
    }
  }

}

