import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CurrentUserCloud, CurrentChatMemberDialogData, MessageDataRTimeDb, RealTimeDbUserData } from '../user-interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable, zip, of, from, Subject, merge, combineLatest, BehaviorSubject, Subscriber, timer } from 'rxjs';
import { AdditionalService } from 'src/app/fa-module/Services/additional.service';
import { MatDialog } from '@angular/material';
import { User } from 'src/app/interfaces/user.interface';
// import { ConfirmDialogService } from 'src/app/comfirm-module/services/confirm-dialog.service';


const FIRST_OPEN_TEXT: string = 'Opened chat...'


@Injectable({
  providedIn: 'root'
})
export class MessengerService implements OnDestroy {
  destroyStream$ = new Subject<void>()
  getMessagesDestroyStream$ = new Subject<void>()
  decoderFieldsdestroyStream$ = new Subject<void>()
  sendMessage$ = new Subject<void>()
  getMessages$ = new Subject<void>()

  currentChatUrl = new BehaviorSubject<string | null>(null);
  isTypingChatMember$ = new BehaviorSubject<string>('false');

  constructor(
    private db: AngularFireDatabase,
    private afs: AngularFirestore,
    private dialog: MatDialog,
    private autoAdditional: AdditionalService,
    // private confirmMessage: ConfirmDialogService,
  ) { }



  /**
   * @param chatMemberUid uma etalu
   * @param senderUid curent User uid
   * @param message text@
   */

  sendMessage(senderUid: string, message: string = ''): void {

    this.currentChatUrl.pipe(takeUntil(this.sendMessage$)).subscribe(chatUrl => {
      // console.log('​chatUrl', chatUrl)
      this.db.list(`chats/${chatUrl}/messages`).push({ // 1 current user 2 chat member
        message: {
          sender: senderUid,
          message: message,
          timestamp: new Date().getTime()
        }
      }).then(res => { this.sendMessage$.next() }).catch()
    })
  }

  /**
 * current url take whith observable
 * @description  message: {
    message: string,
    timestamp:string,
    sender: string,
    key? : string
    }
  }
 */
  getMeassages(): Observable<MessageDataRTimeDb[]> {
    return new Observable(observer => {

      this.currentChatUrl.pipe(takeUntil(this.getMessages$)).subscribe(chatUrl => { // get url

        this.db.list<MessageDataRTimeDb>(`chats/${chatUrl}/messages`).snapshotChanges(['child_added', 'child_removed',]).pipe(   // get messages
          map(messageData =>
            messageData.map(message => Object.assign({}, { key: message.key }, message.payload.val()))),
          map(messageDecodedData => observer.next(messageDecodedData as MessageDataRTimeDb[])))
          .pipe(takeUntil(this.getMessagesDestroyStream$)).subscribe();
        this.getMessages$.next()  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

      })
    })
  }


  /**
   * 
   * @param messageKey (-45-e0f1JwQUkw4sW34F1)
   */
  removeMessage(messageKey: string): Promise<void> {
    return new Promise(resolve => {
      this.currentChatUrl.subscribe(chatUrl => {
        this.db.list(`chats/${chatUrl}/messages/${messageKey}`).remove().then(resolve)
      })
    })
  }


  /**
   * 
   * @param url `${currentUserUid.uid}&${otherUser}`
   */
  openNewChat(url: string): Promise<string> {
    return new Promise(resolve => {
      this.autoAdditional.autoState().then(currentUserUid => {
        if (currentUserUid) {
          this.db.list(`chats/${url}/messages`).push({
            message: {
              sender: currentUserUid.uid,
              message: FIRST_OPEN_TEXT,
              timestamp: new Date().getTime()
            }
          }).then(res => resolve(url))
        }
      })
    })
  }


  /**
   * 
   * @param chatMemberUid 
   * @param currentUserUid
   * @description decoding message uid in Display Name 
   */
  decodMessSenderUidInName<T>(chatMemberUid: string, currentUserUid: string): Promise<{}> {
    return new Promise(resolve => {

      const decodeNames$: Observable<RealTimeDbUserData>[] = [];

      const currentUserName$ = this.db.object<RealTimeDbUserData>(`users/${chatMemberUid}/`).valueChanges()
      const chetMemberName$ = this.db.object<RealTimeDbUserData>(`users/${currentUserUid}/`).valueChanges()
      decodeNames$.push(currentUserName$, chetMemberName$)

      zip(...decodeNames$).pipe(
        takeUntil(this.decoderFieldsdestroyStream$),

        map(users => Object.assign({},
          { [chatMemberUid]: users[0] ? { fullName: users[0].fullName, photoUrl: users[0].photoUrl } : null },
          { [currentUserUid]: users[1] ? { fullName: users[1].fullName, photoUrl: users[1].photoUrl } : null }
        )
        )).subscribe(resolve)
    })
  }


  /**
 * 
 * @param otherUser 
 * @private
 * @description if has chat return chat url else return false
 */

  private hasChatUrl(otherUser: string): Promise<string | false> {
    return new Promise(resolve => {

      this.autoAdditional.autoState().then(currentUserUid => {
        if (currentUserUid) {
          const originChat = [
            this.db.object(`chats/${currentUserUid.uid}&${otherUser}/messages`).valueChanges(),
            this.db.object(`chats/${otherUser}&${currentUserUid.uid}/messages`).valueChanges()
          ];

          zip(...originChat).pipe(takeUntil(this.destroyStream$)).subscribe(originChat => {
            originChat.map(chatUrl => {
              originChat[0] ? resolve(`${currentUserUid.uid}&${otherUser}`) :
                originChat[1] ? resolve(`${otherUser}&${currentUserUid.uid}`) :
                  resolve(false);
              this.destroyStream$.next()// ??
            })
          })
        }
      })
    })
  }

