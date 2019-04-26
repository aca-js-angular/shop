import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auto-slide',
  templateUrl: './auto-slide.component.html',
  styleUrls: ['./auto-slide.component.scss']
})
export class AutoSlideComponent implements OnInit {

  images: string[] = [
    'assets/dolce & gabbana.jpg',
    'assets/armani watch.jpg',
    'assets/calvin klein.png',
    'assets/armani.jpg',
    'assets/nike.jpg',
    'assets/prada.jpg', 
    'assets/black opium.jpg',
  ]

  constructor() { }

  ngOnInit() {
  }

}
