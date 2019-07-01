import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss'],
  inputs: ['animate']
})
export class EmojiComponent implements OnInit {

  @Output('setEmoji') setEmoji = new EventEmitter<string>();
  animate: boolean;
  emojis: string[];


  selectEmoji(index: number){
    this.setEmoji.emit(this.emojis[index]);
  }

  ngOnInit() {
    this.emojis = [
       '😃', '😊', '😂', '😉', '😄', '🤣', '😏',
       '😇', '😜', '😬', '😛', '😁', '😭', '😐',
       '😍', '😘', '😚', '😙', '😗', '🔥', '😋',
       '🤪', '😝', '😵', '😠', '😡', '🤬', '😈', '👿', 
       '👍', '👎', '🤝', '👊', '✊', '👋', '💪', '☝', '💩'
      //  '😌', '💗', '💋', '😗', '😜','🙃', '😓',
      //  '😱', '😰', '🤮', '🤢', '🤧', '😴', '😪', 
      //  '🤑', '🤓', '🤠', '🤠', '🤗', '🤡', '😏',
      //  '😒', '🙄', '🤨', '🤔', '🤫', '🤭', '😳',
      //  '🤯', '😷', '🤒', '🤕','😞', '😔', '😣',
      //  '🙅‍', '️🙅‍',
      //  '😻', '😼', '😽', '🙀', '😿', '😾',
      //  '🐍', '🐢', '👓', '🕶'
      ]
  }

}