  /**
   * 
   * @param searchEmail 
   * @param collectionName 
   * @private
   * @returns finded user with email and return finded data + uid
   */

  private searchUserInEmailCloud(searchEmail: string, collectionName: string = 'users'): Observable<User> {
    return of(searchEmail)
      .pipe(
        map(searchValue => searchValue.toLowerCase()),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(searchValue => this.afs.collection<User>(collectionName, ref => ref.where('email', '==', searchValue)).stateChanges()),
        map(data => data.map(user => Object.assign({}, user.payload.doc.data(), { uid: user.payload.doc.id }))),
        map(data => data[0]),
      )
  }


  private searhUserOnRealTimeDb(userId: string, collectionName: string = 'users'): Observable<CurrentUserCloud[]> {
    const result: object[] = [];
    return this.db.object(`${collectionName}/${userId}`).valueChanges().pipe(
      map(user => {
        result.push(Object.assign({}, user, { userId }));
        return result as CurrentUserCloud[]
      })
    )
  }

  /**
   * 
   * @param searchEmail 
   * @description combine datas in Clous and Real Time DataBases ( fullaName...)
   */
  searchUserCombineRtimeCloud(searchEmail: string): Promise<CurrentChatMemberDialogData> {

    return new Promise(resolve => {
      let findedUser: CurrentChatMemberDialogData;
      this.searchUserInEmailCloud(searchEmail)
      .pipe(takeUntil(this.destroyStream$)).subscribe(cloudData => {
          this.autoAdditional.autoState().then(currentUser => {

          if (cloudData && cloudData.uid !== currentUser.uid) {
              this.searhUserOnRealTimeDb(cloudData.uid)
              .pipe(takeUntil(this.destroyStream$)).subscribe(realTdata => {
				
               if (realTdata.length <= 1) {

                    findedUser = Object.assign({},
                      { fullName: realTdata[0].fullName },
                      { userId: cloudData.uid },
                      { photoUrl: realTdata[0].photoUrl }
                    );
                    resolve(findedUser);
                  }
                  this.destroyStream$.next()
                })
            } else {
              resolve(null);
              this.destroyStream$.next()
            }
          });
        })
    })
  }


  /**
   * 
   * @param findedUser 
   * @description if hasChatUrl() metod return false -> open new chat and -> curentChatUrl Subject .next(opened url)
   */

  openMesssengerBoxOrConfirm(findedUser: CurrentChatMemberDialogData): Promise<string> {
    return new Promise(resolv => {
      enum OpenOrConfirm { openComfirm = 'openConf', openMessageBox = 'openMess' };

      this.hasChatUrl(findedUser.userId).then(chatUrl => {

        this.autoAdditional.autoState().then(currentUserUid => {

          if (chatUrl && currentUserUid) {
            console.log('current chat url', chatUrl)
            this.currentChatUrl.next(chatUrl)

            resolv(OpenOrConfirm.openMessageBox)
            console.log('User fields already added -> Open Chat');

          } else if (currentUserUid) {
            this.openNewChat(`${findedUser.userId}&${currentUserUid.uid}`).then(openedUrl => {
              this.currentChatUrl.next(openedUrl);
              this.destroyStream$.next()// ??
              resolv(OpenOrConfirm.openMessageBox)
              //  resolv(OpenOrConfirm.openComfirm);
            })
          }
        })
      })
    })
  }
//------------------------------------------------------------------
  /**
 * 
 *@description start observe is typing metod
 */
  isTypingChatMember() {
      this.currentChatUrl.pipe(takeUntil(this.getMessagesDestroyStream$)).subscribe(chatUrl => {
       this.db.object(`chats/${chatUrl}/isTyping`).valueChanges()
          .pipe(takeUntil(this.getMessagesDestroyStream$)).subscribe(result => this.isTypingChatMember$.next(result as string))
      })
  }



  changerTypingState(currentUserUid: string | false): Observable<any> {
    const destroyStream$ = new Subject();

    return new Observable(observer => {
      this.currentChatUrl.pipe(takeUntil(destroyStream$)).subscribe(chatUrl => {
        of(currentUserUid).pipe(
          switchMap(uid => this.db.object(`chats/${chatUrl}`).update({ isTyping: uid })),
          takeUntil(destroyStream$),
        ).subscribe(res => {destroyStream$.next(); observer.next(res)})
      })
    })

  }
//----------------------------------------------------------------

  autoOpenMessengerBox(findedUser: CurrentChatMemberDialogData) { }


  closeMessageBox() {
    this.dialog.closeAll()
  }

  ngOnDestroy() {
    this.closeMessageBox()
    this.destroyStream$.next();
    this.getMessagesDestroyStream$.next()
    //------------------------------------------
    this.decoderFieldsdestroyStream$.next()
    this.sendMessage$.next()
  }
}


// import { Injectable } from '@angular/core';
// import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
// import { User } from '../shared/user';
// @Injectable({
// providedIn: 'root'
// })
// export class CrudService {
// usersRef: AngularFireList<any>;      // Reference to users list, Its an Observable
// userRef: AngularFireObject<any>;     // Reference to user object, Its an Observable too
// constructor(private db: AngularFireDatabase) { }   // Inject AngularFireDatabase dependency in constructor

//ere set enq anum obj vra poxuma tex@na dnum et ojn

// // Create User
// AddUser(user: User) {
// this.usersRef.push({
// name: user.name,
// email: user.email,
// contact: user.contact
// })
// }
//this.db.list('users').set('uid-xoski',{chats: {a:4}}) //.valueChanges().subscribe(console.log)



// // Read User
// GetUser(id: string) {
// this.userRef = this.db.object('users-list/' + id);
// return this.userRef;
// }


