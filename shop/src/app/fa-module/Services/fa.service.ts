
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { User } from '../../interfaces/user.interface'
import { Order } from 'src/app/interfaces/order.interface';
import { AngularFireDatabase } from '@angular/fire/database';

const WELLCOM_MESSAGE_CHAT: string = 'Hello wellcome to Mod-Concept'


/* --- Sign-in errors --- */

const WRONG_EMAIL: string = 'This emial is not registered, sign it up.'
const BAD_FORMAT: string = 'Email adress is badly formatted.'
const WRONG_PASSWORD: string = 'Password is incorrect, try again or reset it.'

@Injectable({
  providedIn: 'root'
})
export class FaService {

  constructor(
    private firebaseAuth: AngularFireAuth,
    private db: DatabaseFireService,
    private realTimeDb: AngularFireDatabase,
  ) {}


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

  signUp(input: User): Promise<void> {
    return new Promise(done => {
      this.firebaseAuth.auth.createUserWithEmailAndPassword(input.email, input.password)
      .then(result => {
        this.firebaseAuth.auth.currentUser.sendEmailVerification()

          this.realTimeDb.list('users').set(result.user.uid, {
            fullName: `${input.firstName} ${input.lastName}`,
            photoUrl: '',
          })

        this.signOut()
        .then(_ => result.user.updateProfile({displayName: input.firstName}))
        .then(_ => {
          this.db.postDataWithId('users', result.user.uid, {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            credit: [] as Order[],
          })
        }).then(_ => {
            done()
          })
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



} 