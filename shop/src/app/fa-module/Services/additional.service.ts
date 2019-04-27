import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AdditionalService {

  constructor(private firebaseAuth: AngularFireAuth) { }

  deleteCurrentUser() {
    this.firebaseAuth.auth.currentUser.delete()
  }

  sendEmailVerifResetPass(email: string): Promise<void> {
    return this.firebaseAuth.auth.sendPasswordResetEmail(email)
  }

  rememberMy(): Promise<void>{
   return this.firebaseAuth.auth.setPersistence('session');
  }

  autoState(): Promise<{uid: string} | null> {
    return new Promise(resolve => {
       this.firebaseAuth.auth.onAuthStateChanged((user)=> {
         const uid = user.uid
        user ? resolve({uid}) : resolve(null);
       })
    })
  }


  signOut(): Promise<void> {
   return this.firebaseAuth.auth.signOut();
  } 



}

export interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  creditCard: string;
  password?: string;
  img?: string;
  optional: { city: string, gender: string }
}