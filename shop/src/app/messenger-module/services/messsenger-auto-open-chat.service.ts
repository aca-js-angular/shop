import { Injectable } from '@angular/core';
import { takeUntil, map } from 'rxjs/operators';
import { Observable, Subject, combineLatest } from 'rxjs';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';
import { MessengerService } from './messenger.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { CurrentChatMemberDialogData, MessageDataRTimeDb, CurrentUserCloud, SubscribableChatUrls, MessageData } from '../messenger-interface';


@Injectable({
  providedIn: 'root'
})
export class MessengerAutoOpenChatBoxByNf {

  private subscriblablesChatsUrlsSet = new Set<string>();
  diasbleMessagesNotyfictions$ = new Subject<void>();
  diasbleSubscribeNewChatOppeningWithCUserNotyfictions$ = new Subject<void>();


  _hasOlreadyOpenedOtherChat: boolean = true /// jamanakavor heto 1 hat chat bac lini khanenq

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

      this.autoAdditional.autoState().then(currentUser => {
        if (currentUser) {
          this.getNotifyChatUrls(currentUser).pipe(takeUntil(this.diasbleSubscribeNewChatOppeningWithCUserNotyfictions$))
            // 1 makardak ete chatum mard avelana qo u ira urlnerov 2 makardak asxatuma
            .subscribe((includesInChatsCurrentUser) => {
              console.log('asxatec')

              // subscribe chats/ urls...  ONCE  and subscribe another if added new chat with currentUser uid
              if (!firstInit && isAddedNewChat === includesInChatsCurrentUser.length) return;
              console.log('asxatec bay ifi mej ')

              firstInit && this.diasbleMessagesNotyfictions$.next(); // delete previus subscriptions
              firstInit = false;
              isAddedNewChat = includesInChatsCurrentUser.length;
              includesInChatsCurrentUser.forEach(url => this.subscriblablesChatsUrlsSet.add(url.key))
             
              // ----2 makardak---- 
              //  if(this._hasOlreadyOpenedOtherChat){ // jamanakavor heto khanenq ete chabacvac chateri qanak@ sartacnenq  (xia menak ste drac vortev user@ arden araji angam subscribic stacel sax chateri urlner@ u subscriba exe ete nor chata bacuvm arden hasiv chivortev  hat arden baca ete trua  )
              //--Pushing Observables in subscribableUrls[]--
              const chatUrlsSubscribables: Observable<MessageDataRTimeDb[]>[] = [];
              this.pushingObaservablesChatMembersSubscribables(chatUrlsSubscribables);

              //---Subscribe includes urls valueChanges['added']--- piti kancvi menak 1 angam vor kancvox medto shat subscribe clni
              this.notificationsZipData(currentUser.uid, chatUrlsSubscribables, this.subscriblablesChatsUrlsSet)
                .pipe(takeUntil(this.diasbleSubscribeNewChatOppeningWithCUserNotyfictions$))
                .subscribe(notifiUserData => subscribtion.next(notifiUserData));
              //}
            })
        }
      })
    })
  }


  /**
   * 
   * @param currentUserUid 
   * @param subscribable : any[]
   * @param subscriberChatMessagesSetCollectionReference Set Subsbribable Chat Urls
   * @description return messages notifications whith user data
   * @desvription iside tree calls getNotyfedMessageUdata() > getCurrentMessagesLengths() > getDtat in realTimeDb: 3x
   */
  private notificationsZipData(currentUserUid: string, subscribable: any[], subscriberChatMessagesSetCollectionReference: Set<string>): Observable<CurrentUserCloud[]> {
    let previusMessagesLength: number[];
    let changedNumber: number;
    let notyfedChatUrl: string;

    return new Observable(subscribtion => {
      combineLatest(...subscribable).pipe(takeUntil(this.diasbleMessagesNotyfictions$)).subscribe((allChatsMessagesArray: MessageData[][]) => {

        // console.log("TCL: this.zip returni verev", this._hasOlreadyOpenedOtherChat)
        // if(!this._hasOlreadyOpenedOtherChat) return; // jamanakavor vor ete mihat chat baca u 2 @ smsi vaxt cbacvi
        // this._hasOlreadyOpenedOtherChat = false; // 1 angam asxati 1 i bacveluc 

        [previusMessagesLength, changedNumber] = this.getNotyfedMessageUdata(allChatsMessagesArray, previusMessagesLength);

        notyfedChatUrl = Array.from(this.subscriblablesChatsUrlsSet)[changedNumber];

        console.log('notificationsZipData-> ', notyfedChatUrl)
        if (notyfedChatUrl && !this.messengerService.activeChatBoxs.has(notyfedChatUrl)) {
          // this.messengerService.activeChatBoxs.add(notyfedChatUrl); // add Auto opened Chat Url; olready adding by open
          console.log('opened unic chat box')
          const chatMemberNotifiUid = notyfedChatUrl.split(`${currentUserUid}`).join('').split('&').join(''); // Get Nodefed User Uid

          //---Search result With RT db---next in singl each coming notify udata {}
          this.messengerService.searhUserOnRealTimeDb(chatMemberNotifiUid)
            .pipe(takeUntil(this.diasbleMessagesNotyfictions$)).subscribe(uData => subscribtion.next(uData))
        }
      })
    })
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

  /**
   * 
   * @param allChatsMessArray 
   * @description return chat urls all meseges length 
   */
  private getCurrentMessagesLengths(allChatsMessArray: MessageData[][]): number[] {
    return allChatsMessArray.map(singleChatMessageArray => singleChatMessageArray.length);
  }


  /**
   * 
   * @param originIncomingallChatsMessagesArray 
   * @param previusMessagesLength
   * @description called inside  notificationsZipData() onece
   * @description if originIncomingallChatsMessagesArray === previusMessagesLength return changed index
   * @description else return -1
   * @description inside call meetods getCurrentMessagesLengths() 1x
   */
  private getNotyfedMessageUdata(originIncomingallChatsMessagesArray: MessageData[][], previusMessagesLength: number[]): [number[], number] {

    if (previusMessagesLength) { // return changed > chats messages index (only added > child)
      let changedChildIndex = originIncomingallChatsMessagesArray.findIndex((singleChatMessageArray, ind) => singleChatMessageArray.length > previusMessagesLength[ind]);
      previusMessagesLength = this.getCurrentMessagesLengths(originIncomingallChatsMessagesArray);
      return [previusMessagesLength, changedChildIndex];

    } else { // first initialisation changed not returned changed index;
      console.log('else')
      previusMessagesLength = [];
      previusMessagesLength = this.getCurrentMessagesLengths(originIncomingallChatsMessagesArray);
      return [previusMessagesLength, -1];
    }
  }


}
// kam chach decorator - sarqel mihat set es pahe bac chateri useri uidn key u valuen et data obekt@ vor amen message etaluc chasvi vorchati mseeegneri mej voruma popuxtyun exe