import { Injectable } from '@angular/core';
import { takeUntil, map, take, toArray, flatMap, filter, pluck, concatMap, tap, takeWhile, takeLast } from 'rxjs/operators';
import { Observable, zip, Subject } from 'rxjs';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { MessengerService } from './messenger.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { CurrentChatMemberDialogData, MessageDataRTimeDb, CurrentUserCloud, SubscribableChatUrls } from '../messenger-interface';


@Injectable({
  providedIn: 'root'
})
export class MessengerAutoOpenChatBoxByNf {

  subscriblablesChatsUrls = new Set<string>();
  $diasbleMessagesNotyfictions = new Subject<void>();

  constructor(
    private db: AngularFireDatabase,
    private autoAdditional: AdditionalService,
    private messengerService: MessengerService,
  ) { }




  //-----------Combine Metods--------------

  getNotifyChatUrls(currentUser: { uid: string }): Observable<SubscribableChatUrls[]> {
    return new Observable(observer => {

      this.db.list('chats').snapshotChanges(['child_added'])
        .pipe(
          takeUntil(this.messengerService.getMessagesDestroyStream$),
          map(chatUrls => chatUrls.filter(chatUrl => chatUrl.key.includes(currentUser.uid))),
        )
        .subscribe(chatUrl => {
          observer.next(chatUrl);
          // console.log("TCL: MessengerAutoOpenChatBoxByNf -> chatUrl", chatUrl);
        });
    })
  }



  subscribeNewMessageNotify(): Observable<CurrentChatMemberDialogData[]> {
    return new Observable(subscribtion => {

      this.autoAdditional.autoState().then(currentUser => {  // myus@ subscriba elnum u chi hascnum hetevi opopoxutyunnerin seti mej chi elnum subscrib@
        if (currentUser) {

          this.getNotifyChatUrls(currentUser).pipe(takeUntil(this.$diasbleMessagesNotyfictions))
          .subscribe((includesInChatsCurrentUser) => {

              // --Has Olreddy Opened Meessage Box---
              if (includesInChatsCurrentUser && includesInChatsCurrentUser.length) {

                includesInChatsCurrentUser.filter(url => {// subscriblables chat urls
                  if (!this.messengerService.activeChatBoxs.has(includesInChatsCurrentUser)) {
                    this.subscriblablesChatsUrls.add(url.key);
                    return true;
                  }
                })
                // $subscribableNotify.unsubscribe(); // <<<<<<<<<<<<<<<<<<<<<<<< unsubs chat states

                //--Pushing Observables in subscribableUrls[]--
                const subscribableUrls = [];
                this.subscriblablesChatsUrls.forEach(chatUrl =>
                  subscribableUrls.push(this.db.list<MessageDataRTimeDb>(`chats/${chatUrl}/messages/`).valueChanges(['child_added'])));

                //---Subscribe includes urls valueChanges['added']---
                this.notificationsZipData(currentUser.uid, subscribableUrls, this.subscriblablesChatsUrls).subscribe(notifiUserData => {
                  subscribtion.next(notifiUserData);
                })
              }
            })
        }
      })
    })
  }

  /**
   * 
   * @param currentUserUid 
   * @param subscribable : any[]
   * @param subscriberChatMessagesSetCollectionReference 
   * @description return messages notifications whith user data
   */
  private notificationsZipData(currentUserUid: string, subscribable: any[], subscriberChatMessagesSetCollectionReference: Set<string>): Observable<CurrentUserCloud[]> {
    return new Observable(subscribtion => {

      zip(...subscribable).pipe(takeUntil(this.$diasbleMessagesNotyfictions)).subscribe(messages => {

        subscriberChatMessagesSetCollectionReference.forEach((subscribeChatsNotificationsUrl) => {
          const chatMemberNotifiUid = subscribeChatsNotificationsUrl.split(`${currentUserUid}`).join('').split('&').join('');

          //---Search result With RT db---  next in singl each coming notify udata {}
         this.messengerService.searhUserOnRealTimeDb(chatMemberNotifiUid)
          .pipe(takeUntil(this.$diasbleMessagesNotyfictions)).subscribe(uData =>  subscribtion.next(uData))
        })
      })
    })
  }


}
