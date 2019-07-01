import { Component, OnInit, Input } from '@angular/core';
import { Review } from 'src/app/interfaces/review.interface';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { User } from '../../../../interfaces/user.interface';

@Component({
  selector: 'app-single-review',
  templateUrl: './single-review.component.html',
  styleUrls: ['./single-review.component.scss']
})
export class SingleReviewComponent implements OnInit {

  @Input() singleReview: Review;
  reviewDate: Date;
  ratingClasses: object;

  ngOnInit() {
    this.reviewDate = new Date(this.singleReview.date.seconds * 1000);
    this.ratingClasses = {
      'high-rating' : this.singleReview.evaluation >= 4,
      'mid-rating': this.singleReview.evaluation >=2 && this.singleReview.evaluation < 4,
      'low-rating': this.singleReview.evaluation === 1, 
    }
  }

}
