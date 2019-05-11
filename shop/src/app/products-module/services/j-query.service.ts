import { Injectable } from '@angular/core';

declare var $: any;


@Injectable({
  providedIn: 'root'
})
export class JQueryZoomService {

  constructor() { }

  /**
   * @param imgClassName 
   * @description No Point Only Classname (Classname)
   */
  jQueryZoomImg(imgClassName: string = 'main-img'): void {
    this.jQueryZoom(imgClassName)
  }


  clearjQueryZoomScreans(): void {
    document.querySelectorAll('.zoomContainer').forEach(zoomElem => zoomElem.remove());
  }



  private jQueryZoom(imgClassName: string) {
    $(document).ready(function () {
      $(`.${imgClassName}`).ezPlus({
        zoomWindowFadeIn: 500,
        zoomWindowWidth: 550,
        zoomWindowHeight: 350,
        zoomWindowOffsetX: 0,
        zoomWindowOffsetY: 0,
        scrollZoom: true,
        cursor: 'pointer'
      });
    });
  }



  hidChatBox(toggleElementClassname: string) {

    $('.live-chat header').on('click', function () {
      $('.chat').slideToggle(300, 'swing');
      $('.chat-message-counter').fadeToggle(300, 'swing');
    });

    $('.chat-close').on('click', function (e) {

      e.preventDefault();
      $('#live-chat').fadeOut(300);

    });

  };

}
