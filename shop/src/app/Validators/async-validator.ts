import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { ProfileUsersService } from '../Services/UsersControl/profile-users.service'
import { distinctUntilChanged, switchMap, debounceTime, map } from 'rxjs/operators';

export class AsyncValidator {
    constructor( private usersService: ProfileUsersService) {}


    
//--------------------------------Validatorrrrrrrr
  // asinhron walidator

  myAsyncValidator(formControl: FormControl) {

    return this.usersService.getSpecificUser('email', formControl.value).pipe(
      debounceTime(5000),
      map(result => {
				console.log( result)
        return result[0] ? { myValidetor: { message: 'Tis Email Already Registered' } } : null
      })
    )

  }

}
