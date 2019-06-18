import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { SharedModule } from '../shared-module/shared.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    SharedModule,
  ],
})
export class ProfileModule { }
