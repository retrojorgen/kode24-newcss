$(function() {
  if (!$(".article-entity").length) {
    var adsList = [];
    var premiumAdsList = [];

    if (
      window.location.pathname.indexOf("jobb") <= -1 &&
      window.location.pathname.indexOf("sok") <= -1
    ) {
      getAds(function(ads) {
        adsList = ads;
        adCounterToTopNav(ads.length);
        getFrontArticles("premium/", false, function(premiumAds) {
          let filteredAdsList = premiumAds.map(ad => ad.instance_of); // just get ids
          premiumAdsList = ads.filter(
            ad => filteredAdsList.indexOf(parseInt(ad.id)) > -1
          );
          drawAsideOnlyAdverts(adsList, premiumAdsList);
        });
      });
    } else {
      $(".frontpage").removeClass("wide");
    }
  }
});

function halfSizeByLineImage(imageUrl) {
  return imageUrl.replace("");
}

function drawAsideOnlyAdverts(adsList, premiumAdsList) {
  var asideContent = $("<div></div>").addClass("aside-desktop");
  var adsContainer = drawAdsContainer(adsList, premiumAdsList);
  asideContent.append(adsContainer);

  $("#desktop-sidemenu-front").append(asideContent);
}
