import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkingWithDbComponent } from './root-components/working-with-db/working-with-db.component'
import { NotFoundComponent } from './root-components/not-found/not-found.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'db', component: WorkingWithDbComponent},
  {path: 'aa', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
