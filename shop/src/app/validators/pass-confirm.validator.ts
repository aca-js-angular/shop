import { FormGroup, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';

// export function _passConfirm(control: FormGroup): ValidationErrors | null {
//     const pass = control.get('password').value
//     const passConfirm = control.get('passwordConfirm').value

//     return pass && passConfirm && pass === passConfirm ? null : {_passConfirm: {message: '* Passwords do not match'}}
// }

export function _passConfirm(controlSrc: FormControl): ValidatorFn {
    return function(control: FormControl): ValidationErrors | null {
        return control.value === controlSrc.value ? null : {_passConfirm: {message: 'Passwords do not match'}}
    }
}