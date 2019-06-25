import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderTransforming } from './header-transforming.animation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [HeaderTransforming]
})

export class AppComponent implements OnInit {


  constructor(
    private router: Router,
    private scroller: ViewportScroller,
    ){}


  get currentPage(){
    const url = this.router.url.split('/');
    if(url.includes('not-found')){
      return 'not-found';
    }
    else if(url.includes('basket') && !url.includes('checkout')){
      return 'basket'
    }
    else if(url.includes('basket') && url.includes('checkout')){
      return 'checkout'
    }
    else{
      return 'ordinar'
    }
  }

  ngOnInit(){
    this.router.events
    .pipe(filter(e => e instanceof Scroll))
    .subscribe((scrolledRoute: Scroll) => {
      if(scrolledRoute.position){

        if(scrolledRoute.routerEvent.url.includes('basket')){
          /* backward navigation scrolling to top */
          this.scroller.scrollToPosition([0,0]);
        }
        else{
          /* backward navigation with scroll position restoration */
          this.scroller.scrollToPosition(scrolledRoute.position)
        }
      }else{
        /* forward navigation */
        this.scroller.scrollToPosition([0,0]);
      }
    })
  }


}