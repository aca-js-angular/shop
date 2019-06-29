import { Injectable } from '@angular/core';
import { ProductSingleComment } from 'src/app/interfaces/product-comment.interface';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { Observable, zip } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { singleCommentConstructor } from './comment.constructor';
import { UDataType } from 'src/app/fa-module/services/additional.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  
  constructor(
    private db: DatabaseFireService,
    private afireStore: AngularFirestore,
    ) { }


    /**
     * 
     * @param commentsArray 
     * @param commentId 
     * @param currentProdId 
     */
    public deleteComment(commentsArray: ProductSingleComment[],commentId: string, currentProdId: string): void{
      this.db.updateData('products',currentProdId, {comments: commentsArray.filter(comment => comment.commentId !== commentId)});
    }

   /**
    * 
    * @param commentsArray 
    * @param commentId 
    * @param currentProdId 
    * @param currentUser 
    */
    public toggleLikeComment(commentsArray: ProductSingleComment[],commentId: string, currentProdId: string ,currentUser: UDataType): void{
      const selectedCommentInd = commentsArray.findIndex(item => item.commentId === commentId);
      let toggle: boolean = commentsArray[selectedCommentInd].likes.includes(currentUser.uid);

      switch (toggle) {
        case true: commentsArray[selectedCommentInd].likes = commentsArray[selectedCommentInd].likes.filter(likeUids => 
            likeUids !== currentUser.uid);
             break;
        case false: commentsArray[selectedCommentInd].likes.push(currentUser.uid); 
        break;
      }
      this.db.updateData('products',currentProdId, {comments: commentsArray});
    }

    
    /**
     * 
     * @param commentsArray sort max - min
     */
    public sortBycLikesCount(commentsArray: ProductSingleComment[], sortCondition: string, initialArray: ProductSingleComment[]):ProductSingleComment[]{
      switch (sortCondition) {
        case 'max-min': return commentsArray.slice().sort((a,b) => b.likes.length - a.likes.length);
        case 'min-max': return commentsArray.slice().sort((a,b) => a.likes.length - b.likes.length);
        case 'new': return commentsArray.slice().sort((a,b) => b.date['seconds'] - a.date['seconds']);
        case 'old': return commentsArray.slice().sort((a,b) => a.date['seconds'] - b.date['seconds']);
        case 'disable': return initialArray.slice();
        
        default: console.warn(`sortBycLikesCount invalid argument 
          call ( commentsArray: ProductSingleComment[], sortCondition: 'min-max' - 'max-min' - 'disable' - 'old' - 'new')`)
          break;
      }
    }

    /**
     * 
     * @param content        // texteria value
     * @param currentUserUid // signIned user uid
     * @param commentsArray  // all comments
     * @param currentProdId  // activateRoute id
     */

  public addComment(content: string, currentUserUid: string, commentsArray: ProductSingleComment[], currentProdId: string, callback?: Function){
    const newSingleComment = singleCommentConstructor(content, currentUserUid, this.afireStore.createId()) as ProductSingleComment;
    commentsArray.push(newSingleComment);
    this.db.pushData('products',currentProdId,'comments', newSingleComment).then(_ => callback());
  }


  /**
   * 
   * @param comments 
   * return comments decoded fields
   */
  decodeCommentSenders(comments: ProductSingleComment[]): Observable<Map<string, User>> {
  
    return new Observable(observer => {

      const unicSenders = new Set<string>();
      const decodedFields = new Map<string, User>();
      const decodeSubscribables: Observable<User>[] = [];
      let setFromArray: string[];

      comments.length && comments.map(singleComment =>
        unicSenders.add(singleComment.sender));

        setFromArray = Array.from(unicSenders);

      unicSenders.forEach(unicUid =>
        decodeSubscribables.push(this.db.getDocumentById('users', unicUid)));

      const zipData = zip(...decodeSubscribables).pipe(
        map((decodedUData:User[]) => decodedUData.forEach((uData, ind) => {
          decodedFields.set(setFromArray[ind],uData)
        }))

      ).subscribe(_void => {
        zipData.unsubscribe(); /// ???
        observer.next(decodedFields)
      });
    })
  }
}
