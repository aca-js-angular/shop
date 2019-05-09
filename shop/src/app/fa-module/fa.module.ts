import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatCheckboxModule, MatSelectModule, MatProgressSpinnerModule, MatProgressBarModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { SharedModule } from '../shared-module/shared.module';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
  

@NgModule({
  declarations: [ 
    SignInComponent, SignUpComponent,
   ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,  
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,

  ],
  entryComponents: [SignInComponent, SignUpComponent],
})

export class AudentificModule {}