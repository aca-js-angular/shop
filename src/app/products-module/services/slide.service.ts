import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SlideService {

  /* --- Methods --- */
  
  slide(

        elem: HTMLElement,
        arrowLeft: HTMLElement,
        arrowRight: HTMLElement,
        contentLength: number,
        limit: number,
        direction: boolean

        ): true | void {

    const width: number = parseInt(getComputedStyle(elem).width)
    const matrixArr: string[] = getComputedStyle(elem).transform.split(',')
    const scrolled: number = Math.abs(+matrixArr[matrixArr.length - 2]) || 0
    const scrolledTimes: number = Math.round(scrolled / width)
    
    if(((scrolled % width / width) * limit) % 1){
      return
    }

    if(direction){ 

      const max: number = Math.ceil((contentLength / limit) - 1)
      if(scrolledTimes === max)return;
      else if(scrolledTimes === max - 1){
        let remain = contentLength % limit || limit;
        let percent = limit / remain
        let indent = -(scrolled + (width / percent)) + 'px';
        elem.style.transform = `translateX(${indent})`
        arrowRight.style.opacity = '0'
        arrowRight.style.cursor = 'default'
        arrowLeft.style.opacity = '1'
        arrowLeft.style.cursor = 'pointer'
        return true
      }
      else{
        let indent = -(scrolled + width) + 'px'
        elem.style.transform = `translateX(${indent})`
        arrowLeft.style.opacity = '1'
        arrowLeft.style.cursor = 'pointer'
      }
      

    }else{
      if(!scrolledTimes){
        return
      }
      else if(scrolledTimes === 1){
        if(!(scrolled % width)){
          let indent = -(scrolled - width) + 'px'
          elem.style.transform = `translateX(${indent})`
        }else{
          let remain = contentLength % limit;
          let percent = limit / remain;
          let indent = -(scrolled - (width / percent));
          elem.style.transform = `translateX(${indent})`
        }
        arrowLeft.style.opacity = '0'
        arrowLeft.style.cursor = 'default'
      }
      else{
        let indent = -(scrolled - width) + 'px'
        elem.style.transform = `translateX(${indent})`
      }

      arrowRight.style.opacity = '1'
      arrowRight.style.cursor = 'pointer'

    }
  }

  resetSlide(elem: HTMLElement, arrowLeft: HTMLElement, arrowRight: HTMLElement){
    elem.style.transform = 'initial';
    arrowLeft.style.opacity = '0';
    arrowLeft.style.cursor = 'default';
    arrowRight.style.opacity = '1';
    arrowRight.style.cursor = 'pointer';
  }

}