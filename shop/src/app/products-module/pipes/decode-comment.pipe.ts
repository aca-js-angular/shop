// import { Pipe, PipeTransform } from '@angular/core';
// import { ProductSingleComment } from 'src/app/interfaces/product-comment.interface';
// import { User } from 'src/app/interfaces/user.interface';


// @Pipe({
//   name: 'decodeComment',
// })
// export class DecodeCommentFields implements PipeTransform {

//   transform(comment: ProductSingleComment, decodedFieldsMapCollection: Map<string,User>, convertFieldName: string): any {

//     if(comment && decodedFieldsMapCollection){
//       const user = decodedFieldsMapCollection.get(comment.sender);
//       switch (convertFieldName) {
//         case 'firstName': return user.firstName;
//         case 'fullName': return `${user.firstName} ${user.lastName}`;
//         case 'image': return user.img ? user.img : 'assets/empty_user.png';
//       }
//     } else {
//       throw Error('required values -> (comment: ProductSingleComment, decodedFieldsMapCollection: Map<string,User>, convertFieldName: string)')
//     }
//   }

// }
