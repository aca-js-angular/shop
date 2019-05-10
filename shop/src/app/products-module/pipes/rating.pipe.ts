import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rating'
})
export class RatingPipe implements PipeTransform {

  transform(value: number): any {

    const rating: string = "&#9733;".repeat(value) + "&#9734;".repeat(5 - value)
    const element = document.createElement('span')
    element.innerHTML = rating

    return element.textContent
    
  }

}
