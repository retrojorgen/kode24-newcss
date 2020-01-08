// All the code that needs to be initialised in articles
$(function() {
  // only run if article
  if ($(".article-entity").length) {
    // set timestap on top of article
    jQuery("time.published").timeago();

    // lazyload
    lazyload.init(250);

    // start the carousel at the bottom of articles
    initCarousel(".row.facebook-comments");

    // start the code highlighter
    hljs.initHighlightingOnLoad();
    hljs.initLineNumbersOnLoad();

    getAds(function(ads) {
      // to avoid extra call to api
      adCounterToTopNav(ads.length);
      // create container for ads
      var asideContainer = getAside();

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

        // draw ads
        var adsContainer = drawAdsContainer(
          newShuffledArray(nonPremiumAdsList),
          newShuffledArray(premiumAdsList)
        );
        // add them to the dom

        // if we are on mobile add premium ad under byline
        if (
          window.screen.width <= 640 &&
          window.location.pathname.indexOf("/jobb/") < 0 &&
          premiumAdsList.length
        ) {
          //drawPremiumUnderByline(getRandomItemFromArray(premiumAdsList));
          $(".byline.columns").append(drawPremiumUnderByline(premiumAdsList));
        } else {
          asideContainer.append(adsContainer);
        }

        // when sidebar has been drawn
        adjustOverlap(4000);

        $(window).resize(function() {
          asideContainer.html("");
          asideContainer.append(
            drawAdsContainer(
              newShuffledArray(nonPremiumAdsList),
              newShuffledArray(premiumAdsList)
            )
          );
          // when sidebar has been drawn
          adjustOverlap(4000);
        });

        getArticlesByTag(function(articles, tag) {
          getFrontArticles("", true, function(frontArticles) {
            getContentAds(function(contentAds) {
              $(".body-copy")
                .parent()
                .append(asideContainer);

              drawFooterContent(
                nonPremiumAdsList,
                premiumAdsList,
                articles,
                tag,
                frontArticles,
                contentAds
              );
            });
          });
        });
      });
    });
  }
});
