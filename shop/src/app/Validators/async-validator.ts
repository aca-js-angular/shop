import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { ProfileUsersService } from '../Services/UsersControl/profile-users.service'
import { distinctUntilChanged, switchMap, debounceTime } from 'rxjs/operators';

export class AsyncValidator {
    constructor( private usersService: ProfileUsersService) {}


    
//--------------------------------Validatorrrrrrrr
  // asinhron walidator
  myAsyncValidator(formControl: FormControl) {
    of(formControl.value).pipe(
        distinctUntilChanged(),

        switchMap(email => {
          this.usersService.getSpecificUser('email', email)
            .subscribe(result => {
              console.log(result)
              if (result[0]) {

                //......
                //......
                return { myValidetor: { message: 'Tis Email Already Registered' } }
              }
     
            })
          return of() // mekel es pah chem jogum xi
        })
      ).subscribe() // vosmi ban chi hasnum es subscribin returnneri pahne mejeric ci lnum anel
    return of(null);
  }

}
