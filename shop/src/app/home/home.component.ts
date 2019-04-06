import { Component, OnInit } from '@angular/core';
import { SignInService } from '../audentific-module/Services/SignIn/sign-in.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(private s :SignInService ) { }

  ngOnInit() {
    this.s.isLogined.subscribe(console.log)
  }

}
