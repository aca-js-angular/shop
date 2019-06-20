import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StylesService {

  constructor() {}

  getStyles(elem: HTMLElement, styles: string[]): [string,string][]{
    const initStyles: [string,string][] = [];
    styles.forEach(style => {
      initStyles.push([style,getComputedStyle(elem)[style]])
    })
    return initStyles;
  }

  setStyles(elem: HTMLElement, styles: string[][]): void {
    styles.forEach(rule => {
      elem.style[rule[0]] = rule[1]
    })
  }

  getInitSetNewStyles(elem: HTMLElement, styles: {[key: string]: string}){
    const pairs: [string,string][] = Object.entries(styles);
    const properties: string[] = pairs.map(pair => pair[0]);

    const initStyles = this.getStyles(elem,properties);
    this.setStyles(elem,pairs);
    return initStyles;
  }


  inverceStyles(elem: HTMLElement, properties: [string,string]){
    const initStyles = this.getStyles(elem,properties);
    let inversed = [[initStyles[0][0],initStyles[1][1]],[initStyles[1][0],initStyles[0][1]]]
    this.setStyles(elem,inversed);
  }

  blink(elem: HTMLElement, initStyles: [string,string][],time: number){
    this.setStyles(elem,initStyles)
    let inversed = [[initStyles[0][0],initStyles[1][1]],[initStyles[1][0],initStyles[0][1]]]
    this.setStyles(elem,inversed);
    setTimeout(() => this.setStyles(elem,initStyles),time * 1000 / 2)
  }

  fork(elem: HTMLElement, amount, time){
    let scaleSize: string = (1 + amount / 100).toString();
    this.setTransition(elem,time / 2);
    elem.style.transform = `scale(${scaleSize})`;
    setTimeout(() => elem.style.transform = 'scale(1)',time * 1000 / 2);
    setTimeout(() => this.resetTransition(elem),time * 1000);
  }

  
  getClosureFn(elem: HTMLElement, styles: {[key: string]: string}, timeout: number){

    let isActive: boolean = false

    function closureFn(){
      if(isActive)return
      isActive = true;
      let init = this.getInitSetNewStyles(elem,styles);
      setTimeout(() =>{
        this.setStyles(elem,init);
        isActive = false
      },timeout);
    }

    return closureFn.bind(this)

  }


  setTransition(elem: HTMLElement, duration: number = 0.5){
    elem.style.transition = `all ${duration}s`
  }
  resetTransition(elem: HTMLElement){
    elem.style.transition = 'initial'
  }

  getDistanceBetweenElements(elem1: HTMLElement, elem2: HTMLElement): {
    top: number,
    bottom: number,
    left: number,
    right: number,
    verticalCenter: number,
    horizontalCenter: number,
  }{

    const elem1Coords = elem1.getBoundingClientRect();
    const elem2Coords = elem2.getBoundingClientRect();

    const top = Math.abs(elem1Coords.top - elem2Coords.top);
    const bottom = Math.abs(elem1Coords.bottom - elem2Coords.bottom);
    const left = Math.abs(elem1Coords.left - elem2Coords.left);
    const right = Math.abs(elem1Coords.right - elem2Coords.right);

    const verticalCenter = Math.abs(elem1Coords.top - elem2Coords.top) - Math.abs(elem1Coords.height - elem2Coords.height / 2);
    const horizontalCenter = Math.abs(elem1Coords.left - elem2Coords.left) - Math.abs(elem1Coords.width - elem2Coords.width / 2)

    return {
      top,
      bottom,
      left,
      right,
      verticalCenter,
      horizontalCenter,
    }

  }

  copyGeometry(sourceElem: HTMLElement, targetElem: HTMLElement){
    const sourceElemCoords = sourceElem.getBoundingClientRect();
    this.setStyles(targetElem,[
      ['top',sourceElemCoords.top + 'px'],
      ['bottom',sourceElemCoords.bottom + 'px'],
      ['left',sourceElemCoords.left + 'px'],
      ['right',sourceElemCoords.right + 'px'],
      ['height',sourceElemCoords.height + 'px'],
      ['width',sourceElemCoords.width + 'px'],
    ])
  }

  copyStyles(sourceElem: HTMLElement, targetElem: HTMLElement, styles: string[]){
    let styleEntries = [];
    styles.forEach(key => {
      styleEntries.push([key,getComputedStyle(sourceElem)[key]])
    })
    this.setStyles(targetElem,styleEntries);
  }

  

}
