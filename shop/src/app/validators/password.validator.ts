import {  ValidationErrors, AbstractControl } from '@angular/forms';

export function _password(control: AbstractControl): ValidationErrors | null {
    const digit = new RegExp(/\d/)
    const lowwercase = new RegExp(/[a-z]/)
    const uppercase = new RegExp(/[A-Z]/)
    const pass = control.value

    return digit.test(pass) && lowwercase.test(pass) && uppercase.test(pass) ? null : {_password: {message: 'Invalid password format'}}
}