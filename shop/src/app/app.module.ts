import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ProductsModule } from './products-module/products.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutComponent } from './about/about.component';
// import { AudentificModule } from './audentific-module/audentific.module'; // leazy load


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    NotFoundComponent,
    AboutComponent,
    
  ], 
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProductsModule,
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
