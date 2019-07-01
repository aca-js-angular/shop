import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/interfaces/product.interface';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.scss']
})
export class ProfilePostsComponent implements OnInit {

  uid: string;


  setUid(uid: string){
    this.uid = uid;
  }

  ngOnInit() {
  }

}
