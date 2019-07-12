
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { User } from '../../interfaces/user.interface'
import { Order } from 'src/app/interfaces/order.interface';
import { AngularFireDatabase } from '@angular/fire/database';
import { BAD_FORMAT, WRONG_EMAIL, WRONG_PASSWORD } from 'src/app/constants/sign-in-errors.constant';
import { __randomNumber } from '../../root-components/working-with-db/helper-functions.ts/root';
import { Review } from 'src/app/interfaces/review.interface';
import { Observable } from 'rxjs';
import { EMPTY_USER_IMG } from 'src/app/constants/default-images';

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
    let currentUserUid: string;
    let firstInit: boolean = false;
    
    this.firebaseAuth.auth.onAuthStateChanged((currentUser)=>{
      if(currentUser){

        firstInit = true;
        currentUserUid = currentUser.uid;
        this.realTimeDb.object(`users/${currentUserUid}/`).update({isOnline: true})
      } else if(!currentUser && firstInit){
        this.realTimeDb.object(`users/${currentUserUid}/`).update({isOnline: false});
        firstInit = false;
        currentUserUid = '';
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

  signUp(input: User, imgUrl: string = EMPTY_USER_IMG): Promise<void> {
    return new Promise(done => {
      this.firebaseAuth.auth.createUserWithEmailAndPassword(input.email, input.password)
      .then(result => {
        this.firebaseAuth.auth.currentUser.sendEmailVerification()

        this.realTimeDb.list('users').set(result.user.uid, {
          fullName: `${input.firstName} ${input.lastName}`,
          photoUrl: imgUrl,
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
            rating: 0,
            img: imgUrl,
            registeredDate: new Date(),
            reviews: [] as Review[],
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

  get authState(): Observable<any>{
    return this.firebaseAuth.authState;
  }



} 

