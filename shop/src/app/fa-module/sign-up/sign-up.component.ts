import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, fromEvent, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AutoService } from '../Services/fa.service';
import { takeUntil, debounceTime, map } from 'rxjs/operators';
import { CloseDialogService } from '../Services/close-dialog.service';

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
      firstName: ['', [Validators.required, Validators.pattern("[A-Za-z]{2,20}")]],
      lastName: ['', [Validators.required,Validators.pattern("[A-Za-z]{2,20}")]],

      email: ['', [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
      ]],
      password: ['', [Validators.required, Validators.minLength(8),]],
      //   Validators.pattern('^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$')]],
    })
    
    this.btnValid = this.profileForm.valid;
  }
  get firstName(): AbstractControl { return this.profileForm.get('firstName') }
  get lastName(): AbstractControl { return this.profileForm.get('lastName') }

  get email(): AbstractControl { return this.profileForm.get("email") }
  get card(): AbstractControl { return this.profileForm.get("creditCard") }
  get pass(): AbstractControl { return this.profileForm.get("password") }

  closeDialog() { this.dialog.closeDialog() } 
  //------------------------------------------ 
  passComfirm(value1:string,value2?:string): void {
    if (value1 && this.pass.value === value1) { this.comfirmPass = false }
    else if(value2 && this.pass.value === value2) { this.comfirmPass = false }
    else if(value2 || value1) { this.comfirmPass = true }
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

