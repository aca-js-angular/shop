import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { MessengerService } from './messenger.service';
import { takeUntil, switchMap } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { AdditionalService } from 'src/app/fa-module/services/additional.service';

@Injectable({
  providedIn: 'root'
})
export class MessengerOptionalService {

  isTypingChatMember$ = new BehaviorSubject<string>('false');
  firstInit: boolean;

  constructor(
    private db: AngularFireDatabase,
    private autoAdditional: AdditionalService,
    private messengerService: MessengerService,
  ) {
    this.autoAdditional.$autoState.subscribe((user) => user ? this.firstInit = true:  this.firstInit = false);
   }


 public isOnline(): Observable<boolean> {
    return new Observable(observer => {
      this.autoAdditional.autoState().then(currentUserUid => {

        if (currentUserUid) {
          this.messengerService.currentChatUrl.pipe(takeUntil(this.messengerService.destroyStream$)).subscribe(chatUrl => {
            const chatMemberUid = chatUrl.split(`${currentUserUid.uid}`).join('').split('&').join('');

            this.db.object(`users/${chatMemberUid}/isOnline`).valueChanges()
            .pipe(takeUntil(this.messengerService.getMessagesDestroyStream$))
            .subscribe(isOnline => observer.next(isOnline as boolean));
          })
        }
      })
  })
  }


  /**
 * 
 *@description start observe is typing metod
 */
  isTypingChatMember(): Observable<string> {
    return new Observable(observer => {
      
      return this.messengerService.currentChatUrl.pipe(takeUntil(this.messengerService.getMessagesDestroyStream$)).subscribe(chatUrl => {
        this.db.object(`chats/${chatUrl}/isTyping`).valueChanges()
        .pipe(takeUntil(this.messengerService.getMessagesDestroyStream$)).subscribe(result => observer.next(result as string));
      })
    })
  }



  changerTypingState(currentUserUid: string | false): Observable<any> {
    const destroyStream$ = new Subject;

    return new Observable(observer => {
      this.messengerService.currentChatUrl.pipe(takeUntil(destroyStream$)).subscribe(chatUrl => {
        of(currentUserUid).pipe(
          switchMap(uid => this.db.object(`chats/${chatUrl}`).update({ isTyping: uid })),
          takeUntil(destroyStream$),
        ).subscribe(res => { destroyStream$.next(); observer.next(res) })
      })
    })

  }


  sendMessageSound(src: string, volume = 0.2) {
    if(!this.firstInit) return
    const audio = new Audio(src);
    audio.volume = volume
    audio.play();
  }

}
