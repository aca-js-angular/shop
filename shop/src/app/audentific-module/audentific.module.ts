import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignInService } from './Services/SignIn/sign-in.service'
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: SignInComponent },
];


@NgModule({
  declarations: [ 
    SignInComponent,
   ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule, 
    RouterModule.forChild(routes)
  ],
  exports: [ SignInComponent ],
})

export class AudentificModule { // Что делает этот метод, так это то, что он возвращает модуль плюс поставщиков, которые нам нужны, но поскольку имя метода - forRootAngular, он будет знать, как его использовать: он создаст контекст модуля и службы, объявленные в поставщиках.
  static forRoot(): ModuleWithProviders {
    return { // Но когда мы импортируем SharedModuleв HomeModuleбез использования forRoot, он будет обрабатывать только сам модуль. SharedModuleне будет иметь никакой информации о поставщиках, и поэтому не будет создавать копию AuthenticationService.
      ngModule: AudentificModule,
      providers: [ SignInService ]
    }
  }
} 

// cpti elni provayderneri mej vor global 1 hat elni voste amen meki hamar arandzin'


// https://blog.angular-university.io/angular2-ngmodule/
// https://angular-2-training-book.rangle.io/handout/modules/feature-modules.html
