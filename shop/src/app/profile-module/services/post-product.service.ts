import { Injectable } from '@angular/core';
import { DatabaseFireService } from '../../database-fire.service';
import { FaService } from '../../fa-module/services/fa.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Product } from '../../interfaces/product.interface';
import { ProductSingleComment } from 'src/app/interfaces/product-comment.interface';
import { OpenDialogService } from 'src/app/fa-module/services/open-dialog.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class PostProductService {

  constructor(
    private db: DatabaseFireService,
    private fa: FaService,
    private storage: AngularFireStorage,
    private dialog: OpenDialogService,
    private router: Router,
    private afs: AngularFirestore,
  ){}

  addImage(img: File, name: string): Promise<string> {
    return new Promise(resolve => {
      const storageRef: AngularFireStorageReference = this.storage.ref('product-images');
      const uploadTask: AngularFireUploadTask = storageRef.child(name).put(img);
      uploadTask.then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
          resolve(url);
        }) 
      })
    })
  }


  addMultipleImages(images: File[], name: string): Promise<string[]> {
    return new Promise(resolve => {
      const storageRef: AngularFireStorageReference = this.storage.ref(`product-images/${name}`);
      const uploadTasks: AngularFireUploadTask[] = []
      images.forEach((img,index) => {
        uploadTasks.push(storageRef.child(index.toString()).put(img))
      })
      Promise.all([...uploadTasks]).then(snapshots => {
        const getUrls: Promise<string>[] = [];
        snapshots.forEach(snapshot => getUrls.push(snapshot.ref.getDownloadURL()))
        Promise.all([...getUrls]).then(urls => resolve(urls))
      })
    })
  }


  addProduct(name: string, brand: string, category: string, gender: 'men' | 'women', price: number, img: File[], mainColors: string[], additionalColors: string[], material: string[], originCountry: string, weight: number){
    const x = this.afs.createId();
    // console.log(name)
    this.addMultipleImages(img,name).then(ref => {
      this.db.postDataWithId('products',x,this.createProduct(name, brand, category, gender, price, ref, mainColors, additionalColors, material, originCountry, weight)).then(_ => this.dialog.openConfirmMessage({message: ['Your Post was succesfully published'],okText: 'Go to your post', cancelText: 'OK', accept: (() => {
        this.router.navigate(['/','product',x]).then(_ => window.scrollTo(0,0))
      })}))
    })
  }

  createProduct(
    name: string,
    brand: string,
    category: string,
    gender: 'men' | 'women',
    price: number,
    images: string[],
    mainColors: string[],
    additionalColors: string[],
    material: string[],
    originCountry: string,
    weight: number,

  ): Product {

    console.log(name);

    return {
      name,
      brand,
      category,
      gender,
      price,
      images,
      postDate: Date.now(),

      details: {
        colors: {
          main: mainColors,
          additional: additionalColors,
        },
        material: material,
        originCountry,
        weight,
      },

      rating: 3,
      vendor: this.fa.currentUser.uid,
      comments: [] as ProductSingleComment[],
    }
  }

}