// // Read Users List
// GetUsersList() {
// this.usersRef = this.db.list('users-list');
// return this.usersRef;
// }  


// // Update User
// UpdateUser(user: User) {
// this.userRef.update({
// name: user.name,
// email: user.email,
// contact: user.contact
// })
// }  

// Delete User
// DeleteUser(id: string) { 
// this.userRef = this.db.object('users-list/'+id);
// this.userRef.remove();
// }
// }
// https://github.com/angular/angularfire2/blob/master/docs/rtdb/objects.md












//   message:{
// message: "awd"
// sender: "0MNOC1OAv1VvF7YJSZJ8pQyFjqI2"
// timestamp: 1557245822725
// }

  // return new Observable(resolve => {
  //   const result = []

  //  const a = this.db.list<MessageDataRTimeDb>(`chats/${currentUserUid}&${chatMemberUid}`).valueChanges()
  //    .pipe(
  //     map(messages =>
  //       messages
  //         .map(messageObj => { // arrayi map
  //           let senderName: string;
  //           let requestUid: string;

  //           if (messageObj.message.sender === requestUid) {
  //             messageObj.message.sender = senderName


  //           } else {
  //             this.decodMessSenderUidInName(messageObj.message.sender)

  //               .then(findedUser => {
  // 								console.log('​findedUser', findedUser)
  //                 messageObj.message.sender = findedUser.fullName;

  //                 senderName = findedUser.fullName;
  //                 requestUid = messageObj.message.sender;

  //                 result.push(messageObj)
  //               })
  //               a.unsubscribe()
  //             }

  //             console.log('​messageObj', messageObj)
  //             resolve.next(result)

  //         }))
  //   ).subscribe()

  // })


  //.subscribe(console.log)

  // })

  // const chatMemberSent = this.db.object<T>(`users/${currentUserUid}/chats/${chatMemberUid}/messages`).valueChanges();
  // const currentUserSent = this.db.object<T>(`users/${chatMemberUid}/chats/${currentUserUid}/messages`).valueChanges();
  // messages$.push(chatMemberSent, currentUserSent);

  //  combineLatest(...messages$).pipe( 
  //    map(messagesData => messagesData ? messagesData : []),
  //   //  takeUntil(this.destroyStream)
  //    )
  //    .subscribe(dubleMessages => {
  //    console.log('​dubleMessages', dubleMessages)




  //   const mergedMessages: MessageDataRTimeDb[] = dubleMessages[0] &&
  //    dubleMessages[1] ? [... Object.values(dubleMessages[0]), ...Object.values(dubleMessages[1])] : []


  // observer.next(this.quickSortConcatMessages(mergedMessages))
  // })
  // davit_2014@list.ru
  // rafayel1994@mail.ru
  // });





  //   quickSortConcatMessages(array: MessageDataRTimeDb[]): MessageDataRTimeDb[] {
  //     if (array.length <= 1) {
  //         return array;
  //     }
  //     const pivot = array.splice(array.length / 2)[0];
  // 		// console.log('​pivot', pivot)
  //     const left: MessageDataRTimeDb[] = [];
  //     const right: MessageDataRTimeDb[] = [];

  //     array.forEach(element => {
  //         if (element.message.timestamp < pivot.message.timestamp) {
  //             left.push(element);
  //         } else {
  //             right.push(element);
  //         }
  //     });
  //     const leftReturn = this.quickSortConcatMessages(left);
  //     const rightReturn = this.quickSortConcatMessages(right);
  //     return [...rightReturn, pivot, ...leftReturn] ;
  // }


  // console.log(quicSort([5,7,8,10,4,2,3,9]))
//////////--------------------------------------------------------------













// const FIRST_OPEN_TEXT: string = 'You are Freands'


// @Injectable({
//   providedIn: 'root'
// })
// export class MessengerService implements OnDestroy {
//   destroyStream$ = new Subject<void>()
//   getMessagesDestroyStream$ = new Subject<void>()
//   decoderFieldsdestroyStream$ = new Subject<void>()
//   sendMessage$ = new Subject<void>()
//   getMessages$ = new Subject<void>()

//   currentChatUrl = new BehaviorSubject<string | null>(null);

//   constructor(
//     private db: AngularFireDatabase,
//     private afs: AngularFirestore,
//     private dialog: MatDialog,
//     private autoAdditional: AdditionalService,
//     private confirmMessage: ConfirmDialogService,
//   ) { }



//   /**
//    * 
//    * @param currentUserUid 
//    * @param newChatMemberOptions 
//    * @private
//    */
//   private addMemberInChat(currentUserUid: string, newChatMemberOptions: NewChatMemberOptions) {
//     this.db.list(`users/${currentUserUid}/chats`).set(newChatMemberOptions.newMemberUid, {
//     }).then(_void => this.sendMessage(currentUserUid, newChatMemberOptions.newMemberUid, newChatMemberOptions.messages.message))
//   }


//   /**
//    * @param chatMemberUid uma etalu
//    * @param senderUid curent User uid
//    * @param message text@
//    */

//   sendMessage(chatMemberUid: string, senderUid: string, message: string = ''): void {

//     this.currentChatUrl.pipe(takeUntil(this.sendMessage$)).subscribe(chatUrl => {
//       console.log('​chatUrl', chatUrl)

//       this.db.list(`chats/${chatUrl}`).push({ // 1 current user 2 chat member
//         message: {
//           sender: senderUid,
//           message: message,
//           timestamp: new Date().getTime()
//         }
//       }).then(res => { console.log(res); this.sendMessage$.next() }).catch()
//     })


//   }


//   /**
//    * 
//    * @param otherUser 
//    * @private
//    * @description ete cka chat@ bacuma u veradardznuma url@ bacvac
//    */

