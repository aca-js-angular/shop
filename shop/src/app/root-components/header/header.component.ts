
import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, AfterViewInit } from '@angular/core';
import { DialogService } from '../../fa-module/Services/open-dialog.service'
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { switchMap, map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, Subscribable } from 'rxjs';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { Product } from 'src/app/interfaces and constructors/product.interface';
import { ConfirmDialogService } from 'src/app/comfirm-module/services/confirm-dialog.service';
import { AdditionalService } from 'src/app/fa-module/Services/additional.service';
import { BasketService } from 'src/app/basket-module/services/basket.service';
import { JQueryZoomService } from 'src/app/products-module/services/j-query-zoom.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, AfterViewInit {

  constructor(
    private dialog: DialogService,
    private auth: AngularFireAuth,
    private additionalFa: AdditionalService,
    private router: Router,
    private jQuery: JQueryZoomService,
    private db: DatabaseFireService,
    private confirm: ConfirmDialogService,
    private basketService: BasketService
  ) {}

  /* --- Variables --- */

  @ViewChild('searchInput') input: ElementRef;

  searchAwaitAnimation: boolean;
  searchResult$: Subscribable<object[]>
  searchBoxHid: boolean;
  currentUser: any;


  /* --- Getters --- */
  
  get basketSize(){ return this.basketService.getTotalQuantity()}

  get is404(): boolean {
    return document.location.href.includes('not-found')
  }
  

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

  hideSearchBox() {
    setTimeout(() => this.searchBoxHid = false, 200);
    this.jQuery.jQueryZoomImg()
  }
  
  showSearchBox(){
    this.searchBoxHid = true;
    this.jQuery.clearjQueryZoomScreans()
  }





  private signOut(){
    this.additionalFa.signOut()
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

 ngAfterViewInit(){
    this.searchResult$ = fromEvent(this.input.nativeElement, 'input').pipe(
      map(_ => event.target['value'].toLowerCase()),
      distinctUntilChanged(),
      tap(() => this.searchAwaitAnimation = true),
      debounceTime(400),
      switchMap(inpValue => this.db.getDocumentsBySearchValue<Product>('products', inpValue)),
      tap(() => this.searchAwaitAnimation = false),
    )
  }


}
