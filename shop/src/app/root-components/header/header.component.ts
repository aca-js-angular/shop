import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogService } from '../../fa-module/Services/open-dialog.service'
import { AngularFireAuth } from '@angular/fire/auth';
import { BasketService } from 'src/app/basket-module/basket.service';
import { Router } from '@angular/router';
import { switchMap, map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, Subscribable } from 'rxjs';
import { DatabaseFireService } from 'src/app/databaseFire.service';
import { Product } from 'src/app/products-module/product-interface';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  registered: boolean;
  checkingOut: boolean;

  constructor(
    private dialog: DialogService,
    private auth: AngularFireAuth,
    private bs: BasketService,
    private router: Router,
    private db: DatabaseFireService,
  ) {
  }

  signUp(){
    this.dialog.openSignUp()
  }

  signIn(){
    this.dialog.openSignIn()
  }

  logout(){
    this.auth.auth.signOut();
    const isInBasket = document.location.href.includes('basket')
    if(isInBasket){
      this.router.navigate(['home'])
    }
  }

  goToBasket(){
    this.router.navigate(['/','basket'])
  }

  searchAwaitAnimation: boolean;
  searchResult$: Subscribable<object[]>
  searchBoxHid: boolean;

  hide(){
    setTimeout(() => this.searchBoxHid = false,200)
  }


  currentUser: any;

  @ViewChild('searchInput')
  input: ElementRef;

  ngOnInit() {
    this.auth.authState.subscribe(() => {
      if(this.auth.auth.currentUser){
        this.currentUser = this.auth.auth.currentUser.providerData[0]
				console.log(this.currentUser)
      }else{
        this.currentUser = null
      }
      
    })

    this.searchResult$ = fromEvent(this.input.nativeElement,'input').pipe(
      map(_ => event.target['value'].toLowerCase()),
      distinctUntilChanged(),
      tap(()=> this.searchAwaitAnimation = true),
      debounceTime(500),
      switchMap(inpValue => this.db.getDocumentsBySearchValue<Product>('products',inpValue)),
      tap(()=> this.searchAwaitAnimation = false),
    )
  }

  

}
