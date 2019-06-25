import { Component, ViewChild, ElementRef, Input, SimpleChange, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { FlowService } from 'src/app/animation-module/components/flow/flow.service';

@Component({
  selector: 'anim-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss'],
  providers: [FlowService],
})
export class FlowComponent implements OnChanges, AfterViewInit {

  constructor(private fs: FlowService) {}

  /* ----- Inputs ----- */

  @Input() duration: number = 2;
  @Input() delay: number = 0;
  @Input() from: 'left' | 'right' | 'top' | 'bottom' = 'left';
  @Input() inline: boolean = false;
  @Input() if: boolean = true;
  @Input() zIndex: number = 0;
  @Input() overflow: number = 0;


  /* ----- Methods ----- */

  private doFlow(elem: HTMLElement){
    if(this.if){
      if(this.inline){
        elem.style.display = 'inline-block'
      }
      this.fs.flow({
        target: elem,
        duration: this.duration,
        delay: this.delay,
        from: this.from,
        overflow: this.overflow,
      })
    }
  }

  
  /* ----- References ----- */

  @ViewChild('ref') ref: ElementRef;
  native: HTMLElement;


  /* ----- LC hooks ----- */

  ngOnChanges(changes: SimpleChanges){
    if(changes['if'] && !changes['if'].isFirstChange()){
      this.doFlow(this.native)
    }
  }

  ngAfterViewInit(){
    this.native = this.ref.nativeElement;
    if(this.zIndex){
      this.native.style.zIndex = this.zIndex.toString();
      this.native.style.position = 'relative';
    }
    this.doFlow(this.native)
  }

}
