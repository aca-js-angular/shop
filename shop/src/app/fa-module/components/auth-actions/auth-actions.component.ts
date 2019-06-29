import { Component, OnInit } from '@angular/core';
import { OpenDialogService } from 'src/app/fa-module/services/open-dialog.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { BasketService } from 'src/app/basket-module/services/basket.service';
import { FaService } from 'src/app/fa-module/services/fa.service';
import { Router } from '@angular/router';
import { logOut } from '../../../constants/popup-messages.constant'

@Component({
  selector: 'app-auth-actions',
  templateUrl: './auth-actions.component.html',
  styleUrls: ['./auth-actions.component.scss']
})
export class AuthActionsComponent implements OnInit {

  currentUser: any;

  constructor(
    private dialog: OpenDialogService,
    private auth: AngularFireAuth,
    private bs: BasketService,
    private fa: FaService,
    private router: Router,
  ) { }

  get basketSize(): number{
    return this.bs.getTotalQuantity()
  }

  signIn(){
    this.dialog.openSignIn();
  }

  signUp(){
    this.dialog.openSignUp();
  }

  logout() {
    this.dialog.openConfirmMessage({
      message: logOut(),
      accept: () => this.signOut(),
    })
  }

  goToBasket() {
    this.router.navigate(['/', 'basket'])
  }

  private signOut(){
    this.fa.signOut().then(_ => {
      const isInBasket = this.router.url.includes('basket')
      if (isInBasket) {
        this.router.navigate(['home'])
      };
    });
    
  }

  ngOnInit() {
    this.auth.authState.subscribe(_ => {
      const currentUser = this.auth.auth.currentUser;
      if(currentUser){
        this.currentUser = Object.assign({}, currentUser.providerData[0], {uid: currentUser.uid})
      }else{
        this.currentUser = null;
      }      
    })

  }

}
