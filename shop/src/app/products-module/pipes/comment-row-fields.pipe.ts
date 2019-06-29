import { Pipe, PipeTransform } from '@angular/core';
import { ProductSingleComment } from 'src/app/interfaces/product-comment.interface';

@Pipe({
  name: 'commentFields'
})
export class CommentRowFieldsPipe implements PipeTransform {

  transform(comment: ProductSingleComment, selectedField: string): any {
    return null;
  }

}
