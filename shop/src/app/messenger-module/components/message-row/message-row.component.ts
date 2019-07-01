import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-message-row',
  templateUrl: './message-row.component.html',
  styleUrls: ['./message-row.component.scss'],
  inputs: ['messageRowObj','decodeDataChatMember','firstMessage','currentUserMessage']
})
export class MessageRowComponent {
  @Output('deleteMessage') deleteMessage = new EventEmitter<string>()

  messageRowObj: object;
  decodeDataChatMember: object;
  firstMessage: boolean;
  currentUserMessage: boolean

  
  ngOnInit() {
  }

}
