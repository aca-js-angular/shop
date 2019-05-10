import { FormControl, ValidationErrors } from '@angular/forms';

export function _fullName(control: FormControl) : ValidationErrors | null {
    if(control.value.trim().split(' ').length > 1 || !control.value){
        return null
    }else{
        return {_fullName: {message: 'Full name must contain at least 2 fractions'}}
    }
}