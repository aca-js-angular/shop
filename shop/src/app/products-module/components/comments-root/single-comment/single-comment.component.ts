import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ProductSingleComment } from 'src/app/interfaces/product-comment.interface';
import { User } from 'src/app/interfaces/user.interface';
import { UDataType } from 'src/app/fa-module/services/additional.service';

@Component({
  selector: 'app-single-comment',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss'],
  inputs: ['singleComment','decodedFields','currentUser','currentProductId', 'senderUid']
})
export class SingleCommentComponent {

  @Output() likeComment = new EventEmitter<string>();
  @Output() deleteComment = new EventEmitter<string>();
  @Output() editComment = new EventEmitter<{commentId:string,content: string}>();

  singleComment: ProductSingleComment;
  decodedFields: User;
  currentUser: UDataType;
  currentProductId: string;
  liked: boolean;
  senderUid: string;

  deleteSelectedComment(){
    this.deleteComment.emit(this.singleComment.commentId);
  }

  likeSelectedComment(){
    this.likeComment.emit(this.singleComment.commentId);
  }

  editSelectedComment(){
    this.editComment.emit({
      commentId:this.singleComment.commentId,
      content: this.singleComment.content
    });
  }


}
