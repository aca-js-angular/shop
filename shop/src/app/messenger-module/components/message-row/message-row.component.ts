import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-row',
  templateUrl: './message-row.component.html',
  styleUrls: ['./message-row.component.scss'],
  inputs: ['messageRowObj','decodeDataChatMebrs','firstMessage']
})
export class MessageRowComponent {


  messageRowObj: object;
  decodeDataChatMebrs: object;
  firstMessage: boolean;

  
  ngOnInit() {
  }

}
