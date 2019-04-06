import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { ProductItemComponent } from './product-item/product-item.component'
import { HttpClientModule } from '@angular/common/http';
import { SearchPipe } from './Pipes/optional.pipe'
import { NameFormatPipe } from './Pipes/optional.pipe';
import { AboutProductComponent } from './about-product/about-product.component'
import { ProductsControlService } from './Services/products-control.service'
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductItemComponent,

    NameFormatPipe,
    SearchPipe,
    AboutProductComponent,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [ProductsControlService],
  exports: [ ProductsComponent, ProductItemComponent ]
})
export class ProductsModule { }
