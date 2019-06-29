import { Injectable } from '@angular/core';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { FaService } from 'src/app/fa-module/services/fa.service';
import { Product } from 'src/app/interfaces/product.interface';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { Review } from 'src/app/interfaces/review.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {

  constructor(
    private db: DatabaseFireService,
    private fa: FaService,
  ) {}

  isAuthProfile(uid: string): boolean {
    return this.fa.currentUser && this.fa.currentUser.uid === uid;
  }

  getUser(uid: string): Observable<User>{
    return this.db.getDocumentById<User>('users',uid);
  }

  getUsersPostedProducts(uid: string): Promise<Product[]>{
    return this.db.dynamicQueryFilter<Product>('products',{vendor: uid})
  }

  getUserReviews(uid: string): Observable<Review[]>{
    return this.db.getDocumentById<User>('users',uid).pipe(
      map(user => user.reviews)
    )
  }

}
