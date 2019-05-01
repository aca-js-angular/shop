import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rating'
})
export class RatingPipe implements PipeTransform {

  transform(value: string): any {
    const firstSlashIndex = value.indexOf('/')
    const [_amount,_from] = value.split('/')

    const requirements = 
    `input requirements:

        1. there must be only a single and required slash "/" in input
        2. there must be only positive and required numeric values both to left and right from slash
        3. any other charachters are forbidden
        4. number before slash must be smaller or equal from number after slash

      example: => 7/10`

    if(isNaN(+_amount) || isNaN(+_from)){
      throw new Error(`

      RatingPipe: ERROR
      unexpected input: ${value}
      [RatingPipe] input must include only a single slash charachter and numbers to left and right of it.
      any other charachters are forbidden.

      ${requirements}
      `)
    }
    if(!value.includes('/')){
      throw new Error(`

      RatingPipe: ERROR
      unexpected input: ${value}
      slash charachter "/" is required in [RatingPipe] input

      ${requirements}
      `)
    }
    if(firstSlashIndex === 0 || firstSlashIndex === value.length - 1 || +_amount < 0 || +_from < 0){
      throw new Error(`

      RatingPipe: ERROR
      unexpected input: ${value}
      both sides of slash charachter "/" requires a number greater or equal to 0.

      ${requirements}
      `)
    }
    if(+_amount > +_from){
      throw new Error(`

      RatingPipe: ERROR
      unexpected input: ${value}
      number to left from "/" must be smaller or equal to number after "/"
      
      ${requirements}
      `)
    }
    const [amount,from] = value.split('/')
    const rating: string = "&#9733;".repeat(+amount) + "&#9734;".repeat(+from - +amount)
    const element = document.createElement('span')
    element.innerHTML = rating

    return element.textContent
    
  }

}
