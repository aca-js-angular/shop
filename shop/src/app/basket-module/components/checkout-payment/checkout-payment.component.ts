import { Component } from '@angular/core';
import { DatesService } from 'src/app/basket-module/services/dates.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { FormControlService } from 'src/app/form-control.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent {

  constructor(
    private dates: DatesService,
    private build: FormBuilder,
    private control: FormControlService,
  ) {}

  /* --- Variables --- */

  paymentForm: FormGroup = this.build.group({
    cardNumber: ['',[Validators.required,Validators.minLength(16),Validators.maxLength(16)]],
    nameOnCard: ['',[Validators.required,Validators.pattern(/^[a-z,',-]+(\s)[a-z,',-]+$/i)]],
    expYear: [2020],
    expMonth: [4],
    cvv: ['',[Validators.required,Validators.minLength(3)]],
  })

  hideCardNumber: boolean  = true;

  prevent(): false {
    return false
  }

  /* --- Getters --- */

  get cardNumber(): FormControl {
    return this.paymentForm.get('cardNumber') as FormControl
  }
  get nameOnCard(): FormControl{
    return this.paymentForm.get('nameOnCard') as FormControl
  }
  get cvv(): FormControl {
    return this.paymentForm.get('cvv') as FormControl
  }
  get expMonth(): FormControl {
    return this.paymentForm.get('expMonth') as FormControl
  }
  get expYear(): FormControl {
    return this.paymentForm.get('expYear') as FormControl
  }


  get cardNumberHint(): string {
    return this.cardNumber.value.length <= 16 ? `${this.cardNumber.value.length}/16` : 'Overflow'
  }
  get cardNumberError(): string | null {
    return this.control.getErrorMessage(this.cardNumber)
  }
  get nameOnCardError(): string | null {
    return this.control.getErrorMessage(this.nameOnCard,'Name on card must contain 2 fractions')
  }
  get cvvError(): string | null {
    return this.control.getErrorMessage(this.cvv)
  }

  get shownCardNumberError(): boolean {
    return this.cardNumber.touched && this.cardNumber.invalid
  }




  get nearestYears(): number[]{
    return this.dates.getNearestYears(31);
  }
  
  get months(): number[]{
    return this.dates.getMonths();
  }

}
