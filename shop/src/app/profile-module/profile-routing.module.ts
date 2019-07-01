import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileRootComponent } from './components/profile-root/profile-root.component';
import { ProfileBasicComponent } from './components/profile-basic/profile-basic.component';
import { ProfilePostsComponent } from './components/profile-posts/profile-posts.component';
import { ProfileReviewsComponent } from './components/profile-reviews/profile-reviews.component';

const routes: Routes = [
  {path: '', component: ProfileRootComponent, children: [
    {path: '', redirectTo: 'basic', pathMatch: 'full'},
    {path: 'basic', component: ProfileBasicComponent},
    {path: 'posts', component: ProfilePostsComponent},
    {path: 'reviews', component: ProfileReviewsComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
