import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm-message/confirm.component';
import { MatDialogModule, MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule, MatProgressBarModule } from '@angular/material';


@NgModule({
  declarations: [ConfirmComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatDialogModule,  
    MatButtonModule,
    MatCheckboxModule,
    MatProgressBarModule,
    // MatProgressSpinnerModule
  ],

  exports:[ ],
  entryComponents: [ ConfirmComponent ]
})
export class ConfirmModule { }
