function drawFooterContent(adsList, premiumAdsList, articles, tag) {
  var footerContent = $('<div class="footer-content row"></div>');
  var relatedArticlesElements = drawRelatedArticleElements(
    articles,
    tag,
    adsList,
    premiumAdsList
  );

  footerContent.append(relatedArticlesElements);
  $(".facebook-comments").after(footerContent);
}

function drawFrontArticleElements(articles, adsList, premiumAdsList) {
  var relatedArticles = $(
    '<div class="footer-content-related"><h3>Siste nytt</h3></div>'
  );

  var relatedArticlesWrapFirst = $('<div class="footer-content-wrap"></div>');
  var relatedArticlesWrapSecond = $(
    '<div class="footer-content-wrap two-col"></div>'
  );

  relatedArticlesWrapFirst.append(drawArticle(articles[2]));

  if (premiumAdsList.length > 1) {
    relatedArticlesWrapFirst.append(drawPremiumAd(premiumAdsList[1]));
  } else {
    relatedArticlesWrapFirst.append(drawPremiumAd(adsList[1]));
  }

  relatedArticlesWrapFirst.append(drawArticle(articles[3]));

  relatedArticlesWrapSecond.append(drawArticle(articles[0]));
  relatedArticlesWrapSecond.append(drawArticle(articles[1]));

  return relatedArticles.append(
    relatedArticlesWrapSecond,
    relatedArticlesWrapFirst
  );
}

function drawRelatedArticleElements(articles, tag, adsList, premiumAdsList) {
  var relatedArticles = $(
    '<div class="footer-content-related"><h3>Relaterte saker</h3></div>'
  );

  var relatedArticlesWrapFirst = $('<div class="footer-content-wrap"></div>');
  var relatedArticlesWrapSecond = $(
    '<div class="footer-content-wrap two-col"></div>'
  );
  var relatedArticlesWrapThird = $('<div class="footer-content-wrap"></div>');

  relatedArticlesWrapFirst.append(drawArticle(articles[2]));
  if (premiumAdsList.length) {
    relatedArticlesWrapFirst.append(drawPremiumAd(premiumAdsList[0]));
  } else {
    relatedArticlesWrapFirst.append(drawPremiumAd(adsList[0]));
  }

  relatedArticlesWrapFirst.append(drawArticle(articles[3]));

  relatedArticlesWrapSecond.append(drawArticle(articles[0]));
  relatedArticlesWrapSecond.append(drawArticle(articles[1]));

  if (articles.length >= 7) {
    relatedArticlesWrapThird.append(drawArticle(articles[4]));
    relatedArticlesWrapThird.append(drawArticle(articles[5]));
    relatedArticlesWrapThird.append(drawArticle(articles[6]));
  }

  return relatedArticles.append(
    relatedArticlesWrapSecond,
    relatedArticlesWrapFirst,
    relatedArticlesWrapThird
  );
}

function getTagsElements(tags, avoid) {
  var tagsElementContainer = $('<div class="article-tags"></div>');
  var tagsArray = tags.split(", ");
  tagsArray = tagsArray.filter(tag => tag !== avoid);

  var max = tagsArray.length - 1 < 2 ? tagsArray.length - 1 : 2;

  for (var x = 0; x <= max; x++) {
    tagsElementContainer.append(
      `
        <span>${tagsArray[x]}</span>
      `
    );
  }
  return tagsElementContainer;
}

function drawArticle(article) {
  var tagsElement = getTagsElements(article.tags, article.section_tag);

  articleElement = $(`
            <a class="article article-link" href="//kode24.no${
              article.published_url
            }">
        <div class="article-image">
        ${
          article.images
            ? `<img alt="article image" src="${article.images[0].url_size}">`
            : `<img alt="article image" src="//dbstatic.no/${article.image}.jpg?width=600">`
        }
                    
                </div>
        <div class="text-content">
                    <h4>${article.title}</h4>
        </div>    
      </a>`);

  articleElement.find(".article-image").append(tagsElement);

  return articleElement;
}

function drawPremiumAd(premiumAd, compact) {
  var cities = getCitysFromTags(premiumAd.tags);
  var premiumAdElement = $(`
        <a class="premium-ad ad" href="//kode24.no${premiumAd.published_url}">
            ${
              compact
                ? ""
                : `<div class="ad-image"><img alt="ad image" src="//dbstatic.no/${premiumAd.image}.jpg?width=400"></div>`
            }
            
            <div class="ad-text">
            <div class="ad-company-logo"><img alt="byline image" src="https://dbstatic.no${
              premiumAd.full_bylines[0].imageUrl
            }"></div>
                    <h4>${premiumAd.full_bylines[0].firstname}</h4>
                    <h5>${premiumAd.title}</h5>
                    <h6>${premiumAd.subtitle}</h6>
            </div>
                            
        </a>`);

  var citiesElement = $('<p class="cities"></p>');
  cities.forEach(function(city) {
    citiesElement.append($("<span>" + city + "</span>"));
  });
  premiumAdElement.append(citiesElement);
  return premiumAdElement;
}

function drawRegularAd(ad) {
  var cities = getCitysFromTags(ad.tags);
  var adElement = $(`
        <a class="ad" href="//kode24.no${ad.published_url}">
        <div class="ad-company-logo"><img alt="byline image" src="https://dbstatic.no${ad.full_bylines[0].imageUrl}"></div>
            </div>
            <h4>
                ${ad.full_bylines[0].firstname}&nbsp;
            </h4>
            <h5>${ad.title}</h5>
        </a>`);
  var citiesElement = $('<p class="cities"></p>');
  cities.forEach(function(city) {
    citiesElement.append($("<span>" + city + "</span>"));
  });

  adElement.append(citiesElement);
  return adElement;
}

function drawPremiumUnderByline(premiumAd) {
  var premiumAdElement = getPremiumAdsElement(premiumAd, true);
  var adContainerWrapper = $(
    '<div class="byline-listing"><h3>Ledig stilling</h3></div>'
  );
  var adContainer = $('<div class="premium"></div>').append(
    premiumAdElement.premiumAdElement
  );
  adContainerWrapper.append(adContainer);

  return adContainerWrapper;
}
