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
