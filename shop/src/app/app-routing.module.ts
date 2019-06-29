import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkingWithDbComponent } from './root-components/working-with-db/working-with-db.component'
import { NotFoundComponent } from './root-components/not-found/not-found.component';
import { FaGuard } from './fa-module/guards/activate.guard';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},

  /* --- Lazy Loading Routes --- */
  {path: 'basket', canLoad: [FaGuard], loadChildren: './basket-module/basket.module#BasketModule'},
  {path: 'profile/:uid', loadChildren: './profile-module/profile.module#ProfileModule'},
  
  {path: 'db', component: WorkingWithDbComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


// class AppModule {
//   constructor(router: Router, viewportScroller: ViewportScroller) {
//     router.events.pipe(
//       filter((e: Event): e is Scroll => e instanceof Scroll)
//     ).subscribe(e => {
//       if (e.position) {
//         // backward navigation
//         viewportScroller.scrollToPosition(e.position);
//       } else if (e.anchor) {
//         // anchor navigation
//         viewportScroller.scrollToAnchor(e.anchor);
//       } else {
//         // forward navigation
//         viewportScroller.scrollToPosition([0, 0]);
//       }
//     });
//   }
// }
