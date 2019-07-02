import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CurrentUserCloud, CurrentChatMemberDialogData, MessageDataRTimeDb, RealTimeDbUserData } from '../messenger-interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable, zip, of, Subject, BehaviorSubject } from 'rxjs';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { User } from 'src/app/interfaces/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
export const emiteCloseMessageBox = new EventEmitter();

const FIRST_OPEN_TEXT: string = 'Opened chat...'


@Injectable({
  providedIn: 'root'
})
export class MessengerService implements OnDestroy {
  destroyStream$ = new Subject<void>();
  getMessagesDestroyStream$ = new Subject<void>();
  decoderFieldsdestroyStream$ = new Subject<void>();
  sendMessageStream$ = new Subject<void>();
  currentChatUrl = new BehaviorSubject<string | null>(null);
  activeChatBoxs = new Set();
  currentUser: { uid: string, displayName: string };

  constructor(
    private db: AngularFireDatabase,
    private afs: AngularFirestore,
    private firebaseAuth: AngularFireAuth,
    // private dialog: MatDialog,
    // private confirmMessage: ConfirmDialogService,
  ) {
    this.firebaseAuth.auth.onAuthStateChanged((currentUser) => this.currentUser = currentUser);
  }

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
          unread: true,
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

        this.db.list<MessageDataRTimeDb>(`chats/${chatUrl}/messages`).snapshotChanges(['child_added','child_removed','child_changed']).pipe(   // get messages
          takeUntil(this.getMessagesDestroyStream$),
          map(messageData => messageData.map(message => Object.assign({}, { key: message.key }, message.payload.val()))),
          map(messageData => this.messageSetReadedState(messageData, chatUrl)),
          map(messageDecodedData => observer.next(messageDecodedData as MessageDataRTimeDb[]))
        ).subscribe();

        getMessages$.next()  // ???? <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

      })
    })
  }

  clearAllMessages(charUrl: string){
    this.db.object(`chats/${charUrl}/messages/`).remove();
  }


  messageSetReadedState(messageData: MessageDataRTimeDb[], chatUrl: string): MessageDataRTimeDb[] {
    return messageData.map(messageItem => {
      if (this.currentUser.uid !== messageItem.message.sender && messageItem.unread) {
        this.db.list(`chats/${chatUrl}/messages/${messageItem.key}/unread`).remove()//({ unread: null });
      }
      return messageItem;
    })
  }

  /**
   * 
   * @param messageKey (-45-e0f1JwQUkw4sW34F1)
   */
  removeMessage(messageKey: string): Promise<void> {
    return new Promise(resolve => {
      this.currentChatUrl.pipe(takeUntil(this.getMessagesDestroyStream$)).subscribe(chatUrl => {
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
      if (this.currentUser) {
        this.db.list(`chats/${url}/messages`).push({
          message: {
            sender: this.currentUser.uid,
            message: FIRST_OPEN_TEXT,
            timestamp: new Date().getTime()
          }
        }).then(res => { this.activeChatBoxs.add(url); resolve(url) })
      }
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
      if (this.currentUser) {

        const originChat = [
          this.db.object(`chats/${this.currentUser.uid}&${otherUser}/messages`).valueChanges(),
          this.db.object(`chats/${otherUser}&${this.currentUser.uid}/messages`).valueChanges()
        ];

        zip(...originChat).pipe(takeUntil(this.destroyStream$)).subscribe(originChat => {
          originChat[0] ? resolve(`${this.currentUser.uid}&${otherUser}`) :
            originChat[1] ? resolve(`${otherUser}&${this.currentUser.uid}`) : resolve(false);

          this.destroyStream$.next()// ??
        })
      }
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
      this.searchUserInEmailCloud(searchEmail).pipe(takeUntil(this.destroyStream$))
        .subscribe(cloudData => {

          if (cloudData && cloudData.uid !== this.currentUser.uid) {
            this.searhUserOnRealTimeDb(cloudData.uid).pipe(takeUntil(this.destroyStream$))
              .subscribe(realTdata => {

                if (realTdata.length <= 1) {
                  findedUser = Object.assign({},
                    { fullName: realTdata[0].fullName },
                    { userId: cloudData.uid },
                    { photoUrl: realTdata[0].photoUrl }
                  );
                  resolve(findedUser);
                }
                this.destroyStream$.next();
              })
          } else {
            this.destroyStream$.next();
            resolve(null);
          }
        });
    })
  }




  /**
   * 
   * @param findedUser 
   * @description if hasChatUrl() metod return false -> open new chat and -> curentChatUrl Subject .next(opened url)
   */

  openMesssengerBoxOrConfirm(findedUser: CurrentChatMemberDialogData): Observable<string> {

    return new Observable(subscriber => {
      enum OpenOrConfirm { openComfirm = 'openConf', openMessageBox = 'openMessBox' };

      this.hasChatUrl(findedUser.userId).then(chatUrl => {
        // console.log("----: this.activeChatBoxs SET", this.activeChatBoxs)
        // -------Chat Olready Opened--------
        if (chatUrl && !this.activeChatBoxs.has(chatUrl) && this.currentUser) {
          this.activeChatBoxs.add(chatUrl);
          this.currentChatUrl.next(chatUrl);
          
          // console.log('User chat already OPPENED in db -> Open Chat');
          
          subscriber.next(OpenOrConfirm.openMessageBox);
          // --------Add new Chat-Url--------------
          
        } else if (!this.activeChatBoxs.has(chatUrl) && this.currentUser) {
 
          //-----Confirm-message-??-----------
          this.openNewChat(`${findedUser.userId}&${this.currentUser.uid}`).then(openedUrl => {
            this.activeChatBoxs.add(`${findedUser.userId}&${this.currentUser.uid}`);
            this.currentChatUrl.next(openedUrl);

            this.destroyStream$.next();// ??
            subscriber.next(OpenOrConfirm.openMessageBox); // dublcat for then
          })
        }
      })
    })
  }






  closeMessageBox() { //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    this.currentChatUrl.pipe(takeUntil(this.destroyStream$)).subscribe(chatUrl => {
      emiteCloseMessageBox.emit('close') // close box with component

      // console.log(chatUrl, '------closed chat url')

      this.activeChatBoxs.delete(chatUrl);
    })
  }

  ngOnDestroy() {

    this.destroyStream$.next();
    this.getMessagesDestroyStream$.next();
    //------------------------------------------
    this.decoderFieldsdestroyStream$.next();
    this.sendMessageStream$.next();
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

