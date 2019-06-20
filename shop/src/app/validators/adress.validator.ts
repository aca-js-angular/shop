import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function _adress(control: FormControl): ValidationErrors | null {
    const source = control.value
    const number = new RegExp(/\b\d\b/)
    const char = new RegExp(/[A-Za-z]/)
    if(char.test(source) && number.test(source)){
        return null
    }else{
        return {_adress: {message: 'Adress must contain at least "street" and "house-index"'}}
    }
}