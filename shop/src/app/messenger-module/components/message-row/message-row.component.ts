import { Component, EventEmitter, Output } from '@angular/core';
import { MessageData } from '../../messenger-interface';

@Component({
  selector: 'app-message-row',
  templateUrl: './message-row.component.html',
  styleUrls: ['./message-row.component.scss'],
  inputs: ['messageRowObj', 'decodeDataChatMember', 'firstMessage', 'currentUserMessage', 'messageRowKey']
})
export class MessageRowComponent {

  @Output('deleteMessage') deleteMessage = new EventEmitter<string>()

  messageRowObj: MessageData;
  decodeDataChatMember: object;
  firstMessage: boolean;
  currentUserMessage: boolean;
  messageRowKey: string;
  href = {
    hrefLink: [],
    textStart: '',
    textEnd: '',
  }


  ngOnInit(): void {

    // href --  has bug
    if (!(this.messageRowObj.message.includes('http://') || this.messageRowObj.message.includes('https://'))) return;

    this.messageRowObj.message.split(' ').forEach((item, ind, array) => {

      if (!(item.startsWith('http://') || item.startsWith('https://'))) return;

      this.href.textStart = array.slice(0, ind).join(" ");
      this.href.hrefLink.push(item + ' ');

      array.splice(ind, 1)
      this.href.textEnd = array.slice(ind).join(" ");
    });
  }


}
