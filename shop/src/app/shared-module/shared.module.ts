import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidityFeedbackDirective } from './directives/validity-feedback.directive';
import { ForcedFormatDirective } from './directives/forced-format.directive';
import { SingleClickDirective } from './directives/single-click.directive';
import { PersistanceDirective } from './directives/persistance.directive';
import { OnlyDigitsDirective, NoDigitsDirective, OnlyAlphabetDirective } from './directives/restrictions.directive';

@NgModule({
  
  declarations: [
    ValidityFeedbackDirective,
    ForcedFormatDirective,
    SingleClickDirective,
    PersistanceDirective,
    OnlyDigitsDirective,
    NoDigitsDirective,
    OnlyAlphabetDirective,
  ],

  imports: [
    CommonModule
  ],

  exports: [
    ValidityFeedbackDirective,
    ForcedFormatDirective,
    SingleClickDirective,
    PersistanceDirective,
    OnlyDigitsDirective,
    NoDigitsDirective,
    OnlyAlphabetDirective,
  ]

})
export class SharedModule { }
