import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MessageBoxComponent } from '../components/message-box/message-box.component';
import { CurrentUserCloud, CurrentChatMemberDialogData } from '../user-interface';
import { OverlayRef } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
}) 
export class MessengerDialogService {

  constructor(private dialog: MatDialog) { }

  openMessengerBox(nativeUserData: CurrentChatMemberDialogData): void{ // deefault- >  assets/empty-user.jpg
    const config: MatDialogConfig = {}; 
    config.disableClose = false;
    config.hasBackdrop = false;
    config.closeOnNavigation = false;  // origin

    // config.scrollStrategy = this.overlay.sc.block(),
    // config.width = '300px';
    // config.height = '340px';
    // config.position = {top : '25%', right: '30px'}




    config.width = '299px';
    config.height = '405px';
    config.position = {bottom : '0px', right: '30px'}


    //-------Chat Member--------------

    config.data = { 
      fullName: nativeUserData.fullName,
      userId: nativeUserData.userId, // Chat Member User Uid
      img: nativeUserData.photoUrl
    }

    this.dialog.open(MessageBoxComponent,config)
  }

  closeMessengerBox(): void {
    this.dialog.closeAll()
  }
}
