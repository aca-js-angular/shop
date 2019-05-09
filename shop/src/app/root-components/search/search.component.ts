import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent implements OnInit {
  hidNotResult: boolean;

  constructor(){}

  /* --- Variables --- */

  @Input() results: object[];
  @Input() animation: boolean;


  ngOnInit(){
  }

}
