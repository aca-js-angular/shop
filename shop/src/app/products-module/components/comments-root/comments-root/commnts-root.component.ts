import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductSingleComment, ProductFieldsSubjectNextType } from 'src/app/interfaces/product-comment.interface';
import { Subject, Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { FormControl } from '@angular/forms';
import { CommentService } from '../commenet-service/comment.service';
import { AdditionalService, UDataType } from 'src/app/fa-module/services/additional.service';
import { takeUntil } from 'rxjs/operators';
import { maxLenghtLimitValidator } from '../validators/comment.validator';
import { OpenDialogService } from 'src/app/fa-module/services/open-dialog.service';
import { deleteComment, editComment } from 'src/app/constants/popup-messages.constant';

const BTN_POST = 'Post Comment';
const BTN_EDIT = 'Edit';
const COMMENT_MAX_LENGTH = 300;


@Component({
  selector: 'app-comments-root',
  templateUrl: './commnts-root.component.html',
  styleUrls: ['./commnts-root.component.scss'],
  inputs: ['productFields$']
})
export class CommentsRootComponent implements OnInit, OnDestroy {

  destroyStream$ = new Subject<void>();
  decodedZip: Map<string, User>;
  commentTexteria: FormControl;
  currentUser: UDataType;
  productFields$: Observable<any>
  productFields: ProductFieldsSubjectNextType;
  dinamicCommentsArray: ProductSingleComment[];
  selectFilerValue: FormControl;
  selectOptions: object[];
  submitButtonText: string;
  submitButtonCallack: Function;
  isEditing: boolean;
  showEmojiPanel: boolean;
  sortingArrowType: boolean;
  commentMaxLength: number;
  selectedCommentEditingInd: number;

  constructor(
    private commentServise: CommentService,
    private additionalAuth: AdditionalService,
    private dialog: OpenDialogService,
  ) { }

  /*---Getters---*/
  get $currentUser() {
    return this.additionalAuth.$autoState;
  }

  
  /*---Metods---*/
  trackByComment(index: number, singleComment: ProductSingleComment) {
    return singleComment.commentId;
    // console.log(singleComment)
  }
  
  confirm(collback: Function, alertMessage: Function, ...arg: any) {
    this.dialog.openConfirmMessage({
      message: alertMessage(),
      accept: () => collback.call(this, ...arg),
    })
  }
  
  setEmoji(emoji: string) {
    this.commentTexteria.patchValue(`${this.commentTexteria.value} ${emoji}`);
  }

  /* ------Edit Comment Metods----- */
  cancelCommentEditing() {
    this.selectedCommentEditingInd = -1;
    this.submitButtonCallack = this.postComment;
    this.isEditing = false;
    this.commentTexteria.setValue('');
    this.submitButtonText = BTN_POST;
  }


  showEditingCommentFields({ commentId, content },index: number) {
    this.selectedCommentEditingInd = index;

    this.submitButtonCallack = () =>
      this.confirm(this.editSelectedComment.bind(this, commentId), editComment);

    this.isEditing = true;
    this.commentTexteria.setValue(content);
    this.submitButtonText = BTN_EDIT;
  }

  editSelectedComment(commentId: string) {
    if (!this.commentTexteria.value.length) {
      this.cancelCommentEditing();
      this.deleteComment(commentId);
      this.selectedCommentEditingInd = -1;
      return
    }

    if (this.commentTexteria.value.length < COMMENT_MAX_LENGTH) { // set max comment length ????
      this.commentServise.editSelectedComment(
        this.productFields.currentProductComments,
        commentId,
        this.productFields.currentProductRouteId,
        this.commentTexteria.value,
      )
      this.cancelCommentEditing();
    }
  }

  // ----------------------



  deleteComment(commentId: string) {
    
    this.confirm(callack,deleteComment)

    function callack() {
      this.commentServise.deleteComment(
        this.productFields.currentProductComments,
        commentId,
        this.productFields.currentProductRouteId,
      )
    }
  }


  toggleLikeComment(commentId: string) {
    this.commentServise.toggleLikeComment(
      this.productFields.currentProductComments,
      commentId,
      this.productFields.currentProductRouteId,
      this.currentUser
    )
  }


  postComment() {

    if (this.commentTexteria.value.length && this.commentTexteria.value.length < COMMENT_MAX_LENGTH) { // set max comment length ????
      this.commentServise.postComment(
        this.commentTexteria.value,
        this.currentUser.uid,
        this.productFields.currentProductComments,
        this.productFields.currentProductRouteId,
      );
      this.commentTexteria.setValue('');
    }
  }

  sort() {

    this.dinamicCommentsArray = this.commentServise.sortBycLikesCount(
      this.productFields.currentProductComments,
      this.selectFilerValue.value,
      this.sortingArrowType,
      this.productFields.currentProductComments
    )
  }


  /*---LC Hooks---*/
  ngOnInit() {
    this.selectOptions = [
      { value: 'likes', title: 'By likes' },
      { value: 'date', title: 'By date' },
    ];

    this.submitButtonText = BTN_POST;
    this.submitButtonCallack = this.postComment
    this.commentTexteria = new FormControl('', maxLenghtLimitValidator(COMMENT_MAX_LENGTH));
    this.selectFilerValue = new FormControl('date');
    this.showEmojiPanel = true;
    this.sortingArrowType = false;
    this.commentMaxLength = COMMENT_MAX_LENGTH;

    this.productFields$.pipe(takeUntil(this.destroyStream$)).subscribe(next => {
      this.productFields = next;
      this.dinamicCommentsArray = this.productFields.currentProductComments.slice();

      this.selectFilerValue.value !== 'date' && !this.sortingArrowType && this.sort();

      this.commentServise.decodeCommentSenders(this.productFields.currentProductComments)
        .pipe(takeUntil(this.destroyStream$)).subscribe(decodedZip => this.decodedZip = decodedZip);
    })

    this.$currentUser.pipe(takeUntil(this.destroyStream$)).subscribe(udata => this.currentUser = udata);

  }

  ngOnDestroy() {
    this.destroyStream$.next()
  }
}
