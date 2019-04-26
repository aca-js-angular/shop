import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsRootComponent } from './products-root/products-root.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { ProductSliderComponent } from './product-slider/product-slider.component';
import { ImageSliderComponent } from './image-slider/image-slider.component'
import { ProductListComponent } from './product-list/product-list.component';
import { ProductListPageComponent } from './product-list-page/product-list-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RatingPipe } from './rating.pipe';
import { ZipperPipe } from './zipper.pipe';
import { SharedModule } from '../shared-module/shared.module';

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
  ],

  exports: [ProductSliderComponent,ZipperPipe]
})
export class ProductsModule { }
