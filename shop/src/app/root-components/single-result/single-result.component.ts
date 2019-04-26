import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-result',
  templateUrl: './single-result.component.html',
  styleUrls: ['./single-result.component.scss'],
  inputs: ['singleResult']
})
export class SingleResultComponent implements OnInit {
  
  singleResult: object;

  constructor() { }

  ngOnInit() {
}
}

