import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormValidators } from '../Validators/Form-validator'
import { SignInService } from '../Services/SignIn/sign-in.service'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
  
})
export class SignInComponent implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder, private signInService: SignInService) { }

  logInForm: AbstractControl;
  destroyStream = new Subject<void>();
  infoHide: boolean = false;
  info: string;
  // comfirmEmail: FormControl
  falseCount: number = 0;


  ngOnInit() {

    this.logInForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(28),

        FormValidators.email,
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
          this.falseCount < 6 ? this.falseCount++ : this.info = "You to spend all input attempts",this.infoHide = true
        }
        console.log(isLoginedStatus);
      });
// setTimeout(() => this.wait = true, 4000);
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


