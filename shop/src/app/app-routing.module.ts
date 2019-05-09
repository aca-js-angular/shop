import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkingWithDbComponent } from './root-components/working-with-db/working-with-db.component'
import { NotFoundComponent } from './root-components/not-found/not-found.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'basket', loadChildren: './basket-module/basket.module#BasketModule'},
  {path: 'db', component: WorkingWithDbComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
