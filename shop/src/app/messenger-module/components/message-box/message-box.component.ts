import { Component, OnInit, Inject, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MessengerService, emiteCloseMessageBox } from '../../services/messenger.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { CurrentChatMemberDialogData } from '../../messenger-interface';
import { FormControl, Validators } from '@angular/forms';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { takeUntil, switchMap, debounceTime } from 'rxjs/operators';
import { Subject, fromEvent, Subscription } from 'rxjs';
import { MessengerOptionalService } from '../../services/messenger-optional-service.service';
import { AngularFireAuth } from '@angular/fire/auth';

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
    private faFirebase: AngularFireAuth,
    private dialogRef: MatDialogRef<MessageBoxComponent>,
    @Inject(MAT_DIALOG_DATA) data: CurrentChatMemberDialogData,
    ) {
    this.curentChatMember = data
  }


  ngOnInit() {
    emiteCloseMessageBox.pipe(takeUntil(this.destroyStream$)).subscribe(_ => this.dialogRef.close());
    
    this.messageInput = new FormControl('', Validators.required);

      this.faFirebase.auth.onAuthStateChanged((cUserId) => {

      if (cUserId) {   // ---security---
        this.currentUserId = cUserId.uid;

        //----Get Messages-----
        this.messengerService.getMeassages().pipe(takeUntil(this.destroyStream$))
        .subscribe(messages => {
            // console.log("TCL: ngOnInit -> messages", messages)
            // window.scrollTo(500, 0);
            this.allMessages[0] ? this.messengerOptService.sendMessageSound(NOTIFICATION_SOUND): null;
            this.allMessages = messages;
          });

        //----Decode Mesage Data-------
        this.messengerService.decodMessSenderUidInName(this.curentChatMember.userId, cUserId.uid)
          .then(decodedFields => this.decodeDataCurrentChatMebrs = decodedFields);

        //----isOnline-------
        this.messengerOptService.isOnline().pipe(takeUntil(this.destroyStream$))
        .subscribe(isOnlineChatMemberStatus => this.isOnlineChatMember = isOnlineChatMemberStatus)

        //----typing---------
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
 
  //----------------Metods--------------

  trackByMessages(unicIndex, data){
    return data ? data.key : undefined;
   }


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
  }


  ngOnDestroy() {

    this.destroyStream$.next();
    this.inputTypingState.unsubscribe()

    //----Message-Box Subscriptions------------
    this.messengerService.destroyStream$.next();
    this.messengerService.getMessagesDestroyStream$.next();
    this.messengerService.decoderFieldsdestroyStream$.next();
    this.messengerService.sendMessageStream$.next();
  }

}
