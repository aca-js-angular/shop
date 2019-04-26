import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ComponentType } from '@angular/cdk/portal';


interface ConfirmMessage {
  confirmClass: ComponentType<void>;
  message: string;
  ok: Function;
  cancel?: Function;
  width?: string;
  disableClose?: boolean;
  progressLine?: boolean;
  messageStyle?: object;

  checkBox?: {  
    checkBoxText?: string
    checkBoxFunction?: Function,
  }
}


@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialog: MatDialog) { }
  //-------------------------------------------
  message: string;
  okFunc: Function;
  cancelFunc: Function;
  progressLine: boolean;
  messageStyle: object;

  hasCheckBox: boolean;       // has chackBox
  checkBoxText: string;       // chBox question Text
  checkBoxValue: boolean;     // chBox value
  checkBoxFunction: Function; // checkbox fnktion if true
  //-------------------------------------------


  openDialogMessage(obj: ConfirmMessage) {

//----------Message------------------------
    this.message = obj.message
    this.cancelFunc = obj.cancel;
    this.okFunc = obj.ok;

    this.progressLine = obj.progressLine
    this.messageStyle = obj.messageStyle
//---------Checbox-------------------------

    if(obj.checkBox){
    this.hasCheckBox = true;
    this.checkBoxText = obj.checkBox.checkBoxText;
    this.checkBoxFunction = obj.checkBox.checkBoxFunction;
}

    const dialogRef = this.dialog.open(obj.confirmClass, {
      width: obj.width,
      disableClose: obj.disableClose,
    })
    dialogRef.afterClosed().subscribe();
  }

  clouseDialog(): void {
    this.dialog.closeAll()
  }

}


// documentation;


// openConfirm() {
//   this.confirmDialogService.openSignUp({
//     confirmClass: ConfirmComponent,  // Classs
//     message: 'Do you want to sign-out.', // message (h3)
//     ok: () => alert('ok => function()'), // OK button call Function
//     cancel: () => alert('cancel => function()'), // Cancel button call Function
//      messageStyle: {color: 'red'},
//     checkBox: {
//       hasCheckBox: true, // has CheckBox
//       checkBoxText: "Don't ask anymore", // Checkbox question text
//       checkBoxFunction: () => alert('chBox true => function()') // if Checkbox True  call Function
//     }

//   })
// }

// bottom-sheet/overview

// openConfirm() {
//   this.confirmDialogService.openSignUp({
//     confirmClass: ConfirmComponent,
//     message: 'Confirm Payment',
//     ok: () => alert('ok => function()'),
//     cancel: () => alert('cancel => function()'),
//      progressLine: true, 
//      messageStyle: {color: 'red'},
//     checkBox: {
//       checkBoxText: "Save Your Card",
//       checkBoxFunction: () => alert('chBox true => function() push card Data')
//     }

//   })
// }
