import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

export type UDataType = {
  uid: string
  displayName: string
}

@Injectable({
  providedIn: 'root'
})

export class AdditionalService {
  
  routRedirectUrl: string;

  $autoState = new BehaviorSubject<UDataType>(null);

  constructor(private firebaseAuth: AngularFireAuth) {
    this.firebaseAuth.auth.onAuthStateChanged((user) => {
      user ? this.$autoState.next({ uid: user.uid, displayName: user.displayName })
        : this.$autoState.next(null);
    })
  }


  autoState(): Promise<UDataType | null> {
    return new Promise(resolve => {
      this.firebaseAuth.auth.onAuthStateChanged((user) => {
        user ? resolve({ uid: user.uid, displayName: user.displayName }) : resolve(null);
      })
    })
  }



}