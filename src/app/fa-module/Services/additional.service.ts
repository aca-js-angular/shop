import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AdditionalService {
  routRedirectUrl: string;
  
  constructor(private firebaseAuth: AngularFireAuth) { }

  

  autoState(): Promise<{uid: string, displayName: string} | null> {
    return new Promise(resolve => {
       this.firebaseAuth.auth.onAuthStateChanged((user)=> {
         user ? resolve({ uid: user.uid, displayName: user.displayName }) : resolve(null);
       })
    })
  }



}