import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products-module/products/products.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component'
import { AboutProductComponent } from './products-module/about-product/about-product.component'


const routes: Routes = [ 
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'SignIn' , loadChildren: './audentific-module/audentific.module#AudentificModule' }, // загружает модуль;
  { path: 'products', component: ProductsComponent, children: [
    { path: 'number', component: AboutProductComponent} // avelacnel number:id - n
  ]},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  // { path: 'SignUp', component: rafo },
  { path: '**', component: NotFoundComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
                                        