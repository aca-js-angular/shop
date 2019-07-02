import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MessageBoxComponent } from '../components/message-box/message-box.component';
import { CurrentChatMemberDialogData } from '../messenger-interface';

export const removeOpenedChatАccess = new EventEmitter();

@Injectable({
  providedIn: 'root'
}) 
export class MessengerDialogService {

  unicChatMembers = new Set();


  constructor(private dialog: MatDialog) { }


  openMessengerBox(nativeUserData: CurrentChatMemberDialogData): void{

    const dialogRef = this.dialog.open(MessageBoxComponent, {

      disableClose: false,
      hasBackdrop: false,
      closeOnNavigation: false,
      width: '300px',
      height: '400px',
      position: { bottom : '0px', right: '30px' },
      panelClass: 'message-box-dialog',

      data: {
        fullName: nativeUserData.fullName,
        userId: nativeUserData.userId,
      }
      

    });



    //-------Chat Member--------------
  //  config.data = { 
  //     fullName: nativeUserData.fullName,
  //     userId: nativeUserData.userId, // Chat Member User Uid
  //   }

    // const dialogRef = this.dialog.open(MessageBoxComponent,config)
  
    dialogRef.afterClosed().subscribe(option => {
      removeOpenedChatАccess.emit()
      dialogRef.close()
    })
  }

}
