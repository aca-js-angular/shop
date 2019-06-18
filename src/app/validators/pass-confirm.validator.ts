import { ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';

export function _passConfirm(controlSrc: FormControl): ValidatorFn {
    return function(control: FormControl): ValidationErrors | null {
        return control.value === controlSrc.value ? null : {_passConfirm: {message: 'Passwords do not match'}}
    }
}