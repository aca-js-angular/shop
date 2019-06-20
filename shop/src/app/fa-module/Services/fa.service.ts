
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { User } from '../../interfaces/user.interface'
import { Order } from 'src/app/interfaces/order.interface';
import { AngularFireDatabase } from '@angular/fire/database';
import { BAD_FORMAT, WRONG_EMAIL, WRONG_PASSWORD } from 'src/app/constants/sign-in-errors.constant';
import { AdditionalService } from './additional.service';

/* --- Sign-in errors --- */

@Injectable({
  providedIn: 'root'
})

export class FaService {
  currentUserUid: string;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private db: DatabaseFireService,
    private realTimeDb: AngularFireDatabase,

  ) {
    this.firebaseAuth.auth.onAuthStateChanged((currentUser)=>{
      
      if(currentUser){
        this.currentUserUid = currentUser.uid;
        this.realTimeDb.object(`users/${this.currentUserUid}/`).update({isOnline: true})
      } else {
        this.realTimeDb.object(`users/${this.currentUserUid}/`).update({isOnline: false});
      }
    })
  }
  
  /* --- Sign In ---- */

  signIn(email: string, password: string, rememberMe: boolean): Promise<string | void> {

    return new Promise((resolve,reject) => {
      this.firebaseAuth.auth.signInWithEmailAndPassword(email,password)
      .then(_ => {
        if(rememberMe){
          resolve();
        }else{
          this.firebaseAuth.auth.setPersistence('session').then(_ => resolve());
        }
      })
      .catch(error => {
        switch(error.code){
          case 'auth/invalid-email':
            reject(BAD_FORMAT);
            break;
          case 'auth/user-not-found':
            reject(WRONG_EMAIL);
            break;
          case 'auth/wrong-password':
            reject(WRONG_PASSWORD)
        }
      })
    })
  }


  /* --- Sign Up --- */

  signUp(input: User, imgUrl: string): Promise<void> {
    return new Promise(done => {
      this.firebaseAuth.auth.createUserWithEmailAndPassword(input.email, input.password)
      .then(result => {
        this.firebaseAuth.auth.currentUser.sendEmailVerification()

        this.realTimeDb.list('users').set(result.user.uid, {
          fullName: `${input.firstName} ${input.lastName}`,
          photoUrl: '',
        })

        this.signOut()
        .then(_ => result.user.updateProfile({displayName: input.firstName, photoURL: imgUrl}))
        .then(_ => {
          this.db.postDataWithId<User>('users', result.user.uid, {
            firstName: input.firstName,
            lastName: input.lastName,
            country: input.country,
            city: input.city,
            email: input.email,
            credit: [] as Order[],
          })
        }).then(_ => done())
      })
    })
  }

  
  /* --- Additional --- */

  signOut(): Promise<void>{ 
    return this.firebaseAuth.auth.signOut()
  }

  resetPass(email: string): Promise<void> {
    return this.firebaseAuth.auth.sendPasswordResetEmail(email)
  }

  deactivateAccount(): Promise<void> {
    return this.firebaseAuth.auth.currentUser.delete()
  }

  get currentUser(): null | any {
    return this.firebaseAuth.auth.currentUser
  }



} 