import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatesService } from 'src/app/basket-module/services/dates.service';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { FormControlService } from 'src/app/form-control.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: [
    './checkout-payment.component.scss',
    '../checkout.scss',
    '../checkout.media.scss'
  ]
})
export class CheckoutPaymentComponent implements OnInit, OnDestroy {

  constructor(
    private location: Location,
    private dates: DatesService,
    private build: FormBuilder,
    private control: FormControlService,
  ) {}

  /* --- Variables --- */

  paymentForm: FormGroup;
  hideCardNumber: boolean  = true;
  yearSelectorListener: Subscription;

  prevent(): false {
    return false
  }

  backToShipping(){
    this.location.back();
  }

  /* --- Getters --- */

  get nearestYears(): number[]{
    return this.dates.getNearestYears(31);
  }
  
  months: number[] = this.dates.getMonths();

  get cardNumber(): AbstractControl {
    return this.paymentForm.get('cardNumber') 
  }
  get nameOnCard(): AbstractControl{
    return this.paymentForm.get('nameOnCard')
  }
  get cvv(): AbstractControl {
    return this.paymentForm.get('cvv')
  }
  get expMonth(): AbstractControl {
    return this.paymentForm.get('expMonth') 
  }
  get expYear(): AbstractControl {
      return this.paymentForm.get('expYear')
  }


  get cardNumberHint(): string {
    return this.cardNumber.value.length <= 16 ? `${this.cardNumber.value.length}/16` : 'Overflow'
  }
  get cardNumberError(): string | null {
    return this.cardNumber.touched && this.control.getErrorMessage(this.cardNumber)
  }
  get nameOnCardError(): string | null {
    return this.nameOnCard.touched && this.control.getErrorMessage(this.nameOnCard,'Name on card must contain 2 fractions')
  }
  get cvvError(): string | null {
    return this.cvv.touched && this.control.getErrorMessage(this.cvv)
  }

  get shownCardNumberError(): boolean {
    return this.cardNumber.touched && this.cardNumber.invalid
  }

  ngOnInit(){
    this.paymentForm = this.build.group({
      cardNumber: ['',[Validators.required,Validators.minLength(16),Validators.maxLength(16)]],
      nameOnCard: ['',[Validators.required,Validators.pattern(/^[a-z,',-]+(\s)[a-z,',-]+$/i)]],
      expYear: [this.nearestYears[0]],
      expMonth: [this.months[0]],
      cvv: ['',[Validators.required,Validators.minLength(3)]],
    })

    this.yearSelectorListener = this.expYear.valueChanges.subscribe(next => {
      this.months = this.dates.getMonths(next);
      if(!this.months.includes(this.expMonth.value)){
        this.expMonth.setValue(this.months[0]);
      }
    })
  }

  ngOnDestroy(){
    this.yearSelectorListener.unsubscribe();
  }

}
