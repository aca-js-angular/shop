import { Injectable } from '@angular/core';
import { takeUntil, map, pairwise, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subject, combineLatest } from 'rxjs';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { MessengerService } from './messenger.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { CurrentChatMemberDialogData, MessageDataRTimeDb, CurrentUserCloud, SubscribableChatUrls, MessageData } from '../messenger-interface';

@Injectable({
  providedIn: 'root'
})
export class MessengerAutoOpenChatBoxByNf {

  diasbleSubscribeNewChatOppeningWithCUserNotyfictions$ = new Subject<void>();
  disabledNotifyChatUrlsMap = new Map();
  private subscriblablesChatsUrlsSet = new Set<string>();
  diasbleMessagesNotyfictions$ = new Subject<void>();
  disableNotify: boolean = true;

  constructor(
    private db: AngularFireDatabase,
    private autoAdditional: AdditionalService,
    private messengerService: MessengerService,
  ) { }


  //-----------Combine Metods-------------- 
  /**
   * @description subscribe chat urls autoOpen messageBox 
   * @description inside call metods pushingObaservablesChatMembersSubscribables(), notificationsZipData 2x
   */
  subscribeNewMessageNotify(): Observable<CurrentChatMemberDialogData[]> {
    let isAddedNewChat: number;     // Previus Chat Url Length
    let firstInit: boolean = true;  // subscribie chaturls changes once
    return new Observable(subscribtion => {

      const autoStateSubscrib = this.autoAdditional.$autoState.subscribe(currentUser => {

        if (currentUser) {
          this.getNotifyChatUrls(currentUser).pipe(takeUntil(this.diasbleSubscribeNewChatOppeningWithCUserNotyfictions$))
            // 1 makardak ete chatum mard avelana qo u ira urlnerov 2 makardak asxatuma
            .subscribe((includesInChatsCurrentUser) => {

              // subscribe chats/ urls...  ONCE  and subscribe another if added new chat with currentUser uid
              if (!firstInit && isAddedNewChat === includesInChatsCurrentUser.length && !currentUser) return;


              !firstInit && this.diasbleMessagesNotyfictions$.next(); // delete previus subscriptions
              firstInit = false;
              isAddedNewChat = includesInChatsCurrentUser.length;
              includesInChatsCurrentUser.forEach(url => this.subscriblablesChatsUrlsSet.add(url.key))
              // ----2 makardak---- 
              //  if(this._hasOlreadyOpenedOtherChat){ // jamanakavor heto khanenq ete chabacvac chateri qanak@ sartacnenq  (xia menak ste drac vortev user@ arden araji angam subscribic stacel sax chateri urlner@ u subscriba exe ete nor chata bacuvm arden hasiv chivortev  hat arden baca ete trua  )
              //--Pushing Observables in subscribableUrls[]--
              const chatUrlsSubscribables: Observable<MessageDataRTimeDb[]>[] = [];
              this.pushingObaservablesChatMembersSubscribables(chatUrlsSubscribables);

              //---Subscribe includes urls valueChanges['added']--- piti kancvi menak 1 angam vor kancvox medto shat subscribe clni
              this.notificationsZipData(currentUser.uid, chatUrlsSubscribables)
                .pipe(takeUntil(this.diasbleSubscribeNewChatOppeningWithCUserNotyfictions$))

                .subscribe(notifiUserData => subscribtion.next(notifiUserData));
            })
        } else {autoStateSubscrib.unsubscribe()}
      })
    })
  }


