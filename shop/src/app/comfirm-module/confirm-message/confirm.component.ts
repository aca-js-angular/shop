import { Component, OnInit } from '@angular/core';
import { ConfirmDialogService } from '../confirm-dialog.service';


@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(private confirmDialogService: ConfirmDialogService) { }
  messageStyle: object

  ok(){ if(this.confirmDialogService.okFunc){ this.confirmDialogService.okFunc()} }
  cancel(){ if(this.confirmDialogService.cancelFunc){ this.confirmDialogService.cancelFunc()} }


  checkBoxValue(chBoxValue: boolean) {
    if(this.confirmDialogService.hasCheckBox) {

      this.confirmDialogService.checkBoxValue = chBoxValue; // ete tvaca Checbox true nor value havasaracni
    
    if(chBoxValue && this.confirmDialogService.checkBoxFunction){ 
      this.confirmDialogService.checkBoxFunction();
        console.log(chBoxValue)
      }
  //  this.confirmDialogService.clouseDialog()
 } 


  }

  ngOnInit() { 
    this.messageStyle = this.confirmDialogService.messageStyle
  }

}
