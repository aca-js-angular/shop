import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { Product } from 'src/app/interfaces/product.interface';
import { Review } from 'src/app/interfaces/review.interface';
import { ProfileDataService } from '../../services/profile-data.service';


enum ProfileSections {
  reviews,
  personal,
  products,
  post_product,
}


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})

export class ProfilePageComponent implements OnChanges {

  constructor( private pd: ProfileDataService) {}


  /* --- Variables --- */

  @Input() currentUid: string;
  isAuthProfile: boolean;
  selectedSection: ProfileSections;
  sections = ProfileSections;

  selectedUser$: Observable<User>;
  reviews$: Observable<Review[]>;
  postedProducts$: Promise<Product[]>;


  /* --- Methods --- */

  selectSection(section: ProfileSections){
    this.selectedSection = section;
  }


  /* --- LC-hooks --- */

  ngOnChanges() {
    this.selectSection(this.sections.personal);
    this.isAuthProfile = this.pd.isAuthProfile(this.currentUid);
    this.postedProducts$ = this.pd.getUsersPostedProducts(this.currentUid);
    this.selectedUser$ = this.pd.getUser(this.currentUid);
    this.reviews$ = this.pd.getUserReviews(this.currentUid);
  }









































//   postForm = this.build.group({
//     name: [''],
//     brand: [''],
//     category: [],
//     gender: [],
//     price: [''],
//     mainColor: this.build.array([
//       this.build.control(''),
//     ]),
//     additionalColor: this.build.array([
//       this.build.control(''),
//     ]),
//     originCountry: [''],
//     weight: [''],
//     material: this.build.array([
//       this.build.control(''),
//     ]),

//   })



//   selectedFiles: File[] = [];
//   selectedImages: string[] = [];
//   colors: string[] = CSS_COLOR_NAMES


//   /* --- Getters --- */

//   get name(): FormControl {
//     return this.postForm.get('name') as FormControl
//   }
//   get brand(): FormControl {
//     return this.postForm.get('brand') as FormControl
//   }
//   get category(): FormControl {
//     return this.postForm.get('category') as FormControl
//   }
//   get gender(): FormControl {
//     return this.postForm.get('gender') as FormControl
//   }
//   get price(): FormControl {
//     return this.postForm.get('price') as FormControl
//   }
//   get weight(): FormControl {
//     return this.postForm.get('weight') as FormControl
//   }
//   get originCountry(): FormControl {
//     return this.postForm.get('originCountry') as FormControl
//   }


//   /* --- Form-Arrays --- */

//   get mainColor(): FormArray {
//     return this.postForm.get('mainColor') as FormArray
//   }
//   get additionalColor(): FormArray {
//     return this.postForm.get('additionalColor') as FormArray
//   }
//   get material(): FormArray {
//     return this.postForm.get('material') as FormArray
//   }


//   /* --- Methods --- */

//   getFormArrayValues(form: FormArray): string[] {
//     return form.controls.map(control => control.value)
//   }

//   addControl(control: FormArray) {
//     control.push(this.build.control(''))
//   }

//   removeControl(control: FormArray, index: number) {
//     control.removeAt(index)
//   }

//   deleteSelectedImgItem(i: number){
//     this.selectedImages.length &&
//     this.selectedImages.splice(i,1);
//   }

//   addImgFile(event) {
//     const file = event.target.files[0];
//     if(!file) return;

//     const selectedImgRef = this.selectedImages;
//     const selectedFilesRef = this.selectedFiles;
//     const imgReader = new FileReader();

//     const subscribeEmitImg = emitNewImage.subscribe(imgCode => {
//       imgReader.readAsDataURL(file);
//       imgReader.onload = function(event){
//         selectedImgRef.push(event.target['result']);
        
//         selectedImgRef[selectedImgRef.length-1] = imgCode;
//         selectedFilesRef.push(file);
//         subscribeEmitImg.unsubscribe(); 
//       }
//       imgReader.onerror = () => subscribeEmitImg.unsubscribe();
//     })

//   }


//   postProduct() {
//     this.post.addProduct(
//       this.name.value,
//       this.brand.value,
//       this.category.value,
//       this.gender.value,
//       this.price.value,
//       this.selectedFiles,
//       this.getFormArrayValues(this.mainColor),
//       this.getFormArrayValues(this.additionalColor),
//       this.getFormArrayValues(this.material),
//       this.originCountry.value,
//       +this.weight.value
//     );

    
//   }


}