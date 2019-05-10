import { Injectable } from '@angular/core';
import { flowOptions } from '../../interfaces/exports';


@Injectable({
  providedIn: 'root'
})

export class FlowService {

  constructor() {}

  /* ---------- Public Method ---------- */

  public flow({target, duration = 2, delay = 0, from = 'left'}: flowOptions){

    const initTransition = getComputedStyle(target).transition
    const distance = this.getHidingDistance(target,from) + 'px'

    switch(from){
      case 'left':
        target.style.transform = `translateX(-${distance})`
        break;
      case 'right': 
        target.style.transform = `translateX(${distance})`
        break;
      case 'top':
        target.style.transform = `translateY(-${distance})`
        break;
      case 'bottom':
        target.style.transform = `translateY(${distance})`
        break;
    }

    function animate(){
      target.style.transitionProperty = 'transform'
      target.style.transitionDuration = duration + 's'
      target.style.transform = 'translate(0px,0px)'
    }

    function resetTransition(){
      target.style.transition = initTransition
    }

    setTimeout(animate,delay)
    setTimeout(resetTransition, duration * 1000 + delay)

  }


  /* ---------- Private Implementations ---------- */

  private getHidingDistance(target: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom'): number{

    const width: number = target.offsetWidth
    const height: number = target.offsetHeight
    const coords = target.getBoundingClientRect()

    const left = coords.left + width
    const top = coords.top + height
    const right = window.innerWidth - coords.right + width
    const bottom = window.innerHeight - coords.bottom + height

    switch(direction){
      case 'left': return left
      case 'right': return right
      case 'top': return top
      case 'bottom': return bottom
    }
  }

}