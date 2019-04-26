import { FormControl, ValidationErrors } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { debounceTime, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';



export class FormValidators {
  constructor(public fbAuth?: AngularFireAuth) { }


  static valueToLowerCase(formControlValue: string, inpelem) {
    if (formControlValue) {
      console.log('​staticvalueToLowerCase -> inpelem',formControlValue, inpelem)
	//	console.log('​staticcreditCradFormat -> formControl.value',formControlValue.toLowerCase())
    // 5165623568638687
				//return !isNaN(+formControl.value) && formControl.value.length < 16 ? console.log( { email: { message: 'Invalid Email' }}) : null
				
    }
  }


  static creditCradFormat(formControl: FormControl) {
  }


  isbusyEmail(formControl: FormControl): Promise<ValidationErrors | null> {

    return this.fbAuth.auth.fetchProvidersForEmail(formControl.value).then(res => {
      return of(res).pipe(
        debounceTime(400),
        map(result => {
          console.log(result)
          return result[0] ? { myValidetor: { message: 'Tis Email Already Registered' } } : null
        })
      )
    })



  }
}