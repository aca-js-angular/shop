import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  inputs: ['results:searchResult','animation']
})
export class SearchComponent implements OnInit {

  constructor() { }
  results: object[];
  animation: boolean;

  
  ngOnInit() {
  }


}
