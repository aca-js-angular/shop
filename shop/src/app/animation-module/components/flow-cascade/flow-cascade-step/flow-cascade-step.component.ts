import { Component } from '@angular/core';
import { FlowCascadeService } from '../flow-cascade.service';

@Component({
  selector: 'anim-flow-cascade-step',
  templateUrl: './flow-cascade-step.component.html',
  styleUrls: ['./flow-cascade-step.component.scss'],
  providers: [FlowCascadeService]
})
export class FlowCascadeStepComponent {

  constructor(private fcs: FlowCascadeService){}

}
