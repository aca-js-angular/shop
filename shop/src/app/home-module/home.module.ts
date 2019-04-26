import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ProductsModule } from '../products-module/products.module'

import { HomeRootComponent } from './home-root/home-root.component';
import { AutoSlideComponent } from './auto-slide/auto-slide.component';
import { CustomSlideDirective } from '../customSlide.directive';
import { TopProductsComponent } from './top-products/top-products.component';
import { BestDealsComponent } from './best-deals/best-deals.component';
import { LatestProductsComponent } from './latest-products/latest-products.component';

@NgModule({
  declarations: [
    HomeRootComponent,
    AutoSlideComponent,
    CustomSlideDirective,
    TopProductsComponent,
    BestDealsComponent,
    LatestProductsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ProductsModule,
  ]
})
export class HomeModule { }
