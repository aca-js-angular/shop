import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AutoService } from '../Services/fa.service';
import { takeUntil, switchMap, map, debounceTime, tap } from 'rxjs/operators';
import { CloseDialogService } from '../Services/close-dialog.service';
import { AdditionalService } from '../Services/additional.service';
import { _password , _passConfirm} from '../../validators/root/custom-validators'
import { FormControlService } from 'src/app/form-control.service';

// const Validation = new FormValidators()

//--------Messages-----------

const CREATE_ACCOUNT: string = 'Create Account';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {

  constructor(
    private dialog: CloseDialogService,
    public formBuilder: FormBuilder,
    public router: Router,
    private autoService: AutoService,
    private fireAuth: AngularFireAuth,
    private control: FormControlService
  ) { }

  /* --- Variables --- */

  destroyStream = new Subject<void>()
  info: string = CREATE_ACCOUNT;
  awaitAnimation: boolean;
  emailAwiitIsBusyAnime: boolean;
  busyEmail: boolean;



  profileForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2)]],

    email: ['', [
      Validators.required,
      Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
    ],
      [this.isBusyEmail.bind(this)]
    ],
    password: ['', [Validators.required,Validators.minLength(8),_password]],
    passwordConfirm: ['',[]]

  })



  /* --- Getters --- */

  get firstName(): FormControl {
    return this.profileForm.get('firstName') as FormControl
  }
  get lastName(): FormControl {
    return this.profileForm.get('lastName') as FormControl
  }
  get email(): FormControl {
    return this.profileForm.get("email") as FormControl
  }
  get pass(): FormControl {
    return this.profileForm.get("password") as FormControl
  }
  get passConfirm(): FormControl {
    return this.profileForm.get("passwordConfirm") as FormControl
  }


  get firstNameError(): string | null {
    return this.firstName.touched && this.control.getErrorMessage(this.firstName)
  }
  get lastNameError(): string | null {
    return this.lastName.touched && this.control.getErrorMessage(this.lastName)
  }
  get emailError(): string | null {
    return this.email.touched && this.control.getErrorMessage(this.email,'invalid-email')
  }
  get passError(): string | null {
    return this.pass.touched && this.control.getErrorMessage(this.pass)
  }
  get passConfirmError(): string | null {
    return this.passConfirm.touched && this.control.getErrorMessage(this.passConfirm)
  }




  /* --- Methods --- */

  isBusyEmail(control: FormControl): Observable<ValidationErrors | null> {

    return of(control.value).pipe(
      tap(_ => this.emailAwiitIsBusyAnime = true),
      debounceTime(400),
      switchMap(email => this.fireAuth.auth.fetchSignInMethodsForEmail(email)),
      map(isBusy => isBusy[0] ? { error: 'error' } : null),
      tap(res => res ? this.busyEmail = true : this.busyEmail = false),
      tap(_ => this.emailAwiitIsBusyAnime = false),
    )

  }

  onSubmit() {
    this.awaitAnimation = true;

    this.autoService.signUp(this.profileForm.value).then(() => {
      this.awaitAnimation = false;
    })

    this.fireAuth.authState.pipe(takeUntil(this.destroyStream))
      .subscribe(curentUser => {
        if (curentUser) {
          this.awaitAnimation = false;
          this.profileForm.reset();
        }
      })
  }

  closeDialog() {
    this.dialog.closeDialog()
  }


  /* --- LC hooks --- */

  ngOnInit() {

    this.passConfirm.setValidators(_passConfirm(this.pass))
    // this.btnValid = this.profileForm.valid;
  }


  ngOnDestroy() {
    this.destroyStream.next()
  }

}

