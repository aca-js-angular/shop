import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { Product } from '../../../interfaces and constructors/product.interface';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { FilterService } from '../../services/filter.service';
import { cross } from '../../../validators/priceRangeValidator'

@Component({
  selector: 'app-products-root',
  templateUrl: './products-root.component.html',
  styleUrls: ['./products-root.component.scss']
})

export class ProductsRootComponent implements OnInit, OnDestroy {

  constructor(
    private db: DatabaseFireService,
    private active: ActivatedRoute,
    private ps: ProductService,
    private build: FormBuilder,
    private fs: FilterService,
  ) {}

  /* ---Variables --- */

  initProducts: Product[];
  allProducts: Product[];
  path: string[];
  initColorArr: string[] = [
    'black','grey','white','blue','coral','saddlebrown','pink','silver','navajowhite','red','aqua',
    'brown','darkgoldenrod','gold','orange','yellow','tan','beige','lime','green'
  ];

  routerListener: Subscription;
  materialControlListener: Subscription;
  sortControlListener: Subscription;

  materials: FormGroup = this.build.group({
    iron: [this.fs.materialArray.includes('iron')],
    leather: [this.fs.materialArray.includes('leather')],
    plastic: [this.fs.materialArray.includes('plastic')],
    gold: [this.fs.materialArray.includes('gold')],
    silver: [this.fs.materialArray.includes('silver')],
    bronze: [this.fs.materialArray.includes('bronze')],
  })
  
  rangeControl: FormGroup = this.build.group({
    min: [this.fs.priceRange.min,Validators.min(0)],
    max: [this.fs.priceRange.max],
  },{validators: cross})

  sortControl: FormControl = new FormControl(this.fs.sortType)


  /* --- Methods --- */
  
  setRanges(){
    const min = this.rangeControl.get('min').value;
    const max = this.rangeControl.get('max').value;
    if(min === ''){
      this.fs.setRanges({min: null,max})
    }
    if(max === ''){
      this.fs.setRanges({min,max: Infinity})
    }
    if(min === '' && max === ''){
      this.fs.setRanges({min: null, max: Infinity})
    }
    if(min !== '' && max !== ''){
      this.fs.setRanges({min: +min, max: +max})
    }
    this.update();
  }

  resetRanges(){
    this.rangeControl.setValue({
      min: null,
      max: null,
    });
    this.fs.resetPriceRange();
    this.update();
  }

  resetColors(){
    this.fs.resetColorsFilter();
    this.update();
  }

  resetMaterials(){
    this.materials.setValue({
      iron: false,
      leather: false,
      plastic: false,
      gold: false,
      silver: false,
      bronze: false,
    })
  }

  resetFilters(){
    this.resetRanges();
    this.resetColors();
    this.resetMaterials();
  }

  update(){
    this.allProducts = this.fs.globalFilter(this.initProducts)
  }

  decodeColorName(color: string): string{
    switch(color){
      case 'navajowhite': return 'Dark Beige';
      case 'coral': return 'Bronze';
      case 'darkgoldenrod': return 'Dark Gold';
      case 'saddlebrown': return 'Dark Brown';
      case 'tan': return 'Light Brown';
      default: return color[0].toUpperCase() + color.slice(1)
    }
  }

  toggleOpacity(arg: HTMLElement,prop: string){
    this.update()
  }
 

  /* --- LC hooks --- */

  ngOnInit() {

    this.fs.setRanges(this.rangeControl.value)
    this.fs.setMaterials(this.materials.value)
    
    this.materialControlListener = this.materials.valueChanges.subscribe(next => {
      this.fs.setMaterials(next)
      this.update()
    })

    this.sortControlListener = this.sortControl.valueChanges.subscribe(res => {
      this.fs.sortType = res;
      this.fs.sort(this.initProducts);
      this.update();
    })
    
    this.routerListener = this.active.params.subscribe(next => {
      this.db.getCollection<Product>('products').subscribe(response => {

        this.fs.sort(response)

        if(next.category || next.brand){
          this.initProducts = response.filter(product => {
            if(next.category && next.category !== 'All'){
              this.path = ['Products','Categories',next.category]
              return product.category === next.category
            }
            else if(next.category === 'All'){
              this.path = ['Products','All Categories']
              return true
            }
            else if(next.brand){
              this.path = ['Products','Brands',next.brand]
              return product.brand === next.brand
            }
          })
        }
        else if(next.package){
          switch(next.package){
            case 'topRated': 
            this.path = ['Products','Packages','Top Rated']
            this.ps.getTopProducts().subscribe(res => {
              this.initProducts = res;
              this.update()
            })
            break;
            case 'bestDeals':
            this.path = ['Products','Packages','Best Deals']
            this.ps.getBestDeals().subscribe(res => {
              this.initProducts = res;
              this.update()
            })
            break;
            case 'latestCollection':
            this.path = ['Products','Packages','Latest Collection']
            this.ps.getLatestProducts().subscribe(res => {
              this.initProducts = res;
              this.update()
            })
            break;
          }
        }

        if(!next.package){
          this.update()
        }

      })
    })
  }

  ngOnDestroy(){
    this.routerListener.unsubscribe();
    this.materialControlListener.unsubscribe();
    this.sortControlListener.unsubscribe();
    if(!this.fs.remember){
      this.fs.resetAll();
    }
  }

}