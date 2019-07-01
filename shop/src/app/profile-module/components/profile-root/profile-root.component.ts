import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../interfaces/user.interface';
import { ProfileDataService } from '../../services/profile-data.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { FaService } from 'src/app/fa-module/services/fa.service';
import { pairwise } from 'rxjs/operators';

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
  ) {}

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
  }

}