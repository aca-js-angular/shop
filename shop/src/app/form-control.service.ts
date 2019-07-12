import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';


//  

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  constructor(){}

  /* --- Private Implementations --- */

  private getRequiredMessage(control: AbstractControl): string | null {
    return control.hasError('required') ? 'Required field' : null
  }

  private getEmailMessage(control: AbstractControl): string | null {
    return control.hasError('email') ? 'Invalid e-mail' : null
  }

  private getPatternMessage(control: AbstractControl, message: string): string | null{
    return control.hasError('pattern') ? message : null
  }

  private getMinlengthMessage(control: AbstractControl): string | null {
    if(control.hasError('minlength')){
      const actual = control.errors.minlength.actualLength
      const minLength = control.errors.minlength.requiredLength
      return `Min-length is ${minLength}. (${actual}/${minLength})`
    }else{
      return null
    }
  }

  private getMaxlengthMessage(control: AbstractControl): string | null {
    if(control.hasError('maxlength')){
      const actual = control.errors.maxlength.actualLength
      const maxLength = control.errors.maxlength.requiredLength
      return `Max-length is ${maxLength}. (+${actual - maxLength})`
    }else{
      return null
    }
  }

  private getMinMessage(control: AbstractControl): string | null {
    if(control.hasError('min')){
      const min = control.errors.min.min
      return `Min-value is ${min}`
    }else{
      return null
    }
  }

  private getMaxMessage(control: AbstractControl): string | null {
    if(control.hasError('max')){
      const max = control.errors.max.max
      return `Max-value is ${max}`
    }else{
      return null
    }
  }

  private getCustomMessage(control: AbstractControl): string | null {
    if(control.errors){
      const error = Object.keys(control.errors).find(key => key.startsWith('_'))
      return error ? control.errors[error].message : null
    }else{
      return null
    }
  }

  /* --- Public Methods --- */

  public getErrorMessage(control: AbstractControl, message?: string): string | null {
    
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

  public getCrossFieldErrorMessage(groupControl: AbstractControl, errorName: string): string | null {
    return groupControl.hasError(errorName) ? groupControl.errors[errorName].message : null;
  }

  public toggleState(control: AbstractControl){
    control.touched ? control.markAsUntouched() : control.markAsTouched()
  }

  public getPasswordSafety(control: AbstractControl): {color: string, safety: string}{
    const value = control.value
    if(!value.length)return {color: '', safety: ''};
    else if(value.length <= 10)return {color: 'rgb(172, 111, 111)', safety: 'ordinar'}
    else if(value.length <= 14)return {color: 'rgb(163, 162, 106)', safety: 'safe'}
    else if(value.length >= 15)return {color: 'rgb(126, 165, 107)', safety: 'secret'}
  }

}
