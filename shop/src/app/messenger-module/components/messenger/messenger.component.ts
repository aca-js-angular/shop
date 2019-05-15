import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormControlService } from 'src/app/form-control.service';
import { MessengerService } from '../../services/messenger.service';
import { Subject } from 'rxjs';
import { MessengerDialogService } from '../../services/messenger-dialog.service';
import { CurrentChatMemberDialogData, CurrentUserCloud } from '../../user-interface';
import { MatDialogRef } from '@angular/material';
import { MessageBoxComponent } from '../message-box/message-box.component';


@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
  inputs: ['vendorEmail:email']
})
export class MessengerComponent implements OnInit, OnDestroy {
  vendorEmail: string = '';

  sendMessageForm: FormGroup;
  destroyStream = new Subject<void>()
  findedUser: CurrentChatMemberDialogData;
  toggleMesengerPanel: boolean = true;



  constructor(
    // private dialogRef: MatDialogRef<any>,
    private messengerService: MessengerService,
    private messengerDialogService: MessengerDialogService,
    private formBuilder: FormBuilder,
    private formControlService: FormControlService,
  ) { }


  ngOnInit() {
    this.sendMessageForm = this.formBuilder.group({
      email: [this.vendorEmail, [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
      ]],
    });


    this.messengerService.autoOpenMessengerWhenNotifing().subscribe(notyfiMessageUserData => {
      this.openMesssengerBox(notyfiMessageUserData)      // console.log(' -> notyfiMessageUserData', notyfiMessageUserData)
    })
}



  //----------Metods-------------

  get email() { return this.sendMessageForm.get('email') }

  getErrors(control: FormControl, message?) {
    return this.formControlService.getErrorMessage(control, message)
  }

  searchUser() {
    this.messengerService.searchUserCombineRtimeCloud(this.email.value)
      .then(findedChatMember => this.findedUser = findedChatMember) 
  }



  openMesssengerBox(chatMemberData: CurrentChatMemberDialogData[] = []) {
    if(!chatMemberData[0]) chatMemberData[0] = this.findedUser;


    this.messengerService.openMesssengerBoxOrConfirm(chatMemberData[0]).subscribe(enumResult => {
      // this.destroyStream.next();
      //-------Dublicat mincev Confirm@ dnenq
      if (enumResult === 'openMess') {
        this.toggleMesengerPanel = !this.toggleMesengerPanel;
        this.messengerDialogService.openMessengerBox(chatMemberData[0]);

      } else if (enumResult = 'openConf') {
        this.toggleMesengerPanel = !this.toggleMesengerPanel;
        this.messengerDialogService.openMessengerBox(chatMemberData[0]);

        // accept > messengerService.AddmemberInChat    'You are Friends;
        //-------ConfirmMessage-----------
        // this.addMemberInChat(findedUser.userId, {
        //   newMemberUid: curUser.uid,
        //   messages: {
        //     message: `You and ${findedUser.fullName} have become friends `, timestamp: new Date().getTime().toString(),
        //   }
        // })
      }
      this.findedUser = null;
    });

    ///---------autoOpen--------
  }

  ngOnDestroy() {
    // this.dialogRef.close()
    this.destroyStream.next();
  }
}











      
		// 	console.log('​notyfiMessage', notyfiMessageUserData)

    //   // console.log('notyfiMessageUserData', notyfiMessageUserData)

    //   if(notyfiMessageUserData[ind]){ }


    //   this.messengerService.openMesssengerBoxOrConfirm(notyfiMessageUserData[ind]).subscribe(enumResult => {
    //     this.destroyStream.next();

    //     if (enumResult === 'openMess') {
    //       this.toggleMesengerPanel = !this.toggleMesengerPanel;
    //       this.messengerDialogService.openMessengerBox(notyfiMessageUserData[0]); // this.findedUser
    //     }
    //   });