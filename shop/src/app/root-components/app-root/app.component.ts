import { Component, OnInit } from '@angular/core';
import { Router, Scroll, ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter, pairwise } from 'rxjs/operators';
import { HeaderTransforming } from './header-transforming.animation';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { FaService } from 'src/app/fa-module/services/fa.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [HeaderTransforming]
})

export class AppComponent implements OnInit {


  constructor(
    private additionalAuth: AdditionalService,
    private router: Router,
    private active: ActivatedRoute,
    private scroller: ViewportScroller,
    private fa: FaService,
  ) { }

  get $currentUser() {
    return this.additionalAuth.$autoState;
  }

  get currentPage() {
    const url = this.router.url.split('/');
    if (url.includes('not-found')) {
      return 'not-found';
    }
    else if (url.includes('basket') && !url.includes('checkout')) {
      return 'basket'
    }
    else if (url.includes('basket') && url.includes('checkout')) {
      return 'checkout'
    }
    else if (url.includes('db')){
      return 'db'
    }
    else {
      return 'ordinar'
    }
  }

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof Scroll))
      .subscribe((scrolledRoute: Scroll) => {
        if (scrolledRoute.position) {

          if (scrolledRoute.routerEvent.url.includes('basket')) {
            /* backward navigation scrolling to top */
            this.scroller.scrollToPosition([0, 0]);
          }
          else {
            /* backward navigation with scroll position restoration */
            this.scroller.scrollToPosition(scrolledRoute.position)
          }
        } else {
          /* forward navigation */
          this.scroller.scrollToPosition([0, 0]);
        }
      })
    
  }


}