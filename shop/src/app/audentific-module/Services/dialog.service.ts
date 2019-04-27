import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog, private firebaseAuth: AngularFireAuth) { }

  openSignUp(): void {
    this.firebaseAuth.auth.onAuthStateChanged((res) => {
      if(res){ this.clouseDialog() }
    })

    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '500px',
      autoFocus: true,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe();
    
  }

  openSignIn(): void {
    this.firebaseAuth.auth.onAuthStateChanged((res) => {
      if(res){ this.clouseDialog() }
    })

    const dialogRef = this.dialog.open(SignInComponent, {
      height: '480px',
      autoFocus: true,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe();
  }
 
  clouseDialog(): void {
    this.dialog.closeAll()
  }

}