import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './components/confirm-message/confirm.component';
import { MatDialogModule, MatButtonModule, MatCheckboxModule } from '@angular/material';


@NgModule({
  declarations: [
    ConfirmComponent,
  ],

  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
  ],

  entryComponents: [ ConfirmComponent ]
})
export class ConfirmModule { }
