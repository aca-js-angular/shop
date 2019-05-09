import { Component } from '@angular/core';
import { FlowCascadeService } from './flow-cascade.service';

@Component({
  selector: 'anim-flow-cascade',
  templateUrl: './flow-cascade.component.html',
  styleUrls: ['./flow-cascade.component.scss'],
  providers: [FlowCascadeService]
})

export class FlowCascadeComponent {

  constructor(private fcs: FlowCascadeService){}

}
