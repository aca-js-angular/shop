import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { MatDialogModule,MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatMenuModule } from '@angular/material';
import { MessengerComponent } from './components/messenger-main/messenger-main.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { AnimationModule } from '../animation-module/animation.module';
import { MessageRowComponent } from './components/message-row/message-row.component';
import { RouterModule } from '@angular/router';
import { HrefPipe } from './pipes/href.pipe';

@NgModule({
  declarations: [
    MessageBoxComponent, 
    MessengerComponent, 
    MessageRowComponent, HrefPipe
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
    MatMenuModule,
    MatIconModule,
    RouterModule
  ],
  entryComponents:[MessageBoxComponent],
  exports: [MessengerComponent, MessageBoxComponent]
})
export class MessengerModule { }
