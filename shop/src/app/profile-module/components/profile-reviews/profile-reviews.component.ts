import { Component } from '@angular/core';
import { Review } from 'src/app/interfaces/review.interface';
import { ProfileDataService } from '../../services/profile-data.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { OpenDialogService } from 'src/app/fa-module/services/open-dialog.service';
import { ReviewListAnimation } from '../../animations/review-animation';
import { pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-profile-reviews',
  templateUrl: './profile-reviews.component.html',
  styleUrls: ['./profile-reviews.component.scss','../profile-root/profile-root.component.scss'],
  animations: [ReviewListAnimation],
})
export class ProfileReviewsComponent {

  uid: string;
  isAuth: Observable<boolean>;

  reviews: Observable<Review[]>;
  profileOwner: Observable<User>;
  reviewText: string = '';
  rate: number = null;

  constructor(private pd: ProfileDataService, private dialog: OpenDialogService){}

  setUid(uid: string){
    this.uid = uid;
  }

  setIsAuth(arg: Observable<boolean>){
    this.isAuth = arg;
  }

  postReview(currentUser){
    this.pd.postReview(this.uid,currentUser.uid,new Date(),this.reviewText,this.rate)
    .catch(_ => this.dialog.openWarningMessage({
      message: ['Error occured while trying to post review.','Please try again later.'],
      after: null,
    }))
  }

  removeReview(review: Review): void{
    this.pd.removeReview(this.uid,review)
    .catch(_ => this.dialog.openWarningMessage({
      message: ['Error occured while trying to delete review.','Please try again later.'],
      after: null,
    }))
  }

  ngOnInit(){

    this.reviews = this.pd.getUserReviews(this.uid);
    this.profileOwner = this.pd.getUser(this.uid);
  }


}