//   private hasChatUrl(otherUser: string) {
    // return new Promise(resolve => {

    //   this.autoAdditional.autoState().then(currentUserUid => {

    //     const originChat = [
    //       this.db.object(`chats/${currentUserUid.uid}&${otherUser}`).valueChanges(),
    //       this.db.object(`chats/${otherUser}&${currentUserUid.uid}`).valueChanges()
    //     ];

    //     zip(...originChat).pipe(takeUntil(this.destroyStream$)).subscribe(originChat => {
    //       originChat.map(chatUrl => {
    //         console.log('​privatehasChatUrl -> chatUrl', originChat)
    //         originChat[0] ? this.currentChatUrl.next(`${currentUserUid.uid}&${otherUser}`) :
    //         originChat[1] ? this.currentChatUrl.next(`${otherUser}&${currentUserUid.uid}`) :

    //             this.openNewChat(`${otherUser}&${currentUserUid.uid}`).then(openedUrl => {
    //               this.currentChatUrl.next(openedUrl);
    //               this.destroyStream$.next()// ??
    //               resolve(openedUrl)
    //             })
    //       })
    //     })
    //   })
    // })
//   }
//   /**
//    * 
//    * @param url `${currentUserUid.uid}&${otherUser}`
//    */
//   openNewChat(url: string): Promise<string> {
//     return new Promise(resolve => {

//       this.db.list(`chats/${url}`).push({
//         message: {
//           sender: url.split('&')[0],
//           message: FIRST_OPEN_TEXT,
//           timestamp: new Date().getTime()
//         }
//       }).then(res => resolve(url))
//     })
//   }

//   // davit_2015@list.ru
//   // davit_2014@list.ru

//   decodMessSenderUidInName<T>(chatMemberUid: string, currentUserUid: string): Promise<T> {
//     return new Promise(resolve => {

//       const decodeNames$: Observable<RealTimeDbUserData>[] = [];

//       const currentUserName$ = this.db.object<RealTimeDbUserData>(`users/${chatMemberUid}/`).valueChanges()
//       const chetMemberName$ = this.db.object<RealTimeDbUserData>(`users/${currentUserUid}/`).valueChanges()
//       decodeNames$.push(currentUserName$, chetMemberName$)

//       zip(...decodeNames$).pipe(
//         takeUntil(this.decoderFieldsdestroyStream$),

//         map(users => Object.assign({},
//           users, users,
//           { [chatMemberUid]: users[0] ? users[0].fullName: null },
//           { [currentUserUid]: users[1] ? users[1].fullName: null }
//         )
//         )).subscribe(resolve)
//     })
//   }

//   /** 
//    * 
//    * @param chatMemberUid 
//    * @param currentUserUid 
//    */
//   getMeassages(chatMemberUid: string, currentUserUid: string): Observable<MessageDataRTimeDb[]> {
//     return new Observable(observer => {

//       this.decodMessSenderUidInName(chatMemberUid, currentUserUid).then(decodedFields => {

//         this.decoderFieldsdestroyStream$.next();

//         this.currentChatUrl.pipe(takeUntil(this.getMessages$)).subscribe(chatUrl => { // get url

//           this.db.list<MessageDataRTimeDb>(`chats/${chatUrl}`).valueChanges().pipe(
//             map(messageData => {
//               messageData.forEach((message, ind, messArray) =>
//                 messArray[ind].message.sender = decodedFields[message.message.sender]); // uid
//               // this.getMessages$.next() <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//               return messageData;
//             }),
//             map(messageDecodedData => observer.next(messageDecodedData as MessageDataRTimeDb[])
//             )).pipe(takeUntil(this.getMessagesDestroyStream$)).subscribe();
//         })
//       })
//     })
//   }




//   /**
//    * 
//    * @param searchEmail 
//    * @param collectionName 
//    * @private
//    * @returns finded user and uid
//    */
//   private searchUserInEmailCloud(searchEmail: string, collectionName: string = 'users'): Observable<User> {
//     return of(searchEmail)
//       .pipe(
//         map(searchValue => searchValue.toLowerCase()),
//         switchMap(searchValue => this.afs.collection<User>(collectionName, ref => ref.where('email', '==', searchValue)).stateChanges()),
//         map(data => data.map(user => Object.assign({}, user.payload.doc.data(), { uid: user.payload.doc.id }))),
//         map(data => data[0]),
//       )


//   }

//   private searhUserOnRealTimeDb(userId: string, collectionName: string = 'users'): Observable<CurrentUserCloud[]> {
//     const result: object[] = []
//     return this.db.object(`${collectionName}/${userId}`).valueChanges().pipe(
//       map(user => {
//         result.push(Object.assign({}, user, { userId }));
//         return result as CurrentUserCloud[]
//       })
//     )
//   }

//   /**
//    * 
//    * @param searchEmail 
//    * @description combine datas in Clous and Real Time DataBases (chat, fullaName...)
//    */
//   searchUserCombineRtimeCloud(searchEmail: string): Promise<CurrentChatMemberDialogData> {

//     return new Promise(resolve => {
//       let findedUser: CurrentChatMemberDialogData;

//       this.searchUserInEmailCloud(searchEmail).pipe(takeUntil(this.destroyStream$))

//         .subscribe(cloudData => {

//           if (cloudData) {
//             this.searhUserOnRealTimeDb(cloudData.uid, 'users').pipe(takeUntil(this.destroyStream$))
//               .subscribe(realTdata => {
//                 if (realTdata.length <= 1) {

//                   findedUser = Object.assign({},
//                     { chats: realTdata[0].chats },
//                     { fullName: realTdata[0].fullName },
//                     { userId: cloudData.uid },
//                     { photoUrl: realTdata[0].photoUrl }
//                   );
//                   resolve(findedUser);
//                   this.destroyStream$.next()
//                 }
//               })
//           }
//         });
//     })

