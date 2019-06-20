import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent {

  constructor(){}

  /* --- Variables --- */

  @Input() results: object[];
  @Input() loading: boolean;
  
}