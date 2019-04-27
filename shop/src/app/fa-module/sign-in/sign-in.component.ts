import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AutoService } from '../Services/fa.service'
import { AdditionalService } from '../Services/additional.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CloseDialogService } from '../Services/close-dialog.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']

})
export class SignInComponent implements OnInit, OnDestroy {

  constructor( 
    private dialog: CloseDialogService,
    private formBuilder: FormBuilder,
    private autoService: AutoService,
    private additionalAuth: AdditionalService) { }

  logInForm: AbstractControl;
  infoHide: boolean = false; 
  info: string;
  falseCount: number = 0;
  loginOrReset: string = 'Sign in to continue';
  invavidPassOrMail: boolean;
  destroySetram = new Subject<void>()
  resetEmailMessage: string = 'Verify Your Addres'
  showResetPanel: boolean = true;
  ngOnInit() {
    
    this.autoService.isLogined.pipe(takeUntil(this.destroySetram)).subscribe((result => {
      this.invavidPassOrMail = result;
      setTimeout(() => this.invavidPassOrMail = null, 6000);
    }))


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
    this.loginOrReset = 'Reset Password'
    this.invavidPassOrMail = null; 
  }

  sendLinkResetPass(): void {
    this.additionalAuth.sendEmailVerifResetPass(this.email.value).then(()=> {
      this.loginOrReset = 'Reset link has been sent to your email address';
      this.logInForm.reset()
      this.showResetPanel = true;
      setTimeout(() => this.loginOrReset= 'Sign in to continue', 15000);
    }).catch(()=> {
      this.resetEmailMessage = 'Invalid Email address';
      setTimeout(() => this.resetEmailMessage = 'Verify Your Addres', 5000);
    });
    
  }


  signIn(rememberState: boolean): void {
    this.autoService.signIn(this.logInForm.value);
    
    if(!rememberState){ this.additionalAuth.rememberMy(); }
  }

  ngOnDestroy() {
    this.destroySetram.next()
  }


  openSignUp(): void {
  //  this.additionalDialog.openSignUp()
    // this.dialog.openSignUp();
  }
}//---------------------------------------------------------------------------------------------------------------------------------------------


    //--------Logined status---------------------

//     this.signInService.isLogined.pipe(takeUntil(this.destroyStream))
//       .subscribe(isLoginedStatus => {

//         if (isLoginedStatus) {
//           this.destroyStream.next() // vor login   task@ 1 angam asxti 1 hat {  } ta
//           // ete chista inch ani ???? <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//           // ....
//           // ....
//           // ....

//         } else if (isLoginedStatus === false) {
//           this.info = "Invalid Login or Password";
//           this.infoHide = true;
//           this.falseCount < 6 ? this.falseCount++ : this.info = "You to spend all input attempts",this.infoHide = true
//         }
//         console.log(isLoginedStatus);
//       });
// // setTimeout(() => this.wait = true, 4000);



// kalekciayi anun u { name: ReactiveFormsModule, surna: araqelyan} gtnel sax obj arakelyan 