//   }


//   /**
//    * 
//    * @param findedUser 
//    * ete es ckamm incor meki mot dit ira mot indz ete kam baci chat@
//    */

  // openMesssengerBoxOrConfirm(findedUser: CurrentChatMemberDialogData): Promise<string> {
  //   enum OpenOrConfirm { openComfirm = 'openConf', openMessageBox = 'openMess' };
  //   this.hasChatUrl(findedUser.userId).then(res => console.log(res, 'esfsefe'))
  //   return new Promise(resolv => {
  //     // this.hasChatUrl(findedUser.userId).then(hasCurrentUserInOtherUserChats => {

  //     // if (!hasCurrentUserInOtherUserChats) {
  //     // resolv(OpenOrConfirm.openComfirm);


  //     // } else {
  //     resolv(OpenOrConfirm.openMessageBox)
  //     console.log('User fields already added -> Open Chat');
  //     // }
  //     // })
  //   })
  // }

//   autoOpenMessengerBox(findedUser: CurrentUserCloud) {
//     this.openMesssengerBoxOrConfirm(findedUser)
//   }

//   closeMessageBox() {
//     this.dialog.closeAll()
//   }

//   ngOnDestroy() {
//     this.destroyStream$.next();
//     // this.getMessagesDestroyStream$.next()
//   }
// }

// /////////////////////////////-----------------------333
// import { Injectable, OnDestroy } from '@angular/core';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { NewChatMemberOptions, CurrentUserCloud, CurrentChatMemberDialogData, MessageDataRTimeDb, MessageData, RealTimeDbUserData } from '../user-interface';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { map, switchMap, takeUntil, mergeAll } from 'rxjs/operators';
// import { Observable, zip, of, Subscribable, from, Subject, merge, combineLatest, BehaviorSubject } from 'rxjs';
// import { ConfirmDialogService } from 'src/app/comfirm-module/services/confirm-dialog.service';
// import { AdditionalService } from 'src/app/fa-module/Services/additional.service';
// import { MatDialog } from '@angular/material';
// import { User } from 'src/app/interfaces and constructors/user.interface';


// const FIRST_OPEN_TEXT: string = 'You are Freands'


// @Injectable({
//   providedIn: 'root'
// })
// export class MessengerService implements OnDestroy {
//   destroyStream$ = new Subject<void>()
//   getMessagesDestroyStream$ = new Subject<void>()
//   decoderFieldsdestroyStream$ = new Subject<void>()
//   sendMessage$ = new Subject<void>()
//   getMessages$ = new Subject<void>()

//   currentChatUrl = new BehaviorSubject<string | null>(null);

//   constructor(
//     private db: AngularFireDatabase,
//     private afs: AngularFirestore,
//     private dialog: MatDialog,
//     private autoAdditional: AdditionalService,
//     private confirmMessage: ConfirmDialogService,
//   ) { }



//   /**
//    * 
//    * @param currentUserUid 
//    * @param newChatMemberOptions 
//    * @private
//    */
//   private addMemberInChat(currentUserUid: string, newChatMemberOptions: NewChatMemberOptions) {
//     this.db.list(`users/${currentUserUid}/chats`).set(newChatMemberOptions.newMemberUid, {
//     }).then(_void => this.sendMessage(currentUserUid, newChatMemberOptions.newMemberUid, newChatMemberOptions.messages.message))
//   }


//   /**
//    * @param chatMemberUid uma etalu
//    * @param senderUid curent User uid
//    * @param message text@
//    */

//   sendMessage(chatMemberUid: string, senderUid: string, message: string = ''): void {

//     this.currentChatUrl.pipe(takeUntil(this.sendMessage$)).subscribe(chatUrl => {
//       console.log('​chatUrl', chatUrl)

//       this.db.list(`chats/${chatUrl}`).push({ // 1 current user 2 chat member
//         message: {
//           sender: senderUid,
//           message: message,
//           timestamp: new Date().getTime()
//         }
//       }).then(res => { console.log(res); this.sendMessage$.next() }).catch()
//     })


//   }


//   /**
//    * 
//    * @param otherUser 
//    * @private
//    * @description ete cka chat@ bacuma u veradardznuma url@ bacvac
//    */

//   private hasChatUrl(otherUser: string): Promise<string | false> {
//     return new Promise(resolve => {

//       this.autoAdditional.autoState().then(currentUserUid => {

//         const originChat = [
//           this.db.object(`chats/${currentUserUid.uid}&${otherUser}`).valueChanges(),
//           this.db.object(`chats/${otherUser}&${currentUserUid.uid}`).valueChanges()
//         ];

//         zip(...originChat).pipe(takeUntil(this.destroyStream$)).subscribe(originChat => {
//           originChat.map(chatUrl => {
//             originChat[0] ? resolve(`${currentUserUid.uid}&${otherUser}`) :
//             originChat[1] ? resolve(`${otherUser}&${currentUserUid.uid}`) :
//             resolve(false);
//             this.destroyStream$.next()// ??
//           })
//         })
//       })
//     })
//   }
//   /**
//    * 
//    * @param url `${currentUserUid.uid}&${otherUser}`
//    */
//   openNewChat(url: string): Promise<string> {
//     return new Promise(resolve => {

//       this.db.list(`chats/${url}`).push({
//         message: {
//           sender: url.split('&')[0],
//           message: FIRST_OPEN_TEXT,
//           timestamp: new Date().getTime()
//         }
//       }).then(res => resolve(url))
//     })
//   }

//   // davit_2015@list.ru
//   // davit_2014@list.ru

//   decodMessSenderUidInName<T>(chatMemberUid: string, currentUserUid: string): Promise<T> {
//     return new Promise(resolve => {

