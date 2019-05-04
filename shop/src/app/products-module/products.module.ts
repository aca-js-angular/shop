import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsRootComponent } from './components/products-root/products-root.component';
import { SingleProductComponent } from './components/single-product/single-product.component';
import { ProductSliderComponent } from './components/product-slider/product-slider.component';
import { ImageSliderComponent } from './components/image-slider/image-slider.component'
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductListPageComponent } from './components/product-list-page/product-list-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { RatingPipe } from './pipes/rating.pipe';
import { ZipperPipe } from './pipes/zipper.pipe';
import { SharedModule } from '../shared-module/shared.module';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { AnimationModule } from '../animation-module/animation.module';

@NgModule({
  declarations: [
    ProductsRootComponent,
    SingleProductComponent,
    ProductSliderComponent,
    ImageSliderComponent,
    ProductListComponent,
    ProductListPageComponent,
    ProductDetailComponent,
    RatingPipe,
    ZipperPipe,
  ],

  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    AnimationModule,
  ],

  exports: [ProductSliderComponent,ZipperPipe]
})
export class ProductsModule { }
