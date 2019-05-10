import { Component, OnInit, Input } from '@angular/core';
import { ConfigDecoderService } from '../../services/config-decoder.service';
import { DecodedConfig } from '../../../interfaces/decoded-config.Interface';
import { Config } from '../../../interfaces/config.Interface';
import { Product } from '../../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss'],
  providers: [ConfigDecoderService]
})
export class SingleProductComponent implements OnInit {

  constructor(
    private cds: ConfigDecoderService,
    private ps: ProductService,
  ) {}

  /* --- Variables --- */

  @Input()thisProduct: Product;
  @Input()config: Config;

  liked: boolean = false;
  decoded: DecodedConfig;
  thisId: string;

  /* --- Methods --- */

  like(event){
    this.liked = !this.liked
    event.stopPropagation()
  }

  goToDetails(): void {
    this.ps.goToProductDetails(this.thisId)
  }

  /* --- LC hooks --- */

  ngOnInit() {
    this.decoded = this.cds.decodeConfig(this.config)
    this.ps.getIdByName(this.thisProduct.name).then(id => this.thisId = id)
  }

}
