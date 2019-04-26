import { Injectable } from '@angular/core';
import { Product } from '../product-interface';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  remember: boolean = false;
  strict: boolean = false;
  sortType: string = 'postDate'

  constructor() { }

  priceRange: {min: number, max: number} = {min: null, max: Infinity};
  colorArray: string[] = [];
  materialArray: string[] = ['iron','leather','plastic','gold','silver','bronze'];

  resetPriceRange(){
    this.priceRange = {min: null, max: Infinity}
  }

  resetColorsFilter(){
    this.colorArray.length = 0;
  }

  resetMaterialFilter(){
    this.materialArray = ['iron','leather','plastic','gold','silver','bronze'];
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

  toggleColors(color: string): void{
    if(!this.colorArray.includes(color))this.colorArray.push(color);
    else this.colorArray.forEach((item,index) => {
      if(item === color)this.colorArray.splice(index,1)
    })
  }

  setMaterials(computedMaterials: object): void {
    const materials = []
    for(let key in computedMaterials){
      if(computedMaterials[key])materials.push(key)
    }
    this.materialArray = materials
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
      console.log('filtering Price')
      filteredArray = filteredArray.filter(product => product.price > this.priceRange.min && product.price < this.priceRange.max);
    }

    //-------------Colors-------------------------
    if (this.colorArray.length) {
      if(this.strict){
        filteredArray = filteredArray.filter(product => {
          return this.colorArray.every(color => product.details.colors.includes(color))
        })
      }else{
        filteredArray = filteredArray.filter(product => {
          return this.colorArray.some(color => product.details.colors.includes(color))
        })
      } 
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
