import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeRootComponent } from './components/home-root/home-root.component';

const routes: Routes = [
  {path: 'home', component: HomeRootComponent},
  {path: 'registered', component: HomeRootComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
