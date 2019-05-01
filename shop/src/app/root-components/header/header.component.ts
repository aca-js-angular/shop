
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogService } from '../../fa-module/Services/open-dialog.service'
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { switchMap, map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, Subscribable } from 'rxjs';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { Product } from 'src/app/interfaces and constructors/product.interface';
import { ConfirmDialogService } from 'src/app/comfirm-module/services/confirm-dialog.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit {

  constructor(
    private dialog: DialogService,
    private auth: AngularFireAuth,
    private router: Router,
    private db: DatabaseFireService,
    private confirm: ConfirmDialogService
  ) {}

  /* --- Variables --- */

  @ViewChild('searchInput') input: ElementRef;
  searchAwaitAnimation: boolean;
  searchResult$: Subscribable<object[]>
  searchBoxHid: boolean;
  currentUser: any;
  

  /* --- Methods --- */

  signUp() {
    this.dialog.openSignUp()
  }

  signIn() {
    this.dialog.openSignIn()
  }


  logout() {

    this.confirm.openDialogMessage({
      message: ['Are you sure ?'],
      accept: () => this.signOut(),
    })

  }

  goToBasket() {
    this.router.navigate(['/', 'basket'])
  }

  hide() {
    setTimeout(() => this.searchBoxHid = false, 200)
  }

  private signOut(){
    this.auth.auth.signOut()
    const isInBasket = document.location.href.includes('basket')
    if (isInBasket) {
      this.router.navigate(['home'])
    }
  }


  /* --- LC hooks --- */

  ngOnInit() {
    this.auth.authState.subscribe((user) => {
        setTimeout(() => 
        this.auth.auth.currentUser ? this.currentUser = this.auth.auth.currentUser.providerData[0]:
        this.currentUser = null, 1800);
    })
  }

  ngAterViewInit(){
    this.searchResult$ = fromEvent(this.input.nativeElement, 'input').pipe(
      map(_ => event.target['value'].toLowerCase()),
      distinctUntilChanged(),
      tap(() => this.searchAwaitAnimation = true),
      debounceTime(500),
      switchMap(inpValue => this.db.getDocumentsBySearchValue<Product>('products', inpValue)),
      tap(() => this.searchAwaitAnimation = false),
    )
  }


}
