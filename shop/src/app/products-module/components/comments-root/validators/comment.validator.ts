import { FormControl,ValidationErrors, AbstractControl } from '@angular/forms';

export function maxLenghtLimitValidator(maxLenght: number): ValidationErrors{
    return (formControl: AbstractControl) => {
         return formControl.value.length > maxLenght ? {maxLenghtLimit: {message: 'max lenght is ' + maxLenght}}: null;
    }

  }
