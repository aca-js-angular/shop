import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private build: FormBuilder){}

  profileForm = this.build.group({

    firstName: [''],
    lastName: [''],
    country: ['Armenia'],
    city: ['Yerevan'],
    phone: [''],
    login: [''],
    password: [''],
    passwordConfirm: ['']

  })

  

  ngOnInit(){

  }

}
