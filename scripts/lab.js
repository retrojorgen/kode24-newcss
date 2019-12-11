(function() {
  "use strict";

  var name = "fromNow";

  /**
   * Toggles the text between the original text and time from now
   * @public
   * @example <caption>Toggles the visible text between relative time and original text.</caption>
   * $('#myTimeTag').fromNow('toggle');
   * @memberof db.libs.fromNow
   * @param  {external:jQuery|string} id Selector or jQuery element
   * @return {external:jQuery}        jQuery element
   */
  function toggle(id) {
    var $el = $(id);

    $el.toggleClass("active");

    if ($el.hasClass("active")) {
      $el.text(moment($el.attr("datetime")).fromNow());
    } else {
      $el.text($el.data("text"));
    }

    return $el;
  }

  /**
   * Initialize the component
   * @public
   * @memberof db.libs.fromNow
   * @param {external:jQuery|string} [id] Selector or jQuery element
   * @return {array} Returns array of all targeted elements
   */
  function init(id) {
    var $targets;

    if (id !== undefined) {
      $targets = $(id);
    } else {
      $targets = $("time[data-from-now]");
    }

    $targets.each(function(i, el) {
      if (!db.utils.isInitialized(el, name)) {
        var datetime = $(el).attr("datetime");
        var $el = $(el);
        if (moment(datetime).isValid()) {
          $el.data("text", $el.text());
          $el.addClass("active");
          $el.text(moment(datetime).fromNow());
          $el.on("click", function(event) {
            if (event) {
              event.stopPropagation();
              event.preventDefault();
            }
            toggle($(event.currentTarget));
          });
        } else {
          //FIXME: Log err?
        }
        db.utils.initialized(el, name);
      }
    });

    return $targets;
  }

  return {
    init: init,
    reflow: init,
    toggle: toggle
  };
})(jQuery, moment);

