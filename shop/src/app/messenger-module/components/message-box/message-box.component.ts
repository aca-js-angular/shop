import { Component, OnInit, Inject, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MessengerService } from '../../services/messenger.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { CurrentChatMemberDialogData } from '../../user-interface';
import { FormControl, Validators } from '@angular/forms';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { takeUntil, switchMap, debounceTime } from 'rxjs/operators';
import { Subject, fromEvent, Subscription } from 'rxjs';
import { MessengerOptionalService } from '../../services/messenger-optional-service.service';

const NOTIFICATION_SOUND: string = 'assets/messengerAudio/message2.mp3';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('messageInputRef') messageInputRef: ElementRef;

  curentChatMember: CurrentChatMemberDialogData;
  messageInput: FormControl;
  currentUserId: string;
  allMessages: object[] = [];// or Subscribable<object[] | null>;
  decodeDataCurrentChatMebrs: object;
  isTypingChatMember: boolean;
  destroyStream$ = new Subject<void>()
  inputTypingState: Subscription;
  isOnlineChatMember: boolean;

  constructor(
    private messengerService: MessengerService,
    private messengerOptService: MessengerOptionalService,
    private autoAdditional: AdditionalService,
    private dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: CurrentChatMemberDialogData,
    ) {
    this.curentChatMember = data
  }


  ngOnInit() {
    
    this.messageInput = new FormControl('', Validators.required);
    this.autoAdditional.autoState().then(cUserId => {

      if (cUserId) {   // ---security---
        this.currentUserId = cUserId.uid;

        //----Get Messages-----
        this.messengerService.getMeassages()
          .pipe(takeUntil(this.destroyStream$)).subscribe(messages => {
            // window.scrollTo(500, 0);
            this.allMessages[0] ? this.messengerOptService.sendMessageSound(NOTIFICATION_SOUND): null;
            this.allMessages = messages;
          });

        //------Decode Mesage Data-------
        this.messengerService.decodMessSenderUidInName(this.curentChatMember.userId, cUserId.uid).then(decodedFields =>
          this.decodeDataCurrentChatMebrs = decodedFields);


        //----isOnline-------
        this.messengerOptService.isOnline().pipe(takeUntil(this.destroyStream$))
        .subscribe(isOnlineChatMemberStatus => this.isOnlineChatMember = isOnlineChatMemberStatus)


        //-----------typing---------
        // this.messengerOptService.isTypingChatMember$
        this.messengerOptService.isTypingChatMember().pipe(takeUntil(this.destroyStream$))
          .subscribe(uid => { this.isTypingChatMember = uid === this.curentChatMember.userId ? true : false})

      } else { this.messengerService.closeMessageBox(); } // <<<<<<<<<<<<<<<<<??????????
    });
  }


  

  ngAfterViewInit() {
    
    this.inputTypingState = fromEvent(this.messageInputRef.nativeElement, 'input').pipe(
       debounceTime(300),
 
       switchMap(_ => this.messengerOptService.changerTypingState(this.currentUserId)),
       debounceTime(1000),
 
       switchMap(_ => this.messengerOptService.changerTypingState('false'))
     ).subscribe()
   }
 

   trackByMessages(unicIndex, data){
    return data ? data.key : undefined
   }
  //----------------Metods--------------

  removeMessage(key: string) {
    this.messengerService.removeMessage(key).catch()
  }

  sendMessage() {
    if(!this.messageInput.value) return;
    this.messengerOptService.sendMessageSound(NOTIFICATION_SOUND);
    this.messengerService.sendMessage(this.currentUserId, this.messageInput.value);
    this.messageInput.patchValue('');
  }

  
  closeMessageBox() {
    this.messengerService.closeMessageBox();
    this.dialogRef.close('ok')
  }


  ngOnDestroy() {
    this.dialog.closeAll()

    this.destroyStream$.next();
    this.inputTypingState.unsubscribe()

    //----Message-Box Subscriptions------------
    this.messengerService.destroyStream$.next();
    this.messengerService.getMessagesDestroyStream$.next()
    this.messengerService.decoderFieldsdestroyStream$.next()
    this.messengerService.sendMessageStream$.next()
    // this.messengerService.getMessages$.next()
  }

}
