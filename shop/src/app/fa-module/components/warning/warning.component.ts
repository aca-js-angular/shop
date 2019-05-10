import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AlertMessage } from 'src/app/interfaces/alert-message.interface';


@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss', '../confirm-dialog-main.scss']
})

export class WarningComponent {

  options: AlertMessage

  constructor(@Inject(MAT_DIALOG_DATA) data, private dialogRef: MatDialogRef<WarningComponent>){
    this.options = data;
  }

  close(){
    this.dialogRef.close({to: this.options.after})
  }
  
}