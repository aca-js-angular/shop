import { Component } from '@angular/core';
import { Review } from 'src/app/interfaces/review.interface';

@Component({
  selector: 'app-profile-reviews',
  templateUrl: './profile-reviews.component.html',
  styleUrls: ['./profile-reviews.component.scss']
})
export class ProfileReviewsComponent {

  uid: string;

  setUid(uid: string){
    this.uid = uid;
  }


}
