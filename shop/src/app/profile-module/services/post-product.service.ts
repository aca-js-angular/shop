import { Injectable } from '@angular/core';
import { DatabaseFireService } from '../../database-fire.service';
import { FaService } from '../../fa-module/services/fa.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Product } from '../../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})

export class PostProductService {

  constructor(
    private db: DatabaseFireService,
    private fa: FaService,
    private storage: AngularFireStorage,
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
    this.addMultipleImages(img,name).then(ref => {
      this.db.postData('products',this.createProduct(name, brand, category, gender, price, ref, mainColors, additionalColors, material, originCountry, weight))
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
      vendor: this.fa.currentUser.uid
    }
  }

}
