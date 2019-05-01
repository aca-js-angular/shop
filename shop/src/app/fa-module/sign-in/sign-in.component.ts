import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AutoService } from '../Services/fa.service'
import { AdditionalService } from '../Services/additional.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CloseDialogService } from '../Services/close-dialog.service';

//--------Messages-----------
const RESET_PASS: string = 'Reset Password';
const RESET_PASS_CONF_MESSAGE: string = 'Reset link has been sent to your email';
const SIGN_IN: string = 'Sign in to continue';
const INVALID_EMAIL: string = 'Invalid Email address';
const VERIFY_EMAIL: string = 'Verify Your Addres';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']

})
export class SignInComponent implements OnInit, OnDestroy {

  constructor(
    private additionalFa: AdditionalService,
    private dialog: CloseDialogService,
    private formBuilder: FormBuilder,
    private autoService: AutoService,
    private additionalAuth: AdditionalService) { }

  destroySetram = new Subject<void>()
  logInForm: AbstractControl;
  infoHide: boolean = false;
  info: string;
  falseCount: number = 0;
  loginOrReset: string = 'Sign in to continue';
  invalidPassOrMail: boolean;
  resetEmailMessage: string = 'Verify your email addres'
  showResetPanel: boolean = true;
  awaitAnimation: boolean;
  showInvMessageSignIn: boolean;
  awaitSec: boolean;

  ngOnInit() {



    this.logInForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.maxLength(28),
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(25)
      ]],
    })

  }
  //-----------

  get email(): AbstractControl { return this.logInForm.get('email'); }
  get pass(): AbstractControl { return this.logInForm.get('password'); }
  closeDialog() { this.dialog.closeDialog() }

  resetPass(): void {
    this.showResetPanel = false;
    this.loginOrReset = RESET_PASS
    this.invalidPassOrMail = null;
  }

  sendLinkResetPass(): void {
    this.additionalAuth.sendEmailVerifResetPass(this.email.value).then(() => {
      this.loginOrReset = RESET_PASS_CONF_MESSAGE;
      this.logInForm.reset()
      this.showResetPanel = true;
      setTimeout(() => this.loginOrReset = SIGN_IN, 15000);
    }).catch(() => {
       this.resetEmailMessage = INVALID_EMAIL;
       setTimeout(() => this.resetEmailMessage = VERIFY_EMAIL, 5000);
    });

  }


  signIn(rememberState: boolean): void {
    this.autoService.signIn(this.logInForm.value);

    if (!rememberState) { this.additionalAuth.rememberMy(); }
    this.awaitAnimation = true;

    this.autoService.isLogined.pipe(takeUntil(this.destroySetram)).subscribe((result => {
      if(!this.invalidPassOrMail){ this.awaitSec = true }
      this.awaitAnimation = false;
      this.invalidPassOrMail = result;

      setTimeout(() => this.awaitSec = false, 2000);
    }))
  }

  ngOnDestroy(){
    this.destroySetram.next()
  }


  openSignUp(): void {
    //  this.additionalDialog.openSignUp()
    // this.dialog.openSignUp();
  }
}