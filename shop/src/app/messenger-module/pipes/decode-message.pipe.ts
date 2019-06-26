import { Pipe, PipeTransform } from '@angular/core';
import { MessageDataRTimeDb } from '../messenger-interface';

@Pipe({
  name: 'decodeMessage'
})
export class DecodeMessagePipe implements PipeTransform {

  transform(messageField: MessageDataRTimeDb, decodedFields: any, decodFieldName: string): any {

    if(messageField && decodedFields){
      const decodedFullName: string = decodedFields[messageField.message.sender].fullName;
      const decodedPhotoUrl: string = decodedFields[messageField.message.sender].photoUrl;
      
      switch (decodFieldName) {
        case 'fullName': return decodedFullName;
        case 'photoUrl': return decodedPhotoUrl ? decodedPhotoUrl : 'assets/empty_user.png';
      }
    }
  }

}
