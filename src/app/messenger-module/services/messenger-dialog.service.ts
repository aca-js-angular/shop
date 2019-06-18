import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MessageBoxComponent } from '../components/message-box/message-box.component';
import { CurrentChatMemberDialogData } from '../user-interface';

@Injectable({
  providedIn: 'root'
}) 
export class MessengerDialogService {

  constructor(private dialog: MatDialog) { }

  openMessengerBox(nativeUserData: CurrentChatMemberDialogData): void{
    const config: MatDialogConfig = {}; 
    config.disableClose = false;
    config.hasBackdrop = false;
    config.closeOnNavigation = false;
    config.width = '299px';
    config.height = '405px';
    config.position = { bottom : '0px', right: '30px' }


    //-------Chat Member--------------
   config.data = { 
      fullName: nativeUserData.fullName,
      userId: nativeUserData.userId, // Chat Member User Uid
    }

    const dialogRef = this.dialog.open(MessageBoxComponent,config)
  
    dialogRef.afterClosed().subscribe(option => {
			// console.log('​-> option', option)
      dialogRef.close()
    })
  }

    // config.scrollStrategy = this.overlay.sc.block(),
    // config.width = '300px';
    // config.height = '340px';
    // config.position = {top : '25%', right: '30px'}


}
