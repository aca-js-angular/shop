import { trigger, transition, style, animateChild, animate, query, group } from '@angular/animations';


export const routerSlide =
  trigger('routeAnimations', [

    transition('Basket => Checkout, Checkout => Payment', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      group([
        query(':enter', [
          style({left: '100%'}),
          animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({ left: '0%'}))
        ]),
        query(':leave', [
          style({left: '0'}),
          animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({ left: '-100%'}))
        ])
      ]),
    ]),
    transition('Checkout => Basket, Payment => Checkout', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        }),

      ]),
      group([
        query(':leave', [
          style({left: '0%'}),
          animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({ left: '100%'}))
        ],),
        query(':enter', [
          style({left: '-100%'}),
          animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({ left: '0%'}))
        ],)
      ]),
    ]),
  ]);
