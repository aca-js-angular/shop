import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CloseDialogService {

  constructor(private dialog: MatDialog) { }

  closeDialog(){
    this.dialog.closeAll()
  }

}