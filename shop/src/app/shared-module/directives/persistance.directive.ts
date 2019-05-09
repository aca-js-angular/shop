import { Directive, Input, HostListener, ViewContainerRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { OpenDialogService } from 'src/app/fa-module/services/open-dialog.service';

@Directive({
  selector: '[_persistance]'
})
export class PersistanceDirective {

  @Input('_persistance') callback: Function;

  constructor(
    private fireAuth: AngularFireAuth,
    private dialog: OpenDialogService,
    private viewRef: ViewContainerRef,
  ){}

  @HostListener('click')onClick(){

    const currentUser = this.fireAuth.auth.currentUser

    if(currentUser){
      const hostComponent = this.viewRef['_view'].component
      this.callback.call(hostComponent,currentUser)
    }else{
      this.dialog.openSignIn()
    }
    
  }

}
