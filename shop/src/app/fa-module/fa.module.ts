import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './components/confirm-message/confirm.component';
import { MatDialogModule, MatButtonModule, MatCheckboxModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTooltipModule, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ResetPassComponent } from './components/reset-pass/reset-pass.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared-module/shared.module';
import { faTooltipDefaults } from '../constants/tooltip-defaults.constant';
import { WarningComponent } from './components/warning/warning.component';
import { AlertComponent } from './components/alert/alert.component';
import { AuthActionsComponent } from './components/auth-actions/auth-actions.component';
import { RouterModule } from '@angular/router';
import { AnimationModule } from '../animation-module/animation.module';

@NgModule({
  declarations: [
    ConfirmComponent,
    SignInComponent,
    SignUpComponent,
    ResetPassComponent,
    WarningComponent,
    AlertComponent,
    AuthActionsComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AnimationModule,
  ],
  
  entryComponents: [
    ConfirmComponent,
    SignInComponent,
    SignUpComponent,
    ResetPassComponent,
    WarningComponent,
    AlertComponent,
  ],

  exports: [
    AuthActionsComponent
  ],

  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: faTooltipDefaults}
  ],
  
})
export class FaModule {}
