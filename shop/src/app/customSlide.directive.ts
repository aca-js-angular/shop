import { Directive, TemplateRef, ViewContainerRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[_slide]'
})

export class CustomSlideDirective implements OnInit, OnDestroy {

  public context: any;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ){}

  private index: number = 0;
  private isRepeatable: boolean = false;
  private delay: number;

  @Input('_slideFrom') items: any[];

  @Input('_slideRepeat')

  set repeat(arg: boolean){
    if(arg)this.isRepeatable = true
  }

  @Input('_slideInit')

  set init(ind: number){
    this.index = ind - 1
  }

  @Input('_slideAutoplay')

  set autoplay(delay: number){
    this.delay = delay
    this._setAutoplay(this.delay)
  }

  private _timerId;

  private _setAutoplay(delay: number){
    this._timerId = window.setInterval(() => this.next(),delay)
  }

  private _clearAutoplay(){
    window.clearInterval(this._timerId)
  }

  private _resetTimer(){
    this._clearAutoplay();
    this._setAutoplay(this.delay);
  }
  
  ngOnInit(){
    this.context = {
      $implicit: this.items[this.index],
      next: () => this.next(),
      prev: () => this.prev(),
      index: this.ind
    }      
    this.viewContainer.createEmbeddedView(this.templateRef,this.context)
  }

  ngOnDestroy(){
    this._clearAutoplay()
  }

  get ind(){
    return this.index
  }

  private next(){
    this.index++
    this.checker()
    this.context.$implicit = this.items[this.index]
    this.context.index = this.ind
    this._resetTimer()
  }

  private prev(){
    this.index--
    this.checker()
    this.context.$implicit = this.items[this.index]
    this.context.index = this.ind
    this._resetTimer();
  }

  checker(){
    if(this.index === this.items.length){
      if(this.isRepeatable)this.index = 0
      else this.index--
    }
    else if(this.index === -1){
      if(this.isRepeatable)this.index = this.items.length - 1
      else this.index++
    }
  }

}