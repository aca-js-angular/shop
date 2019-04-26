import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  styleUrls: ['./checkout-shipping.component.scss']
})
export class CheckoutShippingComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) { }

  countries: object;

  checkoutForm: FormGroup;

  get fullName():AbstractControl { return this.checkoutForm.get('fullName')}
  get streetAdress():AbstractControl { return this.checkoutForm.get('streetAdress')}
  get postalCode():AbstractControl { return this.checkoutForm.get('postalCode')}
  get country1():AbstractControl { return this.checkoutForm.get('country')}

  x: any;

  ngOnInit() {

    this.http.get('https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/6ee538beca8914133259b401ba47a550313e8984/countries.min.json').subscribe(data => {
      this.countries = Object.entries(data)
      this.checkoutForm = this.formBuilder.group({
        country: [7,[]],
        city: ['',[]],
        fullName: ['',[Validators.required,Validators.pattern(/^[a-z,',-]+(\s)[a-z,',-]+$/i)]],
        streetAdress: ['',[Validators.required,Validators.pattern(/[a-z]\d+/g)],],
        postalCode: ['',[Validators.required,Validators.minLength(10)],]
      })
      
      console.log(this.countries)
    })
  }
}


        // Validators.pattern('^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$')]],
