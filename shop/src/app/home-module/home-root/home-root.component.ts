import { Component, OnInit } from '@angular/core';
import { DatabaseFireService } from 'src/app/databaseFire.service';
import { AngularFirestore } from '@angular/fire/firestore';

let sb = 'saddleBrown';
let nw = 'navajoWhite';
let dg = 'darkGoldenRod';


@Component({
  selector: 'app-home-root',
  templateUrl: './home-root.component.html',
  styleUrls: ['./home-root.component.scss']
})

export class HomeRootComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
