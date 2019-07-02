import { Injectable } from '@angular/core';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { FaService } from 'src/app/fa-module/services/fa.service';
import { Product } from '../../interfaces/product.interface';
import { Observable } from 'rxjs';
import { User, FirebaseTimestamp } from '../../interfaces/user.interface';
import { Review } from '../../interfaces/review.interface';
import { map, filter, pairwise } from 'rxjs/operators';
import Chart from 'chart.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {

  constructor(
    private db: DatabaseFireService,
    private fa: FaService,
    private router: Router,
  ) {}

  isAuthProfile(uid: string): Observable<boolean> {
    return this.fa.authState.pipe(map(response => response && response.uid === uid))
  }

  getUser(uid: string): Observable<User>{
    return this.db.getDocumentById<User>('users',uid);
  }

  getUserPosts(uid: string): Observable<Product[]>{
    return this.db.getCollectionWithIds<Product>('products')
    .pipe(
      map(products => products.filter(product => product.vendor === uid))
    )    
  }

  getUserReviews(uid: string): Observable<Review[]> {
    return this.db.getCollectionWithIds<User>('users')
      .pipe(
        map(users => {
          const targetUser: User = users.find(user => user.id === uid);
          const reviews = targetUser.reviews.sort((review_1,review_2) => {
            return review_1.date.seconds - review_2.date.seconds;
          });
          const reviewerIds: string[] = reviews.map(review => review.author as string);
          const reviewers: User[] = reviewerIds.map(id => users.find(user => user.id === id))
        
          return reviews.map((review,index) => Object.assign(review, {author: reviewers[index]}))
        })
      )
  }

  getLastActivity(products: Product[]): Product {
    
    const sortedByDate: Product[] = products.sort((product_1,product_2) => {
      return product_1.postDate - product_2.postDate;
    })

    return sortedByDate[sortedByDate.length - 1];
    
  }


  getUserRatingOverTime(reviews: Review[]): {dates: number[], ratings: number[]}{

    const data = {dates: [], ratings: []};

    const sortedReviews = reviews.sort((review_1,review_2) => {
      return review_1.date.seconds - review_2.date.seconds;
    })

    const years = sortedReviews.map(review => new Date(review.date.seconds * 1000).getFullYear());
    const yearsSet: string[] = [];
    years.forEach(year => {
      if(!yearsSet.includes(year.toString())){
        yearsSet.push(year.toString())
      }else{
        yearsSet.push('')
      }
    })

    const ratings = reviews.map(review => review.evaluation);
    const averageRatings: number[] = []

    ratings.forEach((_,index) => {
      averageRatings.push(ratings.slice(0,index + 1).reduce((sum,current) => sum + current,0) / (index + 1))
    })

    data.dates = yearsSet;
    data.ratings = averageRatings;

    return data
  }


  generateRatingGraph(_data: {dates: number[], ratings: number[]}, targetId: string, type: string): Chart {
    const chart = new Chart(targetId,{
      type: type,
      data: {
        labels: _data.dates,
        datasets: [{
          data: _data.ratings,
          borderColor: '#2196f3',
          fill: true,
        }]
      },
      options: {

        tooltips: {
          callbacks: {
            title: function(tooltipItem,data){
              let prevIndex = tooltipItem[0]['index'];
              let nextIndex = tooltipItem[0]['index'];
              const thisYear = new Date().getFullYear();
              while(!data['labels'][prevIndex]){
                prevIndex--;
              }

              while(!data['labels'][nextIndex] && nextIndex != thisYear){
                nextIndex++;
              }
              const prev = data['labels'][prevIndex];
              const next = data['labels'][nextIndex];

              return prev === next ? prev : next ? prev + ' - ' + next : prev + ' - now';

            },
            label: function(tooltipItem,data){
              const dataset = data['datasets'][0]['data'][tooltipItem['index']];
              const fixed = Number(dataset).toFixed(2).toString();
              const tmp = document.createElement('span');
              tmp.innerHTML = '&#9733;'
              return  tmp.innerHTML + fixed
            },
          }
        },


        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: true,
          }],
          yAxes: [{
            display: true,
              ticks: {
                  beginAtZero: true,
                  steps: 5,
                  stepValue: 1,
                  max: 5,
              }
          }]
        },
        maintainAspectRatio: false,
      }
    })

    return chart;
  }

  copyProfileLink(): void{
    // const url: string = 'http://localhost:4200' + this.router.url;
    // navigator.clipboard.writeText(url);
  }

  postReview(receiver: string, author: string, date: Date, description: string, evaluation: number): Promise<Review>{
    return new Promise((resolve,reject) => {
      let review = {author,date: date,description,evaluation} as unknown;
      const convertedReview = review as Review;
      this.db.pushData<Review>('users',receiver,'reviews',convertedReview)
      .then(reviews => {
        const ratingSum: number = reviews.reduce((sum,current) => sum += current.evaluation,0);
        const averageRating = Math.round(ratingSum / reviews.length);
        return this.db.updateData('users',receiver,{rating: averageRating})
      })
      .then(_ => resolve(convertedReview))
      .catch(_ => reject());
    })
    
  }

  removeReview(uid: string, review: Review): Promise<Review> {
    return new Promise((resolve,reject) => {
      this.db.getExtractedProperty<Review[]>('users',uid,['reviews']).pipe(
        map(reviews => {
          return reviews.filter(innerReview => {
            return (innerReview.date.seconds + innerReview.date.nanoseconds) !== (review.date.seconds + review.date.nanoseconds)
          })
        })
      ).subscribe(removed => {
        this.db.updateData('users',uid,{reviews: removed})
        .then(_ => resolve(review))
        .catch(_ => reject())
      })
    })  
  }


}
