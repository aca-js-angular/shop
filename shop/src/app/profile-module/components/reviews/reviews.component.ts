import { Component, OnInit, Input } from '@angular/core';
import { Review } from 'src/app/interfaces/review.interface';
import { DatabaseFireService } from 'src/app/database-fire.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {


  @Input() reviewList: Review[] = [];
  decodedReviews: Review[] = [];
  reviewBody: string = '';
  evaluation: number = null;

  


  constructor(private db: DatabaseFireService) { }

  ngOnChanges(){

    if(this.reviewList){

      const authors = this.reviewList.map(review => review.author) as string[];
      this.db.getDucumentsArray('users',authors).subscribe(res => {
        this.decodedReviews = this.reviewList.map((review,index) => Object.assign(review, {author: {...res[index], uid: authors[index]} }));
      });

    }


    
  }

  ngOnInit() {
    
  }


}
