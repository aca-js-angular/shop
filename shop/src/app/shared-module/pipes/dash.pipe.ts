import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dash'
})
export class DashPipe implements PipeTransform {

  transform(value: string): string {
    let arr = [];
    let lastIndex = 0;
    for(let i = 1; i < value.length; i++){
      if(value[i].toUpperCase() === value[i]){
        arr.push(value.slice(lastIndex,i).toLowerCase())
        lastIndex = i++
      }
    }
    arr.push(value.slice(lastIndex).toLowerCase())
    return arr.join('-')
  }

}
