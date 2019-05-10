import { Component, AfterViewInit } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements AfterViewInit {

  constructor(){}

  help = false;

  getHelp(){
    this.help = true
    setTimeout(() => this.help = false,1000)
  }

  /* --- LC hooks --- */

  ngAfterViewInit() {
    var parallax = function (e) {
      var windowWidth = $(window).width();
      if (windowWidth < 768) return;
      var halfFieldWidth = $(".parallax").width() / 2,
        halfFieldHeight = $(".parallax").height() / 2,
        fieldPos = $(".parallax").offset(),
        x = e.pageX,
        y = e.pageY - fieldPos.top,
        newX = (x - halfFieldWidth) / 30,
        newY = (y - halfFieldHeight) / 30;
      $('.parallax [class*="wave"]').each(function (index) {
        $(this).css({
          transition: "",
          transform:
            "translate3d(" + index * newX + "px," + index * newY + "px,0px)"
        });
      });
    },
      stopParallax = function () {
        $('.parallax [class*="wave"]').css({
          transform: "translate(0px,0px)",
          transition: "all .7s"
        });
        // $timeout(function () {
        //   $('.parallax [class*="wave"]').css("transition", "");
        // }, 700);
      };
    $(document).ready(function () {
      $(".not-found").on("mousemove", parallax);
      $(".not-found").on("mouseleave", stopParallax);
    });
  }

}
