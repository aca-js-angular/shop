import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule } from '@angular/material';
import { MessengerComponent } from './components/messenger/messenger.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfirmModule } from '../comfirm-module/confirm.module';
import { DecodeMessagePipe } from './Pipes/decode-message.pipe';


@NgModule({
  declarations: [MessageBoxComponent, MessengerComponent, DecodeMessagePipe],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    ConfirmModule,
    MatButtonModule,
  ],
  entryComponents:[MessageBoxComponent],
  exports: [MessageBoxComponent,MessengerComponent]
})
export class MessengerModule { }
