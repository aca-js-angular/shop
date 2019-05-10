import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule, MatProgressSpinnerModule, MatProgressBarModule, MatBadgeModule, ErrorStateMatcher } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms'

import { HomeModule } from './home-module/home.module';
import { ProductsModule } from './products-module/products.module'

import { AppComponent } from './root-components/root/app.component';
import { HeaderComponent } from './root-components/header/header-main/header.component';
import { FooterComponent } from './root-components/footer/footer.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth'

import { MatButtonModule, MatIconModule, MatRippleModule } from "@angular/material";
import { WorkingWithDbComponent } from './root-components/working-with-db/working-with-db.component';
import { SearchComponent } from './root-components/search/search.component';
import { SingleResultComponent } from './root-components/search/single-result/single-result.component';
import { SharedModule } from './shared-module/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './root-components/not-found/not-found.component';
import { AnimationModule } from './animation-module/animation.module';
import { FaModule } from './fa-module/fa.module';
import { MessengerModule } from './messenger-module/messenger.module';
import { HeaderNotFoundComponent } from './root-components/header/header-not-found/header-not-found.component';
import { HeaderCheckoutComponent } from './root-components/header/header-checkout/header-checkout.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    WorkingWithDbComponent,
    SearchComponent,
    SingleResultComponent,
    NotFoundComponent,
    HeaderNotFoundComponent,
    HeaderCheckoutComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    ReactiveFormsModule,
    MatTooltipModule,
    MatBadgeModule,
    HttpClientModule,
    HomeModule,
    ProductsModule,
    SharedModule,
    AnimationModule,
    MessengerModule,

    
    FaModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatBadgeModule,
    AppRoutingModule,


    

  ],

  bootstrap: [AppComponent],
})
export class AppModule { }
