import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { FaService } from '../../services/fa.service';
import { switchMap, map, tap, delay } from 'rxjs/operators';
import { _password, _passConfirm } from '../../../validators/root/custom-validators'
import { FormControlService } from 'src/app/form-control.service';
import { MatDialogRef } from '@angular/material';
import { AngularFireUploadTask, AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';
import { AdditionalService } from '../../services/additional.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../dialog-main.scss']
})


export class SignUpComponent implements OnInit {

  constructor(
    private additionalFa: AdditionalService,
    public dialogRef: MatDialogRef<SignUpComponent>,
    public formBuilder: FormBuilder,
    public router: Router,
    private fa: FaService,
    private fireAuth: AngularFireAuth,
    private control: FormControlService,
    private storage: AngularFireStorage,
  ) { }


  /* --- Variables --- */

  currentImg: File;

  destroyStream = new Subject<void>()
  ERROR_COLOR
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

    country: ['', Validators.required],
    city: ['', Validators.required],

    email: ['', [
      Validators.required,
      Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
    ], this.isBusyEmail.bind(this)],

    password: ['', [
      Validators.required,
      Validators.minLength(8),
      _password
    ]],

    passwordConfirm: [''],

  })



  /* --- Getters --- */

  get firstName(): AbstractControl {
    return this.registerForm.get('firstName')
  }
  get lastName(): AbstractControl {
    return this.registerForm.get('lastName')
  }
  get country(): AbstractControl {
    return this.registerForm.get('country')
  }
  get city(): AbstractControl {
    return this.registerForm.get('city')
  }
  get email(): AbstractControl {
    return this.registerForm.get("email")
  }
  get pass(): AbstractControl {
    return this.registerForm.get("password")
  }
  get passConfirm(): AbstractControl {
    return this.registerForm.get("passwordConfirm")
  }

  get controlArray(): AbstractControl[] {
    return [this.firstName, this.lastName, this.email, this.pass, this.passConfirm]
  }

  get isShownError(): boolean {
    return !!this.firstNameError || !!this.lastNameError || !!this.emailError || !!this.emailAsyncError || !!this.passError || !!this.passConfirmError
  }



  get firstNameError(): string {
    return this.firstName.touched && this.control.getErrorMessage(this.firstName)
  }
  get lastNameError(): string {
    return this.lastName.touched && this.control.getErrorMessage(this.lastName)
  }
  get countryError(): string  {
    return this.country.touched && this.control.getErrorMessage(this.country)
  }
  get cityError(): string  {
    return this.city.touched && this.control.getErrorMessage(this.city)
  }
  get emailError(): string  {
    return this.email.touched && this.control.getErrorMessage(this.email, 'invalid-email')
  }
  get emailAsyncError(): boolean {
    return this.email.hasError('_async')
  }
  get passError(): string  {
    return this.pass.touched && this.control.getErrorMessage(this.pass)
  }
  get passConfirmError(): string  {
    return this.passConfirm.touched && this.control.getErrorMessage(this.passConfirm)
  }

  get safetyState(): { safety: string, color: string } {
    return this.control.getPasswordSafety(this.pass)
  }

  /* --- Methods --- */

  prevent(): false {
    return false;
  }

  toSignIn() {
    this.dialogRef.close({ to: 'sign-in' })
  }

  showBusyEmailError(isBusy: boolean) {
    if (isBusy) {
      this.email.markAsTouched();
      let sbcr = this.email.valueChanges.subscribe(_ => {
        this.email.markAsUntouched();
        sbcr.unsubscribe();
      })
    }
  }

  isBusyEmail(control: AbstractControl): Observable<ValidationErrors > {

    return of(control.value).pipe(

      delay(500),
      switchMap(email => this.fireAuth.auth.fetchSignInMethodsForEmail(email)),
      map(isBusy => isBusy.length ? { _async: { message: 'This email was already registered' } } : null),
      tap(isBusy => this.showBusyEmailError(!!isBusy))

    )

  }

  onSubmit() {
    if (this.registerForm.invalid) {
      for (let control in this.registerForm.controls) {
        this.registerForm.controls[control].markAsTouched();
      }
      return
    }
    this.register();
  }


  register() {
    this.registerForm.patchValue({
      country: this.countries[this.registerForm.get('country').value][0],
      city: this.cities[this.registerForm.get('city').value]
    })

    this.submitted = true;
    this.upload().then(imgUrl => {
      this.fa.signUp(this.registerForm.value, imgUrl)
        .then(_ => {
          this.submitted = false;
          this.toSignIn();
        })
    })
  }


  apply(event, preview: HTMLImageElement) {

    this.currentImg = event.target.files[0];
    if (!this.currentImg) return;
    let imgReader = new FileReader();
    imgReader.readAsDataURL(this.currentImg)
    imgReader.onload = function (event) {
      preview.src = event.target['result'];
    }

  }

  upload(): Promise<string> {
    return new Promise(resolve => {

      if(!this.currentImg){
        resolve(); // empty img
      }

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
  countries: [string, string[]][];
  cities: string[];

  ngOnInit() {

    this.registerForm.get('country').valueChanges.subscribe(next => {
    if(!this.countries[next]) return;
      this.cities = this.countries[next][1];
      this.registerForm.get('city').setValue(0)
    })


    this.additionalFa.getCountrys().subscribe(data => {
        this.countries = Object.entries(data)
        this.registerForm.get('country').setValue(7) // Armenia by default
      })



    this.passConfirm.setValidators([_passConfirm(this.pass), Validators.required])
  }

  ngOnDestroy() {
    this.destroyStream.next()
  }

}

