import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasketComponent } from './components/basket/basket.component';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import { BasketRootComponent } from './components/basket-root/basket-root.component';

const routes: Routes = [
  {path: '', component: BasketRootComponent, children: [
    {path: '', component: BasketComponent, data: {animation: 'Basket'}},
    {path: 'checkout', component: CheckoutShippingComponent, data: {animation: 'Checkout'}},
    {path: 'checkout/payment', component: CheckoutPaymentComponent, data: {animation: 'Payment'}},
  ]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasketRoutingModule { }
