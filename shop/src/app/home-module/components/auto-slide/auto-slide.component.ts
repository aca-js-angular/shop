import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { PostProductService } from 'src/app/profile-module/post-product.service';

@Component({
  selector: 'app-auto-slide',
  templateUrl: './auto-slide.component.html',
  styleUrls: ['./auto-slide.component.scss'],
  animations: [
    trigger('entrance', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ]),
    ]),
  ],
})
export class AutoSlideComponent {

  constructor() {}

  /* --- Variables --- */
  
  images: string[] = [
    'assets/dolce & gabbana.jpg',
    'assets/armani watch.jpg',
    'assets/calvin klein.png',
    'assets/armani.jpg',
    'assets/nike.jpg',
    'assets/prada.jpg', 
    'assets/black opium.jpg',
  ]

}