  /**
   * 
   * @param currentUserUid 
   * @param subscribable : any[]
   * @description return messages notifications whith user data
   * @desvription iside tree calls getNotyfedMessageUdata() > getCurrentMessagesLengths() > getDtat in realTimeDb: 3x
   */
  private notificationsZipData(currentUserUid: string, subscribable: any[]): Observable<CurrentUserCloud[]> {
    let notyfedChatUrl: string;
    // let firestInit: boolena = false;

    return new Observable(subscribtion => {
      combineLatest(...subscribable).pipe(
        takeUntil(this.diasbleMessagesNotyfictions$),
        pairwise(),
        distinctUntilChanged(),
        map((prevAndNextMessages: [MessageData[][], MessageData[][]]) =>
          this.getNotyfedMessageUdata(prevAndNextMessages[0], prevAndNextMessages[1])))

          .subscribe(changedIndex => {
          // console.log("TCL: changedIndex", changedIndex)
 

            notyfedChatUrl = Array.from(this.subscriblablesChatsUrlsSet)[changedIndex];
            if (notyfedChatUrl && !this.messengerService.activeChatBoxs.has(notyfedChatUrl) && this.disableNotify) {

              const chatMemberNotifiUid = notyfedChatUrl.split(`${currentUserUid}`).join('').split('&').join(''); // Get Nodefed User Uid
              // this.messengerService.activeChatBoxs.add(notyfedChatUrl); // add Auto opened Chat Url; olready adding by open
              //---Search result With RT db---next in singl each coming notify udata {}
              const getUdata = this.messengerService.searhUserOnRealTimeDb(chatMemberNotifiUid)
                .pipe(
                  takeUntil(this.diasbleMessagesNotyfictions$),
                  distinctUntilChanged((prevUdata,currUdata) =>{

                    if( // if log out chage state ignore autoopenning
                      prevUdata[0].email === currUdata[0].email && 
                      prevUdata[0].fullName === currUdata[0].fullName &&
                      prevUdata[0].photoUrl === currUdata[0].photoUrl
                      ) return true
                    
                  })
                  ).subscribe(uData => subscribtion.next(uData))
           
            }
          })
    })
  }
  /**
   * 
   * @param curremtMessagesArray 
   * @param previusMessagesLength
   * @description called inside  notificationsZipData() onece
   * @description if curremtMessagesArray === previusMessagesLength return changed index
   * @description else return -1
   * @description inside call meetods getCurrentMessagesLengths() 1x
   */
  private getNotyfedMessageUdata(previusMessagesArray: MessageData[][], currentIncomingMessagesArray: MessageData[][]): number {
    return previusMessagesArray.findIndex((prevSingleChatUelsMessageArray, ind) =>
      prevSingleChatUelsMessageArray.length < currentIncomingMessagesArray[ind].length) // notify only new message 
  }

  /**
   * 
   * @param currentUser 
   * @description Get chat urls includes current user uid
   */
  private getNotifyChatUrls(currentUser: { uid: string }): Observable<SubscribableChatUrls[]> {
    return new Observable(observer => {

      this.db.list('chats').snapshotChanges(['child_added', 'child_removed']).pipe(
        takeUntil(this.messengerService.getMessagesDestroyStream$),
        map(chatUrls => chatUrls.filter(chatUrl =>
          chatUrl.key.includes(currentUser.uid)))).subscribe(chatUrl => observer.next(chatUrl)); // subsbribable chat urls;
    })
  }

  /**
   * @param chatUrlsSubscribables
   * @description return array subsbribables includes chat uls currrentUid 
   * @description called inside subscribeNewMessageNotify() when add new chat url with current user
   */
  private pushingObaservablesChatMembersSubscribables(chatUrlsSubscribables: Observable<MessageDataRTimeDb[]>[]): Observable<MessageDataRTimeDb[]>[] {
    this.subscriblablesChatsUrlsSet.forEach(chatUrl =>
      chatUrlsSubscribables.push(this.db.list<MessageDataRTimeDb>(`chats/${chatUrl}/messages/`).valueChanges(['child_added', 'child_removed'])));
    return chatUrlsSubscribables; // optional 
  }

}
// kam chach decorator - sarqel mihat set es pahe bac chateri useri uidn key u valuen et data obekt@ vor amen message etaluc chasvi vorchati mseeegneri mej voruma popuxtyun exe