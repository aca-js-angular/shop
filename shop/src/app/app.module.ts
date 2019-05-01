import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule, MatProgressSpinnerModule, MatProgressBarModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms'

import { HomeModule } from './home-module/home.module';
import { ProductsModule } from './products-module/products.module'
import { BasketModule } from './basket-module/basket.module'

import { AppComponent } from './root-components/root/app.component';
import { HeaderComponent } from './root-components/header/header.component';
import { FooterComponent } from './root-components/footer/footer.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AudentificModule } from './fa-module/fa.module';

import { MatButtonModule, MatIconModule, MatRippleModule } from "@angular/material";
import { ConfirmModule } from './comfirm-module/confirm.module';
import { WorkingWithDbComponent } from './root-components/working-with-db/working-with-db.component';
import { SearchComponent } from './root-components/search/search.component';
import { SingleResultComponent } from './root-components/search/single-result/single-result.component';
import { SharedModule } from './shared-module/shared.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    WorkingWithDbComponent,
    SearchComponent,
    SingleResultComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    ReactiveFormsModule,
    MatTooltipModule,
    AppRoutingModule,
    HttpClientModule,

    HomeModule,
    ProductsModule,
    BasketModule,
    SharedModule,

    AudentificModule,
    ConfirmModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatProgressBarModule

  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
