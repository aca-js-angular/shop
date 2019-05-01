import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  constructor(){}

  /* --- Methods --- */

  getRequiredMessage(control: FormControl): string | null {
    return control.hasError('required') ? 'Field is required' : null
  }

  getEmailMessage(control: FormControl): string | null {
    return control.hasError('email') ? 'Invalid e-mail' : null
  }

  getPatternMessage(control: FormControl, message: string): string | null{
    return control.hasError('pattern') ? message : null
  }

  getMinlengthMessage(control: FormControl): string | null {
    if(control.hasError('minlength')){
      const actual = control.errors.minlength.actualLength
      const minLength = control.errors.minlength.requiredLength
      return `Min-length is ${minLength}. (${actual}/${minLength})`
    }else{
      return null
    }
  }

  getMaxlengthMessage(control: FormControl): string | null {
    if(control.hasError('maxlength')){
      const actual = control.errors.maxlength.actualLength
      const maxLength = control.errors.maxlength.requiredLength
      return `Max-length is ${maxLength}. (+${actual - maxLength})`
    }else{
      return null
    }
  }

  getMinMessage(control: FormControl): string | null {
    if(control.hasError('min')){
      const min = control.errors.min.min
      return `Min-value is ${min}`
    }else{
      return null
    }
  }

  getMaxMessage(control: FormControl): string | null {
    if(control.hasError('max')){
      const max = control.errors.max.max
      return `Max-value is ${max}`
    }else{
      return null
    }
  }

  getCustomMessage(control: FormControl): string | null {
    if(control.errors){
      const error = Object.keys(control.errors).find(key => key.startsWith('_'))
      return error ? control.errors[error].message : null
    }else{
      return null
    }
  }

  getErrorMessage(control: FormControl, message?: string): string | null {
    
    const errorMessage = 
    this.getRequiredMessage(control) ||
    this.getEmailMessage(control) ||
    this.getPatternMessage(control,message) ||
    this.getMinlengthMessage(control) ||
    this.getMaxlengthMessage(control) ||
    this.getMinMessage(control) ||
    this.getMaxMessage(control) ||
    this.getCustomMessage(control) ||
    null

    return errorMessage
  }


}
