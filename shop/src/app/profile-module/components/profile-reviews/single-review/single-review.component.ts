import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Review } from 'src/app/interfaces/review.interface';
import { FaService } from 'src/app/fa-module/services/fa.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../../interfaces/user.interface';

@Component({
  selector: 'app-single-review',
  templateUrl: './single-review.component.html',
  styleUrls: ['./single-review.component.scss']
})
export class SingleReviewComponent implements OnInit {

  @Input() review: Review;
  @Output() remove = new EventEmitter<Review>();
  reviewDate: Date;
  ratingClasses: object;

  isMyReview: Observable<boolean>;

  constructor(private fa: FaService){}

  ngOnInit() {
    this.isMyReview = this.fa.authState.pipe(map(user => {
      if(!user)return false;
      else{
        const author = this.review.author as User
        return user.uid === author.id;
      }
    }))
    this.reviewDate = new Date(this.review.date.seconds * 1000);
    this.ratingClasses = {
      'high-rating' : this.review.evaluation >= 4,
      'mid-rating': this.review.evaluation >=2 && this.review.evaluation < 4,
      'low-rating': this.review.evaluation === 1, 
    }
  }

}
