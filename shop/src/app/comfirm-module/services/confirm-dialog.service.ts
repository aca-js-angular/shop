import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmMessage } from '../../interfaces and constructors/confirm-message.interface';
import { ConfirmComponent } from '../components/confirm-message/confirm.component';

@Injectable({
  providedIn: 'root'
})

export class ConfirmDialogService {

  constructor(private dialog: MatDialog){}

  openDialogMessage(options: ConfirmMessage) {

    this.dialog.open(ConfirmComponent,{
      data: options,
      disableClose: options.sticky,
    })
  }

}