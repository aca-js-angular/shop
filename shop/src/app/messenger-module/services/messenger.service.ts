import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CurrentUserCloud, CurrentChatMemberDialogData, MessageDataRTimeDb, RealTimeDbUserData } from '../user-interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, takeUntil, debounceTime, distinctUntilChanged, toArray } from 'rxjs/operators';
import { Observable, zip, of, Subject, BehaviorSubject } from 'rxjs';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { User } from 'src/app/interfaces/user.interface';


const FIRST_OPEN_TEXT: string = 'Opened chat...'


@Injectable({
  providedIn: 'root'
})
export class MessengerService implements OnDestroy {
  destroyStream$ = new Subject<void>();
  getMessagesDestroyStream$ = new Subject<void>();
  decoderFieldsdestroyStream$ = new Subject<void>();
  sendMessageStream$ = new Subject<void>();
  diasbleMessagesNotyfictions = new Subject<void>();
  currentChatUrl = new BehaviorSubject<string | null>(null);
  activeChatBoxs = new Set();

  constructor(
    private db: AngularFireDatabase,
    private afs: AngularFirestore,
    private autoAdditional: AdditionalService,
    // private dialog: MatDialog,
    // private confirmMessage: ConfirmDialogService,
  ) { }

  /**
   * @param chatMemberUid uma etalu
   * @param senderUid curent User uid
   * @param message text@
   */

  sendMessage(senderUid: string, message: string = ''): void {
    !message ? null : 
    
    this.currentChatUrl.pipe(takeUntil(this.sendMessageStream$)).subscribe(chatUrl => {
      // console.log('​chatUrl', chatUrl)
      this.db.list(`chats/${chatUrl}/messages`).push({ // 1 current user 2 chat member
        message: {
          sender: senderUid,
          message: message,
          timestamp: new Date().getTime()
        }
      }).then(res => { this.sendMessageStream$.next() }).catch()
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
    const getMessages$ = new Subject<void>()
    return new Observable(observer => {

      this.currentChatUrl.pipe(takeUntil(getMessages$)).subscribe(chatUrl => { // get url

        this.db.list<MessageDataRTimeDb>(`chats/${chatUrl}/messages`).snapshotChanges(['child_added', 'child_removed',]).pipe(   // get messages
          takeUntil(this.getMessagesDestroyStream$),
          map(messageData =>
            messageData.map(message => Object.assign({}, { key: message.key }, message.payload.val()))),
          map(messageDecodedData => observer.next(messageDecodedData as MessageDataRTimeDb[]))
          ).subscribe();
          
        getMessages$.next()  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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
          }).then(res => { this.activeChatBoxs.add(url);  resolve(url)})
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
      const decodeData$: Observable<RealTimeDbUserData>[] = [];
      const decodeUsersUids: string[] = [chatMemberUid, currentUserUid];
      decodeUsersUids.map(url => decodeData$.push(this.db.object<RealTimeDbUserData>(`users/${url}/`).valueChanges()))

      zip(...decodeData$).pipe(
        takeUntil(this.decoderFieldsdestroyStream$),
        map(users => {
          const decodedResult = {};
          decodeUsersUids.map((uid, ind) => 
          decodedResult[uid] = users[ind] ? { fullName: users[ind].fullName, photoUrl: users[ind].photoUrl } : null);
          return decodedResult
        })
      ).subscribe(resolve)
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
              originChat[0] ? resolve(`${currentUserUid.uid}&${otherUser}`) :
              originChat[1] ? resolve(`${otherUser}&${currentUserUid.uid}`) : resolve(false);

              this.destroyStream$.next()// ??
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


  searhUserOnRealTimeDb(userId: string, collectionName: string = 'users'): Observable<CurrentUserCloud[]> {
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
              this.destroyStream$.next()
              resolve(null);
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

  openMesssengerBoxOrConfirm(findedUser: CurrentChatMemberDialogData): Observable<string> {

    return new Observable(subscriber => {
      enum OpenOrConfirm { openComfirm = 'openConf', openMessageBox = 'openMess' };

      this.hasChatUrl(findedUser.userId).then(chatUrl => {
        this.autoAdditional.autoState().then(currentUserUid => {


          // -------Chat Olready Opened--------
          if (chatUrl && currentUserUid && !this.activeChatBoxs.has(chatUrl)) {
            this.activeChatBoxs.add(chatUrl)
            this.currentChatUrl.next(chatUrl)

            console.log('User fields already added db -> Open Chat');
            
            subscriber.next(OpenOrConfirm.openMessageBox)
            // --------Add new Chat-Url--------------

          } else if (!chatUrl && !this.activeChatBoxs.has(chatUrl) && currentUserUid) {
            //-----Confirm-message-??-----------
            this.openNewChat(`${findedUser.userId}&${currentUserUid.uid}`).then(openedUrl => {
              this.activeChatBoxs.add(`${findedUser.userId}&${currentUserUid.uid}`);
              this.currentChatUrl.next(openedUrl);
              // this.autoOpenMessengerWhenNotifing()// <<<
              this.destroyStream$.next()// ??

              subscriber.next(OpenOrConfirm.openMessageBox)
              //  resolv(OpenOrConfirm.openComfirm);
            })
          }
        })
      })
    })
  }





  closeMessageBox() { //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    const chatUrl$ = this.currentChatUrl.subscribe(chatUrl => {

      // this.diasbleMessagesNotyfictions.next()
      this.activeChatBoxs.delete(chatUrl);
      chatUrl$ ? chatUrl$.unsubscribe() : null;
    })
  }

  ngOnDestroy() {
    this.closeMessageBox()
    this.destroyStream$.next();
    this.getMessagesDestroyStream$.next()
    //------------------------------------------
    this.decoderFieldsdestroyStream$.next()
    this.sendMessageStream$.next()
  }
}


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

