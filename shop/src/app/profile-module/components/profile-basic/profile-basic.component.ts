import { Component, OnInit, Input } from '@angular/core';
import { User, FirebaseTimestamp } from 'src/app/interfaces/user.interface';
import { Product } from 'src/app/interfaces/product.interface';
import { Review } from 'src/app/interfaces/review.interface';
import { ProfileDataService } from '../../services/profile-data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, BehaviorSubject,zip } from 'rxjs';
import { map } from 'rxjs/operators';
// import { zip } from 'rxjs/operators';

@Component({
  selector: 'app-profile-basic',
  templateUrl: './profile-basic.component.html',
  styleUrls: ['./profile-basic.component.scss']
})
export class ProfileBasicComponent implements OnInit {

  constructor(private pd: ProfileDataService, private active: ActivatedRoute) { }

  uid: string;

  setUid(uid: string){
    this.uid = uid;
  }

  lastActivity(posts: Product[]): Product {
    return this.pd.getLastActivity(posts);
  }

  timestampToDate(arg: FirebaseTimestamp): Date {
    return new Date(arg.seconds * 1000);
  }

  milisecondsToDate(arg: number): Date {
    return new Date(arg);
  }

  profileData: any;

  ngOnInit() {

    const user = this.pd.getUser(this.uid);
    const posts = this.pd.getUserPosts(this.uid);
    const reviews = this.pd.getUserReviews(this.uid);
    const reviewers = this.pd.getReviewers(this.uid);

    this.profileData = zip(user,posts,reviews,reviewers).pipe(
      map(zipped => {
        return {
          user: zipped[0],
          posts: zipped[1],
          reviews: zipped[2],
          reviewers: zipped[3],
        }
      })
    );


  }

}
