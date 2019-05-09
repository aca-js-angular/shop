import { Component, OnInit } from '@angular/core';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { P } from './product-constructor';
import { Product } from 'src/app/interfaces/product.interface';
import { zip, Observable } from 'rxjs';
import { Vendor } from 'src/app/interfaces/vendor.interface';
import { ProductService } from 'src/app/products-module/services/product.service';
import { FormControl } from '@angular/forms';

let sb = 'saddleBrown';
let nw = 'navajoWhite';
let dg = 'darkGoldenRod';


@Component({
  selector: 'app-db',
  templateUrl: './working-with-db.component.html',
  styleUrls: ['./working-with-db.component.scss']
})
export class WorkingWithDbComponent implements OnInit {

  constructor(private db: DatabaseFireService, private dbf: AngularFirestore,private ps: ProductService) {
    // this.dbf.firestore.disableNetwork()
  }

  copy(arg: object): object{
    let x = new Object;
    for(let key in arg){
      x[key] = arg[key]
    }
    return x
  }

  shuffle(array: any[]) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  // name  , brand , category , price , colors[] , material, imgQuantity, gender
  prods: any[] = [
    new P('Apex','Rolex','Watches',800,['black','silver'],['iron'],4,0),
    new P('Ashen Taupe','Pierre Cardin','Watches',550,['coral',sb],['leather'],4,1),
    new P('Aster','Rolex','Watches',430,['pink','coral'],['leather'],4,0),
    new P('Aster Blue','Rolex','Watches',890,['silver','blue'],['iron'],4,0),
    new P('Aubrey','Rolex','Watches',735,['blue','silver','white'],['leather'],4,0),
    new P('Axiom','Rolex','Watches',1100,['blue','silver'],['iron'],4,0),
    new P('B3','Rolex','Watches',400,['pink','silver','white'],['leather'],4,1),
    new P('Beverly Box','MVMT','Combo-Box',1400,['grey','coral','white'],['leather','bronze'],5,1),
    new P('Blacktop Gritty Glow','Rolex','Watches',900,['grey','silver'],['leather'],4,0),
    new P('Blacktop Nude','Rolex','Watches',760,['red',nw,sb],['iron'],4,0),
    new P('Blair','Pierre Cardin','Watches',520,['black','coral'],['leather'],4,1),
    new P('Bloom Gritty Glow','Rolex','Watches',400,['grey','silver'],['leather'],4,1),
    new P('Boulevard Gritty Glow','Rolex','Watches',560,['grey','silver'],['leather'],4,1),
    new P('Bourbon Rose','Rolex','Watches',1050,['brown','grey','coral'],['leather'],4,0),
    new P('Bristol','Rolex','Watches',880,['blue','silver'],['iron'],4,2),
    new P('Bronze Age Box','MVMT','Combo-Box',1650,['grey',dg],['leather','iron'],5,0),
    new P('Burnt Poppy','Rolex','Watches',440,['gold','orange','white'],['leather'],4,1),
    new P('Camden','Pierre Cardin','Watches',310,['gold','silver','white','yellow'],['leather'],4,1),
    new P('Canyon','Pierre Cardin','Watches',420,['gold','orange','white'],['leather'],4,1),
    new P('Champagne Gold','Pierre Cardin','Watches',710,['gold',sb],['iron'],3,1),
    new P('Charlie','Pierre Cardin','Watches',530,['gold','white'],['iron'],4,1),
    new P('Checker White Caramel','Pierre Cardin','Watches',655,['brown','tan','white'],['leather'],4,0),
    new P('Chrono 40 Box','MVMT','Combo-Box',2100,['grey','silver'],['leather','iron'],5,0),
    new P('Chrono Gritty Glow','Pierre Cardin','Watches',900,['grey','silver'],['leather'],4,0),
    new P('Chrono Monochrome','Pierre Cardin','Watches',610,['grey'],['leather'],3,0),
    new P('Classic Gritty Glow','Pierre Cardin','Watches',855,['grey','silver'],['leather'],4,0),
    new P('Classic Nude','Pierre Cardin','Watches',900,[nw,sb,'red'],['leather'],4,0),
    new P('Classic Silver Brown','Pierre Cardin','Watches',895,['black','brown'],['leather'],4,0),
    new P('Cloud Silver','Pierre Cardin','Watches',575,['silver',sb],['iron'],4,0),
    new P('Doreen','Pierre Cardin','Watches',490,['beige','black','silver','tan'],['leather'],4,2),
    new P('Dusk Taupe','Pierre Cardin','Watches',280,['coral',sb],['iron'],4,1),
    new P('Earl Grey','Pierre Cardin','Watches',370,['blue','coral','white'],['leather'],4,1),
    new P('Essex','Fossil','Watches',630,['gold','orange','white'],['leather'],4,1),
    new P('Ghost Iris','Fossil','Watches',780,['grey','coral','white'],['leather'],4,1),
    new P('Gilded Lilac','Fossil','Watches',550,['pink','coral','white'],['leather'],4,1),
    new P('Griffith','Fossil','Watches',600,['black','silver'],['leather'],4,1),
    new P('Gunmetal Rose','Fossil','Watches',710,['black',dg],['iron'],4,1),
    new P('Hayden','Fossil','Watches',440,['coral',sb],['iron'],4,1),
    new P('Heather','Fossil','Watches',500,['brown',sb],['leather'],4,1),
    new P('Hustle','Fossil','Watches',820,['black','gold'],['iron'],5,2),
    new P('Indie','Fossil','Watches',595,['grey','coral','white'],['leather'],5,2),
    new P('Iron Elm','Fossil','Watches',615,['grey','silver','white'],['leather'],4,0),
    new P('Iso','Fossil','Watches',900,[dg,'grey'],['iron'],4,0),
    new P('Ivory Oak','Fossil','Watches',880,['brown','white'],['leather'],4,0),
    new P('Jaded Rose','Fossil','Watches',700,['coral','white'],['iron'],4,1),
    new P('Jet Noir','Fossil','Watches',1020,['black','grey','silver'],['leather'],4,0),
    new P('Joyride','Fossil','Watches',670,['black'],['leather'],5,2),
    new P('Libra','Fossil','Watches',400,['pink','coral','white'],['leather'],4,1),
    new P('Limitless','Fossil','Watches',840,['silver','white'],['iron'],4,0),
    new P('Lynx','Fossil','Watches',620,['pink','coral',sb],['leather'],4,1),
    new P('Magnolia Marble','Fossil','Watches',950,['coral','black'],['iron'],4,1),
    new P('Marble Box','MVMT','Combo-Box',2100,['grey',sb,'black','white'],['leather','bronze'],7,1),
    new P('Mason','Patek Philippe','Watches',1400,['black','gold'],['iron'],4,0),
    new P('Modern Sport Nude','Patek Philippe','Watches',1240,[nw,sb],['iron'],4,0),
    new P('Monochrome Box','MVMT','Combo-Box',1900,['grey','silver'],['leather','iron'],7,0),
    new P('Nova Gritty Glow','Patek Philippe','Watches',980,['grey','silver'],['leather'],4,0),
    new P('Oath','Patek Philippe','Watches',1330,['black'],['iron'],5,2),
    new P('Obsidian Raven','Patek Philippe','Watches',800,['black'],['iron'],4,0),
    new P('Odyssey Gritty Glow','Patek Philippe','Watches',1310,['grey','silver'],['iron'],4,0),
    new P('Orion Box','MVMT','Combo-Box',2560,['coral','grey'],['iron','bronze'],5,1),
    new P('Paradox','Patek Philippe','Watches',2070,['black','silver'],['iron'],4,0),
    new P('Payton','Patek Philippe','Watches',1100,['blue','gold','grey'],['leather'],4,1),
    new P('Pelham','Patek Philippe','Watches',990,['grey','silver'],['leather'],5,2),
    new P('Rallye Green Gunmetal','Patek Philippe','Watches',2000,['green','grey'],['iron'],4,0),
    new P('Rallye Green Sandstone','Patek Philippe','Watches',1410,['beige','brown','green','grey','tan'],['leather'],4,0),
    new P('Revolver Gritty Glow','Patek Philippe','Watches',980,['grey','silver'],['leather'],4,0),
    new P('Revolver Nude','Patek Philippe','Watches',1140,[nw,sb,'silver'],['iron'],4,0),
    new P('Rosecrans','Patek Philippe','Watches',870,['pink','coral'],['leather'],4,1),
    new P('Sandstone Box','MVMT','Combo-Box',1900,['black','tan'],['leather'],5,0),
    new P('Santa Monica Box','MVMT','Combo-Box',3300,['black','coral'],['leather','bronze'],5,1),
    new P('Signature II Gritty Glow','Patek Philippe','Watches',995,['grey','silver'],['leather'],4,1),
    new P('Silver Myst','Patek Philippe','Watches',1800,['grey'],['leather'],4,0),
    new P('Skylar','Patek Philippe','Watches',1520,['aqua','silver'],['iron'],4,1),
    new P('Slate Box','MVMT','Combo-Box',1870,['black'],['iron','leather'],5,0),
    new P('Starlight Black','Patek Philippe','Watches',2500,['black','grey'],['iron'],4,0),
    new P('Sterling Daisy','Patek Philippe','Watches',920,['silver','white','yellow'],['leather'],4,1),
    new P('Stone Rouge','Patek Philippe','Watches',1290,['coral',sb],['iron'],5,1),
    new P('Storm Gold','Patek Philippe','Watches',750,['gold','grey'],['leather'],4,1),
    new P('Terra','Patek Philippe','Watches',880,['yellow','white','silver'],['leather'],4,1),
    new P('Thirteen','Patek Philippe','Watches',1640,['gold','white'],['iron'],5,2),
    new P('Umbra','Patek Philippe','Watches',1060,['gold,orange,white'],['leather'],4,1),
    new P('Venice Marble','Patek Philippe','Watches',2330,['silver','white'],['iron'],4,0),
    new P('Voyager Gritty Glow','Patek Philippe','Watches',1300,['grey','silver'],['leather'],4,0),
    new P('Voyager Nude','Patek Philippe','Watches',1380,['grey','coral',nw,sb],['leather'],4,0),
    new P('Voyager Kolder Edition','MVMT','Combo-Box',1650,['black','silver'],['iron, leather'],6,0),
    new P('Zodiac Pink','Ray-Ban','Sunglasses',340,['pink','silver'],['iron'],4,1),
    new P('Zodiac Dark','Ray-Ban','Sunglasses',330,['black'],['iron'],5,2),
    new P('Street Goggle Pink','Ray-Ban','Sunglasses',410,['pink','red'],['plastic'],4,1),
    new P('Street Goggle Black','Ray-Ban','Sunglasses',410,['black'],['plastic'],4,0),
    new P('Rio Everscroll','Ray-Ban','Sunglasses',210,['black','yellow'],['plastic'],4,0),
    new P('Reveler Everscroll White','Ray-Ban','Sunglasses',560,['white'],['plastic'],4,0),
    new P('Reveler Everscroll Black','Ray-Ban','Sunglasses',500,['black'],['plastic'],4,0),
    new P('Nu Wave','Cartier','Sunglasses',720,['black','orange'],['plastic'],5,1),
    new P('Nu Wave Pink','Cartier','Sunglasses',720,['pink','white'],['plastic'],4,1),
    new P('Kilo','Cartier','Sunglasses',720,['black'],['iron'],4,0),
    new P('Mogul Lime','Cartier','Sunglasses',600,['lime'],['plastic'],4,1),
    new P('Mogul Dark','Cartier','Sunglasses',620,['black'],['plastic'],4,1),
    new P('Maverick','Cartier','Sunglasses',400,['black'],['iron'],4,1),
    new P('Loveless Purple','Cartier','Sunglasses',310,['blue'],['iron'],4,1),
    new P('Loveless Pink','Cartier','Sunglasses',310,['pink'],['iron'],4,1),
    new P('Loveless Lime','Cartier','Sunglasses',310,['lime'],['iron'],4,1),
    new P('Tokyo Black','Cartier','Sunglasses',640,['black'],['plastic'],5,2),
    new P('Tokyo Red','Cartier','Sunglasses',600,['red'],['plastic'],4,1),
    new P('Tokyo Tiger','Cartier','Sunglasses',700,['black',sb],['plastic'],4,1),
    new P('Highball Black','Cartier','Sunglasses',900,['black'],['plastic'],5,2),
    new P('Highball Blue-Yellow','Cartier','Sunglasses',950,['blue','gold','yellow'],['plastic'],5,2),
    new P('Cypher Gold','Ray-Ban','Sunglasses',670,['coral','gold'],['iron'],5,2),
    new P('Cypher Black','Ray-Ban','Sunglasses',680,['black'],['iron'],5,2),
    new P('Voodoo Dark','Ray-Ban','Sunglasses',900,['black'],['iron'],4,1),
    new P('Voodoo White-Tiger','Ray-Ban','Sunglasses',1050,['black','grey'],['plastic'],3,1),
    new P('Cypher Blue','Ray-Ban','Sunglasses',685,['blue','gold'],['iron'],5,2),
    new P('Bombay Black','Ray-Ban','Sunglasses',700,['black'],['plastic'],4,1),
    new P('Bombay Rose','Ray-Ban','Sunglasses',750,['pink','white'],['plastic'],4,1),
    new P('Bombay Aqua','Ray-Ban','Sunglasses',700,['aqua'],['plastic'],4,1),
 
    new P('Crown Cuff Bronze','Tiffany & Co.','Bracelets',450,['coral'],['bronze'],3,1),
    new P('Crown Cuff Silver','Tiffany & Co.','Bracelets',650,['silver'],['silver'],3,1),
    new P('Crown Cuff Gold','Tiffany & Co.','Bracelets',1250,['gold'],['gold'],3,1),

    new P('Origin Bracelet Bronze','Tiffany & Co.','Bracelets',500,['coral'],['bronze'],3,1),
    new P('Origin Bracelet Silver','Tiffany & Co.','Bracelets',900,['silver'],['silver'],3,1),
    new P('Origin Bracelet Gold','Tiffany & Co.','Bracelets',1620,['gold'],['gold'],3,1),

    new P('Origin Necklace Bronze','Tiffany & Co.','Necklaces',670,['coral'],['bronze'],3,1),
    new P('Origin Necklace Silver','Tiffany & Co.','Necklaces',1100,['silver'],['silver'],3,1),
    new P('Origin Necklace Gold','Tiffany & Co.','Necklaces',2150,['gold'],['gold'],3,1),

    new P('Prism Charm Bracelet Bronze','Bvlgari','Bracelets',650,['coral'],['bronze'],3,1),
    new P('Prism Charm Bracelet Silver','Bvlgari','Bracelets',1000,['silver'],['silver'],3,1),
    new P('Prism Charm Bracelet Gold','Bvlgari','Bracelets',1400,['gold'],['gold'],3,1),

    new P('Prism Charm Choker Bronze','Bvlgari','Necklaces',800,['coral'],['bronze'],3,1),
    new P('Prism Charm Choker Silver','Bvlgari','Necklaces',1200,['silver'],['silver'],3,1),
    new P('Prism Charm Choker Gold','Bvlgari','Necklaces',2300,['gold'],['gold'],3,1),

    new P('Prism Lariat Necklace Bronze','Bvlgari','Necklaces',850,['coral'],['bronze'],3,1),
    new P('Prism Lariat Necklace Silver','Bvlgari','Necklaces',1240,['silver'],['silver'],3,1),
    new P('Prism Lariat Necklace Gold','Bvlgari','Necklaces',1800,['gold'],['gold'],3,1),

    new P('Prism Charm Cuff Bronze','Bvlgari','Bracelets',350,['coral'],['bronze'],3,1),
    new P('Prism Charm Cuff Silver','Bvlgari','Bracelets',750,['silver'],['silver'],3,1),
    new P('Prism Charm Cuff Gold','Bvlgari','Bracelets',1150,['gold'],['gold'],3,1),

    new P('Prism Pendant Choker Bronze','Bvlgari','Necklaces',900,['coral'],['bronze'],3,1),
    new P('Prism Pendant Choker Silver','Bvlgari','Necklaces',1650,['silver'],['silver'],3,1),
    new P('Prism Pendant Choker Gold','Bvlgari','Necklaces',3100,['gold'],['gold'],3,1),

    new P('Twist Cuff Bronze','Tiffany & Co.','Bracelets',550,['coral'],['bronze'],3,1),
    new P('Twist Cuff Silver','Tiffany & Co.','Bracelets',840,['silver'],['silver'],3,1),
    new P('Twist Cuff Gold','Tiffany & Co.','Bracelets',1320,['gold'],['gold'],3,1),
  ]