//       const decodeNames$: Observable<RealTimeDbUserData>[] = [];

//       const currentUserName$ = this.db.object<RealTimeDbUserData>(`users/${chatMemberUid}/`).valueChanges()
//       const chetMemberName$ = this.db.object<RealTimeDbUserData>(`users/${currentUserUid}/`).valueChanges()
//       decodeNames$.push(currentUserName$, chetMemberName$)

//       zip(...decodeNames$).pipe(
//         takeUntil(this.decoderFieldsdestroyStream$),

//         map(users => Object.assign({},
//           users, users,
//           { [chatMemberUid]: users[0] ? users[0].fullName : null },
//           { [currentUserUid]: users[1] ? users[1].fullName : null }
//         )
//         )).subscribe(resolve)
//     })
//   }

//   /** 
//    * 
//    * @param chatMemberUid 
//    * @param currentUserUid 
//    */
//   getMeassages(chatMemberUid: string, currentUserUid: string): Observable<MessageDataRTimeDb[]> {
//     return new Observable(observer => {

//       this.decodMessSenderUidInName(chatMemberUid, currentUserUid).then(decodedFields => {

//         this.decoderFieldsdestroyStream$.next();

//         this.currentChatUrl.pipe(takeUntil(this.getMessages$)).subscribe(chatUrl => { // get url

//           this.db.list<MessageDataRTimeDb>(`chats/${chatUrl}`).valueChanges().pipe(
//             map(messageData => {
//               messageData.forEach((message, ind, messArray) =>
//                 messArray[ind].message.sender = decodedFields[message.message.sender]); // uid
//               // this.getMessages$.next() <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//               return messageData;
//             }),
//             map(messageDecodedData => observer.next(messageDecodedData as MessageDataRTimeDb[])
//             )).pipe(takeUntil(this.getMessagesDestroyStream$)).subscribe();
//         })
//       })
//     })
//   }




//   /**
//    * 
//    * @param searchEmail 
//    * @param collectionName 
//    * @private
//    * @returns finded user and uid
//    */
//   private searchUserInEmailCloud(searchEmail: string, collectionName: string = 'users'): Observable<User> {
//     return of(searchEmail)
//       .pipe(
//         map(searchValue => searchValue.toLowerCase()),
//         switchMap(searchValue => this.afs.collection<User>(collectionName, ref => ref.where('email', '==', searchValue)).stateChanges()),
//         map(data => data.map(user => Object.assign({}, user.payload.doc.data(), { uid: user.payload.doc.id }))),
//         map(data => data[0]),
//       )


//   }

//   private searhUserOnRealTimeDb(userId: string, collectionName: string = 'users'): Observable<CurrentUserCloud[]> {
//     const result: object[] = []
//     return this.db.object(`${collectionName}/${userId}`).valueChanges().pipe(
//       map(user => {
//         result.push(Object.assign({}, user, { userId }));
//         return result as CurrentUserCloud[]
//       })
//     )
//   }

//   /**
//    * 
//    * @param searchEmail 
//    * @description combine datas in Clous and Real Time DataBases (chat, fullaName...)
//    */
//   searchUserCombineRtimeCloud(searchEmail: string): Promise<CurrentChatMemberDialogData> {

//     return new Promise(resolve => {
//       let findedUser: CurrentChatMemberDialogData;

//       this.searchUserInEmailCloud(searchEmail).pipe(takeUntil(this.destroyStream$))

//         .subscribe(cloudData => {

//           if (cloudData) {
//             this.searhUserOnRealTimeDb(cloudData.uid, 'users').pipe(takeUntil(this.destroyStream$))
//               .subscribe(realTdata => {
//                 if (realTdata.length <= 1) {

//                   findedUser = Object.assign({},
//                     { chats: realTdata[0].chats },
//                     { fullName: realTdata[0].fullName },
//                     { userId: cloudData.uid },
//                     { photoUrl: realTdata[0].photoUrl }
//                   );
//                   resolve(findedUser);
//                   this.destroyStream$.next()
//                 }
//               })
//           }
//         });
//     })

//   }


//   /**
//    * 
//    * @param findedUser 
//    * ete es ckamm incor meki mot dit ira mot indz ete kam baci chat@
//    */

//   openMesssengerBoxOrConfirm(findedUser: CurrentChatMemberDialogData): Promise<string> {
//     return new Promise(resolv => {
//       enum OpenOrConfirm { openComfirm = 'openConf', openMessageBox = 'openMess' };

//       this.hasChatUrl(findedUser.userId).then(chatUrl => {

//         this.autoAdditional.autoState().then(currentUserUid => {

//         if (chatUrl) {
// 						console.log('current chat url', chatUrl)
//             this.currentChatUrl.next(chatUrl)

//             resolv(OpenOrConfirm.openMessageBox)
//             console.log('User fields already added -> Open Chat');

//           } else {
//             this.openNewChat(`${findedUser.userId}&${currentUserUid.uid}`).then(openedUrl => {
//               this.currentChatUrl.next(openedUrl);
//               this.destroyStream$.next()// ??
//               resolv(OpenOrConfirm.openMessageBox)
//               //  resolv(OpenOrConfirm.openComfirm);
//             })
//           }
//         })
//       })
//     })
//   }

//   autoOpenMessengerBox(findedUser: CurrentUserCloud) {
//     this.openMesssengerBoxOrConfirm(findedUser)
//   }

//   closeMessageBox() {
//     this.dialog.closeAll()
//   }

//   ngOnDestroy() {
//     this.destroyStream$.next();
//     // this.getMessagesDestroyStream$.next()
//   }
// }


