import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  constructor() { }

  private generateArray(quantity: number, start: number): number[]{
    return new Array(quantity).fill(null).map(() => start++)
  }

  getNearestYears(amount: number = 20): number[]{
    const thisYear: number = new Date().getFullYear()
    return this.generateArray(amount,thisYear)
  }

  getMonths(year?: number): number[]{
    const isThisYear: boolean = !year || year == new Date().getFullYear();
    const firstMonth: number = isThisYear ? new Date().getMonth() + 1 : 1;
    return this.generateArray(12 - firstMonth + 1, firstMonth);
  }

  getMonthDays(monthIndex: number): number[]{

    switch(monthIndex){
      case 1: case 3: case 5: case 7: case 8: case 10: case 12: 
      return this.generateArray(31,1)

      case 4: case 6: case 9: case 11:
      return this.generateArray(30,1)

      case 2:
      let thisYear: number = new Date().getFullYear()
      let days: number;
      if(thisYear % 4 === 2)days = 28
      else days = 29
      return this.generateArray(days,1)
    }
  }

}
