import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsRootComponent } from './components/products-root/products-root.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

const routes: Routes = [
  {path: 'products/category/:category', component: ProductsRootComponent},
  {path: 'products/brands/:brand', component: ProductsRootComponent},
  {path: 'products/:package', component: ProductsRootComponent},
  {path: 'product/:id', component: ProductDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
