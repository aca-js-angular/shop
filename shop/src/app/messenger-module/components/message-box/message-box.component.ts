import { Component, OnInit, Inject, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MessengerService } from '../../services/messenger.service';
import { MAT_DIALOG_DATA, DialogRole, MatDialog, MatDialogRef } from '@angular/material';
import { CurrentUserCloud } from '../../user-interface';
import { FormControl, Validators } from '@angular/forms';
import { AdditionalService } from 'src/app/fa-module/Services/additional.service';
import { takeUntil, switchMap, debounceTime } from 'rxjs/operators';
import { Subject, fromEvent, Subscription } from 'rxjs';

const NOTIFICATION_SOUND: string = 'assets/messengerAudio/message2.mp3';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('messageInputRef') messageInputRef: ElementRef;

  curentChatMember: CurrentUserCloud;
  messageInput: FormControl;
  currentUserId: string;
  allMessages: object[] = [];// Subscribable<object[] | null>;
  decodeNamesCurrentChatMebrs: object;
  isTypingChatMember: boolean;
  destroyStream$ = new Subject<void>()
  inputTypingState: Subscription;

  constructor(
    private messagesService: MessengerService,
    private autoAdditional: AdditionalService,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.curentChatMember = data
  }


  ngOnInit() {
    
    this.messageInput = new FormControl('', Validators.required);
    this.autoAdditional.autoState().then(cUserId => {

      if (cUserId) {   // ---security---
        this.currentUserId = cUserId.uid;

        //----Get Messages-----
        this.messagesService.getMeassages()
          .pipe(takeUntil(this.destroyStream$)).subscribe(messages => {
            // window.scrollTo(500, 0);
            this.allMessages[0] ? this.messagesService.sendMessageSound(NOTIFICATION_SOUND): null
            this.allMessages = messages;
          });

        //------Decode Mesage Data-------
        this.messagesService.decodMessSenderUidInName(this.curentChatMember.userId, cUserId.uid).then(decodedFields =>
          this.decodeNamesCurrentChatMebrs = decodedFields);

        //-----------typing---------
        this.messagesService.isTypingChatMember();
        this.messagesService.isTypingChatMember$.pipe(takeUntil(this.destroyStream$))
          .subscribe(uid => { this.isTypingChatMember = uid === this.curentChatMember.userId ? true : false})

      } else { this.messagesService.closeMessageBox() } // <<<<<<<<<<<<<<<<<??????????
    });
  }


  

  ngAfterViewInit() {
    
    this.inputTypingState = fromEvent(this.messageInputRef.nativeElement, 'input').pipe(
       debounceTime(300),
 
       switchMap(_ => this.messagesService.changerTypingState(this.currentUserId)),
       debounceTime(1000),
 
       switchMap(_ => this.messagesService.changerTypingState('false'))
     ).subscribe()
   }
 

   trackByMessages(unicIndex,data){
    return data ? data.key : undefined
   }
  //----------------Metods--------------

  removeMessage(key: string) {
    this.messagesService.removeMessage(key).catch()
  }

  sendMessage() {

    if(!this.messageInput.value) return;
    this.messagesService.sendMessageSound(NOTIFICATION_SOUND);
    this.messagesService.sendMessage(this.currentUserId, this.messageInput.value);
    this.messageInput.patchValue('');
  }

  
  closeMessageBox() {
    this.messagesService.closeMessageBox();
    this.dialogRef.close('ok')
  }


  ngOnDestroy() {

    this.destroyStream$.next();
    this.inputTypingState.unsubscribe()

    //----Message-Box Subscriptions------------
    this.messagesService.destroyStream$.next();
    this.messagesService.getMessagesDestroyStream$.next()
    this.messagesService.decoderFieldsdestroyStream$.next()
    this.messagesService.sendMessageStream$.next()
    this.messagesService.getMessages$.next()
  }

}
