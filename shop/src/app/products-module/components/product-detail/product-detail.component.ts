
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { Product } from '../../../interfaces and constructors/product.interface';
import { ProductService } from '../../services/product.service';
// declare var $:any;
// declare var jQuery:any;

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
  ) {}

  /* --- Variables --- */

  // d  = 'https://cdn.jsdelivr.net/gh/igorlino/elevatezoom-plus@1.1.6/demo/images/large/image3.jpg'

  thisProduct: Product;
  moreFromThisBrand: Product[];
  similarProducts: Product[];
  currentSrc: string;

  currentId: string;
  isInBasket: boolean;

  quantity: number = 1;

  startAnimation: boolean = false;



  /* --- Methods --- */


  toDate(seconds: number): Date {
    return new Date(seconds)
  }

  addToBasket(currentUser: any) {
    this.ps.pushToCard({productId: this.currentId, quantity: this.quantity}, currentUser.uid)
    window.scrollTo(0,0)
    this.startAnimation = true
    this.isInBasket = true
  }
  

  /* --- LC hooks --- */

  ngOnInit() {
    this.active.params.subscribe(next => {

      this.currentId = next.id
      this.startAnimation = false
      this.ps.isInBasket(this.currentId).then(res => this.isInBasket = res)

      this.db.getDocumentById<Product>('products',this.currentId).subscribe(response => {

        this.thisProduct = response;

        this.currentSrc = this.thisProduct.images[0]

        this.db.dynamicQueryFilter('products',{brand: response.brand},res => this.moreFromThisBrand = res);

        this.ps.getSimilarProducts(response).subscribe(res => this.similarProducts = res)

      }) 
    })
  }
  // 









  ngAfterViewInit(){

  //   jQuery(document).ready(function () {

  //     var $ctb = $('.table tbody'),
  //         $cta = $ctb.find('td .arrow'),
  //         $ctr = $cta.parents('tr');

  //     $ctb.each(function () {
  //         var ctrn = 0;
  //         $('.table tbody tr:odd').addClass('odd');
  //         $('.table tbody tr:even').addClass('even');

  //     });

  //     //	code + italic
  //     $ctb.find('tr').each(function () {
  //         if ($('td', this).length === 5) $(this).find('td:eq(2)').wrapInner('<code />').end().find('td:eq(3)').addClass('italic');
  //         if ($('td', this).length === 4) $(this).find('td:eq(2)').addClass('italic');
  //         if ($('td', this).length === 3) $(this).find('td:eq(1)').addClass('italic');
  //     });

  // });


  // $(document).ready(function () {

  //     // Using custom configuration
  //     $('#img_01').ezPlus({
  //         zoomWindowFadeIn: 500,
  //         zoomLensFadeIn: 500,
  //         gallery: 'gal1',
  //         imageCrossfade: true,
  //         zoomWindowWidth: 411,
  //         zoomWindowHeight: 274,
  //         zoomWindowOffsetX: 10,
  //         scrollZoom: true,
  //         cursor: 'pointer'
  //     });


  //     $('#img_01').bind('click', function (e) {
  //         var ez = $('#img_01').data('ezPlus');
  //         $.fancyboxPlus(ez.getGalleryList());
  //         return false;
  //     });
  //     $('#img_02').ezPlus({
  //         gallery: 'gal2',
  //         tint: true,
  //         cursor: 'crosshair',
  //         windowHeight: 600
  //     });
  //     $('#img_03').ezPlus({
  //         zoomType: 'lens',
  //         lensShape: 'round',
  //         lensSize: 200
  //     });


  //     $('#img_02').bind('click', function (e) {
  //         var ez = $('#img_02').data('ezPlus');
  //         $.fancyboxPlus(ez.getGalleryList());
  //         return false;
  //     });


  // });

  // $(document).ready(function () {
  //     $(function () {
  //         var slide_duration = 1000;
  //         $('.view_source').click(function () {
  //             let t = $(this).attr('rel');
  //             let h = $('.' + t + '');
  //             h.slideToggle(slide_duration);
  //             if ($(this).html() === 'SHOW THE CODE') {
  //                 $(this).html('HIDE THE CODE');
  //                 h.show();
  //             }
  //             else {
  //                 $(this).html('SHOW THE CODE');
  //             }
  //             //slideToggle(slide_duration);
  //             //	s.find('div.script:not('+h+')').slideUp(slide_duration);

  //             return false;
  //         });
  //     });
  // });


  }

}

// <!-- <img style="width:411px" id="img_01" [src]="currentSrc" [data-zoom-image]="currentSrc"  onerror="this.src = 'assets/emptycart.png'"> -->    