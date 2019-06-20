import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { FormControlService } from 'src/app/form-control.service';
import { MessengerService } from '../../services/messenger.service';
import { Subject } from 'rxjs';
import { MessengerDialogService } from '../../services/messenger-dialog.service';
import { CurrentChatMemberDialogData } from '../../user-interface';
import { chatEmitVendor, openChatSearchBox } from 'src/app/products-module/components/product-detail/product-detail.component';
import { MessengerAutoOpenChatBoxByNf } from '../../services/messsenger-auto-open-chat.service';

// import { MatDialogRef } from '@angular/material';
// import { MessageBoxComponent } from '../message-box/message-box.component';



@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
})

export class MessengerComponent implements OnInit, OnDestroy {
  vendorEmail: string = '';

  searchEmailForm: FormControl;
  destroyStream = new Subject<void>()
  findedUser: CurrentChatMemberDialogData;
  toggleMesengerPanel: boolean = true;
  firstInit: boolean = false;


  constructor(
    // private dialogRef: MatDialogRef<any>,
    private messengerAutoOpenChatService: MessengerAutoOpenChatBoxByNf,
    private messengerService: MessengerService,
    private messengerDialogService: MessengerDialogService,
    private formControlService: FormControlService,
  ) { }


  ngOnInit() {
    
    chatEmitVendor.subscribe(emitedVendor => this.searchEmailForm.setValue(emitedVendor.email));
    openChatSearchBox.subscribe(_void => this.toggleMesengerPanel = !this.toggleMesengerPanel);// this.toggleMesengerPanel = openSearchBox

    this.searchEmailForm = new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
    ])

    this.messengerAutoOpenChatService.autoOpenMessengerWhenNotifing().subscribe(notyfiMessageUserData => {
      this.firstInit && this.openMesssengerBox(notyfiMessageUserData)    // console.log(' -> notyfiMessageUserData', notyfiMessageUserData)
      this.firstInit = true;
    })

  }

  //----------Metods-------------

  searchUser() {
    this.messengerService.searchUserCombineRtimeCloud(this.searchEmailForm.value)
      .then(findedChatMember => this.findedUser = findedChatMember)
  }



  openMesssengerBox(chatMemberData: CurrentChatMemberDialogData[] = []) { // Finded User
    if (!chatMemberData[0]) chatMemberData[0] = this.findedUser;


    this.messengerService.openMesssengerBoxOrConfirm(chatMemberData[0]).subscribe(enumResult => {
      // this.destroyStream.next();
      //-------Dublicat mincev Confirm@ dnenq
      if (enumResult === 'openMess' || enumResult === 'openConf') {
        this.toggleMesengerPanel = !this.toggleMesengerPanel;
        this.messengerDialogService.openMessengerBox(chatMemberData[0]);
      }

      this.findedUser = null;
    });

    ///---------autoOpen--------
  }

  getErrors(control: FormControl, message?) {
    return this.formControlService.getErrorMessage(control, message)
  }
  ngOnDestroy() {
    // this.dialogRef.close()
    this.destroyStream.next();
  }
}


// if(!chatMemberData[0]) chatMemberData[0] = this.findedUser;
// this.messengerService.openMesssengerBoxOrConfirm(chatMemberData[0]).subscribe(enumResult => {
//   // this.destroyStream.next();
//   //-------Dublicat mincev Confirm@ dnenq
//   if (enumResult === 'openMess') {
//     this.toggleMesengerPanel = !this.toggleMesengerPanel;
//     this.messengerDialogService.openMessengerBox(chatMemberData[0]);

//   } else if (enumResult = 'openConf') {
//     this.toggleMesengerPanel = !this.toggleMesengerPanel;
//     this.messengerDialogService.openMessengerBox(chatMemberData[0]);
//     //-----comment-----
//   }
//   this.findedUser = null;
// });
        // accept > messengerService.AddmemberInChat    'You are Friends;
        //-------ConfirmMessage-----------
        // this.addMemberInChat(findedUser.userId, {
        //   newMemberUid: curUser.uid,
        //   messages: {
        //     message: `You and ${findedUser.fullName} have become friends `, timestamp: new Date().getTime().toString(),
        //   }
        // })