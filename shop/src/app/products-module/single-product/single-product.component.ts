import { Component, OnInit, Input } from '@angular/core';
import { ConfigDecoderService } from './config-decoder.service';
import { DecodedConfig } from './decodedConfigInterface';
import { Config } from './configInterface';
import { DatabaseFireService } from 'src/app/databaseFire.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../product-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss'],
  providers: [ConfigDecoderService]
})
export class SingleProductComponent implements OnInit {

  @Input()thisProduct: Product;
  @Input()config: Config;

  liked: boolean = false;

  decoded: DecodedConfig;

  thisId: string;

  like(event){
    this.liked = !this.liked
    event.stopPropagation()
  }

  goToDetails(): void {
    this.router.navigate(['product',this.thisId])
  }

  constructor(private cd: ConfigDecoderService, private db: DatabaseFireService, private router: Router) { }

  ngOnInit() {
    this.decoded = this.cd.decodeConfig(this.config)
    this.db.getDocumentIdByUnqieProperty('products','name',this.thisProduct.name).then(res => this.thisId = res)
  }

}
