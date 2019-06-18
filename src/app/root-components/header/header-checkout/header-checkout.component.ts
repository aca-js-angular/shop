import { Component } from '@angular/core';
import { OpenDialogService } from 'src/app/fa-module/services/open-dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-checkout',
  templateUrl: './header-checkout.component.html',
  styleUrls: ['./header-checkout.component.scss']
})
export class HeaderCheckoutComponent {

  constructor(private dialog: OpenDialogService, private router: Router){}

  get isPayment(): boolean {
    return document.location.href.includes('payment')
  }

  goHomeByConfirm(){
    this.dialog.openConfirmMessage({
      message: ['Your order is not resolved yet.','Do you want leave anyway ?'],
      accept: () => {this.router.navigate(['/','home'])}
    })
  }
}