import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isHref'
})
export class HrefPipe implements PipeTransform {

  transform(message: string, arg: string): any {


    let hrefStart;

    const a = message.indexOf('http://');
    const b = message.indexOf('https://');
    const c = message.indexOf('www.');
    a === -1 && b === -1 && c === -1
    ? hrefStart = -1 



    : b !== -1 
    ? hrefStart = b  :

    c !== -1 ? 
    hrefStart = c :
    hrefStart = a;

    const hrefEnd = message.indexOf('#');
      
    const [textStart,href,textEnd ] = [

      message.slice(0,hrefStart),
      message.slice(hrefStart,
      hrefEnd),message.slice(hrefEnd, message.length-2)
    ]

    switch (arg) {
      case 'start-href': return textStart;
      case 'href': return href;
      case 'href-end': return textEnd;
    }
  }

}

