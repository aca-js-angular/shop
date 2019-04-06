import { Pipe, PipeTransform } from '@angular/core';
import { Products } from '../Services/products-control.service'


@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(array:Products[] , value: string) {
    if (array && value) {
      return array.filter(products => products.name.toLowerCase().includes(value.toLowerCase()) || products.price.toString().includes(value) ) 
    } else return array; // asinci hamar
  }
}


@Pipe({
  name: 'nameFormat',
  pure: false
}) // данные будут отфилтрованы толко тагода кгда будет менятсе целеком
export class NameFormatPipe implements PipeTransform {
  transform(name) {
    return name[0].toUpperCase() + name.slice(1)
  }
}