import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  constructor(private firebaseAuth: AngularFireAuth, private http: HttpClient) {
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

  getCountrys<T>(url = 'https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/6ee538beca8914133259b401ba47a550313e8984/countries.min.json'): Observable<T>{
    return this.http.get<T>(url)
  }
      

}