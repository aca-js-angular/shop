import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormArray } from '@angular/forms';
import { PostProductService } from '../../services/post-product.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { CSS_COLOR_NAMES } from 'src/app/constants/css-colors.constant';
import { jQueryImagesResize, emitNewImage } from '../../services/j-query-resizing';
import { Subject } from 'rxjs';
import { ProductSingleComment } from 'src/app/interfaces/product-comment.interface';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss']
})
export class PostProductComponent implements OnInit {

  @ViewChild('cropImagePopBtn') cropImagePopBtn: ElementRef<HTMLButtonElement>;
  @ViewChild('cropImagePop') cropImagePop: ElementRef<HTMLDivElement>;

  $destroyStream = new Subject<void>()
  imgReader = new FileReader();
  selectedFiles: File[] = [];
  selectedImages: string[] = [];
  colors: string[] = CSS_COLOR_NAMES


  constructor(
    private build: FormBuilder,
    private post: PostProductService,
    private storage: AngularFireStorage,
    private jQueryService: jQueryImagesResize,
  ) { }

  /* --- Variables --- */

  postForm = this.build.group({
    name: [''],
    brand: [''],
    category: [],
    gender: [],
    price: [''],
    mainColor: this.build.array([
      this.build.control(''),
    ]),
    additionalColor: this.build.array([
      this.build.control(''),
    ]),
    originCountry: [''],
    weight: [''],
    material: this.build.array([
      this.build.control(''),
    ]),

  })


  /* --- Getters --- */

  get name(): FormControl {
    return this.postForm.get('name') as FormControl
  }
  get brand(): FormControl {
    return this.postForm.get('brand') as FormControl
  }
  get category(): FormControl {
    return this.postForm.get('category') as FormControl
  }
  get gender(): FormControl {
    return this.postForm.get('gender') as FormControl
  }
  get price(): FormControl {
    return this.postForm.get('price') as FormControl
  }
  get weight(): FormControl {
    return this.postForm.get('weight') as FormControl
  }
  get originCountry(): FormControl {
    return this.postForm.get('originCountry') as FormControl
  }

  /* --- Form-Arrays --- */

  get mainColor(): FormArray {
    return this.postForm.get('mainColor') as FormArray
  }
  get additionalColor(): FormArray {
    return this.postForm.get('additionalColor') as FormArray
  }
  get material(): FormArray {
    return this.postForm.get('material') as FormArray
  }


  /* --- Methods --- */

  getFormArrayValues(form: FormArray): string[] {
    return form.controls.map(control => control.value)
  }

  addControl(control: FormArray) {
    control.push(this.build.control(''))
  }

  removeControl(control: FormArray, index: number) {
    control.removeAt(index)
  }

  deleteSelectedImgItem(i: number){
    this.selectedImages.length &&
    this.selectedImages.splice(i,1);
   
    this.selectedFiles.length &&
    this.selectedFiles.splice(i,1);

  }
  
  
  closeEventListeners(){
    if(this.cropImagePopBtn && this.cropImagePop){
      this.cropImagePopBtn.nativeElement.onclick = this.abortUploading;
      this.cropImagePop.nativeElement.onclick = this.abortUploading;
      }
  }

  abortUploading(){
    console.log('clicked clos fields')
      if(this.imgReader){
        this.imgReader.onload = null;
      //  this.unsubscribeCloseEventListeners();
       console.log( this.closeEventListeners)
    } else {
  
      console.log( this.closeEventListeners)
    }
  }



  addImgFile(event) {
    this.cropImagePopBtn.nativeElement.addEventListener('click',this.abortUploading);
    this.cropImagePop.nativeElement.addEventListener('click',this.abortUploading);


    const file = event.target.files[0];
    if(!file) return;

    const selectedImgRef = this.selectedImages;
    const selectedFilesRef = this.selectedFiles;


    const subscribeEmitImg = emitNewImage.subscribe(imgCode => {
      this.imgReader.readAsDataURL(file);

      this.imgReader.onload = function(event){

        selectedImgRef.push(event.target['result']);
        
        selectedImgRef[selectedImgRef.length-1] = imgCode;
        selectedFilesRef.push(file);
        subscribeEmitImg.unsubscribe(); 
        console.log(selectedFilesRef)
      }
      this.imgReader.onerror = () => subscribeEmitImg.unsubscribe();
    })

  }


  postProduct() {
    this.post.addProduct(
      this.name.value,
      this.brand.value,
      this.category.value,
      this.gender.value,
      this.price.value,
      this.selectedFiles,
      this.getFormArrayValues(this.mainColor),
      this.getFormArrayValues(this.additionalColor),
      this.getFormArrayValues(this.material),
      this.originCountry.value,
      +this.weight.value,
    );

    
  }


  ngOnInit() {
    this.jQueryService.resizeJQuery();


  }


}
