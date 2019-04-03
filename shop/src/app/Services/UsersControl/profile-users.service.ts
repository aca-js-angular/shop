import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Person {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  city?: string;
  balance?: string;
}
 

@Injectable({
  providedIn: 'root'
})
export class ProfileUsersService {

  constructor(private http: HttpClient, private router: Router) { }


  getUsersAll(url: string = 'http://localhost:3000/users'): Observable<object> {
    return this.http.get(url);
  }


  getSpecificUser(by: string, searcValue: string,url: string ="http://localhost:3000/users"): Observable<object> {
    if (by === 'id') { 
      return this.http.get(`${url}/${searcValue}`);
    } else {
      return this.http.get(`${url}/?${by}=${searcValue}`);
    }
  }

  

  addUser(data: Person, url: string ="http://localhost:3000/users"): Observable<object> {
    return this.http.post(url, data);
  }

  deleetUserById(id: number | string, url: string = 'http://localhost:3000/users'): Observable<object> {
    return this.http.delete(`${url}/${id}`);
  }


  changeUserProperty(): Observable<object> {
  return //......
  }

}




// switchMap () 
// switchMap()Оператор имеет три важные характеристики.

// Он принимает аргумент функции, который возвращает Observable. PackageSearchService.searchвозвращает Observable, как и другие методы обслуживания данных.

// Если предыдущий поисковый запрос все еще находится в полете (например, когда соединение плохое), он отменяет этот запрос и отправляет новый.

// Он возвращает ответы службы в исходном порядке запроса, даже если сервер возвращает их не в порядке.

// Если вы думаете, что бу












// const arr = [ {id: 1, user: {name: 'Alex', lname: 'Smith'}},{id: 2, user: {name: 'John', lname: 'Doe'}}]

// from(arr).pipe(
//   pluck('user'),
//   map( name => name)
// ).subscribe(res => console.log(res))







// const subject$ = new Subject<number>()

// subject$.pipe(
//  // map(num => num *2),
//  takeUntil(subject$),
//   ).subscribe(res => console.log(res))

//   setTimeout(() =>  subject$.next(5555) , 5000);




// interval(350).pipe(
//   take(5),
//   map(num => num * num ),
// ).subscribe(res => console.log(res))




// const observable$ = of(1,2,5,6,9,8,7,8,21).pipe(
//   take(10),
//   map(num => num * 2 ),
//   retry(3),
//   )

// observable$.subscribe({
//   next:(res) => console.log(res),
//   complete:() => console.log("compleated"),

// })


// const subject = new Subject<number>()

// subject.subscribe({next(res){console.log(res)}})
// subject.subscribe({next(res){console.log(res)}})

// subject.next(Math.random())
//-------------------



// const obj1 = { next(res) { console.log(res) } }
// const obj2 = {
//   next(res) { console.log(res)},
//   complete(){ console.log("compleated") }
// }

// const subject = new Subject<number>();

// subject.subscribe(obj1)
// subject.subscribe(obj2)

// subject.next(Math.random())
// subject.next(Math.random())
// subject.complete()
// const observable = new Observable(subscriber => {
//   subscriber.next(Math.random());
//   setTimeout(() => subscriber.complete(), 1000);
// })
// const obj = {
//    next: (res: number)=> console.log(res),
//    complete: () => console.log("compleated"),
//   }
// const obj2 = {
//    next: (res: number)=> console.log(res),
//    complete: () => console.log("compleated"),
//   }

// observable.subscribe(obj)

// observable.subscribe(obj2)

  // const timerOne = timer(0,10).pipe(take(3));
  // const timerTwo = timer(0,10).pipe(take(3));
  // const timerTree = timer(0,10).pipe(take(3));

  // const o = zip(timerOne,timerTwo,timerTree);

  // o.subscribe({
  //   next: res => console.log(res),
  //   error: err => console.log(err),
  //   complete: () => console.log('compleated'),
  // })









// const obs = Observable.create((observer: Observer<string>) => {
//   observer.next("grdgrdg")
// })

// const obs = interval(500)
// const obs = timer(500)
// const obs = fromEvent(document.body, "mousemove")
// const obs = of(5,8,5,5,65,fetch("https://randomuser.me/api"),45,0)
// const obs = from([fetch("https://randomuser.me/api"),8,5,5,65,45,0])
// const obs = range(0,20) // 1 2 3 4 5 6 7 8 9 11 12 13 14 15 16 17 18 19 complete
// const obs = empty() // стразу complete без передачи занчение
// const obs = throwError('myError Text') // errors

// Operaotrs---------------
// const obs = range(0,50).pipe(filter(number => number > 18))
// const obs = range(0,50).pipe(first(number => number > 18)) // началное значение который попадает филтер = 18
// const obs = range(0,50).pipe(last(number => number > 18)) // началное значение который попадает филтер   50
// const obs = range(0,50).pipe(single(number => number ==  18)) // началное значение который попадает филтер   50

//Operaotrs debounse --------------------
/*
//-----havaqagrac------
 const obs = range(0,30).pipe(  debounce(number => timer(number * 1000)) || debounceTime(1000)  // nuyna hamarya  )

 //----unics-----
const obs = from([1,1,1,2,2,2,8,8,8,9]).pipe(  distinctUntilChanged()  )

//------throttle -- throttleTime
const timer(0,200).pipe( throttleTime(1000) )


//-----combine---zip
combineLatest // при измемнении однови из значение оно выстреливате поток
const timerOne = timer(0,10).pipe(take(3))
const timerTwo = timer(0,10).pipe(take(3))
const timerTree = timer(0,10).pipe(take(3))

const comb = combineLatest(timerOne,timerTwo,timerTree)
[0,0,0]
[1,0,0]
[1,1,0]
[1,1,1]
[2,1,1]....

//-------------zip

ждет формирвани е группи потом пропускает поток (паралелно)
  const o = zip(timerOne,timerTwo,timerTree);
[0,0,0]
[1,1,1]
[2,2,2]....

*/

// const obs = range(0,50).pipe(
//   filter(num => num % 3 !== 0),
//   map(num => num * 2),
// )



// obs.subscribe({
//   next: res => console.log(res),
//   error: err => console.log(err),
//   complete: () => console.log('complete'),
// })



// import { ajax } from 'rxjs/ajax';
// import { map, retry, catchError } from 'rxjs/operators';

// const apiData = ajax('/api/data').pipe(
//   retry(3), // Retry up to 3 times before failing
//   map(res => {
//     if (!res.response) {
//       throw new Error('Value expected!');
//     }
//     return res.response;
//   }),
//   catchError(err => of([]))
// );

// apiData.subscribe({
//   next(x) { console.log('data: ', x); },
//   error(err) { console.log('errors already caught... will not run'); }
// });







// function obsFn(observer){
//   return new Observable((observer)=> {
//     const handler = (e) => observer.next(5);
//     // target.addEventListener('click', handler);
//     return () => {
//       // Detach the event handler from the target
//     //  target.removeEventListener(eventName, handler);
//     };
//   })
// }

