import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-panel',
  templateUrl: './category-panel.component.html',
  styleUrls: ['./category-panel.component.scss']
})
export class CategoryPanelComponent implements OnInit {

  shouldOpen: boolean = false;

  ngOnInit() {
    document.addEventListener('click',(e) => {
      const target = e.target as HTMLImageElement;
      if(target.id === 'menu-item')return;
      if(this.shouldOpen){
        this.shouldOpen = false;
      }
    })
  }

}
