// the scripts that run on the front page

$(function() {
  // add inn premium ads in the news mix on the front page

  // only run if not in article
  if (!$(".article-entity").length) {
    // lazyload
    lazyload.init(250);

    initPremium("#front-articles-list", [
      { type: "premium", row: 3 },
      { type: "premium", row: 5 },
      { type: "carousel", row: 7 },
      { type: "premium", row: 9 },
      { type: "premium", row: 11 },
      { type: "premium", row: 13 },
      { type: "premium", row: 15 },
      { type: "premium", row: 17 },
      { type: "premium", row: 19 },
      { type: "premium", row: 21 },
      { type: "premium", row: 23 },
      { type: "premium", row: 25 }
    ]);

    // don't show sidebar on job and search site
    if (
      window.location.pathname.indexOf("jobb") > -1 ||
      window.location.pathname.indexOf("sok") > -1
    ) {
      $(".frontpage").removeClass("wide");
    } else {
      getAds(function(ads) {
        // done here to avoid an additional ads-call
        adCounterToTopNav(ads.length);
        // Get active premium ads from premium-frontpage and filter them out.
        getFrontArticles("premium/", false, function(premiumAds) {
          // Get ids of all active premium ads
          let filteredAdsList = premiumAds.map(ad => ad.instance_of);
          // filter out non-premium ads
          var premiumAdsList = ads.filter(
            ad => filteredAdsList.indexOf(parseInt(ad.id)) > -1
          );
          // filter out premium ads
          var nonPremiumAdsList = ads.filter(
            ad => filteredAdsList.indexOf(parseInt(ad.id)) == -1
          );
          // create container for ads
          var asideContainer = getAside();
          // draw ads
          var adsContainer = drawAdsContainer(
            newShuffledArray(nonPremiumAdsList),
            newShuffledArray(premiumAdsList)
          );
          // add them to the dom
          asideContainer.append(adsContainer);
          $("#desktop-sidemenu-front").append(asideContainer);
        });
      });
    }
  }
});
