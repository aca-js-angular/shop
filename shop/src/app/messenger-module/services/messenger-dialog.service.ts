import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MessageBoxComponent } from '../components/message-box/message-box.component';
import { CurrentChatMemberDialogData } from '../messenger-interface';

export const removeOpenedChatАccess = new EventEmitter();
export const chatBoxsCount = new EventEmitter();


@Injectable({
  providedIn: 'root'
}) 
export class MessengerDialogService {

  unicChatMembers = new Set();
  chatCounts: number;

  constructor(private dialog: MatDialog) { }


  openMessengerBox(nativeUserData: CurrentChatMemberDialogData): void{
    this.chatCounts++;
    chatBoxsCount.emit(this.chatCounts);
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



    dialogRef.afterClosed().subscribe(_ => {
      this.chatCounts--;
      chatBoxsCount.emit(this.chatCounts);
      removeOpenedChatАccess.emit()
    })
  }

}
