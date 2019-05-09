import { Component, OnInit, Inject, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MessengerService } from '../../services/messenger.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CurrentUserCloud } from '../../user-interface';
import { FormControl, Validators } from '@angular/forms';
import { AdditionalService } from 'src/app/fa-module/Services/additional.service';
import { takeUntil, switchMap, debounceTime, map } from 'rxjs/operators';
import { Subject, fromEvent, Subscription, pipe } from 'rxjs';


@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('messageInput') messageInput: ElementRef

  curentChatMember: CurrentUserCloud;
  messageTexteria: FormControl;
  currentUserId: string;
  allMessages: object[] = [];// Subscribable<object[] | null>;
  decodeNamesCurrentChatMebrs: object;
  isTypingChatMember: boolean;
  destroyStream$ = new Subject<void>()
  inputTypingState: Subscription;

  constructor(
    private messagesService: MessengerService,
    private autoAdditional: AdditionalService,

    @Inject(MAT_DIALOG_DATA) data) {
    this.curentChatMember = data
  }


  ngOnInit() {
    
    this.messageTexteria = new FormControl('', Validators.required);
    this.autoAdditional.autoState().then(cUserId => {

      if (cUserId) {   // ---security---
        this.currentUserId = cUserId.uid;

        //----Get Messages-----
        this.messagesService.getMeassages()
          .pipe(takeUntil(this.destroyStream$)).subscribe(allMessages => {
            // window.scrollTo(500, 0);
            this.allMessages = allMessages;
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
    
    this.inputTypingState = fromEvent(this.messageInput.nativeElement, 'input').pipe(
       debounceTime(200),
 
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
    this.sendMessageSound()
    this.messagesService.sendMessage(this.currentUserId, this.messageTexteria.value)
    this.messageTexteria.patchValue('')
  }

   sendMessageSound() {
    var audio = new Audio();
    audio.src = '../../../../assets/messengerAudio/message2.mp3';
    audio.autoplay = true; 
  }

  closeMessageBox() {
    this.messagesService.closeMessageBox()
  }
  ngOnDestroy() {

    this.destroyStream$.next();
    this.inputTypingState.unsubscribe()

    //----Message-Box Subscriptions------------
    this.messagesService.destroyStream$.next();
    this.messagesService.getMessagesDestroyStream$.next()
    this.messagesService.decoderFieldsdestroyStream$.next()
    this.messagesService.sendMessage$.next()
    this.messagesService.getMessages$.next()
  }

}
