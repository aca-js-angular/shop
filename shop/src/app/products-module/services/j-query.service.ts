import { Injectable } from '@angular/core';
import { ZoomConfig } from 'src/app/interfaces/zoom-config.interface';

declare var $: any;


@Injectable({
  providedIn: 'root'
})
export class JQueryZoomService {

  constructor() {}

  /**
   * @param imgClassName 
   * @description No Point Only Classname (Classname)
   */
  jQueryZoomImg(imgClassName: string, config: ZoomConfig): void {
      this.jQueryZoom(imgClassName,config)
  }


  clearjQueryZoomScreans(): void {
    document.querySelectorAll('.zoomContainer').forEach(zoomElem => zoomElem.remove());
  }



  private jQueryZoom(imgClassName: string,config: ZoomConfig) {

    $(document).ready(function () {
      try{
        $(`.${imgClassName}`).ezPlus(config);
      }catch(error){
        console.warn('ERROR_FROM_CATCH: \n' + error)
      }
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
