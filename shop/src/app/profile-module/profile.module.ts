import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { SharedModule } from '../shared-module/shared.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { PostedProductsComponent } from './components/posted-products/posted-products.component';
import { ProductsModule } from '../products-module/products.module';
import { SingleReviewComponent } from './components/reviews/single-review/single-review.component';
import { ProfileRootComponent } from './components/profile-root/profile-root.component';
import { RatingScaleComponent } from './components/reviews/rating-scale/rating-scale.component';
import { PostProductComponent } from './components/post-product/post-product.component';

@NgModule({
  declarations: [ProfilePageComponent, ReviewsComponent, PersonalInfoComponent, PostedProductsComponent, SingleReviewComponent, ProfileRootComponent, RatingScaleComponent, PostProductComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    ProductsModule,
    SharedModule,
  ],
})
export class ProfileModule { }
