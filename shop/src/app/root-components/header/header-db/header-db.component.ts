import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header-db',
  templateUrl: './header-db.component.html',
  styleUrls: ['./header-db.component.scss']
})
export class HeaderDbComponent implements OnInit {

  constructor(private location: Location) { }

  back(){
    this.location.back();
  }

  ngOnInit() {
  }

}