// ////////////////////////////////-----------------------------444
// import { Injectable, OnDestroy } from '@angular/core';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { CurrentUserCloud, CurrentChatMemberDialogData, MessageDataRTimeDb, MessageData, RealTimeDbUserData } from '../user-interface';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { map, switchMap, takeUntil, mergeAll, debounceTime, distinctUntilChanged, timeout, debounce, timeoutWith } from 'rxjs/operators';
// import { Observable, zip, of, Subscribable, from, Subject, merge, combineLatest, BehaviorSubject, Subscriber, timer } from 'rxjs';
// import { ConfirmDialogService } from 'src/app/comfirm-module/services/confirm-dialog.service';
// import { AdditionalService } from 'src/app/fa-module/Services/additional.service';
// import { MatDialog } from '@angular/material';
// import { User } from 'src/app/interfaces and constructors/user.interface';


// const FIRST_OPEN_TEXT: string = 'Opened chat...'


// @Injectable({
//   providedIn: 'root'
// })
// export class MessengerService implements OnDestroy {
//   destroyStream$ = new Subject<void>()
//   getMessagesDestroyStream$ = new Subject<void>()
//   decoderFieldsdestroyStream$ = new Subject<void>()
//   sendMessage$ = new Subject<void>()
//   getMessages$ = new Subject<void>()

//   currentChatUrl = new BehaviorSubject<string | null>(null);

//   constructor(
//     private db: AngularFireDatabase,
//     private afs: AngularFirestore,
//     private dialog: MatDialog,
//     private autoAdditional: AdditionalService,
//     private confirmMessage: ConfirmDialogService,
//   ) { }



//   /**
//    * @param chatMemberUid uma etalu
//    * @param senderUid curent User uid
//    * @param message text@
//    */

//   sendMessage(senderUid: string, message: string = ''): void {

//     this.currentChatUrl.pipe(takeUntil(this.sendMessage$)).subscribe(chatUrl => {
//       // console.log('​chatUrl', chatUrl)
//       this.db.list(`chats/${chatUrl}/messages`).push({ // 1 current user 2 chat member
//         message: {
//           sender: senderUid,
//           message: message,
//           timestamp: new Date().getTime()
//         }
//       }).then(res => { this.sendMessage$.next() }).catch()
//     })
//   }

//   /**
//  * current url take whith observable
//  * @description  message: {
//     message: string,
//     timestamp:string,
//     sender: string,
//     key? : string
//     }
//   }
//  */
//   getMeassages(): Observable<MessageDataRTimeDb[]> {
//     return new Observable(observer => {

//       this.currentChatUrl.pipe(takeUntil(this.getMessages$)).subscribe(chatUrl => { // get url

//         this.db.list<MessageDataRTimeDb>(`chats/${chatUrl}/messages`).snapshotChanges(['child_added', 'child_removed',]).pipe(   // get messages
//           map(messageData =>
//             messageData.map(message => Object.assign({}, { key: message.key }, message.payload.val()))),
//           map(messageDecodedData => observer.next(messageDecodedData as MessageDataRTimeDb[])))
//           .pipe(takeUntil(this.getMessagesDestroyStream$)).subscribe();
//         this.getMessages$.next()  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

//       })
//     })
//   }


//   /**
//    * 
//    * @param messageKey (-45-e0f1JwQUkw4sW34F1)
//    */
//   removeMessage(messageKey: string): Promise<void> {
//     return new Promise(resolve => {
//       this.currentChatUrl.subscribe(chatUrl => {
//         this.db.list(`chats/${chatUrl}/messages/${messageKey}`).remove().then(resolve)
//       })
//     })
//   }


//   /**
//    * 
//    * @param url `${currentUserUid.uid}&${otherUser}`
//    */
//   openNewChat(url: string): Promise<string> {
//     return new Promise(resolve => {
//       this.autoAdditional.autoState().then(currentUserUid => {
//         if (currentUserUid) {
//           this.db.list(`chats/${url}/messages`).push({
//             isTyping: 'false',
//             message: {
//               sender: currentUserUid.uid,
//               message: FIRST_OPEN_TEXT,
//               timestamp: new Date().getTime()
//             }
//           }).then(res => resolve(url))
//         }
//       })
//     })
//   }


//   /**
//    * 
//    * @param chatMemberUid 
//    * @param currentUserUid
//    * @description decoding message uid in Display Name 
//    */
//   decodMessSenderUidInName<T>(chatMemberUid: string, currentUserUid: string): Promise<{}> {
//     return new Promise(resolve => {

//       const decodeNames$: Observable<RealTimeDbUserData>[] = [];

//       const currentUserName$ = this.db.object<RealTimeDbUserData>(`users/${chatMemberUid}/`).valueChanges()
//       const chetMemberName$ = this.db.object<RealTimeDbUserData>(`users/${currentUserUid}/`).valueChanges()
//       decodeNames$.push(currentUserName$, chetMemberName$)

//       zip(...decodeNames$).pipe(
//         takeUntil(this.decoderFieldsdestroyStream$),

//         map(users => Object.assign({},
//           { [chatMemberUid]: users[0] ? { fullName: users[0].fullName, photoUrl: users[0].photoUrl } : null },
//           { [currentUserUid]: users[1] ? { fullName: users[1].fullName, photoUrl: users[1].photoUrl } : null }
//         )
//         )).subscribe(resolve)
//     })
//   }


//   /**
//  * 
//  * @param otherUser 
//  * @private
//  * @description if has chat return chat url else return false
//  */

//   private hasChatUrl(otherUser: string): Promise<string | false> {
//     return new Promise(resolve => {

//       this.autoAdditional.autoState().then(currentUserUid => {
//         if (currentUserUid) {
//           const originChat = [
//             this.db.object(`chats/${currentUserUid.uid}&${otherUser}/messages`).valueChanges(),
//             this.db.object(`chats/${otherUser}&${currentUserUid.uid}/messages`).valueChanges()
//           ];

