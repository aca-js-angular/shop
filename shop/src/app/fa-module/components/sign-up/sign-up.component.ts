import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { FaService } from '../../services/fa.service';
import { switchMap, map, tap, delay } from 'rxjs/operators';
import { _password , _passConfirm} from '../../../validators/root/custom-validators'
import { FormControlService } from 'src/app/form-control.service';
import { MatDialogRef } from '@angular/material';
import { AngularFireUploadTask, AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss','../dialog-main.scss']
})


export class SignUpComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SignUpComponent>,
    public formBuilder: FormBuilder,
    public router: Router,
    private fa: FaService,
    private fireAuth: AngularFireAuth,
    private control: FormControlService,
    private storage: AngularFireStorage,
  ) {}

  
  /* --- Variables --- */

  currentImg: File;

  destroyStream = new Subject<void>()

  submitted: boolean;
  busyEmail: boolean;
  hidePassword: boolean = true

  registerForm: FormGroup = this.formBuilder.group({

    firstName: ['', [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(2)
    ]],

    lastName: ['', [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(2)
    ]],

    country: ['',Validators.required],
    city: ['',Validators.required],

    email: ['', [
      Validators.required,
      Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
    ],this.isBusyEmail.bind(this)],

    password: ['', [
      Validators.required,
      Validators.minLength(8),
      _password
    ]],

    passwordConfirm: [''],

  })



  /* --- Getters --- */

  get firstName(): FormControl {
    return this.registerForm.get('firstName') as FormControl
  }
  get lastName(): FormControl {
    return this.registerForm.get('lastName') as FormControl
  }
  get country(): FormControl {
    return this.registerForm.get('country') as FormControl
  }
  get city(): FormControl {
    return this.registerForm.get('city') as FormControl
  }
  get email(): FormControl {
    return this.registerForm.get("email") as FormControl
  }
  get pass(): FormControl {
    return this.registerForm.get("password") as FormControl
  }
  get passConfirm(): FormControl {
    return this.registerForm.get("passwordConfirm") as FormControl
  }

  get controlArray(): FormControl[] {
    return [this.firstName,this.lastName,this.email,this.pass,this.passConfirm]
  }

  get isShownError(): boolean {
    return !!this.firstNameError || !!this.lastNameError || !!this.emailError || !!this.emailAsyncError || !!this.passError || !!this.passConfirmError
  }



  get firstNameError(): string | null {
    return this.firstName.touched && this.control.getErrorMessage(this.firstName)
  }
  get lastNameError(): string | null {
    return this.lastName.touched && this.control.getErrorMessage(this.lastName)
  }
  get countryError(): string | null {
    return this.country.touched && this.control.getErrorMessage(this.country)
  }
  get cityError(): string | null {
    return this.city.touched && this.control.getErrorMessage(this.city)
  }
  get emailError(): string | null {
    return this.email.touched && this.control.getErrorMessage(this.email,'invalid-email')
  }
  get emailAsyncError(): boolean {
    return this.email.hasError('_async')
  }
  get passError(): string | null {
      return this.pass.touched && this.control.getErrorMessage(this.pass)
  }
  get passConfirmError(): string | null {
    return this.passConfirm.touched && this.control.getErrorMessage(this.passConfirm)
  }

  get safetyState(): {safety: string, color : string} {
    return this.control.getPasswordSafety(this.pass)
  }

  /* --- Methods --- */

  prevent(): false {
    return false;
  }

  toSignIn(){
    this.dialogRef.close({to: 'sign-in'})
  }

  showBusyEmailError(isBusy: boolean){
    if(isBusy){
      this.email.markAsTouched();
      let sbcr = this.email.valueChanges.subscribe(_ => {
        this.email.markAsUntouched();
        sbcr.unsubscribe();
      })
    }
  }

  isBusyEmail(control: FormControl): Observable<ValidationErrors | null> {

    return of(control.value).pipe(
      
      delay(800),
      switchMap(email => this.fireAuth.auth.fetchSignInMethodsForEmail(email)),
      map(isBusy => isBusy.length ? {_async: { message: 'This email was already registered' }} : null),
      tap(isBusy => this.showBusyEmailError(!!isBusy))
      
    )

  }

  onSubmit(){
    if(this.registerForm.invalid){
      for(let control in this.registerForm.controls){
        this.registerForm.controls[control].markAsTouched();
      }
      return
    }
    this.register();
  }


  register() {
    this.submitted = true;
    this.upload().then(imgUrl => {
      this.fa.signUp(this.registerForm.value,imgUrl)
      .then(_ => {
        this.submitted = false;
        this.toSignIn();
      })
    })
  }


  apply(event, preview: HTMLImageElement){

    this.currentImg = event.target.files[0];
    if(!this.currentImg)return;
    let imgReader = new FileReader();
    imgReader.readAsDataURL(this.currentImg)
    imgReader.onload = function(event){
      preview.src = event.target['result']
    }

  }

  upload(): Promise<string> {
    return new Promise(resolve => {
      const storageRef: AngularFireStorageReference = this.storage.ref('profile-images');
      const uploadTask: AngularFireUploadTask = storageRef.child(`${this.email.value}`).put(this.currentImg);
      uploadTask.then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
          resolve(url);
        }) 
      })
    })
  }


  /* --- LC hooks --- */

  ngOnInit() {
    this.passConfirm.setValidators([_passConfirm(this.pass),Validators.required])
  }

  ngOnDestroy() {
    this.destroyStream.next()
  }

}

