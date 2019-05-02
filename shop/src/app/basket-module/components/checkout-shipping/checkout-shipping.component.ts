import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormControlService } from 'src/app/form-control.service';
import { _fullName, _adress } from '../../../validators/root/custom-validators'

@Component({
  selector: 'app-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  styleUrls: ['./checkout-shipping.component.scss']
})
export class CheckoutShippingComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private control: FormControlService,
  ) {}

  /* --- Variables --- */

  countries: [string, string[]][];
  cities: string[];

  checkoutForm: FormGroup = this.formBuilder.group({
    country: [],
    city: [],
    fullName: ['',[Validators.required,_fullName]],
    streetAdress: ['',[Validators.required,_adress]],
    postalCode: ['',[Validators.required,Validators.minLength(3)]],
  })

  /* --- Methods --- */

  getErrors(form: FormControl): string | null{
    return this.control.getErrorMessage(form)
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