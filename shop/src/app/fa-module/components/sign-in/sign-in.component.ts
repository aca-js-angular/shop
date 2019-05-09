
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FaService } from '../../services/fa.service'
import { MatDialogRef } from '@angular/material';
import { trigger, transition, style, animate } from '@angular/animations';


const REQUIRED: string = 'Both email and password are required';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss','../dialog-main.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(-100%)', opacity: 0.4}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(-100%)', opacity: 0.4}))
        ])
      ]
    )
  ],
})

export class SignInComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private fb: FormBuilder,
    private fa: FaService,
    private dialogRef: MatDialogRef<SignInComponent>,
  ){}

  /* --- Variables --- */


  loggingIn: boolean = false;
  rememberMe: FormControl = new FormControl(false)

  signInForm: FormGroup = this.fb.group({
    email: [''],
    password: [''],
  })
  
  nativeEmail: HTMLInputElement;
  nativePassword: HTMLInputElement;

  hidePassword: boolean = true;
  notification: string = null;
    

  /* --- Getters --- */

  get email(): string {
    return this.signInForm.get('email').value
  }
  get password(): string {
    return this.signInForm.get('password').value
  }

  /* --- Methods --- */

  prevent(): false {
    return false
  }

  setNotification(content: string){
    if(this.notification)return;
    this.notification = content;
    setTimeout(() => this.notification = null,5000)
  }


  /* --- reality imitation purposes only, let progress bar load some time untill signing in --- */

  handleSignIn(){
    if(!this.email){
      this.nativeEmail.focus();
      this.setNotification(REQUIRED)
    }
    else if(this.email && !this.password){
      this.nativePassword.focus();
      this.setNotification(REQUIRED)
    }
    else{
      this.fa.signIn(this.email,this.password,this.rememberMe.value)
      .then(_ => {
        this.loggingIn = true;
        this.setNotification('Logging in...')
        setTimeout(() => this.dialogRef.close(),3500)  /* --- realistic imitation purposes only --- */
      })
      .catch(message => this.setNotification(message))
    }

  }


  toSignUp(){
    this.dialogRef.close({to:'sign-up'});
  }

  toResetPassword(){
    this.dialogRef.close({to: 'reset-pass'})
  }


  /* --- LC hooks --- */

  ngOnInit(){}
  ngOnDestroy(){}


  @ViewChild('emailRef') emailRef: ElementRef;
  @ViewChild('passwordRef') passwordRef: ElementRef;
  ngAfterViewInit(){
    this.nativeEmail = this.emailRef.nativeElement;
    this.nativePassword = this.passwordRef.nativeElement;
  }
}