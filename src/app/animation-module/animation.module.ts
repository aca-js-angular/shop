import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowComponent } from './components/flow/flow.component';
import { ForkOnChangesDirective } from './directives/fork-on-changes.directive';

@NgModule({
  declarations: [
    FlowComponent,
    ForkOnChangesDirective,
  ],

  imports: [
    CommonModule,
  ],
  
  exports: [
    FlowComponent,
    ForkOnChangesDirective,
  ],
})
export class AnimationModule {}
