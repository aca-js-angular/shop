import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, CanLoad, Router, Route } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { OpenDialogService } from 'src/app/fa-module/services/open-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class FaGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private auth: AdditionalService,
    private router: Router,
    private authDialog: OpenDialogService
     ) { }

  canActivate(

    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    let url: string = state.url;
    return this.navigateToBasket(url) as Promise<boolean>;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state)
  }

  canLoad(route: Route): Promise<boolean> {
    let url = `/${route.path}`;
  
    return this.navigateToBasket(url);
  }

  

  navigateToBasket(url: string): Promise<boolean> {
    return new Promise(resolve => {
      this.auth.autoState().then(udata => {
        if (udata) { resolve(true) }
        else {
          resolve(false);
          this.router.navigate(['../']);
          this.auth.routRedirectUrl = url;
          this.authDialog.openSignIn();

          // let redirect = this.auth.routRedirectUrl ? this.router.parseUrl(this.auth.routRedirectUrl) : '/basket';
          // Redirect the user
          // this.router.navigateByUrl(redirect);
        }
      }) // open popup
    })
  }
}
