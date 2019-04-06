import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductItemComponent } from '../product-item/product-item.component'
import { ProductsComponent } from '../products/products.component'
 
const routes: Routes = [ 
  { path: 'products', component: ProductsComponent },
  { path: 'products:id', component: ProductItemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
   