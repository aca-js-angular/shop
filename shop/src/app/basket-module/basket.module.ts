import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from '../products-module/products.module'
import { ReactiveFormsModule } from '@angular/forms'

import { BasketRoutingModule } from './basket-routing.module';
import { BasketItemComponent } from './components/basket-item/basket-item.component';
import { BasketComponent } from './components/basket/basket.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import { SharedModule } from '../shared-module/shared.module';

@NgModule({
  declarations: [
    BasketItemComponent,
    BasketComponent,
    OrderSummaryComponent,
    CheckoutShippingComponent,
    CheckoutPaymentComponent
  ],

  imports: [
    CommonModule,
    BasketRoutingModule,
    ProductsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})

export class BasketModule { }