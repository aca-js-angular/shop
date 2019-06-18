import { FormGroup, ValidationErrors } from '@angular/forms';

export function cross(control: FormGroup): ValidationErrors | null {
    const min = control.get('min')
    const max = control.get('max')
    return max.value < min.value ? {crossFieldError: {error: true}} : null
}