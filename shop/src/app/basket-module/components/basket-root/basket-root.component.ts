import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { routerSlide } from '../../animations/router-slide.animation';

@Component({
  selector: 'app-basket-root',
  templateUrl: './basket-root.component.html',
  styleUrls: ['./basket-root.component.scss'],
  animations: [routerSlide]
})
export class BasketRootComponent implements OnInit {

  animating: boolean = false;

  constructor(private router: Router) {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnInit(){}

}
