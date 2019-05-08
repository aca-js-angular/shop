import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule } from '@angular/material';
import { MessengerComponent } from './components/messenger/messenger.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfirmModule } from '../comfirm-module/confirm.module';
import { DecodeMessagePipe } from './Pipes/decode-message.pipe';

// const routes: Routes = [
//   // {path: '', component: MessageBoxComponent}
// ]

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
    
    // RouterModule.forChild(routes)
  ],
  entryComponents:[MessageBoxComponent],
  exports: [MessageBoxComponent,MessengerComponent]
})
export class MessengerModule { }


// static forRoot(): ModuleWithProviders {
//   return { // Но когда мы импортируем SharedModuleв HomeModuleбез использования forRoot, он будет обрабатывать только сам модуль. SharedModuleне будет иметь никакой информации о поставщиках, и поэтому не будет создавать копию AuthenticationService.
//     ngModule: AudentificModule,
//     providers: [ AutoService, ]
//   }
// }