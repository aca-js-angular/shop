import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zipper'
})
export class ZipperPipe implements PipeTransform {

  transform(value: string, arg: number): string {
    return value.length > arg ? value.slice(0,arg) + '...' : value
  }

}
