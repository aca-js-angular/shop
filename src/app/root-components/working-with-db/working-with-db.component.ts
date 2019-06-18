import { Component, OnInit } from '@angular/core';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { P } from './product-constructor';

let sb = 'saddleBrown';
let nw = 'navajoWhite';
let dg = 'darkGoldenRod';



function Colors(main: string[],additional: string[] = []) {
  this.main = main;
  this.additional = additional;
}



@Component({
  selector: 'app-db',
  templateUrl: './working-with-db.component.html',
  styleUrls: ['./working-with-db.component.scss']
})
export class WorkingWithDbComponent implements OnInit {

  constructor(private db: DatabaseFireService, private dbf: AngularFirestore) {
    // this.dbf.firestore.work()
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
 






  prods: any[] = [
    // {main: [ ], additional: [ ] },

    // name  , brand , category , price , colors[] , material, imgQuantity, gender
    
    // new P('Ashen Taupe','Pierre Cardin','Watches',550, new Colors(['coral',sb,]),['leather']  ,4,1),
    // new P('Apex','Rolex','Watches',800, new Colors(['black','silver']) ,['iron']  ,4,0),
    // new P('Aster Blue','Rolex','Watches',890,new Colors(['silver','blue']),['iron']  ,4,0),
    // new P('Aubrey','Rolex','Watches',735,new Colors(['blue','white'],['silver']),['leather'],4,0),
    // new P('Aster','Rolex','Watches',430, new Colors(['pink','coral']),['leather'],4,0),
    // new P('Axiom','Rolex','Watches',1100,  new Colors(['blue','silver']),['iron'],4,0),
    // new P('B3','Rolex','Watches',400, new Colors(['silver','white'],['gold']),['leather'],4,1),
    // new P('Beverly Box','MVMT','Combo-Box',1400,  new Colors( ['grey','white'],['gold']),['leather','bronze'],5,1),
    // new P('Blacktop Gritty Glow','Rolex','Watches',900, new Colors (['grey','silver','black'],['coral']),['leather'],4,0),
    // new P('Blacktop Nude','Rolex','Watches',760,  new Colors( ['red' ,nw],['coral']),['iron'],4,0),
    // new P('Blair','Pierre Cardin','Watches',520,  new Colors( ['black', 'coral']),['leather'],4,1),
    // new P('Bloom Gritty Glow','Rolex','Watches',400,  new Colors( ['grey', 'silver'],['coral']),['leather'],4,1),
    // new P('Boulevard Gritty Glow','Rolex','Watches',560,  new Colors( ['grey', 'silver'],['coral']),['leather'],4,1),
    // new P('Bourbon Rose','Rolex','Watches',1050, new Colors( ['brown', 'grey'],[sb]),['leather'],5,0),
    // new P('Bristol','Rolex','Watches',880,  new Colors( ['blue', 'silver']),['iron'],5,2),
    // new P('Bronze Age Box','MVMT','Combo-Box',1650,  new Colors( ['grey' ,dg]),['leather','iron'],5,0),
    // new P('Burnt Poppy','Rolex','Watches',440,  new Colors( ['orange','white'],['gold']),['leather'],4,1),
    // new P('Camden','Pierre Cardin','Watches',310,  new Colors( ['white','yellow'],['gold', 'silver']),['leather'],4,1),
    // new P('Canyon','Pierre Cardin','Watches',420,  new Colors( [ 'orange','white'],['gold']),['leather'],4,1),
    // new P('Champagne Gold','Pierre Cardin','Watches',710,  new Colors( ['gold' ,sb]),['iron'],3,1),
    // new P('Checker White Caramel','Pierre Cardin','Watches',655,new Colors(['brown','tan','white'],['gray']),['leather'],4,0),
    // new P('Charlie','Pierre Cardin','Watches',530,new Colors(['gold','white']),['iron'],4,1),
    // new P('Chrono 40 Box','MVMT','Combo-Box',2100,new Colors(['grey','silver']),['leather','iron'],5,0),
    // new P('Chrono Gritty Glow','Pierre Cardin','Watches',900,new Colors(['grey','silver'],['coral']),['leather'],4,0),
    // new P('Chrono Monochrome','Pierre Cardin','Watches',610,new Colors(['grey','black']),['leather'],3,0),
    // new P('Classic Gritty Glow','Pierre Cardin','Watches',855,new Colors(['grey','black'],['silver']),['leather'],4,0),
    // new P('Classic Nude','Pierre Cardin','Watches',900,new Colors([nw,sb,],['red']),['leather'],4,0),
    // new P('Classic Silver Brown','Pierre Cardin','Watches',895,new Colors(['black','brown'],['red','white']),['leather'],4,0),
    // new P('Cloud Silver','Pierre Cardin','Watches',575,new Colors(['silver',sb]),['iron'],4,0),
    // new P('Doreen','Pierre Cardin','Watches',490,new Colors(['beige','black','silver','tan'],['skyblue']),['leather'],4,2),
    // new P('Dusk Taupe','Pierre Cardin','Watches',280,new Colors(['coral',sb]),['iron'],4,1),
    // new P('Earl Grey','Pierre Cardin','Watches',370,new Colors(['blue','coral','white']),['leather'],4,1),
    // new P('Essex','Fossil','Watches',630,new Colors(['gold','orange','white']),['leather'],4,1),
    // new P('Ghost Iris','Fossil','Watches',780,new Colors(['grey','coral','white']),['leather'],4,1),
    // new P('Gilded Lilac','Fossil','Watches',550,new Colors(['pink','coral','white']),['leather'],4,1),
    // new P('Griffith','Fossil','Watches',600,new Colors(['black','silver']),['leather'],4,1),
    // new P('Gunmetal Rose','Fossil','Watches',710,new Colors(['black',dg]),['iron'],4,1),
    // new P('Hayden','Fossil','Watches',440,new Colors(['coral',sb],['white']),['iron'],4,1),
    // new P('Heather','Fossil','Watches',500,new Colors(['brown',sb],['white']),['leather'],4,1),
    // new P('Hustle','Fossil','Watches',820,new Colors(['black','gold']),['iron'],5,2),
    // new P('Indie','Fossil','Watches',595,new Colors(['grey','coral','white']),['leather'],5,2),
    // new P('Iron Elm','Fossil','Watches',615,new Colors(['grey','silver','white']),['leather'],4,0),
    // new P('Iso','Fossil','Watches',900,new Colors([dg,'grey']),['iron'],4,0),
    // new P('Ivory Oak','Fossil','Watches',880,new Colors(['brown','white'],['coral']),['leather'],4,0),
    // new P('Jaded Rose','Fossil','Watches',700,new Colors(['coral','white']),['iron'],4,1),
    // new P('Jet Noir','Fossil','Watches',1020,new Colors(['black','grey'],['silver']),['leather'],4,0),
    // new P('Joyride','Fossil','Watches',670,new Colors(['black'],['skyblue']),['leather'],5,2),
    // new P('Libra','Fossil','Watches',400,new Colors(['pink','coral','white']),['leather'],4,1),
    // new P('Limitless','Fossil','Watches',840,new Colors(['silver','white']),['iron'],4,0),
    // new P('Lynx','Fossil','Watches',620,new Colors(['pink','coral',sb]),['leather'],4,1),
    // new P('Magnolia Marble','Fossil','Watches',950,new Colors(['coral','black']),['iron'],4,1),
    // new P('Marble Box','MVMT','Watches',2100,new Colors(['grey',sb,'black','white']),['leather','bronze'],7,1),
    // new P('Mason','Patek Philippe','Watches',1400,new Colors(['black','gold']),['iron'],4,0),
    // new P('Modern Sport Nude','Patek Philippe','Watches',1240,new Colors([nw,sb],['red']),['iron'],4,0),
    // new P('Monochrome Box','MVMT','Combo-Box',1900,new Colors(['grey','silver']),['leather','iron'],7,0),
    // new P('Nova Gritty Glow','Patek Philippe','Watches',980,new Colors(['grey','silver'],['coral']),['leather'],4,0),
    // new P('Oath','Patek Philippe','Watches',1330,new Colors(['black'],['skyblue']),['iron'],5,2),
    // new P('Obsidian Raven','Patek Philippe','Watches',800,new Colors(['black']),['iron'],4,0),
    // new P('Odyssey Gritty Glow','Patek Philippe','Watches',1310,new Colors(['grey','silver']),['iron'],4,0),
    // new P('Orion Box','MVMT','Combo-Box',2560,new Colors(['grey','dimgrey']),['iron','bronze'],5,1),
    // new P('Paradox','Patek Philippe','Watches',2070,new Colors(['black'],['silver']),['iron'],4,0),
    // new P('Payton','Patek Philippe','Watches',1100,new Colors(['gold','grey','white']),['leather'],4,1),
    // new P('Pelham','Patek Philippe','Watches',990,new Colors(['grey','silver']),['leather'],5,2),
    // new P('Rallye Green Gunmetal','Patek Philippe','Watches',2000,new Colors(['green','grey']),['iron'],4,0),
    // new P('Rallye Green Sandstone','Patek Philippe','Watches',1410,new Colors(['beige','brown','green','grey','tan']),['leather'],4,0),
    // new P('Revolver Gritty Glow','Patek Philippe','Watches',980,new Colors(['grey','silver'],['coral']),['leather'],4,0),
    // new P('Revolver Nude','Patek Philippe','Watches',1140,new Colors([nw,sb,],['silver','coral']),['iron'],4,0),
    // new P('Rosecrans','Patek Philippe','Watches',870,new Colors(['pink','coral']),['leather'],4,1),
    // new P('Sandstone Box','MVMT','Combo-Box',1900,new Colors(['black','tan'],['skyblue']),['leather'],5,0),
    // new P('Santa Monica Box','MVMT','Watches',3300,new Colors(['black','coral']),['leather','bronze'],5,1),
    // new P('Signature II Gritty Glow','Patek Philippe','Watches',995,new Colors(['grey','silver'],['coral']),['leather'],4,1),
    // new P('Silver Myst','Patek Philippe','Watches',1800,new Colors(['grey'],['black']),['leather'],4,0),
    // new P('Skylar','Patek Philippe','Watches',1520,new Colors(['aqua','silver']),['iron'],4,1),
    // new P('Slate Box','MVMT','Combo-Box',1870,new Colors(['black']),['iron','leather'],5,0),
    // new P('Starlight Black','Patek Philippe','Watches',2500,new Colors(['black','grey']),['iron'],4,0),
    // new P('Sterling Daisy','Patek Philippe','Watches',920,new Colors(['silver','white','saddleBrown']),['leather'],4,1),
    // new P('Stone Rouge','Patek Philippe','Watches',1290,new Colors(['yellow','white','silver']),['iron'],5,1),
    // new P('Storm Gold','Patek Philippe','Watches',750,new Colors(['gold','grey']),['leather'],4,1),
    // new P('Terra','Patek Philippe','Watches',880,new Colors(['yellow','white','silver']),['leather'],4,1),
    // new P('Thirteen','Patek Philippe','Watches',1640,new Colors(['gold','white'],['red']),['iron'],5,2),
    // new P('Umbra','Patek Philippe','Watches',1060,new Colors(['gold,orange,white']),['leather'],4,1),
    // new P('Voyager Gritty Glow','Patek Philippe','Watches',1300,new Colors(['grey','silver','balck'],['red']),['leather'],4,0),
    // new P('Venice Marble','Patek Philippe','Watches',2330,new Colors(['silver','white']),['iron'],4,0),
    // new P('Voyager Nude','Patek Philippe','Watches',1380,new Colors(['grey',nw, sb],['coral']),['leather'],4,0),   
    // new P('Voyager Kolder Edition','MVMT','Combo-Box',1650,new Colors(['black','silver'],['saddleBrown']),['iron, leather'],6,0),
    // new P('Zodiac Pink','Ray-Ban','Sunglasses',340,new Colors(['pink','silver']),['iron'],4,1),
    // new P('Zodiac Dark','Ray-Ban','Sunglasses',330,new Colors(['black']),['iron'],5,2),
    // new P('Street Goggle Black','Ray-Ban','Sunglasses',410,new Colors(['black']),['plastic'],4,0),
    // new P('Street Goggle Pink','Ray-Ban','Sunglasses',410,new Colors(['pink','red']),['plastic'],4,1),
    // new P('Rio Everscroll','Ray-Ban','Sunglasses',210,new Colors(['black','yellow']),['plastic'],4,0),
    // new P('Reveler Everscroll White','Ray-Ban','Sunglasses',560,new Colors(['white']),['plastic'],4,0),
    // new P('Reveler Everscroll Black','Ray-Ban','Sunglasses',500,new Colors(['black']),['plastic'],4,0),
    // new P('Nu Wave','Cartier','Sunglasses',720,new Colors(['black','orange']),['plastic'],5,1),
    // new P('Nu Wave Pink','Cartier','Sunglasses',720, new Colors(['pink','white']),['plastic'],4,1),
    // new P('Kilo','Cartier','Sunglasses',720,new Colors(['black']),['iron'],4,0),
    // new P('Mogul Lime','Cartier','Sunglasses',600,new Colors(['lime']),['plastic'],4,1),
    // new P('Mogul Dark','Cartier','Sunglasses',620,new Colors(['black']),['plastic'],4,1),
    // new P('Maverick','Cartier','Sunglasses',400,new Colors(['black']),['iron'],4,1),
    // new P('Loveless Purple','Cartier','Sunglasses',310,new Colors(['blue'],['black']),['iron'],4,1),
    // new P('Loveless Pink','Cartier','Sunglasses',310,new Colors(['pink'],['nyde']),['iron'],4,1),
    // new P('Loveless Lime','Cartier','Sunglasses',310,new Colors(['lime'],['silver']),['iron'],4,1),
    // new P('Tokyo Black','Cartier','Sunglasses',640,new Colors(['black']),['plastic'],5,2),
    // new P('Tokyo Red','Cartier','Sunglasses',600,new Colors(['saddleBrown'],[nw]),['plastic'],4,1),
    // new P('Tokyo Tiger','Cartier','Sunglasses',700,new Colors(['black',sb]),['plastic'],4,1),
    // new P('Highball Black','Cartier','Sunglasses',900,new Colors(['black']),['plastic'],5,2),
    // new P('Highball Blue-Yellow','Cartier','Sunglasses',950,new Colors(['blue','gold','yellow']),['plastic'],5,2),
    // new P('Cypher Gold','Ray-Ban','Sunglasses',670,new Colors(['coral','gold'],['black']),['iron'],5,2),
    // new P('Cypher Black','Ray-Ban','Sunglasses',680,new Colors(['black']),['iron'],5,2),
    // new P('Voodoo Dark','Ray-Ban','Sunglasses',900,new Colors(['black']),['iron'],4,1),
    // new P('Voodoo White-Tiger','Ray-Ban','Sunglasses',1050,new Colors(['saddleBrown'],['black','grey']),['plastic'],3,1),
    // new P('Cypher Blue','Ray-Ban','Sunglasses',685,new Colors(['blue','gold'],['saddleBrown']),['iron'],5,2),
    // new P('Bombay Black','Ray-Ban','Sunglasses',700,new Colors(['black']),['plastic'],4,1),
    // new P('Bombay Rose','Ray-Ban','Sunglasses',750,new Colors(['pink','white']),['plastic'],4,1),
    // new P('Bombay Aqua','Ray-Ban','Sunglasses',700,new Colors(['aqua']),['plastic'],4,1),



//-------------------------------------------------------------------------








    
    


    






    
    new P('Crown Cuff Bronze','Tiffany & Co.','Bracelets',450,new Colors(['coral']),['bronze'],3,1),
    new P('Crown Cuff Silver','Tiffany & Co.','Bracelets',650,new Colors(['silver']),['silver'],3,1),
    new P('Crown Cuff Gold','Tiffany & Co.','Bracelets',1250,new Colors(['gold']),['gold'],3,1),
    new P('Origin Bracelet Bronze','Tiffany & Co.','Bracelets',500,new Colors(['coral']),['bronze'],3,1),
    new P('Origin Bracelet Silver','Tiffany & Co.','Bracelets',900,new Colors(['silver']),['silver'],3,1),
    new P('Origin Bracelet Gold','Tiffany & Co.','Bracelets',1620,new Colors(['gold']),['gold'],3,1),
    new P('Origin Necklace Bronze','Tiffany & Co.','Necklaces',670,new Colors(['coral']),['bronze'],3,1),
    new P('Origin Necklace Silver','Tiffany & Co.','Necklaces',1100,new Colors(['silver']),['silver'],3,1),
    new P('Origin Necklace Gold','Tiffany & Co.','Necklaces',2150,new Colors(['gold']),['gold'],3,1),
    new P('Prism Charm Bracelet Bronze','Bvlgari','Bracelets',650,new Colors(['coral']),['bronze'],3,1),
    new P('Prism Charm Bracelet Silver','Bvlgari','Bracelets',1000,new Colors(['silver']),['silver'],3,1),
    new P('Prism Charm Bracelet Gold','Bvlgari','Bracelets',1400,new Colors(['gold']),['gold'],3,1),
    new P('Prism Charm Choker Bronze','Bvlgari','Necklaces',800,new Colors(['coral']),['bronze'],3,1),
    new P('Prism Charm Choker Silver','Bvlgari','Necklaces',1200,new Colors(['silver']),['silver'],3,1),
    new P('Prism Charm Choker Gold','Bvlgari','Necklaces',2300,new Colors(['gold']),['gold'],3,1),
    new P('Prism Lariat Necklace Bronze','Bvlgari','Necklaces',850,new Colors(['coral']),['bronze'],3,1),
    new P('Prism Lariat Necklace Silver','Bvlgari','Necklaces',1240,new Colors(['silver']),['silver'],3,1),
    new P('Prism Lariat Necklace Gold','Bvlgari','Necklaces',1800,new Colors(['gold']),['gold'],3,1),
    new P('Prism Charm Cuff Bronze','Bvlgari','Bracelets',350,new Colors(['coral']),['bronze'],3,1),
    new P('Prism Charm Cuff Silver','Bvlgari','Bracelets',750,new Colors(['silver']),['silver'],3,1),
    new P('Prism Charm Cuff Gold','Bvlgari','Bracelets',1150,new Colors(['gold']),['gold'],3,1),
    new P('Prism Pendant Choker Bronze','Bvlgari','Necklaces',900,new Colors(['coral']),['bronze'],3,1),
    new P('Prism Pendant Choker Silver','Bvlgari','Necklaces',1650,new Colors(['silver']),['silver'],3,1),
    new P('Prism Pendant Choker Gold','Bvlgari','Necklaces',3100,new Colors(['gold']),['gold'],3,1),
    new P('Twist Cuff Bronze','Tiffany & Co.','Bracelets',550,new Colors(['coral']),['bronze'],3,1),
    new P('Twist Cuff Silver','Tiffany & Co.','Bracelets',840,new Colors(['silver']),['silver'],3,1),
    new P('Twist Cuff Gold','Tiffany & Co.','Bracelets',1320,new Colors(['gold']),['gold'],3,1),
  ]

  checkDb(){
    this.dbf.collection('products').valueChanges().subscribe(console.log)
  }


  clearDb(){
    this.db.getIdArray('products').subscribe(id => {

      id.forEach(item => this.dbf.collection('products').doc(item).delete().then(res => console.log('deleted')))
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


  f(){
    let objs: object[] = this.prods.map(item => this.copy(item))

    objs = this.shuffle(objs)
    console.log(this.prods)
    console.log(objs)
  }

  push(){
    // objs = this.shuffle(objs)

    let objs: object[] = this.prods.map(item => this.copy(item))

    objs.forEach(item => {
      item['details'].colors = this.copy(item['details'].colors)
    })
    console.log('​WorkingWithDbComponent -> push -> objs', objs)

    objs.forEach(item => this.dbf.collection('products').add(item).then(res => console.log('done')))



    
    // objs.forEach(item =>  console.log(item))
  }

  ngOnInit() {
  }

}
