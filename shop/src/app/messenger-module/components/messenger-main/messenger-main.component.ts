import { Component, OnInit, OnDestroy, AfterViewInit, EventEmitter } from '@angular/core';
import { MessengerService } from '../../services/messenger.service';
import { MessengerDialogService, removeOpenedChatАccess } from '../../services/messenger-dialog.service';
import { CurrentChatMemberDialogData } from '../../messenger-interface';
import { chatEmitVendor, openChatBox } from 'src/app/products-module/components/product-detail/product-detail.component';
import { MessengerAutoOpenChatBoxByNf } from '../../services/messsenger-auto-open-chat.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user.interface';


@Component({
  selector: 'app-messenger',
  templateUrl: './messenger-main.component.html',
  styleUrls: ['./messenger-main.component.scss'],
})

export class MessengerComponent implements OnInit, OnDestroy {
  
  $destroyStream = new Subject<void>();

  notifysAndMessages: CurrentChatMemberDialogData[] = [];
  findedVendor: CurrentChatMemberDialogData;
  emitedVendor: User;
  firstInit: boolean = false;
  showNotifys: boolean = true;

  constructor(
    private messengerService: MessengerService,
    private messengerDialogService: MessengerDialogService,
    private messengerAutoOpenChatService: MessengerAutoOpenChatBoxByNf,
  ) { }


  ngOnInit() {
    let emitedVendorEmailUnicBox: string; // for unic box openning;

    //----Emiters-----
    removeOpenedChatАccess.pipe(takeUntil(this.$destroyStream)).subscribe(_void => emitedVendorEmailUnicBox = '');


    chatEmitVendor.pipe(takeUntil(this.$destroyStream)).subscribe(emitedVendor => this.emitedVendor = emitedVendor as User);

    openChatBox.pipe(takeUntil(this.$destroyStream)).subscribe(_void => {
      this.emitedVendor 
        && this.emitedVendor.email 
        && this.emitedVendor.email !== emitedVendorEmailUnicBox
        && this.searchUserandEmite(this.emitedVendor.email);

      emitedVendorEmailUnicBox = this.emitedVendor.email; // for unic search
    })

    // ----Auto Opening by Notify----
    this.messengerAutoOpenChatService.subscribeNewMessageNotify().pipe(takeUntil(this.$destroyStream))
      .subscribe(notyfiMessageUserData => {
        this.openMesssengerBoxByEmit(notyfiMessageUserData[0]);
        console.log("TCL: MessengerComponent -> ngOnInit ->", notyfiMessageUserData) 
      })
  }


  emiteNotifyVendorWithTemplate(vendor) {
    // this.openMesssengerBoxByEmit(vendor)
  }

  //----------Metods-------------

  searchUserandEmite(emitedSearchEmail) {
    this.messengerService.searchUserCombineRtimeCloud(emitedSearchEmail)
      .then(findedChatMember => this.openMesssengerBoxByEmit(findedChatMember));
  }



  openMesssengerBoxByEmit(emitedVendorData: CurrentChatMemberDialogData) { // Finded User
    // console.log("-> vendor-----", emitedVendorData)
    if (emitedVendorData) {
      const $subscribable = this.messengerService.openMesssengerBoxOrConfirm(emitedVendorData)
        .subscribe(enumCondition => {
          console.log(enumCondition)

          switch (enumCondition) {
            case 'openMessBox':
              this.messengerDialogService.openMessengerBox(emitedVendorData);
              $subscribable.unsubscribe();
              break;

            case 'openConf':

              break;
          }
        })
    }
  }


  ngOnDestroy() {
    this.$destroyStream.next();
    this.messengerAutoOpenChatService.diasbleMessagesNotyfictions$.next();
  }
}

// if (this.notifysAndMessages.length) {
//   this.notifysAndMessages.forEach(item => {
//      item.userId !== notyfiMessageUserData[0].userId 
//      && this.notifysAndMessages.push(notyfiMessageUserData[0]);
//   })
// } else if(this.firstInit) this.notifysAndMessages.push(notyfiMessageUserData[0]);