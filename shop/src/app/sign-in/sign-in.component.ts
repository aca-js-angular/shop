import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SignInService } from '../Services/SignIn/sign-in.service'
import { takeUntil, distinctUntilChanged, switchMap, debounceTime, map, debounce } from 'rxjs/operators';
import { Subject, of, Observable, timer, from } from 'rxjs';
import { ProfileUsersService } from '../Services/UsersControl/profile-users.service'
import { AsyncValidator } from '../Validators/async-validator'


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {

  constructor(private usersService: ProfileUsersService, private formBuilder: FormBuilder, private signInService: SignInService) { }

  logInForm: AbstractControl;
  destroyStream = new Subject<void>();
  infoHide: boolean = false;
  info: string;

  ngOnInit() {

    this.logInForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.minLength(7),
        Validators.maxLength(18)
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(25)
      ]],
    })
    //--------Logined status---------------------

    this.signInService.isLogined.pipe(takeUntil(this.destroyStream))
      .subscribe(isLoginedStatus => {

        if (isLoginedStatus) {
          this.destroyStream.next() // vor login   task@ 1 angam asxti 1 hat {  } ta
          // ete chista inch ani ???? <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          // ....
          // ....
          // ....

        } else if (isLoginedStatus === false) {
          this.info = "Invalid Login or Password";
          this.infoHide = true;

        }
        console.log(isLoginedStatus);
      });

  }
  //-----------

  get email(): AbstractControl { return this.logInForm.get('email'); }
  get pass(): AbstractControl { return this.logInForm.get('password'); }

  logIn(): void {
    this.signInService.logInAccaunt(this.logInForm.value);
  }


  ngOnDestroy() {
    this.destroyStream.next();
  }
}//---------------------------------------------------------------------------------------------------------------------------------------------


