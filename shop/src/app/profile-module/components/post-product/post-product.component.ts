import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { PostProductService } from '../../services/post-product.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { CSS_COLOR_NAMES } from 'src/app/constants/css-colors.constant';
import { jQueryImagesResize } from '../../services/j-query-resizing';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss'],

})
export class PostProductComponent implements OnInit {

  @ViewChild('cropImagePopBtn') cropImagePopBtn: ElementRef<HTMLButtonElement>;
  @ViewChild('cropImagePop') cropImagePop: ElementRef<HTMLDivElement>;

  $destroyStream = new Subject<void>();
  imgReader = new FileReader();
  selectedFiles: File[] = [];
  selectedImages: string[] = [];
  colors: string[] = CSS_COLOR_NAMES;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;


  constructor(
    private build: FormBuilder,
    private post: PostProductService,
    private jQueryService: jQueryImagesResize,
  ) { }

  /* --- Variables --- */

  postForm = this.build.group({
    name: [''],
    brand: [''],
    category: [''],
    gender: [''],
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

  setUid(...uid) {
  }
  setIsAuth(...a) { }

  getFormArrayValues(form: FormArray): string[] {
    return form.controls.map(control => control.value)
  }

  addControl(control: FormArray) {
    control.push(this.build.control(''))
  }

  removeControl(control: FormArray, index: number, event: Event) {
    // event.stopPropagation()
    control.removeAt(index)
  }



  addFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFiles.push(event.target.files[0]);
  }

  addSrc(event, arr: string[]) {

    const file = event.target.files[0];
    if (!file) return;
    let imgReader = new FileReader();
    imgReader.readAsDataURL(file)
    imgReader.onload = function (event) {
      arr.push(event.target['result'])
    }

  }

  disableEnterKeydown: boolean;

  postProduct() {
    if (this.disableEnterKeydown) return;


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
      +this.weight.value
    );

  }


  ngOnInit() {
    this.jQueryService.resizeJQuery();


  }
}