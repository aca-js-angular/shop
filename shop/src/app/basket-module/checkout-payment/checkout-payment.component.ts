import { Component, OnInit } from '@angular/core';
import { DatesService } from 'src/app/dates.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {

  constructor(private dates: DatesService) { }

  ngOnInit() {
  }

}
