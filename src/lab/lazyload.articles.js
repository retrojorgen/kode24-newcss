// LazyLoad
// written by Matt Evans @mattkatt

(function() {
    "use strict";
    var lazyload = {
        events: [
            "load",
            "orientationchange",
            "resize",
            "scroll"
        ],
        setOffset: function (offset) {
            lazyload.offset = parseInt(offset, 10);
        },
        run: function () {
            var i, targets = document.querySelectorAll(".lazyload");

            if (targets.length > 0) {
                for (i = 0; i < targets.length; i++) {
                    var elem = targets[i],
                        list = elem.getAttribute("class").split(" "),
                        lazyBG = list.indexOf("lazyBG"),
                        src = elem.getAttribute("data-src"),
                        set = elem.hasAttribute("data-srcset") ? elem.getAttribute("data-srcset") : null,
                        rect = elem.getBoundingClientRect();

                    if (rect.top <= (window.innerHeight + lazyload.offset) && elem.offsetParent !== null) {
                        if (lazyBG > -1) {
                            elem.style.backgroundImage = "url(" + src + ")";
                        }

                        if (lazyBG <= -1) {
                            if (src) {
                                elem.src = src;
                            }

                            if (set) {
                                elem.srcset = set;
                                elem.removeAttribute("data-srcset");
                            }
                            if (elem.tagName === "VIDEO") {
                                elem.play();
                            }
                        }

                        list.splice(list.indexOf("lazyload"), 1);
                        elem.setAttribute("class", list.join(" "));
                        elem.removeAttribute("data-src");
                    }
                }
            } else {
                for (i = 0; i < lazyload.events.length; i++) {
                    window.removeEventListener(lazyload.events[i], lazyload.run);
                }
            }
        },
        init: function (offset) {
            var script = document.querySelector('script#lazyloadjs');

            if (typeof offset !== "number") {
                offset = 200;
            }

            if (script && script.hasAttribute('data-offset')) {
                offset = script.getAttribute('data-offset');
            }

            lazyload.setOffset(offset);

            for (var j = 0; j < lazyload.events.length; j++) {
                window.addEventListener(lazyload.events[j], lazyload.run, false);
            }
            lazyload.run();
        }
    };

    lazyload.init();
})();
