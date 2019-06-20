import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-single-result',
  templateUrl: './single-result.component.html',
  styleUrls: ['./single-result.component.scss'],
})
export class SingleResultComponent  {
  constructor() {}

  /* --- Variables --- */

  @Input() singleResult: any;

}

