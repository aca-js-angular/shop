
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { User } from '../../interfaces and constructors/user.interface'
import { Order } from 'src/app/interfaces and constructors/order.interface';



@Injectable({
  providedIn: 'root'
})
export class AutoService {

  constructor(
    private firebaseAuth: AngularFireAuth,
    private db: DatabaseFireService,
  ) {}

  isLogined = new Subject<boolean>();
  invalidMessage: string;


  signIn(formValue: { email: string, password: string }): void {
    
    this.firebaseAuth.auth.signInWithEmailAndPassword(formValue.email, formValue.password)
    .catch(_void => {
        this.isLogined.next(false)
      })

  }



  signUp(formValue: User) {

    return this.firebaseAuth.auth.createUserWithEmailAndPassword(formValue.email, formValue.password)
      .then(result => {

        result.user.updateProfile({ displayName: formValue.firstName})
          .then(_void => {
            this.db.postDataWithId('users',result.user.uid,{
              firstName: formValue.firstName,
              lastName: formValue.lastName,
              email: formValue.email,
              credit: [] as Order[],
            }).then(_ => {
              this.firebaseAuth.auth.currentUser.sendEmailVerification().catch(console.log)
              this.firebaseAuth.auth.signOut().catch()
            })
          }).catch();

      }, (err => { console.log(err)})).catch(console.log)

  }

} 