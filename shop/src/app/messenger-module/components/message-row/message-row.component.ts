import { Component, EventEmitter, Output } from '@angular/core';
import { MessageData } from '../../messenger-interface';

@Component({
  selector: 'app-message-row',
  templateUrl: './message-row.component.html',
  styleUrls: ['./message-row.component.scss'],
  inputs: ['messageRowObj','decodeDataChatMember','firstMessage','currentUserMessage','messageRowKey']
})
export class MessageRowComponent {
  
  @Output('deleteMessage') deleteMessage = new EventEmitter<string>()

  messageRowObj: object;
  decodeDataChatMember: object;
  firstMessage: boolean;
  currentUserMessage: boolean;
  messages: MessageData;
  messageRowKey: string;


}
