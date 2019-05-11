import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormControlService } from 'src/app/form-control.service';
import { MessengerService } from '../../services/messenger.service';
import { Subject } from 'rxjs';
import { MessengerDialogService } from '../../services/messenger-dialog.service';
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
    private db: AngularFireDatabase, // <<<<<<<<  TEST
    private messengerService: MessengerService,
    private messengerDialogService: MessengerDialogService,
    private formBuilder: FormBuilder,
    private formControlService: FormControlService,
  ) { }


  ngOnInit() {
    console.log(' -> on init', )


    this.messengerService.autoOpenMessengerWhenNotifing().subscribe(notyfiMessageUserData => {
      // console.log(' -> notyfiMessageUserData', notyfiMessageUserData)

      this.messengerService.openMesssengerBoxOrConfirm(notyfiMessageUserData[0]).subscribe(enumResult => {

        if (enumResult === 'openMess') {
          this.toggleMesengerPanel = !this.toggleMesengerPanel;
          this.messengerDialogService.openMessengerBox(notyfiMessageUserData[0]); // this.findedUser
        }
      });


    })
  

    this.sendMessageForm = this.formBuilder.group({
      email: ['davit_2014@list.ru', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
      ]],
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


  openMesssengerBox() {

    //---original---------
    this.messengerService.openMesssengerBoxOrConfirm(this.findedUser).subscribe(enumResult => {
      // this.destroyStream.next();

      //-------Dublicat mincev Confirm@ dnenq
      if (enumResult === 'openMess') {
        this.toggleMesengerPanel = !this.toggleMesengerPanel;
        this.messengerDialogService.openMessengerBox(this.findedUser);


      } else if (enumResult = 'openConf') {
        this.toggleMesengerPanel = !this.toggleMesengerPanel;
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