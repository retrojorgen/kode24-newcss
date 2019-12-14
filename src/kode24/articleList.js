$(function() {
  if ($(".article-entity").length) {
    console.log("yo22");
    var adsList = [];
    var premiumAdsList = [];
    var autoJobcarousel = $(".auto-job-carousel");
    var articleHeight = $("main").height();
    var screenWidth = window.screen.width;
    var mobileThresholdPixels = 640;
    getAds(function(ads) {
      adsList = ads;

      adCounterToTopNav(ads.length);
      getArticlesByTag(function(articles, tag) {
        getFrontArticles("premium/", false, function(premiumAds) {
          let filteredAdsList = premiumAds.map(ad => ad.instance_of); // just get ids
          premiumAdsList = ads.filter(
            ad => filteredAdsList.indexOf(parseInt(ad.id)) > -1
          );
          if (
            screenWidth <= mobileThresholdPixels &&
            window.location.pathname.indexOf("/jobb/") < 0 &&
            premiumAdsList.length
          ) {
            drawPremiumUnderByline(premiumAdsList);
          }
          getFrontArticles("", true, function(frontArticles) {
            getContentAds(function(contentAds) {
              drawAside(
                adsList,
                premiumAdsList,
                articles,
                tag,
                frontArticles,
                articleHeight,
                contentAds
              );

              drawFooterContent(
                adsList,
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }
}

function drawFooterContent(
  adsList,
  premiumAdsList,
  articles,
  tag,
  frontArticles
) {
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

function drawContentAd(contentAds) {
  if (contentAds.length) {
    var contentAd = contentAds[0]; // pick the first one for now
    var adsContainer = $(
      '<div class="aside-container ads"><h3>Anonsørinnhold</h3></div>'
    );
    var contentAdElement = $(`<a class="premium-ad content-ad ad" href="//kode24.no${contentAd.published_url}">
            <div class="ad-image"><img alt="ad image" src="//dbstatic.no/${contentAd.image}.jpg?width=400"></div>
            <div class="ad-text">
            <div class="ad-company-logo"><img alt="company logo" src="https://dbstatic.no${contentAd.full_bylines[0].imageUrl}"></div>
                <h4>${contentAd.full_bylines[0].firstname}</h4>
                <h5>${contentAd.title}</h5>
                <h6>${contentAd.subtitle}</h6>
            </div>
            
        </a>`);
    adsContainer.append(contentAdElement);
    return adsContainer;
  } else {
    return "";
  }
}

function drawPremiumUnderByline(premiumAdsList) {
  var premiumAdElement = getPremiumAdsElement(premiumAdsList, true);
  var adContainerWrapper = $(
    '<div class="byline-listing"><h3>Ledig stilling</h3></div>'
  );
  var adContainer = $('<div class="premium"></div>').append(
    premiumAdElement.premiumAdElement
  );
  adContainerWrapper.append(adContainer);

  $(".byline.columns").after(adContainerWrapper);
}

function drawAdsContainer(adsList, premiumAdsList) {
  /** Draw ads-container */
  var adsContainer = $(
    '<div class="aside-container ads"><h3>Ledige stillinger</h3></div>'
  );
  if (premiumAdsList.length) {
    var premiumAdObject = getPremiumAdsElement(premiumAdsList);
    var premiumAdElement = premiumAdObject.premiumAdElement;
  }

  var premiumAdId = 0;
  if (premiumAdObject && premiumAdObject.premiumAdId)
    premiumAdId = premiumAdObject.premiumAdId;

  var regularAdsElements = getRegularAdsElements(adsList, premiumAdId);
  if (premiumAdsList.length && premiumAdElement)
    adsContainer.append(premiumAdElement);
  if (regularAdsElements) adsContainer.append(regularAdsElements);
  adsContainer.append(
    '<div class="adslist-see-more"><a href="//kode24.no/jobb/"><span>Se alle stillinger (' +
      adsList.length +
      ")</span></a></div>"
  );
  return adsContainer;
}

function drawRelatedArticles(articles, tag) {
  /** Draw related-articles-container */
  articles = articles.slice(0, 3);
  var relatedContainer = $(
    '<div class="aside-container related"><h3>Siste fra: ' + tag + "</h3></div>"
  );
  articles.forEach(function(article, index) {
    var articleElement = $(`
        <article class="article top ${index === 0 ? "top" : ""}">
        <a class="article-link" href="//kode24.no${article.published_url}">
         <div class="article-image"><img alt="article image" src="//dbstatic.no/${
           article.image
         }.jpg?width=400"></div>
        <div class="text-content">
            <h4>${article.title}</h4>
        </div>    
         </a></article>`);
    relatedContainer.append(articleElement);
  });

  return relatedContainer;
}

function drawFrontArticles(articles) {
  /** Draw related-articles-container */
  articles = articles.slice(0, 5);
  var relatedContainer = $(
    '<div class="aside-container related front"><h3>Siste nytt</h3></div>'
  );
  articles.forEach(function(article, index) {
    var articleElement = $(`
        <article class="article">
        <a class="article-link" href="${article.url}">
         <div class="article-image"><img alt="article image" src="//dbstatic.no/${
           article.imageUrl
         }"></div>
        <div class="text-content">
            <h4>${$("<div>" + article.title + "</div>").text()}</h4>
            <h5>${$("<div>" + article.description + "</div>").text()}</h5>
        </div>    
         </a></article>`);
    relatedContainer.append(articleElement);
  });

  return relatedContainer;
}

function drawAside(
  adsList,
  premiumAdsList,
  articles,
  tag,
  articlesFront,
  articleHeight,
  contentAdsList
) {
  var asideContent = $("<div></div>").addClass("aside-desktop");

  var contentAdsContainer = drawContentAd(contentAdsList);
  var adsContainer = drawAdsContainer(adsList, premiumAdsList);
  var adsContainerHeight = 1884;
  asideContent.append(contentAdsContainer, adsContainer);

  var relatedContainer = drawRelatedArticles(articles, tag);
  var relatedContainerHeight = 856;
  if (articleHeight > adsContainerHeight + relatedContainerHeight)
    asideContent.append(relatedContainer);

  var frontArticlesContainer = drawFrontArticles(articlesFront);
  var frontArticlesContainerHeight = 575;
  if (
    articleHeight >
    adsContainerHeight + relatedContainerHeight + frontArticlesContainerHeight
  )
    asideContent.append(frontArticlesContainer);

  $(".body-copy")
    .parent()
    .append(asideContent);
}

function getRegularAdsElements(adsList, premiumAdId) {
  var regularAds = $('<div class="regular-ad"></div>');
  shuffleArray(adsList);
  adsList = adsList.slice(0, 8);
  adsList.forEach(function(ad) {
    if (ad.id !== premiumAdId && ad.visibility_status === "P") {
      var cities = getCitysFromTags(ad.tags);

      var adElement = $(`
            <a class="ad" href="//kode24.no${ad.published_url}">
            <div class="ad-company-logo"><img alt="company logo" src="https://dbstatic.no${ad.full_bylines[0].imageUrl}"></div>
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
      regularAds.append(adElement);
    }
  });

  return regularAds;
}

function getPremiumAdsElement(premiumAdsList, compact) {
  var premiumAdElement = undefined;
  shuffleArray(premiumAdsList);

  if (premiumAdsList.length) {
    premiumAd = premiumAdsList[0];
    var cities = getCitysFromTags(premiumAd.tags);
    premiumAdElement = $(`<a class="premium-ad ad" href="//kode24.no${
      premiumAd.published_url
    }">
    ${
      compact
        ? ""
        : `<div class="ad-image"><img alt="premium ad image" src="//dbstatic.no/${premiumAd.image}.jpg?width=400"></div>`
    }
            <div class="ad-text">
            <div class="ad-company-logo"><img alt="premium ad image" src="https://dbstatic.no${
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
  }

  return { premiumAdElement: premiumAdElement, premiumAdId: premiumAd.id };
}

function getAds(callback) {
  getUrl(
    "//api.kode24.no/article/?query=published:[2017-01-01T00:00:00Z+TO+NOW]+AND+NOT+hidefromfp_time:[*+TO+NOW]+AND+visibility_status:P+AND+section:jobb&site_id=207&limit=2000",
    function(data) {
      var ads = data.result.filter(ad => ad.visibility_status !== "H");
      callback(ads);
    }
  );
}

function getFrontArticles(front, filterContentMarketing, callback) {
  getUrl("//www.kode24.no/" + front + "?lab_viewport=json", function(data) {
    var articles = [];
    if (filterContentMarketing) {
      articles = data.result.filter(function(article) {
        return article.isContentMarketing !== "1";
      });
    } else {
      articles = data.result;
    }
    callback(articles);
  });
}

function getContentAds(callback) {
  getUrl(
    "//api.kode24.no/article/?query=published:[2017-01-01T00:00:00Z+TO+NOW]+AND+visibility_status:P+AND+section:annonse&limit=50&orderBy=published&site_id=207",
    function(data) {
      var contentAds = data.result.filter(
        ad => ad.tags.indexOf("content") > -1
      );
      callback(contentAds);
    }
  );
}

function getArticlesByTag(callback) {
  var articleId = getArticleId();
  getUrl("//api.kode24.no/article/?query=id:" + articleId, function(data) {
    var tag = data.result[0].section_tag || "";
    getUrl(
      '//api.kode24.no/article/?query=published:[2017-01-01T00:00:00Z+TO+NOW]+AND+visibility_status:P+AND+section:"' +
        tag +
        '"&limit=50&orderBy=published&site_id=207',
      function(data) {
        callback(data.result, tag);
      }
    );
  });
}

function getArticleId() {
  var articleUrl = window.location.href;
  var articleUrl = articleUrl.split("?")[0];
  var articleList = articleUrl.split("/").filter(val => val !== "");
  var articleId = articleList[articleList.length - 1];
  return articleId;
}

function getCitysFromTags(tags) {
  tags = tags.split(",");
  var foundCities = [];
  var cities = [
    "Halden",
    "Moss",
    "Sarpsborg",
    "Fredrikstad",
    "Hvaler",
    "Aremark",
    "Marker",
    "Rømskog",
    "Trøgstad",
    "Spydeberg",
    "Askim",
    "Eidsberg",
    "Skiptvet",
    "Rakkestad",
    "Råde",
    "Rygge",
    "Våler",
    "Hobøl",
    "Vestby",
    "Ski",
    "Ås",
    "Frogn",
    "Nesodden",
    "Oppegård",
    "Bærum",
    "Asker",
    "Aurskog-Høland",
    "Sørum",
    "Fet",
    "Rælingen",
    "Enebakk",
    "Lørenskog",
    "Skedsmo",
    "Nittedal",
    "Gjerdrum",
    "Ullensaker",
    "Nes",
    "Eidsvoll",
    "Nannestad",
    "Hurdal",
    "Oslo",
    "Kongsvinger",
    "Hamar",
    "Ringsaker",
    "Løten",
    "Stange",
    "Nord-Odal",
    "Sør-Odal",
    "Eidskog",
    "Grue",
    "Åsnes",
    "Våler",
    "Elverum",
    "Trysil",
    "Åmot",
    "Stor-Elvdal",
    "Rendalen",
    "Engerdal",
    "Tolga",
    "Tynset",
    "Alvdal",
    "Folldal",
    "Os",
    "Lillehammer",
    "Gjøvik",
    "Dovre",
    "Lesja",
    "Skjåk",
    "Lom",
    "Vågå",
    "Nord-Fron",
    "Sel",
    "Sør-Fron",
    "Ringebu",
    "Øyer",
    "Gausdal",
    "Østre Toten",
    "Vestre Toten",
    "Jevnaker",
    "Lunner",
    "Gran",
    "Søndre Land",
    "Nordre Land",
    "Sør-Aurdal",
    "Etnedal",
    "Nord-Aurdal",
    "Vestre Slidre",
    "Øystre Slidre",
    "Vang",
    "Drammen",
    "Kongsberg",
    "Ringerike",
    "Hole",
    "Flå",
    "Nes",
    "Gol",
    "Hemsedal",
    "Ål",
    "Hol",
    "Sigdal",
    "Krødsherad",
    "Modum",
    "Øvre Eiker",
    "Nedre Eiker",
    "Lier",
    "Røyken",
    "Hurum",
    "Flesberg",
    "Rollag",
    "Nore og Uvdal",
    "Horten",
    "Tønsberg",
    "Sandefjord",
    "Svelvik",
    "Larvik",
    "Sande",
    "Holmestrand",
    "Re",
    "Færder",
    "Porsgrunn",
    "Skien",
    "Notodden",
    "Siljan",
    "Bamble",
    "Kragerø",
    "Drangedal",
    "Nome",
    "Bø",
    "Sauherad",
    "Tinn",
    "Hjartdal",
    "Seljord",
    "Kviteseid",
    "Nissedal",
    "Fyresdal",
    "Tokke",
    "Vinje",
    "Risør",
    "Grimstad",
    "Arendal",
    "Gjerstad",
    "Vegårshei",
    "Tvedestrand",
    "Froland",
    "Lillesand",
    "Birkenes",
    "Åmli",
    "Iveland",
    "Evje og Hornnes",
    "Bygland",
    "Valle",
    "Bykle",
    "Kristiansand",
    "Mandal",
    "Farsund",
    "Flekkefjord",
    "Vennesla",
    "Songdalen",
    "Søgne",
    "Marnardal",
    "Åseral",
    "Audnedal",
    "Lindesnes",
    "Lyngdal",
    "Hægebostad",
    "Kvinesdal",
    "Sirdal",
    "Eigersund",
    "Sandnes",
    "Stavanger",
    "Haugesund",
    "Sokndal",
    "Lund",
    "Bjerkreim",
    "Hå",
    "Klepp",
    "Time",
    "Gjesdal",
    "Sola",
    "Randaberg",
    "Forsand",
    "Strand",
    "Hjelmeland",
    "Suldal",
    "Sauda",
    "Finnøy",
    "Rennesøy",
    "Kvitsøy",
    "Bokn",
    "Tysvær",
    "Karmøy",
    "Utsira",
    "Vindafjord",
    "Bergen",
    "Etne",
    "Sveio",
    "Bømlo",
    "Stord",
    "Fitjar",
    "Tysnes",
    "Kvinnherad",
    "Jondal",
    "Odda",
    "Ullensvang",
    "Eidfjord",
    "Ulvik",
    "Granvin",
    "Voss",
    "Kvam",
    "Fusa",
    "Samnanger",
    "Os",
    "Austevoll",
    "Sund",
    "Fjell",
    "Askøy",
    "Vaksdal",
    "Modalen",
    "Osterøy",
    "Meland",
    "Øygarden",
    "Radøy",
    "Lindås",
    "Austrheim",
    "Fedje",
    "Masfjorden",
    "Flora",
    "Gulen",
    "Solund",
    "Hyllestad",
    "Høyanger",
    "Vik",
    "Balestrand",
    "Leikanger",
    "Sogndal",
    "Aurland",
    "Lærdal",
    "Årdal",
    "Luster",
    "Askvoll",
    "Fjaler",
    "Gaular",
    "Jølster",
    "Førde",
    "Naustdal",
    "Bremanger",
    "Vågsøy",
    "Selje",
    "Eid",
    "Hornindal",
    "Gloppen",
    "Stryn",
    "Molde",
    "Ålesund",
    "Kristiansund",
    "Vanylven",
    "Sande",
    "Herøy",
    "Ulstein",
    "Hareid",
    "Volda",
    "Ørsta",
    "Ørskog",
    "Norddal",
    "Stranda",
    "Stordal",
    "Sykkylven",
    "Skodje",
    "Sula",
    "Giske",
    "Haram",
    "Vestnes",
    "Rauma",
    "Nesset",
    "Midsund",
    "Sandøy",
    "Aukra",
    "Fræna",
    "Eide",
    "Averøy",
    "Gjemnes",
    "Tingvoll",
    "Sunndal",
    "Surnadal",
    "Rindal",
    "Halsa",
    "Smøla",
    "Aure",
    "Bodø",
    "Narvik",
    "Bindal",
    "Sømna",
    "Brønnøy",
    "Vega",
    "Vevelstad",
    "Herøy",
    "Alstahaug",
    "Leirfjord",
    "Vefsn",
    "Grane",
    "Hattfjelldal",
    "Dønna",
    "Nesna",
    "Hemnes",
    "Rana",
    "Lurøy",
    "Træna",
    "Rødøy",
    "Meløy",
    "Gildeskål",
    "Beiarn",
    "Saltdal",
    "Fauske",
    "Sørfold",
    "Steigen",
    "Hamarøy",
    "Tysfjord",
    "Lødingen",
    "Tjeldsund",
    "Evenes",
    "Ballangen",
    "Røst",
    "Værøy",
    "Flakstad",
    "Vestvågøy",
    "Vågan",
    "Hadsel",
    "Bø",
    "Øksnes",
    "Sortland",
    "Andøy",
    "Moskenes",
    "Harstad",
    "Tromsø",
    "Kvæfjord",
    "Skånland",
    "Ibestad",
    "Gratangen",
    "Lavangen",
    "Bardu",
    "Salangen",
    "Målselv",
    "Sørreisa",
    "Dyrøy",
    "Tranøy",
    "Torsken",
    "Berg",
    "Lenvik",
    "Balsfjord",
    "Karlsøy",
    "Lyngen",
    "Storfjord",
    "Kåfjord",
    "Skjervøy",
    "Nordreisa",
    "Kvænangen",
    "Vardø",
    "Vadsø",
    "Hammerfest",
    "Kautokeino",
    "Alta",
    "Loppa",
    "Hasvik",
    "Kvalsund",
    "Måsøy",
    "Nordkapp",
    "Porsanger",
    "Karasjok",
    "Lebesby",
    "Gamvik",
    "Berlevåg",
    "Tana",
    "Nesseby",
    "Båtsfjord",
    "Sør-Varanger",
    "Trondheim",
    "Steinkjer",
    "Namsos",
    "Hemne",
    "Snillfjord",
    "Hitra",
    "Frøya",
    "Ørland",
    "Agdenes",
    "Bjugn",
    "Åfjord",
    "Roan",
    "Osen",
    "Oppdal",
    "Rennebu",
    "Meldal",
    "Orkdal",
    "Røros",
    "Holtålen",
    "Midtre Gauldal",
    "Melhus",
    "Skaun",
    "Klæbu",
    "Malvik",
    "Selbu",
    "Tydal",
    "Meråker",
    "Stjørdal",
    "Frosta",
    "Levanger",
    "Verdal",
    "Verran",
    "Namdalseid",
    "Snåsa",
    "Lierne",
    "Røyrvik",
    "Namsskogan",
    "Grong",
    "Høylandet",
    "Overhalla",
    "Fosnes",
    "Flatanger",
    "Vikna",
    "Nærøy",
    "Leka",
    "Inderøy",
    "Indre Fosen"
  ];
  tags.forEach(function(tag) {
    tag = tag.replace(/ /g, ""); // trim whitespace
    cities.forEach(function(city, index) {
      if (tag == city.toLowerCase()) foundCities.push(city);
    });
  });
  return foundCities;
}

function cleanSectionTag(sectionTag) {
  sectionTag = sectionTag.replace(/ /g, "-");
  return sectionTag;
}

function getUrl(url, callback) {
  $.ajax({
    type: "GET",
    url: url,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    success: function(data) {
      callback(data);
    }
  });
}
