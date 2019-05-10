import { Component } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  get currentState(): string {
    if(document.location.href.includes('not-found')){
      return '404'
    }
    else if(document.location.href.includes('checkout')){
      return 'checkout'
    }
    else return 'ordinar'
  }

}