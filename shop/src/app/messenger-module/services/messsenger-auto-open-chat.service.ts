import { Injectable } from '@angular/core';
import { takeUntil, map, take } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { MessengerService } from './messenger.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { CurrentChatMemberDialogData, MessageDataRTimeDb, CurrentUserCloud } from '../user-interface';

@Injectable({
  providedIn: 'root'
})
export class MessengerAutoOpenChatBoxByNf {

  subscriblablesChatsUrls = new Set<string>();

  constructor(
    private db: AngularFireDatabase,
    private autoAdditional: AdditionalService,
    private messengerService: MessengerService,
    ) { }



  
  //-----------Combine Metods--------------

  autoOpenMessengerWhenNotifing(): Observable<CurrentChatMemberDialogData[]> {
    return new Observable(subscribtion => {

      this.autoAdditional.autoState().then(currentUser => {  // myus@ subscriba elnum u chi hascnum hetevi opopoxutyunnerin seti mej chi elnum subscrib@
        if (currentUser) {
          const subscribableNotifi$ = this.db.list('chats').stateChanges(['child_added']).pipe(
            
            takeUntil(this.messengerService.getMessagesDestroyStream$),
            take(1),
         
            map(messagesData => messagesData.key.includes(currentUser.uid) ? messagesData.key : ''))

            .subscribe(includesInChatsCurrentUser => {
              //--Has Olreddy Opened Meessage Box
              // this.hasOpenedMessageBox(includesInChatsCurrentUser).then(_true => { // warning _true ;   vonc anenq vor skzbic subsqrib elneluc sax sms ner@ stanaluc bcaic uvedomlenin 
              //-------------------------------------
              if (includesInChatsCurrentUser && !this.messengerService.activeChatBoxs.has(includesInChatsCurrentUser)  ) {

                // subscribableNotifi$.unsubscribe(); // <<<<<<<<<<<<<<<<<<<<<<<< unsubs chat states

                this.subscriblablesChatsUrls.add(includesInChatsCurrentUser); // subscriblables chat urls


                const subscribable = [];
                this.subscriblablesChatsUrls.forEach(chatUrl =>
                  subscribable.push(this.db.list<MessageDataRTimeDb>(`chats/${chatUrl}/messages/`).valueChanges(['child_added'])))

                  
                  this.notificationsZipData(currentUser.uid, subscribable, this.subscriblablesChatsUrls).subscribe(notifiUserData =>
                    subscribtion.next(notifiUserData));
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
      zip(...subscribable).pipe(takeUntil(this.messengerService.diasbleMessagesNotyfictions)).subscribe(messages => {
      console.log("TCL: messages", messages)
        
          subscriberChatMessagesSetCollectionReference.forEach((subscribeChatsNotificationsUrl) => {
            // console.log('​subscribeChatsNotificationsUrl', subscribeChatsNotificationsUrl)
            console.log('​subscribeChatsNotificationsUrl')
             
            const chatMemberNotifiUid = subscribeChatsNotificationsUrl.split(`${currentUserUid}`).join('').split('&').join('');
					// console.log('​chatMemberNotifiUid', chatMemberNotifiUid)
          
          //---Search result With RT db-----
          const getUserDataSubscribible = this.messengerService.searhUserOnRealTimeDb(chatMemberNotifiUid).subscribe(uData => {
            console.log('notifed ​uData ***', uData)
            // console.log('notifed ​userData ***')
            subscribtion.next(uData);
            getUserDataSubscribible.unsubscribe()
          })
        })
      })
    })
  }


}
