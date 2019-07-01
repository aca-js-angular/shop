import { FormControl,ValidationErrors } from '@angular/forms';

export function maxLenghtLimitValidator(maxLenght: number): ValidationErrors{
    return (formControl: FormControl) => {
         return formControl.value.length > maxLenght ? {maxLenghtLimit: {message: 'max lenght is ' + maxLenght}}: null;
    }

  }
