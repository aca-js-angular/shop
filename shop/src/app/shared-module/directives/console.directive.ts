import { Directive, Input, HostListener, ViewContainerRef } from '@angular/core';
import { Component } from '@angular/compiler/src/core';

@Directive({
  selector: '[_console]'
})
export class ConsoleDirective {

  @Input('_console') variable: any;
  hostComponent: Component;

  constructor(private viewRef: ViewContainerRef) {
    this.hostComponent = this.viewRef['_view'].component
  }

  @HostListener('click')consoleVariable(){
    window.console.log.call(this.hostComponent,this.variable)
  }

  

}
