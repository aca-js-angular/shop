import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AutoService } from '../Services/fa.service';
import { takeUntil, switchMap, map, debounceTime, tap } from 'rxjs/operators';
import { CloseDialogService } from '../Services/close-dialog.service';
import { AdditionalService } from '../Services/additional.service';

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
  ) {}

  /* --- Variables --- */

  private profileForm: FormGroup;
  destroyStream = new Subject<void>()
  cities: string[] = [];
  btnValid: boolean;
  info: string = CREATE_ACCOUNT;
  invMess: boolean = false;
  comfirmPass: boolean = false;
  mailInvMessage: string;
  invalidInput: {}
  comfPass: string
  awaitAnimation: boolean;
  emailAwiitIsBusyAnime: boolean;
  busyEmail: boolean;


  /* --- Getters --- */

  get firstName(): AbstractControl { return this.profileForm.get('firstName') }
  get lastName(): AbstractControl { return this.profileForm.get('lastName') }
  get email(): AbstractControl { return this.profileForm.get("email") }
  get card(): AbstractControl { return this.profileForm.get("creditCard") }
  get pass(): AbstractControl { return this.profileForm.get("password") }


  /* --- Methods --- */

  isBusyEmail(control: FormControl): Observable<ValidationErrors | null> {

    return of(control.value).pipe(
      tap(_ => this.emailAwiitIsBusyAnime = true),
      debounceTime(400),
      switchMap(email => this.fireAuth.auth.fetchSignInMethodsForEmail(email)),
      map(isBusy => isBusy[0] ? {error: 'error'} : null ), 
      tap(res => res ? this.busyEmail = true :this.busyEmail = false),
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

  passComfirm(value1: string, value2?: string): void {
    if (value1 && this.pass.value === value1) { this.comfirmPass = false }
    else if (value2 && this.pass.value === value2) { this.comfirmPass = false }
    else if (value2 || value1) { this.comfirmPass = true }
  }

  closeDialog() {
    this.dialog.closeDialog()
  }


  /* --- LC hooks --- */

  ngOnInit() {

    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern("[A-Za-z]{2,20}")]],
      lastName: ['', [Validators.required, Validators.pattern("[A-Za-z]{2,20}")]],

      email: ['', [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
      ],
        [this.isBusyEmail.bind(this)]

      ],
      password: ['', [Validators.required, Validators.minLength(8),]],
      //   Validators.pattern('^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$')]],
    })

    this.btnValid = this.profileForm.valid;
  }
  
  
  ngOnDestroy() {
    this.destroyStream.next()
  }

}

