import { Component } from '@angular/core';

@Component({
  selector: 'app-category-panel',
  templateUrl: './category-panel.component.html',
  styleUrls: ['./category-panel.component.scss']
})
export class CategoryPanelComponent {

  shouldOpen: boolean = false;

  closeMenu = (e: MouseEvent) => {
    const target = e.target as HTMLImageElement;
    if(target.id === 'menu-item')return;
    this.shouldOpen = false;
    document.removeEventListener('click',this.closeMenu);
  }

  openMenu(){
    this.shouldOpen = true;
    document.addEventListener('click',this.closeMenu);
  }

}
