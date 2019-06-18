import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[_inactive]',
})

export class SingleClickDirective {

  @Input() 
  @HostBinding('disabled')
  @HostBinding('class.inactive') // class "inactive" declared in global styles.scss
  _inactive: boolean;

}