/** 
Get offset of bottom of last element in body container.
Loop through elements in ads aside listing except the button,
and hide all elements that have higher bottom offset then the last element in the body container.
**/

function adjustAdsToFitBodyHeight() {
  console.log("adjusting ads updated");
  var lastItem = $(".body-copy").children(":last-child");

  lastItemOffset = lastItem.offset().top;

  var lastItemHeight = lastItem.outerHeight(true);

  var textBodyOffset = lastItem.parent().offset().top;

  var offsetHeight = lastItemOffset + lastItemHeight;

  console.log("adjusting ads", offsetHeight, lastItemOffset, lastItemHeight);

  $(".aside-container .premium-ad").each(function() {
    var element = $(this);
    if (element.outerHeight(true) + element.offset().top > offsetHeight) {
      element.hide();
    }
  });
  $(".aside-container .regular-ad .ad").each(function() {
    var element = $(this);
    if (element.outerHeight(true) + element.offset().top > offsetHeight) {
      element.hide();
    }
  });
}
