import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './additional.service'
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AutoService {

  constructor(
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private rout: Router) {
    }

  isBusyEmail = this.firebaseAuth.auth.fetchProvidersForEmail

  isLogined = new BehaviorSubject<boolean>(null);
  invalidMessage: string

  signIn(formValue: { email: string, password: string }): void {

    this.firebaseAuth.auth.signInWithEmailAndPassword(formValue.email, formValue.password)
      .then(value => {
        console.log("Succses", value)
        this.rout.navigate(['products'])

      }).catch(err => {
        console.log("rejected", err)
        this.isLogined.next(false)
      })

  }



  signUp(formValue: User) {

    return this.firebaseAuth.auth.createUserWithEmailAndPassword(formValue.email, formValue.password)
      .then(result => {

        result.user.updateProfile({ displayName: formValue.firstName, photoURL: '' })
          .then(() => {
            this.db.collection('users').doc(result.user.uid).set({
              firstName: formValue.firstName,
              lastName: formValue.lastName,
              email: formValue.email,
              creditCard: [],
            }).then(_ => {
              this.firebaseAuth.auth.currentUser.sendEmailVerification().then(console.log).catch(console.log)   // .languageCode = 'fr';
              this.firebaseAuth.auth.signOut().then(res => console.log("sign outed")).catch(console.log)
            })
          }).catch(console.log);

      }, (err => { console.log(err); this.invalidMessage = 'AR'; })).catch(console.log)

  }

} 