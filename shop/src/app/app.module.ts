import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms'
import { AppComponent } from './root-components/app-root/app.component';
import { HeaderComponent } from './root-components/header/header-main/header.component';
import { FooterComponent } from './root-components/footer/footer-main/footer.component';
import { WorkingWithDbComponent } from './root-components/working-with-db/working-with-db.component';
import { SearchComponent } from './root-components/search/search.component';
import { SingleResultComponent } from './root-components/search/single-result/single-result.component';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './root-components/not-found/not-found.component';
import { HeaderNotFoundComponent } from './root-components/header/header-not-found/header-not-found.component';
import { HeaderCheckoutComponent } from './root-components/header/header-checkout/header-checkout.component';
import { ProjectMainModules, FireBaseModules, MaterialDesignModules } from './useds-modules';
import { CategoryPanelComponent } from './root-components/category-panel/category-panel.component';
import { FooterBasketComponent } from './root-components/footer/footer-basket/footer-basket.component';
import { HeaderDbComponent } from './root-components/header/header-db/header-db.component';
import { FooterDbComponent } from './root-components/footer/footer-db/footer-db.component';
import { HashLocationStrategy, LocationStrategy, APP_BASE_HREF } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderCheckoutComponent,
    HeaderNotFoundComponent,
    FooterComponent,
    FooterBasketComponent,
    WorkingWithDbComponent,
    SearchComponent,
    SingleResultComponent,
    NotFoundComponent,
    CategoryPanelComponent,
    HeaderDbComponent,
    FooterDbComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
    ...ProjectMainModules,
    ...FireBaseModules,
    ...MaterialDesignModules,

    AppRoutingModule,
    
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],

  bootstrap: [AppComponent],
})
export class AppModule { }
