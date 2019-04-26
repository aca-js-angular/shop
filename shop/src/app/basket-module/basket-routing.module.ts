import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasketComponent } from './basket/basket.component';
import { CheckoutShippingComponent } from './checkout-shipping/checkout-shipping.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';

const routes: Routes = [
  {path: 'basket', component: BasketComponent},
  {path: 'checkout', component: CheckoutShippingComponent},
  {path: 'checkout/payment', component: CheckoutPaymentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasketRoutingModule { }
