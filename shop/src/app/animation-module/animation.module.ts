import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowComponent } from './components/flow/flow.component';
import { FlowCascadeComponent } from './components/flow-cascade/flow-cascade.component';
import { FlowCascadeStepComponent } from './components/flow-cascade/flow-cascade-step/flow-cascade-step.component';
import { BlinkOnChangesDirective } from './directives/blink-on-changes.directive';
import { AnimSoftClickDirective } from './directives/anim-soft-click.directive';
import { BlinkOnValueChangesDirective } from './directives/blink-on-value-changes.directive';

@NgModule({
  declarations: [
    FlowComponent,
    FlowCascadeComponent,
    FlowCascadeStepComponent,
    BlinkOnChangesDirective,
    AnimSoftClickDirective,
    BlinkOnValueChangesDirective,
  ],

  imports: [
    CommonModule,
  ],
  
  exports: [
    FlowComponent,
    FlowCascadeComponent,
    FlowCascadeStepComponent,
    BlinkOnChangesDirective,
    AnimSoftClickDirective,
    BlinkOnValueChangesDirective,
  ],
})
export class AnimationModule {}