//           zip(...originChat).pipe(takeUntil(this.destroyStream$)).subscribe(originChat => {
//             originChat.map(chatUrl => {
//               originChat[0] ? resolve(`${currentUserUid.uid}&${otherUser}`) :
//                 originChat[1] ? resolve(`${otherUser}&${currentUserUid.uid}`) :
//                   resolve(false);
//               this.destroyStream$.next()// ??
//             })
//           })
//         }
//       })
//     })
//   }

//   /**
//    * 
//    * @param searchEmail 
//    * @param collectionName 
//    * @private
//    * @returns finded user with email and return finded data + uid
//    */

//   private searchUserInEmailCloud(searchEmail: string, collectionName: string = 'users'): Observable<User> {
//     return of(searchEmail)
//       .pipe(
//         map(searchValue => searchValue.toLowerCase()),
//         debounceTime(400),
//         distinctUntilChanged(),
//         switchMap(searchValue => this.afs.collection<User>(collectionName, ref => ref.where('email', '==', searchValue)).stateChanges()),
//         map(data => data.map(user => Object.assign({}, user.payload.doc.data(), { uid: user.payload.doc.id }))),
//         map(data => data[0]),
//       )
//   }


//   private searhUserOnRealTimeDb(userId: string, collectionName: string = 'users'): Observable<CurrentUserCloud[]> {
//     const result: object[] = [];
//     return this.db.object(`${collectionName}/${userId}`).valueChanges().pipe(
//       map(user => {
//         result.push(Object.assign({}, user, { userId }));
//         return result as CurrentUserCloud[]
//       })
//     )
//   }

//   /**
//    * 
//    * @param searchEmail 
//    * @description combine datas in Clous and Real Time DataBases ( fullaName...)
//    */
//   searchUserCombineRtimeCloud(searchEmail: string): Promise<CurrentChatMemberDialogData> {

//     return new Promise(resolve => {
//       let findedUser: CurrentChatMemberDialogData;
//       this.searchUserInEmailCloud(searchEmail).pipe(takeUntil(this.destroyStream$))

//         .subscribe(cloudData => {
//           this.autoAdditional.autoState().then(currentUser => {

//             if (cloudData && cloudData.uid !== currentUser.uid) {
//               this.searhUserOnRealTimeDb(cloudData.uid, 'users').pipe(takeUntil(this.destroyStream$))
//                 .subscribe(realTdata => {

//                   if (realTdata.length <= 1) {

//                     findedUser = Object.assign({},
//                       { fullName: realTdata[0].fullName },
//                       { userId: cloudData.uid },
//                       { photoUrl: realTdata[0].photoUrl }
//                     );
//                     resolve(findedUser);
//                   }
//                   this.destroyStream$.next()
//                 })
//             } else {
//               resolve(null);
//               this.destroyStream$.next()
//             }
//           });
//         })
//     })
//   }


//   /**
//    * 
//    * @param findedUser 
//    * @description if hasChatUrl() metod return false -> open new chat and -> curentChatUrl Subject .next(opened url)
//    */

//   openMesssengerBoxOrConfirm(findedUser: CurrentChatMemberDialogData): Promise<string> {
//     return new Promise(resolv => {
//       enum OpenOrConfirm { openComfirm = 'openConf', openMessageBox = 'openMess' };

//       this.hasChatUrl(findedUser.userId).then(chatUrl => {

//         this.autoAdditional.autoState().then(currentUserUid => {

//           if (chatUrl && currentUserUid) {
//             console.log('current chat url', chatUrl)
//             this.currentChatUrl.next(chatUrl)

//             resolv(OpenOrConfirm.openMessageBox)
//             console.log('User fields already added -> Open Chat');

//           } else if (currentUserUid) {
//             this.openNewChat(`${findedUser.userId}&${currentUserUid.uid}`).then(openedUrl => {
//               this.currentChatUrl.next(openedUrl);
//               this.destroyStream$.next()// ??
//               resolv(OpenOrConfirm.openMessageBox)
//               //  resolv(OpenOrConfirm.openComfirm);
//             })
//           }
//         })
//       })
//     })
//   }
// //------------------------------------------------------------------
//   /**
//  * 
//  * @param uid 
//  * @requires boolean
//  */
//   isTypingChatMember(): Observable<{}> {
//     return new Observable(observer => {
//       this.currentChatUrl.pipe(takeUntil(this.getMessagesDestroyStream$)).subscribe(chatUrl => {

//        this.db.object(`chats/${chatUrl}/isTyping`).valueChanges()
//           .pipe(takeUntil(this.getMessagesDestroyStream$)).subscribe(result =>  observer.next(result))
//       })
//     })
//   }



//   changerTypingState(currentUserUid: string | false): Observable<any> {
//     const destroyStream$ = new Subject();

//     return new Observable(observer => {
//       this.currentChatUrl.pipe(takeUntil(destroyStream$)).subscribe(chatUrl => {
//         of(currentUserUid).pipe(
//           switchMap(uid => this.db.object(`chats/${chatUrl}`).update({ isTyping: uid })),
//           takeUntil(destroyStream$),
//         ).subscribe(res => {destroyStream$.next(); observer.next(res)})
//       })
//     })

//   }
// //----------------------------------------------------------------


//   autoOpenMessengerBox(findedUser: CurrentChatMemberDialogData) { }

//   closeMessageBox() {
//     this.dialog.closeAll()
//   }

//   ngOnDestroy() {
//     this.closeMessageBox()
//     this.destroyStream$.next();
//     this.getMessagesDestroyStream$.next()
//     //------------------------------------------
//     this.decoderFieldsdestroyStream$.next()
//     this.sendMessage$.next()
//   }
// }
