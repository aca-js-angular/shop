import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  styleUrls: ['./checkout-shipping.component.scss']
})
export class CheckoutShippingComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) {}

  countries: Array<string[]>;

  checkoutForm: FormGroup = this.formBuilder.group({
    country: [],
    city: [],
    fullName: ['',[Validators.required,Validators.pattern(/^[a-z,',-]+(\s)[a-z,',-]+$/i)]],
    streetAdress: ['',[Validators.required]],
    postalCode: ['',[Validators.required,Validators.minLength(4)],]
  })


  ngOnInit() {

    this.http.get('https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/6ee538beca8914133259b401ba47a550313e8984/countries.min.json')
      .subscribe(data => {
        this.countries = Object.entries(data)
        this.checkoutForm.get('country').setValue(7) // Armenia by default
      })
  }
}