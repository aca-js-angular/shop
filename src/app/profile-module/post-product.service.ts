import { Injectable } from '@angular/core';
import { DatabaseFireService } from '../database-fire.service';
import { FaService } from '../fa-module/services/fa.service';
import { Vendor } from '../interfaces/vendor.interface';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { User } from '../interfaces/user.interface';
import { Product } from '../interfaces/product.interface';

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
    this.addVendor();
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


  createVendor(): Promise<Vendor> {
    return new Promise(resolve => {
      this.db.getDocumentById<User>('users',this.fa.currentUser.uid).subscribe(user => {
        resolve({
          fullName: user.firstName + ' ' + user.lastName,
          country: user.country,
          city: user.city,
          email: user.email,
          img: this.fa.currentUser.photoURL,
          rating: 3,
        })
      })
    })
  }

  isVendor(): Promise<boolean> {
    return new Promise(resolve => {
      this.db.getIdArray('vendors').subscribe(ids => {
        resolve(ids.includes(this.fa.currentUser.uid))
      })
    })
  }

  addVendor(){
    this.isVendor().then(res => {
      if(res)return;
      else{
        this.createVendor().then(vendor => {
          this.db.postDataWithId<Vendor>('vendors',this.fa.currentUser.uid,vendor)
        }) 
      }
    })
  }

  showCurrentUser(){
    console.log(this.fa.currentUser)
  }
}
