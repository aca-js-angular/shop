import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, fromEvent, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AutoService } from '../Services/audentific.service';
import { takeUntil, debounceTime, map } from 'rxjs/operators';
import { FormValidators } from '../Validators/Form-validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private autoService: AutoService,
    private fireAuth: AngularFireAuth,
  ) { }


  private profileForm: FormGroup;
  destroyStream = new Subject<void>()
  cities: string[] = [];
  btnValid: boolean;
  info: string = 'Create Accaunt';
  invMess: boolean = false;
  comfirmPass: boolean = false;
  mailInvMessage: string;
  invalidInput: {}
  comfPass: string

  ngOnInit() {

    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern("[A-Za-z]{4,20}")]],
      lastName: ['', [Validators.required,Validators.pattern("[A-Za-z]{4,20}")]],

      email: ['', [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
      ]],
      password: ['', [Validators.required, Validators.minLength(8),]],
      // creditCard: ['', [
      //   Validators.required,
      //   Validators.pattern('^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$')]],
    })
    
    this.btnValid = this.profileForm.valid;
  }
  get firstName(): AbstractControl { return this.profileForm.get('firstName') }
  get lastName(): AbstractControl { return this.profileForm.get('lastName') }

  get email(): AbstractControl { return this.profileForm.get("email") }
  get card(): AbstractControl { return this.profileForm.get("creditCard") }
  get pass(): AbstractControl { return this.profileForm.get("password") }


  //------------------------------------------ 
  passComfirm(value): void {
    if (this.pass.value === value) { this.comfirmPass = false }
    else { this.comfirmPass = true }
  }

  onSubmit() {
    this.autoService.signUp(this.profileForm.value).then(() => {
      if (this.autoService.invalidMessage === 'AR') {
        this.mailInvMessage = 'This E-mail address already registered...'
        
      } else if (this.autoService.invalidMessage === 'DNE') {
        this.mailInvMessage = 'Email address does not exist'
      }
      setTimeout(() => this.autoService.invalidMessage = '', 6000);
    })

    this.fireAuth.authState.pipe(takeUntil(this.destroyStream))
      .subscribe(curentUser => {
        if (curentUser) {
          this.profileForm.reset();
        }
      })
  }


  ngOnDestroy() {
    this.destroyStream.next()
  }

  get test(): string { return JSON.stringify(this.profileForm.value) }
}




  // function isbusyEmail(formControl: FormControl) {
  //   return this.fbAuth.auth.fetchProvidersForEmail(formControl.value).then(res => {
  //     return of(res).pipe(
  //       debounceTime(400),
  //       map(result => {
  //         console.log(result)
  //         return result[0] ? { myValidetor: { message: 'Tis Email Already Registered' } } : null
  //       })
  //     )
  //   })
