
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


export const HeaderTransforming = [

    // trigger('headerTransforming', [
    //     transition(':enter', [
    //     style({width: 0, position: 'absolute', right: 0, top: 0, overflow: 'hidden' }),
    //     animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({width: '100%' }))
    //     ]),
    //     transition(':leave', [
    //     style({ width: '100%', overflow: 'hidden'}),
    //     animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({width: 0}))
    //     ]),
    // ]),

    trigger('headerTransforming', [
    
        transition('basket => checkout', [
            style({boxShadow: '2px 2px 5px gray'}),
            group([
                query(':enter',[
                    style({width: 0, position: 'absolute', right: 0, top: 0, overflow: 'hidden' }),
                    animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({width: '100%' }))
                ]),
                query(':leave',[
                    style({ width: '100%', height: '*', overflow: 'hidden'}),
                    animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({width: '0', height: '100px' }))
                ]) 
            ])
        ]),
        transition('checkout => basket', [
            style({boxShadow: '2px 2px 5px gray'}),
            group([
                query(':leave',[
                    style({width: '100%', position: 'absolute', right: 0, top: 0, overflow: 'hidden' }),
                    animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({width: 0 }))
                ]),
                query(':enter',[
                    style({ width: 0, overflow: 'hidden', height: '100px'}),
                    animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({width: '100%', height: '*' }))
                ]) 
            ])
        ])
    ]),

    // transition('Basket => Checkout, Checkout => Payment', [
    //     style({ position: 'relative' }),
    //     query(':enter, :leave', [
    //       style({
    //         position: 'absolute',
    //         top: 0,
    //         left: 0,
    //         width: '100%'
    //       })
    //     ]),
    //     group([
    //       query(':enter', [
    //         style({left: '100%'}),
    //         animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({ left: '0%'}))
    //       ]),
    //       query(':leave', [
    //         style({left: '0'}),
    //         animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({ left: '-100%'}))
    //       ])
    //     ]),
    //   ]),
    //   transition('Checkout => Basket, Payment => Checkout', [
    //     style({ position: 'relative' }),
    //     query(':enter, :leave', [
    //       style({
    //         position: 'absolute',
    //         top: 0,
    //         left: 0,
    //         width: '100%'
    //       }),
  
    //     ]),
    //     group([
    //       query(':leave', [
    //         style({left: '0%'}),
    //         animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({ left: '100%'}))
    //       ],),
    //       query(':enter', [
    //         style({left: '-100%'}),
    //         animate('1.5s cubic-bezier(.8, -0.5, 0.2, 1.5)', style({ left: '0%'}))
    //       ],)
    //     ]),
    //   ]),
]
