/** 
Get offset of bottom of last element in body container.
Loop through elements in ads aside listing except the button,
and hide all elements that have higher bottom offset then the last element in the body container.
**/

function adjustAdsToFitBodyHeight() {
  console.log("adjusting ads");
  var lastItem = $(".body-copy").children(":last-child");

  lastItemOffset = lastItem.offset().top;

  var lastItemHeight = lastItem.outerHeight(true);

  var textBodyyOffset = lastItem.parent().offset().top;

  var offsetHeight = lastItemOffset + lastItemHeight;
  /**
    $(".aside-container").children(":not(.adslist-see-more)").each(function () {
        var element = $(this);

        if(element.outerHeight(true) + lastItem.offset().top > offsetHeight) {
            element.hide();
        }
    })
     */
}
