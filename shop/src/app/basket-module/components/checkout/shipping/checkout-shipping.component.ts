import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { FormControlService } from 'src/app/form-control.service';
import { _fullName, _adress, _password } from '../../../../validators/root/custom-validators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  styleUrls: [
    './checkout-shipping.component.scss',
    '../checkout.scss',
    '../checkout.media.scss',
  ]
})
export class CheckoutShippingComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private control: FormControlService,
    private loaction: Location,
  ) {}

  /* --- Variables --- */

  countries: [string, string[]][];
  cities: string[];

  checkoutForm: FormGroup = this.formBuilder.group({
    country: [],
    city: [],
    fullName: ['',[Validators.required,_fullName]],
    adress: ['',[Validators.required,_adress]],
    postalCode: ['',[Validators.required,Validators.minLength(4)]],
  })

  /* --- Methods --- */

  backToBasket(){
    this.loaction.back()
  }

  getErrors(form: AbstractControl): string | null{
    return this.control.getErrorMessage(form)
  }

  get fullNameError(){
    return this.fullName.touched && this.control.getErrorMessage(this.fullName)
  }
  get adressError(){
    return this.adress.touched && this.control.getErrorMessage(this.adress)
  }
  get postalCodeError(){
    return this.postalCode.touched && this.control.getErrorMessage(this.postalCode)
  }

  get fullName(): AbstractControl {
    return this.checkoutForm.get('fullName');
  }
  get adress(): AbstractControl {
    return this.checkoutForm.get('adress');
  }
  get postalCode(): AbstractControl {
    return this.checkoutForm.get('postalCode');
  }
  
  /* --- LC hooks --- */

  ngOnInit() {

    this.checkoutForm.get('country').valueChanges.subscribe(next => {
      this.cities = this.countries[next][1];
      this.checkoutForm.get('city').setValue(0)
    })

    this.http.get('https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/6ee538beca8914133259b401ba47a550313e8984/countries.min.json')
      .subscribe(data => {
        this.countries = Object.entries(data)
        this.checkoutForm.get('country').setValue(7) // Armenia by default
        
      })
  }
}