import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../product-interface';

@Pipe({
  name: 'test',
  pure: false,
})
export class TestPipe implements PipeTransform {

  transform(value: Product[], till: number): Product[] {
    console.log('pipe')
    return value.filter(product => product.price <= till)
  }

}
