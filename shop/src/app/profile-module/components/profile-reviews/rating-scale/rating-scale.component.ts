import { Component, OnInit } from '@angular/core';

const FILLED = '&#9733;'
const EMPTY = '&#9734;'

@Component({
  selector: 'app-rating-scale',
  templateUrl: './rating-scale.component.html',
  styleUrls: ['./rating-scale.component.scss']
})
export class RatingScaleComponent implements OnInit {

  hoveredRate: number = null;
  staticRate: number = null;

  get hoverClasses(): object {
    return {
      'static-high'   : this.staticRate >= 4,
      'static-mid'    : this.staticRate >=2 && this.staticRate < 4,
      'static-low'    : this.staticRate === 1,
      'high-rate' : !this.staticRate && this.hoveredRate >= 4,
      'mid-rate'  : !this.staticRate && this.hoveredRate >=2 && this.hoveredRate < 4,
      'low-rate'  : !this.staticRate && this.hoveredRate === 1,
      'no-rate'   : !this.staticRate && this.hoveredRate === null,
    }
  }

  get staticClasses(): object {
    return {
      'high-rate' : this.staticRate >= 4,
      'mid-rate'  : this.staticRate >=2 && this.staticRate < 4,
      'low-rate'  : this.staticRate === 1,
    }
  }

  isFilled(index: number): string {
    return this.staticRate ?
    this.staticRate >= index ? FILLED : EMPTY :
    this.hoveredRate >= index ?  FILLED : EMPTY 
  }

  setStaticRate(amount: number){

  }


  constructor() { }

  ngOnInit() {
  }

}
