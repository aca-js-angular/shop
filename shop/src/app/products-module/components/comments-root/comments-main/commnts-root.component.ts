import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductSingleComment } from 'src/app/interfaces/product-comment.interface';
import { Subject, Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { FormControl } from '@angular/forms';
import { CommentService } from '../commenet-service/comment.service';
import { AdditionalService, UDataType } from 'src/app/fa-module/services/additional.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-comments-root',
  templateUrl: './commnts-root.component.html',
  styleUrls: ['./commnts-root.component.scss'],
  inputs: ['$productFields']
})
export class CommentsRootComponent implements OnInit, OnDestroy {

  $destroyStream = new Subject<void>();
  decodedZip: Map<string, User>;
  commentTexteria: FormControl;
  currentUser: UDataType;
  $productFields: Observable<any>;
  productFields: { currentProductRouteId: string, currentProductComments: ProductSingleComment[] };
  dinamicCommentsArray: ProductSingleComment[];
  selectFilerValue: FormControl;
  selectOptions: object[];

  constructor(
    private commentServise: CommentService,
    private additionalAuth: AdditionalService,

  ) { }

  /*---Getters---*/
  get $currentUser() {
    return this.additionalAuth.$autoState;
  }


  /*---Metods---*/
  trackByComment(index: number, singleComment: ProductSingleComment){
    return singleComment.commentId;
    // console.log(singleComment)
    
  }

  deleteComment(commentId: string){
    this.commentServise.deleteComment(
      this.productFields.currentProductComments,
      commentId,
      this.productFields.currentProductRouteId,
    )
  }


  toggleLikeComment(commentId: string) {
    this.commentServise.toggleLikeComment(
      this.productFields.currentProductComments,
      commentId,
      this.productFields.currentProductRouteId,
      this.currentUser
    )
  }

  f = () => {
    document.querySelector('.comments-box').scrollTo({
      top: 10000, 
      left: 0,
      behavior: 'smooth',
    })
  }

  addComment() {
    
    this.commentTexteria.value.length >= 0 && // set min comment length ????
      this.commentServise.addComment(
        this.commentTexteria.value,
        this.currentUser.uid,
        this.productFields.currentProductComments,
        this.productFields.currentProductRouteId,
        this.f,
        )
        
    this.commentTexteria.setValue('');
  }

  sortByLikes() {
    if(!this.currentUser) return;
    this.dinamicCommentsArray = this.commentServise.sortBycLikesCount(
      this.productFields.currentProductComments,
      this.selectFilerValue.value,
      this.productFields.currentProductComments
    )
  }


  /*---LC Hooks---*/
  ngOnInit() {
    this.selectOptions = [
      { value: 'max-min', title: 'From Max Likes' },
      { value: 'min-max', title: 'From Min Likes' },
      { value: 'new', title: 'News' },
      { value: 'old', title: 'olds' }
    ];

    this.commentTexteria = new FormControl('');
    this.selectFilerValue = new FormControl('new');

    this.$productFields.pipe(takeUntil(this.$destroyStream)).subscribe(next => {
      this.productFields = next;
      this.dinamicCommentsArray = this.productFields.currentProductComments.slice();
      this.selectFilerValue.value !== 'disable' && this.sortByLikes();
      this.commentServise.decodeCommentSenders(this.productFields.currentProductComments)
        .pipe(takeUntil(this.$destroyStream)).subscribe(decodedZip => this.decodedZip = decodedZip);
    })

    this.$currentUser.pipe(takeUntil(this.$destroyStream)).subscribe(udata => this.currentUser = udata);

  }

  ngOnDestroy() {
    this.$destroyStream.next()
  }
}
