// All the code that needs to be initialised in articles
$(function() {
  // only run if article
  if ($(".article-entity").length) {
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
        var adsContainer = drawAdsContainer(nonPremiumAdsList, premiumAdsList);
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
        getArticlesByTag(function(articles, tag) {
          getFrontArticles("", true, function(frontArticles) {
            getContentAds(function(contentAds) {
              var contentAdsContainer = drawContentAd(contentAds);
              var relatedContainer = drawRelatedArticles(articles, tag);
              var frontArticlesContainer = drawFrontArticles(frontArticles);
              asideContainer.append(
                contentAdsContainer,
                adsContainer,
                relatedContainer,
                frontArticlesContainer
              );

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
