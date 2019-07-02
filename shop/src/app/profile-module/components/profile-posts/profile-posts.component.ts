import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/interfaces/product.interface';
import { Observable, of } from 'rxjs';
import { ProfileDataService } from '../../services/profile-data.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.scss','../profile-root/profile-root.component.scss']
})
export class ProfilePostsComponent implements OnInit {

  uid: string;
  isAuth: Observable<boolean>;

  postedProducts: Observable<Product[]>;
  fakePosts: Observable<Product[]>;
  selectedBrand: number = -1;

  constructor(private pd: ProfileDataService){}

  setUid(uid: string){
    this.uid = uid;
  }

  setIsAuth(arg: Observable<boolean>){
    this.isAuth = arg;
  }

  getBrands(products: Product[]): Set<string>{
    return new Set(products.map(p => p.brand))
  }

  filterBrand(posts: Product[],brand: string): void {
    this.fakePosts = of(posts.filter(p => p.brand === brand));
  }

  resetFilter(posts: Product[]): void{
    this.fakePosts = of(posts);
  }

  ngOnInit() {
    this.postedProducts = this.pd.getUserPosts(this.uid);
    this.fakePosts = this.pd.getUserPosts(this.uid);    
  }

}
