import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileDataService } from '../../services/profile-data.service';

@Component({
  selector: 'app-profile-root',
  templateUrl: './profile-root.component.html',
  styleUrls: ['./profile-root.component.scss']
})
export class ProfileRootComponent {

  currentUid$: Observable<string>;

  constructor(private activeRoute: ActivatedRoute, private pd: ProfileDataService) {

    this.currentUid$ = this.activeRoute.params.pipe(
      map(params => params.uid)
    )

  }

}
