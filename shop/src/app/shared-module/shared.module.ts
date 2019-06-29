import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidityFeedbackDirective } from './directives/validity-feedback.directive';
import { ForcedFormatDirective } from './directives/forced-format.directive';
import { SingleClickDirective } from './directives/single-click.directive';
import { PersistanceDirective } from './directives/persistance.directive';
import { OnlyDigitsDirective, NoDigitsDirective, OnlyAlphabetDirective, NaturalNumbersDirective } from './directives/restrictions.directive';
import { ConsoleDirective } from './directives/console.directive';
import { DashPipe } from './pipes/dash.pipe';
import { RatingPipe } from './pipes/rating.pipe';

@NgModule({
  
  declarations: [
    ValidityFeedbackDirective,
    ForcedFormatDirective,
    SingleClickDirective,
    PersistanceDirective,
    OnlyDigitsDirective,
    NoDigitsDirective,
    OnlyAlphabetDirective,
    NaturalNumbersDirective,
    ConsoleDirective,
    DashPipe,
    RatingPipe,
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
    NaturalNumbersDirective,
    ConsoleDirective,
    DashPipe,
    RatingPipe,
  ]

})
export class SharedModule { }
