import { Injectable } from '@angular/core';
import { Product } from '../../interfaces and constructors/product.interface';

@Injectable({
  providedIn: 'root'
})

export class FilterService {

  constructor() {}

  /* --- Variables --- */

  sortType: string = 'postDate'
  remember: boolean = false;
  strict: boolean = false;
  priceRange: {min: number, max: number} = {min: null, max: Infinity};
  colorArray: string[] = [];
  materialArray: string[] = [];

  /* --- Methods --- */

  resetPriceRange(){
    this.priceRange = {min: null, max: Infinity}
  }

  resetColorsFilter(){
    this.colorArray.length = 0;
  }

  resetMaterialFilter(){
    this.materialArray = [];
  }

  resetAll(){
    this.resetPriceRange();
    this.resetColorsFilter();
    this.resetMaterialFilter();
    this.strict = false;
  }


  setRanges(range: {min: number, max: number}): void{
    this.priceRange.min = range.min
    this.priceRange.max = range.max
  }

  setMaterials(computedMaterials: object): void {
    const materials = []
    for(let key in computedMaterials){
      if(computedMaterials[key])materials.push(key)
    }
    this.materialArray = materials
  }

  toggleColors(color: string): void{
    if(!this.colorArray.includes(color))this.colorArray.push(color);
    else this.colorArray.forEach((item,index) => {
      if(item === color)this.colorArray.splice(index,1)
    })
  }

  sort(array: Product[]){
    if(this.sortType === 'rating'){
      array.sort((productA,productB) => parseInt(productB.rating) - parseInt(productA.rating))
    }else{
      array.sort((productA,productB) => productB[this.sortType] - productA[this.sortType])
    }
  }

  globalFilter(sourceArray: Product[]): Product[]{

    let filteredArray = sourceArray.map(item => item);

    //-------------Price--------------------------
    if(this.priceRange.min || isFinite(this.priceRange.max)){
      filteredArray = filteredArray.filter(product => product.price > this.priceRange.min && product.price < this.priceRange.max);
    }

    //-------------Colors-------------------------
    if (this.colorArray.length) {
        filteredArray = filteredArray.filter(product => {
          if(this.strict){
            return this.colorArray.every(color => product.details.colors.includes(color))
          }else{
            return this.colorArray.some(color => product.details.colors.includes(color))
          }
        })
    }

    //-------------Material-------------------------
    if (this.materialArray.length) {
      filteredArray = filteredArray.filter(product => {
        return this.materialArray.some(material => product.details.material.includes(material))
      })

    }

    return filteredArray;

  }

}
