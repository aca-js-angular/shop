import { Injectable } from '@angular/core';

@Injectable()

export class SlideService {

  /* --- Methods --- */
  
  slide(elem: HTMLElement, contentArray: any[], limit: number, direction: boolean,){

    const width: number = parseInt(getComputedStyle(elem).width)
    const matrixArr: string[] = getComputedStyle(elem).transform.split(',')
    const scrolled: number = Math.abs(+matrixArr[matrixArr.length - 2]) || 0
    const scrolledTimes: number = Math.round(scrolled / width)

    if(Math.abs((scrolled / width) - Math.round(scrolled / width)) > 0){
      return
    }

    if(direction){ 

      const max: number = Math.ceil((contentArray.length / limit) - 1)
      if(scrolledTimes >= max)return;
      let indent = -(scrolled + width) + 'px'
      elem.style.transform = `translateX(${indent})`

    }else{

      if(!scrolledTimes)return;
      let indent = -(scrolled - width) + 'px'
      elem.style.transform = `translateX(${indent})`

    }
  }
}