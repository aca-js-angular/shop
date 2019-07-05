import { Component, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../interfaces/user.interface';
import { ProfileDataService } from '../../services/profile-data.service';
import { Observable } from 'rxjs';
import { FaService } from 'src/app/fa-module/services/fa.service';
import { pairwise } from 'rxjs/operators';
import { MessengerAutoOpenChatBoxByNf } from 'src/app/messenger-module/services/messsenger-auto-open-chat.service';

export const emitOpenChatWithProfile = new EventEmitter<string>()

@Component({
  selector: 'app-profile-root',
  templateUrl: './profile-root.component.html',
  styleUrls: ['./profile-root.component.scss']
})
export class ProfileRootComponent {

  currentUid: string;
  isAuthProfile: Observable<boolean>;
  profileOwner: Observable<User>;

  constructor(
    private active: ActivatedRoute, 
    private pd: ProfileDataService,
    private fa: FaService,
    private router: Router,
    private messengerAutoOpenChatService: MessengerAutoOpenChatBoxByNf,
    
  ) {}

  
  toggleNotifys(): void{
    this.messengerAutoOpenChatService.disableNotify = !this.messengerAutoOpenChatService.disableNotify;
  }



  openChat(user){
    debugger;
    user.email && emitOpenChatWithProfile.emit(user.email);
  }

  ngOnInit(){

    this.active.params.subscribe(params => {
      this.currentUid = params.uid;
      this.profileOwner = this.pd.getUser(params.uid);
      this.isAuthProfile = this.pd.isAuthProfile(params.uid);
    })

    this.fa.authState.pipe(pairwise())
    .subscribe(pair => {
      const [previous,current] = pair;
      if(!current && (this.currentUid === previous.uid)){
        this.router.navigate(['/'])
      }
    })

  }


  onActivate(componentRef: any){
    componentRef.setUid(this.currentUid);
    componentRef.setIsAuth(this.isAuthProfile);
  }

}
