import { Component, OnInit } from '@angular/core';
import { DatesService } from 'src/app/dates.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent {

  constructor(
    private dates: DatesService,
    private build: FormBuilder
  ) {}

  paymentForm = this.build.group({
    cardNumber: ['',[Validators.required,Validators.minLength(16)]],
    nameOnCard: ['',[Validators.required,Validators.pattern(/^[a-z,',-]+(\s)[a-z,',-]+$/i)]],
    expYear: [],
    expMonth: [],
    cvv: ['',[Validators.required,Validators.minLength(4)]],
  })

  get cardNumber(){
    return this.paymentForm.get('cardNumber')
  }
  get nameOnCard(){
    return this.paymentForm.get('nameOnCard')
  }
  get cvv(){
    return this.paymentForm.get('cvv')
  }


  get nearestYears(): number[]{
    return this.dates.getNearestYears(31);
  }
  
  get months(): number[]{
    return this.dates.getMonths();
  }

}
