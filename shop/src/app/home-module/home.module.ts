import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ProductsModule } from '../products-module/products.module'

import { HomeRootComponent } from './components/home-root/home-root.component';
import { AutoSlideComponent } from './components/auto-slide/auto-slide.component';
import { StructuralSlideDirective } from './directives/structural-slide.directive';
import { TopProductsComponent } from './components/top-products/top-products.component';
import { BestDealsComponent } from './components/best-deals/best-deals.component';
import { LatestProductsComponent } from './components/latest-products/latest-products.component';
import { AnimationModule } from '../animation-module/animation.module';

@NgModule({
  declarations: [
    HomeRootComponent,
    AutoSlideComponent,
    StructuralSlideDirective,
    TopProductsComponent,
    BestDealsComponent,
    LatestProductsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ProductsModule,
    AnimationModule,
  ],
  exports: [HomeRootComponent]
})
export class HomeModule { }
