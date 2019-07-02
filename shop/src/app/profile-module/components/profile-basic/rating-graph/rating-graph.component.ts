import { Component, OnInit, Input } from '@angular/core';
import { Review } from 'src/app/interfaces/review.interface';
import { ProfileDataService } from 'src/app/profile-module/services/profile-data.service';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-rating-graph',
  templateUrl: './rating-graph.component.html',
  styleUrls: ['./rating-graph.component.scss','../profile-basic.component.scss']
})
export class RatingGraphComponent implements OnInit {

  @Input() reviews: Review[];
  reviewers: User[] = [];
  graphType = 'line';

  graphContent: unknown;

  get tooltipContent(): string{
    if(!this.reviews.length)return null;
    let members = this.reviews.map(review => review.author as User)
    .map(reviewer => reviewer.firstName + ' ' + reviewer.lastName)
    .slice(5)

    if(members.length > 10){
      members = members.slice(0,10)
      members[members.length - 1] += ' ...'
    }
    
    return members.join('\n')
  }

  


  constructor(private pd: ProfileDataService) { }

  refreshGraph(){
    this.graphContent = this.pd.generateRatingGraph(this.pd.getUserRatingOverTime(this.reviews),'graph-id',this.graphType)
  }

  ngOnInit() {
    this.reviewers = this.reviews.map(review => review.author as User);
    this.graphContent = this.pd.generateRatingGraph(this.pd.getUserRatingOverTime(this.reviews),'graph-id',this.graphType)
  }

}
