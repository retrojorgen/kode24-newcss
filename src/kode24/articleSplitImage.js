function hasOverlap(x, y, x2, y2) {
  // is above element, but touches it in bottom
  if (x2 < x && y2 < y && y2 > x) {
    return true;
  }
  // is inside element
  if (x2 >= x && y2 <= y) {
    return true;
  }
  // element touhes in top
  if (x2 > x && y2 > y && x2 < y) {
    return true;
  }
  return false;
}

function adjustOverlap(timeoutTimer) {
  setTimeout(function() {
    var fullWidthImages = $(".body-copy .full-bleed");
    fullWidthImages.each(function(index) {
      var imageOffsetTop = $(this).offset().top;
      var imageTotaltHeight = $(this).outerHeight(true);

      var asideContainers = $(".aside-desktop").children();
      asideContainers.each(function(index) {
        var containerOffsetTop = $(this).offset().top;
        var containerTotalHeight = $(this).outerHeight(true);
        // if it overlaps, there might be elements inside that we must move
        if (
          hasOverlap(
            imageOffsetTop,
            imageOffsetTop + imageTotaltHeight,
            containerOffsetTop,
            containerOffsetTop + containerTotalHeight
          )
        ) {
          $(this)
            .children()
            .each(function(index) {
              var childOffsetTop = $(this).offset().top;
              var childTotalHeight = $(this).outerHeight(true);
              if (
                hasOverlap(
                  imageOffsetTop,
                  imageOffsetTop + imageTotaltHeight,
                  childOffsetTop,
                  childOffsetTop + childTotalHeight
                )
              ) {
                $(this).css(
                  "margin-top",
                  imageOffsetTop + imageTotaltHeight - childOffsetTop
                );
              }
            });
        }
      });
    });
  }, timeoutTimer);
}
