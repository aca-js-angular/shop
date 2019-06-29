import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ProductSingleComment } from 'src/app/interfaces/product-comment.interface';
import { User } from 'src/app/interfaces/user.interface';
import { UDataType } from 'src/app/fa-module/services/additional.service';

@Component({
  selector: 'app-single-comment',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss'],
  inputs: ['singleComment','decodedFields','currentUser','senderUid','currentProductId']
})
export class SingleCommentComponent {

  @Output() likeComment = new EventEmitter<string>();
  @Output() deleteComment = new EventEmitter<string>();

  singleComment: ProductSingleComment;
  decodedFields: User;
  senderUid: string;
  currentUser: UDataType;
  currentProductId: string;
  liked: boolean;


  deleteSelectedComment(){
    this.deleteComment.emit(this.singleComment.commentId);
  }

  likeSelectedComment(){
    this.likeComment.emit(this.singleComment.commentId);
  }


}
