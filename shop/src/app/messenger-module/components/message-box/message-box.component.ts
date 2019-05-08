import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MessengerService } from '../../services/messenger.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CurrentUserCloud } from '../../user-interface';
import { FormControl, Validators } from '@angular/forms';
import { AdditionalService } from 'src/app/fa-module/Services/additional.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit, OnDestroy {

  curentChatMember: CurrentUserCloud;
  messageTexteria: FormControl;
  currentUserId: string;
  allMessages: object[] = []// Subscribable<object[] | null>;
  decodeNamesCurrentChatMebrs: object

  destroyStream$ = new Subject<void>()

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
        this.messagesService.getMeassages(this.curentChatMember.userId, this.currentUserId)
        .pipe(takeUntil(this.destroyStream$)).subscribe(allMessages => {
            this.allMessages = allMessages;
          });

        //------Decode Mesage Data-------
        this.messagesService.decodMessSenderUidInName(this.curentChatMember.userId, cUserId.uid).then(decodedFields =>
          this.decodeNamesCurrentChatMebrs = decodedFields);
      }
    });
  }

  sendMessage() {
    this.messagesService.sendMessage(this.curentChatMember.userId, this.currentUserId, this.messageTexteria.value)
    this.messageTexteria.patchValue('')
  }

  closeMessageBox() {
    this.messagesService.closeMessageBox()
  }
  ngOnDestroy() {
    this.destroyStream$.next()
  }
}
