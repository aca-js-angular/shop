import { Component, OnInit } from '@angular/core';
import { DatabaseFireService } from 'src/app/database-fire.service';
import { AngularFirestore } from '@angular/fire/firestore';

import {
  __randomNumber,
  __randomDate,
  __randomFrom,
  __shuffleArray,
  __copyObject,
  __symbol,
} from './helper-functions.ts/root';

import {
  BREAK_LINE,
  POINTING_ARROW,
} from './constants'
import { User } from 'src/app/interfaces/user.interface';

const uids = [
  "7CvTe6l75yOBhIfFJfwaykSO1fv1",
  "A6RARwwUEaZY1iSJYvS57gPlw3E3",
  "IlRzgypd1De8DRv6zqRavqBoe0G2",
  "O4RwscvqBMXeHv7Uy0DzdnWzoPE3",
  "OuR5yxCydEeiBMXGjQtp4kKMWGW2",
  "SllR8LhzU8V8OXBtCPJ8yib3k7x2",
  "f8tJkK2AJeQCKa387rkG3BOvL8G2",
  "ichcWpnAIJVgPDo9JYEWq9u828y1",
  "litmVnfIkKTktMkZnreLXOczak02",
  "nR7NUHbv00VtFt29XJ1q0eDzeLu1",
  "rGFsWsbjKaZwSZTLoNk0whSZUIf2",
  "rpNMYvuulvPyjo018hYDRW1gaIw2",
  "x72olHgptyXUclBeLhZUcjfLK8P2",
]







@Component({
  selector: 'app-db',
  templateUrl: './working-with-db.component.html',
  styleUrls: ['./working-with-db.component.scss']
})

export class WorkingWithDbComponent implements OnInit {

  allCollections: string[] = ['categories','products','users'];



  buffer: any[] = [];
  initialValue: any;


  bufferExpanded = false;

  constructor(
    private db: DatabaseFireService, 
    private dbf: AngularFirestore
  ) {}


  getRating(userId){
   const a = this.db.getDocumentById('users',userId).subscribe((user: User) => {
     const rating = Math.round((user.reviews.reduce((sum,current) => sum + current.evaluation,0) / user.reviews.length));
     console.log("TCL: WorkingWithDbComponent -> getRating -> raing", isNaN(rating))
    if(isNaN(rating)){
      user.rating = 0;
    } else {
      user.rating = rating;
    }
    this.userrrr = user
    a.unsubscribe()
    console.log( this.userrrr)
    });
  }
  userrrr: User;
  setRating(userId){
  this.db.updateData('users',userId, this.userrrr).then(r => console.log('updated'))
  }



  get bufferData(): string {
    return JSON.stringify(this.buffer);
  }

  get initialValueData(): string{
    return JSON.stringify(this.initialValue);
  }

  targetId: string;

  printId(name: string){
    this.db.getDocumentIdByUniqueProperty('products','name',name).then(res => this.targetId = res)
  }

  deleteProduct(){
    this.dbf.collection('products').doc(this.targetId).delete().then(_ => alert(`deleted product with id ${this.targetId}`))
  }

  printBuffer(){
    console.dir(this.buffer);
  }

  printCollection(collectionName: string, withIds: boolean = false){

    console.log(BREAK_LINE);
    console.log(`${collectionName.toUpperCase()} ${withIds ? '(with ids)' : ''}`, POINTING_ARROW);

    withIds ?
    this.db.getCollectionWithIds(collectionName).subscribe(console.log) :
    this.db.getCollection(collectionName).subscribe(console.log);

  }

  clearCollection(collectionName: string){
    const verification = confirm(`Are you sure you want to clear "${collectionName}" collection ? \nthis action can't be undone`);
    if(verification){
      const subscription = this.db.getIdArray(collectionName).subscribe(idArray => {
        if(!idArray.length){
          alert(collectionName + ' collection is already empty');
          subscription.unsubscribe();
          return;
        }
        idArray.forEach(id => this.dbf.collection(collectionName).doc(id).delete());
        alert(`deleted ${idArray.length} documents from ${collectionName} collection`);
        subscription.unsubscribe();
      })
    }
  }



  replenishCollection(collectionName: string,withIds: boolean = false){
    let message = `You are about to add ${this.buffer.length} documents to "${collectionName}" collection. \nThis action can't be undone, confirm to continue.`
    if(withIds){
      message += `\n\nBe aware. you are using custom ids mode. \nIf in buffer documents wouldn't be found extra "id" property random id will be applied`
    }
    const verification = confirm(message);
    if(verification){
      const documentsCopy: any[] = this.buffer.map(doc => __copyObject<any>(doc));
      const addTasks = documentsCopy.map(doc => {
        if(withIds && doc.id){
          const _id = doc.id;
          delete doc.id;
          return this.dbf.collection(collectionName).doc(_id).set(doc)
        }else{
          return this.dbf.collection(collectionName).add(doc) as Promise<unknown>;
        }
      });
      Promise.all(addTasks).then(_ => alert(`added ${documentsCopy.length} documents to "${collectionName}" collection`))
    }
  }



  storeInBuffer(collectionName: string, withIds: boolean = false){
    let verification = true;
    if(this.buffer.length){
      verification = confirm(`Your buffer currently is not empty. \nAll data will be overriden, confirm to continue`)
    }
    if(verification){
      if(withIds){
        const subscription = this.db.getCollectionWithIds(collectionName).subscribe(res => {
          this.buffer = res;
          subscription.unsubscribe();
        })
      }else{
        const subscription = this.db.getCollection(collectionName).subscribe(res => {
          this.buffer = res;
          subscription.unsubscribe();
        })
      } 
    }
  }


  addField(collectionName: string, fieldName: string){
    const subscription = this.db.getIdArray(collectionName).subscribe(idArray => {
      const updateTasks = idArray.map(id => this.dbf.collection(collectionName).doc(id).update({[fieldName] : this.initialValue}));
      Promise.all(updateTasks).then(_ => alert(`added/updated field "${fieldName}" with initial value ${this.initialValueData} on ${idArray.length} documents in collection "${collectionName}"`))
      subscription.unsubscribe();
    })
  }

  deleteField(collectionName: string, fieldName: string){
    const verification = confirm(`You are about to delete "${fieldName}" field on each document in "${collectionName}" collection. \nThis action can't be undone, confirm to continue`);
    if(verification){
      const subscription = this.db.getCollectionWithIds(collectionName).subscribe(docs => {
        const updateTasks: Promise<void>[] = [];
        docs.forEach(doc => {
          if(fieldName in doc){
            const _id = doc.id;
            delete doc.id;
            delete doc[fieldName];
            updateTasks.push(this.dbf.collection(collectionName).doc(_id).set(doc))
          }
        })
        if(updateTasks.length){
          Promise.all(updateTasks).then(_ => {
            alert(`"${fieldName}" field was found and deleted in ${updateTasks.length} documents from ${docs.length} in collection "${collectionName}"`);
          })
          subscription.unsubscribe();
        }
      })
    }
  }


  ngOnInit() {}

}











