import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormControlService } from 'src/app/form-control.service';
import { MessengerService } from '../../services/messenger.service';
import { Subject } from 'rxjs';
import { MessengerDialogService } from '../../services/messenger-dialog.service';
import { ConfirmDialogService } from 'src/app/comfirm-module/services/confirm-dialog.service';
import { AdditionalService } from 'src/app/fa-module/Services/additional.service';
import { CurrentChatMemberDialogData } from '../../user-interface';

import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit, OnDestroy {
  sendMessageForm: FormGroup;
  destroyStream = new Subject<void>()
  findedUser: CurrentChatMemberDialogData;
  toggleMesengerPanel: boolean = true;

  constructor(
    private confirmMessage: ConfirmDialogService,
    private db: AngularFireDatabase, // <<<<<<<<  TEST
    private messengerService: MessengerService,
    private messengerDialogService: MessengerDialogService,
    private formBuilder: FormBuilder,
    private formControlService: FormControlService,
  ) { }


  ngOnInit() {


    this.sendMessageForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
      ]],

    })
  }


  get email() { return this.sendMessageForm.get('email') }

  getErrors(control: FormControl, message?) {
    return this.formControlService.getErrorMessage(control, message)
  }



  searchUser() {
    this.messengerService.searchUserCombineRtimeCloud(this.email.value).then(findedChatMember => this.findedUser = findedChatMember)
  }


  openMesssengerBox() {
    this.messengerService.openMesssengerBoxOrConfirm(this.findedUser).then(enumResult => {
      this.destroyStream.next();

      //-------Dublicat mincev Confirm@ dnenq
      if (enumResult === 'openMess') {
        this.messengerDialogService.openMessengerBox(this.findedUser);

      } else if (enumResult = 'openConf') {
        this.messengerDialogService.openMessengerBox(this.findedUser);

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
    this.destroyStream.next();
  }
}