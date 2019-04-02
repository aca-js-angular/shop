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

  options: object[];

  ngOnInit(){
    this.options = [
      {name: 'firstName', control: this.profileForm.get('firstName'), type: 'input'},
      {name: 'lastName', control: this.profileForm.get('lastName'), type: 'input'},
      {name: 'country', control: this.profileForm.get('country'), type: 'select'},
      {name: 'city', control: this.profileForm.get('city'), type: 'select'},
      {name: 'phone', control: this.profileForm.get('phone'), type: 'input'},
      {name: 'login', control: this.profileForm.get('login'), type: 'input'},
      {name: 'password', control: this.profileForm.get('password'), type: 'input'},
      {name: 'passwordConfirm', control: this.profileForm.get('passwordConfirm'), type: 'input'},
    ]
  }

}
