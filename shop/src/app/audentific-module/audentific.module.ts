import { NgModule, ModuleWithProviders, ModuleWithComponentFactories } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { Routes, RouterModule } from '@angular/router';
import { AutoService } from './Services/audentific.service';
import { MatDialogModule, MatButtonModule, MatCheckboxModule, MatSelectModule } from '@angular/material';
import { DialogService } from './Services/dialog.service';
import { SharedModule } from '../shared-module/shared.module';


const routes: Routes = [
//  { path: 'SignIn', component: SignInComponent },
//  { path: 'SignUp', component: SignUpComponent},
];
  

@NgModule({
  declarations: [ 
    SignInComponent, SignUpComponent,
   ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule, 
    RouterModule.forChild(routes),
    SharedModule,
    
    MatDialogModule,  
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,

  ],
  entryComponents: [SignInComponent, SignUpComponent],
})

export class AudentificModule {}  // Что делает этот метод, так это то, что он возвращает модуль плюс поставщиков, которые нам нужны, но поскольку имя метода - forRootAngular, он будет знать, как его использовать: он создаст контекст модуля и службы, объявленные в поставщиках.
  // static forRoot(): DeclareFunctionStm {
  //   return { // Но когда мы импортируем SharedModuleв HomeModuleбез использования forRoot, он будет обрабатывать только сам модуль. SharedModuleне будет иметь никакой информации о поставщиках, и поэтому не будет создавать копию AuthenticationService.
  //     ngModule: AudentificModule,
  //     providers: [ AutoService, ],
  //   }
  // }


// cpti elni provayderneri mej vor global 1 hat elni voste amen meki hamar arandzin'


// https://blog.angular-university.io/angular2-ngmodule/
// https://angular-2-training-book.rangle.io/handout/modules/feature-modules.html
