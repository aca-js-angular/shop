import { Component, OnInit, Input } from '@angular/core';
import { User, FirebaseTimestamp } from 'src/app/interfaces/user.interface';
import { Product } from 'src/app/interfaces/product.interface';
import { Review } from 'src/app/interfaces/review.interface';
import { ProfileDataService } from '../../services/profile-data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, BehaviorSubject,zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { COUNTRY_CODES_MAP } from '../../../constants/country-codes.constant';

@Component({
  selector: 'app-profile-basic',
  templateUrl: './profile-basic.component.html',
  styleUrls: ['./profile-basic.component.scss','../profile-root/profile-root.component.scss']
})
export class ProfileBasicComponent implements OnInit {

  constructor(private pd: ProfileDataService, private active: ActivatedRoute) { }

  uid: string;
  isAuth: Observable<boolean>;

  getCountryCode(name: string): string {
    const target = COUNTRY_CODES_MAP.find(item => item.country.toLowerCase() === name.toLowerCase());
    return target ? target.abbreviation : null;
  }

  setUid(uid: string){
    this.uid = uid;
  }

  setIsAuth(arg: Observable<boolean>){
    this.isAuth = arg;
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

  toClipboard(){
    this.pd.copyProfileLink()
  }

  profileData: any;

  ngOnInit() {

    const user = this.pd.getUser(this.uid);
    const posts = this.pd.getUserPosts(this.uid);
    const reviews = this.pd.getUserReviews(this.uid);

    this.profileData = zip(user,posts,reviews).pipe(
      map(zipped => {
        return {
          user: zipped[0],
          posts: zipped[1],
          reviews: zipped[2],
        }
      })
    );


  }

}
