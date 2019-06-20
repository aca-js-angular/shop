import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule } from '@angular/material';
import { MessengerComponent } from './components/messenger/messenger.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DecodeMessagePipe } from './pipes/decode-message.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop'

@NgModule({
  declarations: [
    MessageBoxComponent, 
    MessengerComponent, 
    DecodeMessagePipe
  ],

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
    MatButtonModule,
    DragDropModule
  ],
  entryComponents:[MessageBoxComponent],
  exports: [MessengerComponent, MessageBoxComponent]
})
export class MessengerModule { }
