import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rating'
})
export class RatingPipe implements PipeTransform {

  transform(value: string): any {
    
    const [amount,from] = [value,5]
    const rating: string = "&#9733;".repeat(+amount) + "&#9734;".repeat(+from - +amount)
    const element = document.createElement('span')
    element.innerHTML = rating

    return element.textContent
    
  }

}
