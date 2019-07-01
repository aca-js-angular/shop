import { Injectable } from '@angular/core';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { FaService } from 'src/app/fa-module/services/fa.service';
import { Product } from '../../interfaces/product.interface';
import { Observable } from 'rxjs';
import { User, FirebaseTimestamp } from '../../interfaces/user.interface';
import { Review } from '../../interfaces/review.interface';
import { map, filter } from 'rxjs/operators';
import Chart from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {

  constructor(
    private db: DatabaseFireService,
    private fa: FaService,
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
    // return this.db.dynamicQueryFilter<Product>('products',{vendor: uid})
    
  }

  getUserReviews(uid: string): Observable<Review[]>{
    return this.db.getDocumentById<User>('users',uid).pipe(
      map(user => user.reviews)
    )
  }

  getLastActivity(products: Product[]): Product {
    
    const sortedByDate: Product[] = products.sort((product_1,product_2) => {
      return product_1.postDate - product_2.postDate;
    })

    return sortedByDate[sortedByDate.length - 1];
    
  }

  getReviewers(uid: string): Observable<User[]>{
      return this.db.getCollectionWithIds<User>('users')
      .pipe(
        map(users => {
          const targetUser: User = users.find(user => user.id === uid);
          const reviewerIds: string[] = targetUser.reviews.map(review => review.author as string);
          const reviewers: User[] = users.filter(user => reviewerIds.includes(user.id));
          return reviewers;
        })
      )
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


  generateRatingGraph(_data: {dates: number[], ratings: number[]}, targetId: string): Chart {
    const chart = new Chart(targetId,{
      type: 'line',
      data: {
        labels: _data.dates,
        datasets: [{
          data: _data.ratings,
          borderColor: '#3cba9f',
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
            label: function(){},
            afterLabel: function(tooltipItem,data){
              const dataset = data['datasets'][0]['data'][tooltipItem['index']];
              const fixed = Number(dataset).toFixed(2).toString();
              const tmp = document.createElement('span');
              tmp.innerHTML = '&#9733;'
              return  tmp.innerHTML + fixed
            }
          }
        },


        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        },
        maintainAspectRatio: false,
      }
    })

    return chart;
  }


}
