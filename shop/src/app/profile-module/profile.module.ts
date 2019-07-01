import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared.module';
import { ProductsModule } from '../products-module/products.module';
import { ProfileRoutingModule } from './profile-routing.module';

import { ProfileRootComponent } from './components/profile-root/profile-root.component';
import { ProfileBasicComponent } from './components/profile-basic/profile-basic.component';
import { ProfilePostsComponent } from './components/profile-posts/profile-posts.component';
import { ProfileReviewsComponent } from './components/profile-reviews/profile-reviews.component';
import { SingleReviewComponent } from './components/profile-reviews/single-review/single-review.component';
import { PostProductComponent } from './components/post-product/post-product.component';
import { RatingScaleComponent } from './components/profile-reviews/rating-scale/rating-scale.component';
import { LastActivityComponent } from './components/profile-basic/last-activity/last-activity.component';
import { RatingGraphComponent } from './components/profile-basic/rating-graph/rating-graph.component';
import { MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';


@NgModule({
  declarations: [
    ProfileRootComponent,
    ProfileBasicComponent,
    ProfilePostsComponent,
    ProfileReviewsComponent,
    SingleReviewComponent,
    PostProductComponent,
    RatingScaleComponent,
    LastActivityComponent,
    RatingGraphComponent,
  ],

  imports: [
    CommonModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ProductsModule,
    ProfileRoutingModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
})

export class ProfileModule {}