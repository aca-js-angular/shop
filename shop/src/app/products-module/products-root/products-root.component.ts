import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseFireService } from 'src/app/databaseFire.service';
import { Product } from '../product-interface';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../product.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { FilterService } from './filter.service';
import { cross } from './priceRangeValidator'

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
    ) { }

  rangeControl = this.build.group({
    min: [this.fs.priceRange.min,Validators.min(0)],
    max: [this.fs.priceRange.max],
  },{validators: cross})

  sortControl = new FormControl(this.fs.sortType)
  
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
      iron: true,
      leather: true,
      plastic: true,
      gold: true,
      silver: true,
      bronze: true,
    })
  }
  resetFilters(){
    this.resetRanges();
    this.resetColors();
    this.resetMaterials();
  }

  initProducts: Product[];
  allProducts: Product[];

  routerListener: Subscription;
  controlListener: Subscription;
  sortControlListener: Subscription;

  path: string[];

  initColorArr: string[] = [
    'black','grey','white','blue','coral','saddlebrown','pink','silver','navajowhite','red','aqua',
    'brown','darkgoldenrod','gold','orange','yellow','tan','beige','lime','green'
  ];

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
    arg.style.opacity = this.fs[prop] ? '1' : '0.3'
    this.update()
  }

  materials = this.build.group({
    iron: [this.fs.materialArray.includes('iron')],
    leather: [this.fs.materialArray.includes('leather')],
    plastic: [this.fs.materialArray.includes('plastic')],
    gold: [this.fs.materialArray.includes('gold')],
    silver: [this.fs.materialArray.includes('silver')],
    bronze: [this.fs.materialArray.includes('bronze')],
  })
 
  ngOnInit() {

    this.fs.setRanges(this.rangeControl.value)
    this.fs.setMaterials(this.materials.value)
    
    this.controlListener = this.materials.valueChanges.subscribe(next => {
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
    this.controlListener.unsubscribe();
    this.sortControlListener.unsubscribe();
    if(!this.fs.remember){
      this.fs.resetAll();
    }
  }



}