(function() {
  "use strict";

  var name = "imageSrcset";
  var ready = false;

  /**
   * Ranges for targeting sizes in srcset
   * @private
   * @memberof db.libs.imageSrcset
   * @constant {object}
   */
  var range = {
    small: "(?:[0-9]|[0-9][0-9]|[0-6][0-3][0-9])", //Target 0-639
    medium: "(?:6[4-9][0-9]|[7-9][0-9][0-9]|10[0-2][0-3])", //Target 640-1023
    large: "(?:10[2-9][4-9]|[1-9][1-9][0-9][0-9])" //Target 1024 +
  };

  /**
   * The threshold for when images in view should be loaded
   * @private
   * @memberof db.libs.imageSrcset
   * @constant {number}
   */
  var threshold = 400;

  /**
   * The nodeList for all the images on the page using <code>data-srcset</code>
   * @private
   * @memberof db.libs.imageSrcset
   * @type {nodeList}
   */
  var images = [];

  /**
   * The nodeList for all the images to lazyload using the <code>data-defer</code> attribute
   * @private
   * @memberof db.libs.imageSrcset
   * @type {nodeList}
   */
  var deffered = [];

  /**
   * Returns the list of images
   * @public
   * @memberof db.libs.imageSrcset
   */
  function getImages() {
    return images;
  }

  /**
   * Returns the list of deferred images
   * @public
   * @memberof db.libs.imageSrcset
   */
  function getDefferedImages() {
    return deffered;
  }

  /**
   * Loads all images with <code>data-defer</code> attribute if they are within the viewport threshold
   * @private
   * @memberof db.libs.imageSrcset
   */
  function loadImagesInView() {
    var offset =
      window.pageYOffset !== undefined
        ? window.pageYOffset
        : document.body.scrollTop;
    var edge = offset + window.innerHeight + threshold;
    for (var i = 0; i < deffered.length; i++) {
      if (parseInt(deffered[i].getBoundingClientRect().top + offset) < edge) {
        setImageSrc(deffered[i]);
      }
    }
    images = document.querySelectorAll("img[data-srcset]:not([data-defer])");
    deffered = document.querySelectorAll("img[data-defer]");
  }

  /**
   * Re-evaluate all images and load the correct src from <code>data-srcset</code>
   * @private
   * @memberof db.libs.imageSrcset
   */
  function loadImages() {
    for (var i = 0; i < images.length; i++) {
      setImageSrc(images[i]);
    }
  }

  /**
   * Loads a given image
   * @public
   * @memberof db.libs.imageSrcset
   * @param {element} element
   * @return {element} element
   */
  function load(el) {
    setImageSrc(el);
    return el;
  }

  /**
   * Set the image src based on width of page and what is in <code>data-srcset</code> or </code>data-src</code>
   * @private
   * @memberof db.libs.imageSrcset
   * @param {element} element
   * @return {element} element
   */
  function setImageSrc(el) {
    var size, src;

    if (!el.dataset.srcset && !el.dataset.srcset) {
      return false;
    }

    if (el.dataset.src !== undefined) {
      src = el.dataset.src;
    } else {
      if (window.innerWidth <= 640) {
        size = range.small;
      } else if (window.innerWidth > 1024) {
        size = range.large;
      } else {
        size = range.medium;
      }
      src = parseSrcset(el.dataset.srcset, size);
    }

    if (el.tagName == "IMG") {
      if (src != el.getAttribute("src")) {
        el.setAttribute("src", src);
      }
    } else {
      el.style.backgroundImage = "url(" + src + ")";
    }

    el.removeAttribute("data-defer");

    return el;
  }

  /**
   * Parse the <code>data-srcset</code> and return the url that matches given size
   * @private
   * @memberof db.libs.imageSrcset
   * @param {string} srcset A srcset formatted string
   * @param {string} size A string used in the regex to match a spesific size
   * @return {string} the url matching size
   */
  function parseSrcset(srcset, size) {
    var re = new RegExp("([^\\s|\\d|w|,]\\S+)\\s" + size + "w", "i");
    var src = srcset.match(re);
    if (src) {
      return src[1].trim();
    } else {
      return "";
    }
  }

  /**
   * Initialize the component
   * @public
   * @memberof db.libs.imageSrcset
   */
  function init() {
    console.log("yo");
    if (!ready) {
      images = document.querySelectorAll("img[data-srcset]:not([data-defer])");
      deffered = document.querySelectorAll("img[data-defer]");

      loadImages();
      loadImagesInView();

      window.addEventListener("scroll", function() {
        window.requestAnimationFrame(loadImagesInView);
      });

      window.addEventListener("resize", function() {
        window.requestAnimationFrame(loadImages);
      });

      ready = true;
    } else {
      reflow();
    }
  }

  /**
   * Load all images that can be loaded
   * @public
   * @memberof db.libs.imageSrcset
   */
  function reflow() {
    images = document.querySelectorAll("img[data-srcset]:not([data-defer])");
    deffered = document.querySelectorAll("img[data-defer]");

    loadImages();
    loadImagesInView();
  }

  return {
    init: init,
    reflow: reflow,
    getDefferedImages: getDefferedImages,
    getImages: getImages,
    load: load
  };
})();

// moment.js locale configuration
// locale : norwegian bokmål (nb)
// authors : Espen Hovlandsdal : https://github.com/rexxars
//           Sigurd Gartmann : https://github.com/sigurdga

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['moment'], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../moment')); // Node
    } else {
        factory((typeof global !== 'undefined' ? global : this).moment); // node or other global
    }
}(function (moment) {
    return moment.defineLocale('nb', {
        months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
        monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
        weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
        weekdaysShort : 'søn_man_tirs_ons_tors_fre_lør'.split('_'),
        weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
        longDateFormat : {
            LT : 'H.mm',
            LTS : 'LT.ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY [kl.] LT',
            LLLL : 'dddd D. MMMM YYYY [kl.] LT',
            humanReadable: 'dddd D. MMMM YYYY'
        },
        calendar : {
            sameDay: '[i dag kl.] LT',
            nextDay: '[i morgen kl.] LT',
            nextWeek: 'dddd [kl.] LT',
            lastDay: '[i går kl.] LT',
            lastWeek: '[forrige] dddd [kl.] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'om %s',
            past : '%s',
            s : 'noen sekunder',
            m : 'ett minutt',
            mm : '%d minutter',
            h : 'en time',
            hh : '%d timer',
            d : 'i går',
            dd : '%d dager',
            M : 'en måned',
            MM : '%d måneder',
            y : 'ett år',
            yy : '%d år'
        },
        ordinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });
}));
