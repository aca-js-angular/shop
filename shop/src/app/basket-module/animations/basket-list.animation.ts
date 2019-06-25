
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  query, 
  stagger, 
  animateChild, 
  keyframes,
  group
} from '@angular/animations';


export const BasketListAnimation = [
    
  trigger('list', [
    transition(':enter', [
      query('@items', stagger(80, animateChild()))
    ]),
  ]),

  trigger('items', [
    transition(':enter', [
      style({ transform: 'scale(0.5)', opacity: 0 }),
      animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)', 
        style({ transform: 'scale(1)', opacity: 1 }))
    ]),
    transition(':leave', [
      group([
        animate('1s cubic-bezier(.7, -0.6, 0.3, 1.5)', style({
          transform: 'scale(0.5)', 
          opacity: 0, 
          height: '0px',
          margin: '0px' ,
        })),
        animate('1s cubic-bezier(.7, 0, 0.3, 1.5)', keyframes([
            style({ 
              width: '*',
              flexBasis: '*',
              offset: 0.7,
            }),
            style({ 
              width: 0,
              flexBasis: 0,
              offset: 1,
            }),
          ])
        )
      ]),
    ]),
  ]),
]
