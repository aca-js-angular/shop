import { Component, OnInit, OnDestroy, AfterViewInit, EventEmitter } from '@angular/core';
import { MessengerService } from '../../services/messenger.service';
import { MessengerDialogService, removeOpenedChatАccess } from '../../services/messenger-dialog.service';
import { CurrentChatMemberDialogData } from '../../messenger-interface';
import { chatEmitVendor, openChatBox } from 'src/app/products-module/components/product-detail/product-detail.component';
import { MessengerAutoOpenChatBoxByNf } from '../../services/messsenger-auto-open-chat.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user.interface';
import { emitOpenChatWithProfile } from 'src/app/profile-module/components/profile-root/profile-root.component';



@Component({
  selector: 'app-messenger',
  templateUrl: './messenger-main.component.html',
  styleUrls: ['./messenger-main.component.scss'],
})

export class MessengerComponent implements OnInit, OnDestroy {

  destroyStream$ = new Subject<void>();
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

    //----------Emiters---------------
    removeOpenedChatАccess.pipe(takeUntil(this.destroyStream$)).subscribe(_void => emitedVendorEmailUnicBox = '');

    // ----Subscribe Product Detail Emiting-----
    chatEmitVendor.pipe(takeUntil(this.destroyStream$)).subscribe(emitedVendor => this.emitedVendor = emitedVendor as User);

    openChatBox.pipe(takeUntil(this.destroyStream$)).subscribe(_void => {
      if(this.emitedVendor && this.emitedVendor.email && this.emitedVendor.email !== emitedVendorEmailUnicBox){
        this.searchUserandEmite(this.emitedVendor.email)
        emitedVendorEmailUnicBox = this.emitedVendor.email; // for unic search
      }
    })

    //-------Subscribe From Profile Emiting-----
    emitOpenChatWithProfile.pipe(takeUntil(this.destroyStream$)).subscribe(vendorEmail => {
      if(emitedVendorEmailUnicBox === vendorEmail) return;
      
        this.searchUserandEmite(vendorEmail);
        emitedVendorEmailUnicBox = vendorEmail as string; // for unic search
    })



    // ----Auto Opening by Notify----
    this.messengerAutoOpenChatService.subscribeNewMessageNotify().pipe(takeUntil(this.destroyStream$))
      .subscribe(notyfiMessageUserData => {
        console.log('autoopening oninit')

        this.openMesssengerBoxByEmit(notyfiMessageUserData[0]);
      })
  }

  //----------Metods-------------

  searchUserandEmite(emitedSearchEmail) {
    this.messengerService.searchUserCombineRtimeCloud(emitedSearchEmail)
      .then(findedChatMember => this.openMesssengerBoxByEmit(findedChatMember));
  }



  openMesssengerBoxByEmit(emitedVendorData: CurrentChatMemberDialogData) { 

    if (emitedVendorData) {
      const $subscribable = this.messengerService.openMesssengerBoxOrConfirm(emitedVendorData)
        .subscribe(enumCondition => {

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
    this.destroyStream$.next();
    this.messengerAutoOpenChatService.diasbleMessagesNotyfictions$.next();
  }
}