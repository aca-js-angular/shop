import { FormControl, ValidationErrors } from '@angular/forms';

export class FormValidators {
    constructor() {}

 static email(formControl: FormControl): ValidationErrors | null {
  const value: string = formControl.value;
  return value.includes('@') && value.includes('.ru') || value.includes('.com')? null : { email: { message: 'Invalid Email' } };
}



}
