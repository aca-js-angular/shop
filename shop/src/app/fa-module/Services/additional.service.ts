import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AdditionalService {

  constructor(private firebaseAuth: AngularFireAuth) { }

  deleteCurrentUser() {
    this.firebaseAuth.auth.currentUser.delete().catch()
  }

  sendEmailVerifResetPass(email: string): Promise<void> {
    return this.firebaseAuth.auth.sendPasswordResetEmail(email).catch()
  }

  rememberMy(): Promise<void>{
   return this.firebaseAuth.auth.setPersistence('session').catch(); 
  }

  autoState(): Promise<{uid: string} | null> {
    return new Promise(resolve => {
       this.firebaseAuth.auth.onAuthStateChanged((user)=> {
         user ? resolve({ uid: user.uid }) : resolve(null);
       })
    })
  }


  signOut(): Promise<void> {
   return this.firebaseAuth.auth.signOut();
  } 



}