(function ($) {
    'use strict';

    var browserWindow = $(window);

    // :: 1.0 Preloader Active Code
    //browserWindow.on('load', function () {
        $('.preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    //});

    // :: 2.0 Nav Active Code
    if ($.fn.classyNav) {
        $('#oneMusicNav').classyNav();
    }

    // :: Minimal slideshow
    let slides = $('.slide-img');
    if (slides.length) {

      let arr = [
        'img/bg-img/hs_band_perf-01.jpg',
        'img/bg-img/hs_jake-01.jpg',
        'img/bg-img/hs_cole-01.jpg',
        'img/bg-img/hs_kitt-01.png',
        'img/bg-img/hs_max-01.jpg',
        'img/bg-img/hs_ttg-01.jpg',
      ];

      arr.forEach((src, index) => {
        let img = new Image();
        let imgThumb = new Image();
        let counter = index + 1;
        imgThumb.src = src.replace('01', '01_thumb');
        img.src = src;
        let loaded = function () {
          let classes = $('.hero-slide-' + counter).get(0).className;
          $('.hero-slide-' + counter).get(0).className = classes.replace('hero-slide-low-res-' + counter, '');
        };
        if (img.width) {
          loaded();
        }
        else {
          img.onload = loaded;
        }
      });

      let SHOW_TIME = 10000;
      let index = 0;
      let current;
      let next;
      let hideSlide = (index) => {
        let slide = slides.get(index);
        slide.style.transition = 'opacity 0.75s ease-out';
        slide.style.opacity = '0';
      };
      let showSlide = (index) => {
        let slide = slides.get(index);
        slide.style.display = 'block';
        slide.style.transition = 'opacity 1.5s ease-out';
        slide.style.opacity = '1';
      };
      let checkLoaded = (index) => {
      };

      let showNext = () => {
        let current = index;
        index++;
        index = index > (arr.length - 1) ? 0 : index;
        let next = index;
        hideSlide(current);
        setTimeout(() => {
          showSlide(next);
        }, 750);
        setTimeout(showNext, SHOW_TIME);
      };
      showSlide(index);
      setTimeout(showNext, SHOW_TIME);
    }

    // :: 4.0 Masonary Gallery Active Code
    if ($.fn.imagesLoaded) {
        $('.hairstrike-photos').imagesLoaded(function () {
            // filter items on button click
            $('.catagory-menu').on('click', 'a', function () {
                var filterValue = $(this).attr('data-filter');
                $grid.isotope({
                    filter: filterValue
                });
            });
            // init Isotope
            var $grid = $('.hairstrike-photos').isotope({
                itemSelector: '.single-album-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.single-album-item'
                }
            });
        });
    }

    // :: 5.0 Video Active Code
    if ($.fn.magnificPopup) {
        $('.video--play--btn').magnificPopup({
            disableOn: 0,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: true,
            fixedContentPos: false
        });
        $('.image--gallery--btn').magnificPopup({
            disableOn: 0,
            type: 'image',
            gallery: {
              enabled: true,
            },
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: true,
            fixedContentPos: false
        });
    }

    // :: 6.0 ScrollUp Active Code
    if ($.fn.scrollUp) {
        browserWindow.scrollUp({
            scrollSpeed: 1500,
            scrollText: '<i class="fa fa-angle-up"></i>'
        });
    }

    // :: 7.0 CounterUp Active Code
    if ($.fn.counterUp) {
        $('.counter').counterUp({
            delay: 10,
            time: 2000
        });
    }

    // :: 8.0 Sticky Active Code
    if ($.fn.sticky) {
        $(".hairstrike-main-menu").sticky({
            topSpacing: 0
        });
    }

    // :: 9.0 Progress Bar Active Code
    if ($.fn.circleProgress) {
        $('#circle').circleProgress({
            size: 160,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#000000',
            thickness: '3',
            reverse: true
        });
        $('#circle2').circleProgress({
            size: 160,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#000000',
            thickness: '3',
            reverse: true
        });
        $('#circle3').circleProgress({
            size: 160,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#000000',
            thickness: '3',
            reverse: true
        });
        $('#circle4').circleProgress({
            size: 160,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#000000',
            thickness: '3',
            reverse: true
        });
    }

    // :: 10.0 audioPlayer Active Code
    if ($.fn.audioPlayer) {
        $('audio').audioPlayer();

        // Bandaid the race condition that leads to duration displayed of 'Infinity:NaN'
        $('audio').on('loadedmetadata', function (ev) {
          let counter = 0;
          let check = () => {
            counter++;
            let target = ev.currentTarget;
            let seconds = target.duration;
            if (counter < 10) {
              if (!isFinite(seconds)) {
                setTimeout(check, 500);
              }
              else {
                let elem = $(target).siblings('.audioplayer-time-duration');
                let mins = String(parseInt(seconds / 60, 10));
                let secs = String(parseInt(seconds % 60, 10));
                mins = mins.padStart(2, '0');
                secs = secs.padStart(2, '0');
                elem.html([mins, secs].join(':'));
                elem.css('visibility', 'visible');
              }
            }
          }
          check();
        });
    }

    // :: 11.0 Tooltip Active Code
    if ($.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip()
    }

    // :: 12.0 prevent default a click
    $('a[href="#"]').on('click', function ($) {
        $.preventDefault();
    });

    // :: 13.0 wow Active Code
    if (browserWindow.width() > 767) {
        new WOW().init();
    }
    
    // :: 14.0 Gallery Menu Active Code
    $('.catagory-menu a').on('click', function () {
        $('.catagory-menu a').removeClass('active');
        $(this).addClass('active');
    })

    // Populate the list of scheduled show dates
    loadSchedule();

})(jQuery);

async function loadSchedule() {
  let data = await fetch('https://docs.google.com/spreadsheets/d/1haFDx2J43O4P4AZfif2uuplXxOjRZu0IPXM6OcbOBZM/gviz/tq?tqx=out:csv&tq&gid=0');
  data = await data.text();
  data = data.split('\n');
  data = data.map((row) => {
    let item = row.split('","');
    item = item.map((col) => {
      return col.replace(/"/g, '');
    })
    return {
      date: item[0],
      venue: item[1],
      city: item[2],
      url: item[3],
    };
  });

  let html = data.map((item) => {
    return `<dt>${item.date}</dt>
    <dd>${item.venue} — ${item.city}</dd>`;
  }).join('\n');

  $('#scheduleList').html(html);
  $('#scheduleHeader').css('display', 'block');
}

