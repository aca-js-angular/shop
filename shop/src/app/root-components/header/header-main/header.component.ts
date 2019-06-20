
import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { switchMap, map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, Subscribable } from 'rxjs';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { Product } from 'src/app/interfaces/product.interface';
import { BasketService } from 'src/app/basket-module/services/basket.service';
import { JQueryZoomService } from 'src/app/products-module/services/j-query.service';
import { FaService } from 'src/app/fa-module/services/fa.service';
import { OpenDialogService } from '../../../fa-module/services/open-dialog.service'
import { logOut } from '../../../constants/popup-messages.constant'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss','../header-media.scss'],
})

export class HeaderComponent implements OnInit, AfterViewInit {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private jQuery: JQueryZoomService,
    private db: DatabaseFireService,
    private bs: BasketService,
    private fa: FaService,
    private dialog: OpenDialogService

  ) {}

  /* --- Variables --- */

  @ViewChild('searchInput') input: ElementRef;

  isLoading: boolean;
  displayingResults: boolean;
  searchResult$: Subscribable<object[]>
  currentUser: any;


  /* --- Getters --- */

  get basketSize(): number{
    return this.bs.getTotalQuantity()
  }

  /* --- Methods --- */

  signUp() {
    this.dialog.openSignUp()
  }

  signIn() {
    this.dialog.openSignIn()
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

  hideSearchResults() {
    this.jQuery.jQueryZoomImg();
    setTimeout(() => {this.displayingResults = false},200)
  }
  
  displaySearchResults(){
    this.displayingResults = true;
    this.jQuery.clearjQueryZoomScreans();
  }

  private signOut(){
    this.fa.signOut()
    const isInBasket = document.location.href.includes('basket')
    if (isInBasket) {
      this.router.navigate(['home'])
    }
  }


  /* --- LC hooks --- */

  ngOnInit() {
    this.auth.authState.subscribe(_ => {
      this.auth.auth.currentUser ? this.currentUser = this.auth.auth.currentUser.providerData[0]:this.currentUser = null
    })
  }

 ngAfterViewInit(){

    this.searchResult$ = fromEvent(this.input.nativeElement, 'input').pipe(
      map(_ => event.target['value'].toLowerCase()),
      distinctUntilChanged(),
      tap(() => this.isLoading = true),
      debounceTime(400),
      switchMap(inpValue => this.db.getDocumentsBySearchValue<Product>('products', inpValue)),
      tap(() => this.isLoading = false),
    )
  }


}