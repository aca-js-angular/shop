import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(private http: HttpClient) { }

  isLogined = new BehaviorSubject<boolean | object>(null);
  destroyStream = new Subject<void>();



  logInAccaunt(formValue: { email: string, password: string }, url: string = 'http://localhost:3000/users'): void {

    this.http.get(`${url}/?email=${formValue.email}&password=${formValue.password}`).pipe(
      map(result => result[0]),
      takeUntil(this.destroyStream)
    )
      .subscribe(result => {
        if (result) {
          this.isLogined.next({ firstName: result.firstName, lastName: result.lastName, email: result.email }) // avelord informacya ctam menak inc petqa accauntum cyyc tanq et...

        } else {
          this.isLogined.next(false);
        }
        this.destroyStream.next()
      })
  }

  loginedStatus(): object | boolean {
    return this.isLogined.getValue() // veradardznuma @natacik arjeq@ aracnc observable isk   asObservable veradardznuma arjeq@ observablov pti subscrib elnie nq vor bacenq // 
  }

}