  checkDb(){
    this.dbf.collection('products').valueChanges().subscribe(console.log)
  }
  clearDb(){
    this.db.getCollectionWithIds('products').subscribe(res => {
      res.forEach(item => this.dbf.collection('products').doc(item.id).delete())
    })
  }


  updateValue = {images: [
    'assets/Stone Rouge/1.jpg',
    'assets/Stone Rouge/2.jpg',
    'assets/Stone Rouge/3.jpg',
    'assets/Stone Rouge/4.jpg',
    'assets/Stone Rouge/5.jpg',
  ], name: 'Stone Rouge'}




  updateDoc(name: string){
    this.db.getDocumentIdByUniqueProperty('products','name',name).then(res => {
      this.db.updateData('products',res,this.updateValue)
    })
  }

  getId(arg: string){
    this.db.getDocumentIdByUniqueProperty('products','name',arg).then(console.log)
  }

  getCategoryId(arg: string){
    this.db.getDocumentIdByUniqueProperty('categories','name',arg).then(console.log)
  }

  nameaa = new FormControl('')

  f(){
    let objs: object[] = this.prods.map(item => this.copy(item))

    objs = this.shuffle(objs)
    console.log(this.prods)
    console.log(objs)
  }

  push(){

    let objs: object[] = this.prods.map(item => this.copy(item))

    objs = this.shuffle(objs)

    objs.forEach(item => this.dbf.collection('products').add(item).then(() => console.log('done')))
    
  }

  ngOnInit() {
  }

}
