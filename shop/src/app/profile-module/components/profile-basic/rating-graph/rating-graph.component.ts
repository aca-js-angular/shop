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
  @Input() reviewers: User[];

  graphContent: unknown;

  get tooltipContent(): string{

    let members = this.reviewers
    .map(reviewer => reviewer.firstName + ' ' + reviewer.lastName)
    .slice(5)

    if(members.length > 10){
      members = members.slice(0,10)
      members.push('...')
    }
    
    return members.join('\n')
  }

  fakeScroll(){
    window.scrollBy(0,1);
    window.scrollBy(0,-1)
  }

  constructor(private pd: ProfileDataService) { }

  ngOnInit() {
    this.graphContent = this.pd.generateRatingGraph(this.pd.getUserRatingOverTime(this.reviews),'graph-id')
  }

}
