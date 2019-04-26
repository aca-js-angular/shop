import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseFireService } from 'src/app/databaseFire.service';
import { Product } from '../product-interface';
import { ProductService } from '../product.service';
import { BasketService } from 'src/app/basket-module/basket.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, AfterViewInit {

  constructor(
    private active: ActivatedRoute,
    private db: DatabaseFireService,
    private ps: ProductService,
    private bs: BasketService,
  ) { }

  thisProduct: Product;
  moreFromThisBrand: Product[];
  similarProducts: Product[];
  currentSrc: string;

  toDate(seconds: number): Date{
    return new Date(seconds)
  }

  currentId: string;
  isInBasket: boolean;

  f(){
    this.ps.pushToCard('0Pf28eEATyqv370FlAR8','Qn6SXUCpZAcfBmwR47zmmDm3Vy73')
  }
  addToBasket(currentUser: any){
    this.ps.pushToCard(this.currentId,currentUser.uid)
    this.isInBasket = true
  }

  ngOnInit() {
    this.active.params.subscribe(next => {
      this.currentId = next.id
      this.ps.isInBasket(this.currentId).then(res => this.isInBasket = res)
      this.db.getDocumentById<Product>('products',this.currentId).subscribe(response => {
        this.thisProduct = response;
        this.currentSrc = this.thisProduct.images[0]
        window.scrollTo(0,0)
        this.db.dynamicQueryFilter('products',{brand: response.brand},res => this.moreFromThisBrand = res);
        this.ps.getSimilarProducts(response).subscribe(res => this.similarProducts = res)
      }) 
    })
  }

  ngAfterViewInit(){

  }

}
