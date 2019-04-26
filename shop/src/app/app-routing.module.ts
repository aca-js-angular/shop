import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkingWithDbComponent } from './root-components/working-with-db/working-with-db.component'

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'db', component: WorkingWithDbComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
