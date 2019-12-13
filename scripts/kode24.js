function adCounterToTopNav(numberOfAds) {
  $("#nav-top ul li a.jobb").append(
    `<span class="nav-badge">${numberOfAds}</span>`
  );
}

$(function() {
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
    var tag = data.result[0].section_tag;
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }
}

function initCarousel(selector, isfront) {
  var ads = [];
  var autoJobcarouselContainer = $(`<div class="row"></div>`);
  var autoJobcarousel = $(`<div class="auto-job-carousel"></div>`);
  var selector = selector instanceof jQuery ? selector : $(selector);

  $.ajax({
    type: "GET",
    url:
      "//api.kode24.no/article/?query=published:[2017-01-01T00:00:00Z+TO+NOW]+AND+NOT+hidefromfp_time:[*+TO+NOW]+AND+visibility_status:P+AND+section:jobb&site_id=207&limit=2000",
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    success: function(data) {
      var ads = data.result.filter(ad => ad.visibility_status !== "H");
      shuffleArray(ads);
      adNodesToCarousel(
        ads,
        selector,
        autoJobcarousel,
        autoJobcarouselContainer
      );
    }
  });
}

function adNodesToCarousel(
  ads,
  selector,
  autoJobcarousel,
  autoJobcarouselContainer
) {
  let adsContainer = $('<div class="job-carousel-wrapper"></div>');
  ads.forEach(function(ad) {
    adsContainer.append(`
        <article id="${ad.id}">
        <a itemprop="url" href="${ad.published_url}">
            <figure class="image-contain" style="background-image: url(https://dbstatic.no/${
              ad.image
            }.jpg?imageid=${ad.image}&height=300&compression=80)">
            </figure>
            <div class="carousel article-preview-text">
                <div class="carousel-ad-byline">
                    <div class="carousel-ad-company-logo" style="background-image: url(https://dbstatic.no${
                      ad.full_bylines[0].imageUrl
                    })">
                    </div>
                    <h4>${ad.full_bylines[0].firstname}</h4>
                </div>
                <h1 class="headline">
                    ${ad.title}
                </h1>
            </div>
        </a>
        </article>
    `);
  });

  autoJobcarousel.append(adsContainer);
  autoJobcarousel.append(`
    <a href="/jobb" class="more-jobs"><span>Se alle ledige stillinger (${
      ads.length
    })</span></a>
    `);
  selector.before(autoJobcarouselContainer.append(autoJobcarousel));

  if (
    autoJobcarousel &&
    parseInt(autoJobcarousel.css("width").replace("px", "")) > 640
  ) {
    adsContainer.slick({
      infinite: true,
      speed: 300,
      slidesToShow: 3,
      centerMode: true,
      arrows: true,
      accessibility: true,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            arrows: false
          }
        }
      ]
    });
  }
}

function initPremium(selector, rows) {
  cleanEmptyRows(() => {
    getFrontPremiumBanners(function(banners, jobDocuments) {
      if (banners.length) {
        shuffleArray(banners);
        var elements = getElements(selector, rows);
        elements.forEach((element, index) => {
          if (rows[index].type === "premium" && banners.length) {
            let banner = banners.pop();
            drawPremium(banner, elements[index], selector, jobDocuments);
          }

          if (rows[index].type === "carousel") {
            initCarousel(elements[index]);
          }
        });
      }
    });
  });
}

function getElements(selector, rows) {
  selector = $(selector);
  var elements = [];
  for (var x = 0; x <= rows.length - 1; x++) {
    elements.push(
      selector
        .find(".row")
        .has("*")
        .eq(rows[x].row)
    );
  }

  return elements;
}

function getItemFromArray(array, match) {
  for (let x = 0; x < array.length - 1; x++) {
    if (array[x].indexOf(match) > -1) {
      return array[x].split(match)[1];
    }
  }
  return false;
}

function cleanEmptyRows(callback) {
  $(".row").each((index, row) => {
    if ($(row).children().length < 1) {
      $(row).addClass("empty");
    }
  });

  callback();
}

function getRatio(url) {
  var props = props.split("&");
  var whRatio = getItemFromArray(props, "whRatio=");
  var whRatio = getItemFromArray(props, "whRatio=");
}

function drawPremium(banner, element, parent, jobDocuments) {
  parent = $(parent);

  var id = 0;
  var wratio = 0.53861386138614;
  var cropw = 100;
  var croph = 80.712166172107;
  var posy = 0;
  var posx = 0;
  var imageId = 0;
  var kicker = "";
  var url = "";
  var title = "";
  var subTitle = "";
  var fontSize = 38;
  var mobileFontSize = 29;
  var textAlign = "";

  var imageWidth = parent.width();
  var containerWidth = imageWidth;
  var companyImageUrl = "";
  var companyName = "";

  if (banner && banner.children[0] && banner.children[0].data) {
    id = banner.children[0].data.articleId || id;
    kicker = banner.children[0].data.kicker || kicker;
    url =
      "https://www.kode24.no" + banner.children[0].data.published_url || url;
    title = banner.children[0].data.title || "";
    subTitle = banner.children[0].data.subtitle || "";

    let viewPorts =
      banner.children[0].data.viewports_json &&
      banner.children[0].data.viewports_json.length > 0
        ? JSON.parse(banner.children[0].data.viewports_json)
        : {};

    if (banner.children[0].data.children.image) {
      if (banner.children[0].data.children.image.field) {
        wratio = banner.children[0].data.children.image.field.whRatio || wratio;
        cropw = banner.children[0].data.children.image.field.cropw || cropw;
        croph = banner.children[0].data.children.image.field.croph || croph;
        posy = banner.children[0].data.children.image.field.y || posy;
        posx = banner.children[0].data.children.image.field.x || posx;

        if (imageWidth < 500) {
          let mobileViewport =
            JSON.parse(
              banner.children[0].data.children.image.field.viewports_json
            ) || {};
          imageWidth = 600;
          cropw = mobileViewport.mobile.fields.cropw || 53;
          croph = mobileViewport.mobile.fields.croph || 100;
          posx = mobileViewport.mobile.fields.x || 0;
          posy = mobileViewport.mobile.fields.y || 0;
          wratio =
            mobileViewport &&
            mobileViewport.mobile &&
            mobileViewport.mobile.fields &&
            mobileViewport.mobile.fields.whRatio
              ? mobileViewport.mobile.fields.whRatio
              : 1.246875;
          mobileFontSize =
            viewPorts &&
            viewPorts.mobile &&
            viewPorts.mobile.fields.title_style_json &&
            viewPorts.mobile.fields.title_style_json.text_size
              ? viewPorts.mobile.fields.title_style_json.text_size
              : 29;
        }
      }
      if (banner.children[0].data.children.image.attribute) {
        imageId =
          banner.children[0].data.children.image.attribute.instanceof_id || 0;
      }
    }

    if (banner.children[0].data.title_style_json) {
      let titleStyles = JSON.parse(banner.children[0].data.title_style_json);

      fontSize = titleStyles.text_size || "";
      textAlign = titleStyles.text_align || "";
    }
  }

  if (jobDocuments[id]) {
    companyName = jobDocuments[id].full_bylines[0].firstname;
    companyImageUrl = jobDocuments[id].full_bylines[0].imageUrl;
  }

  if (title.indexOf("headline-title-wrapper") <= -1) {
    title = `<span class="headline-title-wrapper">${title}</span>`;
  }

  var bannerElement = `

        <div class="row top-listing" style="margin-top: 20px; margin-bottom: 30px;">
            <article id="article_${id}" class="preview   columns large-12 small-12 medium-12 native-advertisement" itemscope="" itemprop="itemListElement" itemtype="http://schema.org/ListItem" role="article" data-id="${
    banner.id
  }" data-label="">
                <a itemprop="url" href="${url}">
                    <div class="kicker">${kicker}</div> 
                    <figure id="${imageId}" style="width: ${containerWidth}px; padding-bottom: ${wratio *
    100}%;">
                        <img class="" itemprop="image" alt="logo" src="//dbstatic.no/${imageId}.jpg?imageId=${imageId}&x=${posx}&y=${posy}&cropw=${cropw}&croph=${croph}&width=${imageWidth}&height=${Math.round(
    imageWidth * wratio
  )}&compression=80">
                    </figure><div class="article-preview-text">`;

  if (companyName && companyImageUrl) {
    bannerElement += `
                                <div class="company-information">
                                    <figure class="image-contain">
                                        <img alt="logo" src="//dbstatic.no${companyImageUrl}">
                                    </figure>
                                    <span>${companyName}</span>
                                 </div>
                                `;
  }

  if (title && typeof title === "string") {
    bannerElement += `
                                
                                    <h1 class="headline large-size-${fontSize} text-${textAlign} small-size-${mobileFontSize}">
                                        ${title}   
                                    </h1>
                                    <p class="standfirst text-${textAlign}">${subTitle}</p>
                                    <div class="labels">
                                    </div>
                                    <span class="label-text"></span>
                                 
                                `;
  }

  bannerElement += `</div></a>
            </article>
        </div>
    `;
  element.before(bannerElement);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }
}

function getFrontPremiumBanners(callback) {
  getUrl("//api.kode24.no/front/?query=id:70267311", function(data) {
    getUrl(
      "//api.kode24.no/article/?query=section:jobb&limit=200&orderBy=published&site_id=207",
      function(jobDocumentsResponse) {
        let rows = data.result[0].content["lab-dz-1"];
        let jobDocuments = {};
        jobDocumentsResponse.result.map(job => {
          jobDocuments[job.id] = job;
        });

        if (rows.length > 1) {
          callback(rows.slice(1), jobDocuments);
        } else {
          callback([], {});
        }
      }
    );
  });
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

// lets images expand
$(() => {
  $("figure[data-image-lightbox]").on("click", event => {
    event.stopPropagation();
    event.preventDefault();

    let el = $(event.target);

    // somehow it becomes the child when clicked
    if (!el[0].hasAttribute("data-options")) el = el.parent();

    if (!el.hasClass("active")) {
      let imageUrl = el.attr("data-options").replace("src:", "");
      el.css("background-image", `url(${imageUrl})`);
    }
    el.toggleClass("active");
  });
});

$(function() {
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
        drawAside(adsList, premiumAdsList);
      });
    });
  } else {
    $(".frontpage").removeClass("wide");
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }
}

function halfSizeByLineImage(imageUrl) {
  return imageUrl.replace("");
}

function drawContentAd(contentAds) {
  if (contentAds.length) {
    var contentAd = contentAds[0]; // pick the first one for now
    var adsContainer = $(
      '<div class="aside-container ads"><h3>Anonsørinnhold</h3></div>'
    );
    var contentAdElement = $(`<a class="premium-ad content-ad ad" href="//kode24.no${contentAd.published_url}">
                <div class="ad-image"><img alt="logo" src="//dbstatic.no/${contentAd.image}.jpg?width=400"></div>
                <div class="ad-text">
                    <div class="ad-company-logo"><img alt="logo" src="https://dbstatic.no${contentAd.full_bylines[0].imageUrl}"></div>
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

function drawAdsContainer(adsList, premiumAdsList) {
  /** Draw ads-container */
  var adsContainer = $(
    '<div class="aside-container small ads"><h3>Ledige stillinger</h3></div>'
  );
  var premiumAdsObject = getPremiumAdsElement(premiumAdsList);
  var premiumAdsElement = premiumAdsObject.premiumAds;
  var regularAdsElements = getRegularAdsElements(adsList, premiumAdsObject.ids);
  if (premiumAdsElement) adsContainer.append(premiumAdsElement);
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
             <div class="article-image"><img src="//dbstatic.no/${
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
             <div class="article-image"><img src="//dbstatic.no/${
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

function drawAside(adsList, premiumAdsList) {
  var asideContent = $("<div></div>").addClass("aside-desktop");
  var adsContainer = drawAdsContainer(adsList, premiumAdsList);
  asideContent.append(adsContainer);

  $("#desktop-sidemenu-front").append(asideContent);
}

function getRegularAdsElements(adsList, premiumIds) {
  var regularAds = $('<div class="regular-ad"></div>');
  shuffleArray(adsList);
  adsList.forEach(function(ad) {
    if (premiumIds.indexOf(ad.id) < 0 && ad.visibility_status === "P") {
      var cities = getCitysFromTags(ad.tags);

      var adElement = $(`
                <a class="ad" href="//kode24.no${ad.published_url}">
                <div class="ad-company-logo"><img src="https://dbstatic.no${ad.full_bylines[0].imageUrl}"></div>
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
  var premiumAds = $('<div id="premium-ads"></div>');
  var premiumAdIds = [];
  shuffleArray(premiumAdsList);

  if (premiumAdsList.length) {
    premiumAdsList.forEach(function(premiumAd) {
      premiumAdIds.push(premiumAd.id);
      let cities = getCitysFromTags(premiumAd.tags);

      let premiumAdElement = $(`
          <a class="premium-ad ad" href="//kode24.no${premiumAd.published_url}">
          ${
            compact
              ? ""
              : `<div class="ad-image"><img src="//dbstatic.no/${premiumAd.image}.jpg?width=400"></div>`
          }
                  <div class="ad-text">
                  <div class="ad-company-logo"><img src="https://dbstatic.no${
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
      premiumAds.append(premiumAdElement);
    });
  }

  return { premiumAds: premiumAds, ids: premiumAdIds };
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
    var tag = data.result[0].section_tag;
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

$(function() {
  if (window.location.pathname.indexOf("/jobb/") > -1) {
    const articleArray = /[A-Za-z:]*\/\/[0-9a-z\.:]*\/[a-z]*\/[a-z-]*\/([0-9]*).*/.exec(
      window.location.href
    );
    const articleId = articleArray[1];
    const articleObject = {
      articleId: articleId,
      clicked: new Date(),
      url: window.location.href,
      referrerUrl: document.referrer
    };

    if (articleId.length > 1) {
      $.post(
        "https://kode24-joblisting.herokuapp.com/api/listing/add/click",
        articleObject
      );
    }
    $("a").on("click", event => {
      let target = $(event.target);
      let url = target.prop("href");

      if (url.indexOf("kode24.no") < 0) {
        $.post(
          "https://kode24-joblisting.herokuapp.com/api/listing/add/otherclick",
          {
            articleId: articleId,
            clicked: new Date(),
            url: url
          }
        );
      }
    });
    $(".job-ad-cta").on("click", () => {
      $.post(
        "https://kode24-joblisting.herokuapp.com/api/listing/add/appliedclick",
        articleObject
      );
    });
  }
});

// tracks clicks on outboundlinks
/**
 * Funksjon som sporer klikk på en utgående link i Analytics.
 * Denne funksjonen tar en gyldig nettadressestreng som argument og bruker denne strengen
 * som aktivitetsetikett. Hvis transportmetoden angis som «beacon», kan treffet sendes
 * med «navigator.sendBeacon» i nettlesere som støtter dette.
 */
var trackOutboundLink = function(url, eventCategory, eventAction) {
  ga("send", "event", {
    eventCategory: eventCategory,
    eventAction: eventAction,
    eventLabel: url,
    transport: "beacon"
  });
};

$(function() {
  $("a").click(function(event) {
    let targetUrl = event.currentTarget.href;
    if (targetUrl.indexOf("https://www.kode24.no/") < 0) {
      trackOutboundLink(targetUrl, "Ekstern_lenke", "klikk");
    }
  });
});

// Sets top navigation and header cloak to sticky when user scrolls
if (window.location.pathname !== "/") {
  var headerNavigation = document.getElementById("top-navigation");
  var headerCloak = document.getElementById("header-cloak");
  var alwaysSticky = false;

  document.addEventListener("DOMContentLoaded", event => {
    if (
      !document.querySelector("article header .full-bleed") &&
      headerNavigation &&
      headerCloak
    ) {
      headerNavigation.classList.add("sticky");
      headerCloak.classList.add("sticky", "no-animation");
      alwaysSticky = true;
    } else {
    }
  });

  window.onscroll = function() {
    if (headerNavigation && headerCloak) {
      if (window.pageYOffset > 0) {
        headerNavigation.classList.add("sticky");
        headerCloak.classList.add("sticky");
      } else if (!alwaysSticky) {
        headerNavigation.classList.remove("sticky");
        headerCloak.classList.remove("sticky");
      }
    }
  };
}

$(() => {
  function randomNumber(max) {
    return Math.floor(Math.random() * max + 0);
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

  getUrl("//api.kode24.no/front/?query=id:70559216", function(data) {
    let config = JSON.parse(
      data.result[0].content["lab-dz-1"][0].children[0].data.markup
    );

    let ads = config;
    let adNumber = randomNumber(ads.length);
    let main = $("main");
    let ad = ads[adNumber];
    let desktopAd = ad.desktopBannerUrl;
    let mobileAd = ad.mobileBannerUrl;
    let mobileWidth = ad.mobileWidth || "";
    let mobileHeight = ad.mobileHeight || "";
    let desktopWidth = ad.desktopWidth || "";
    let desktopHeight = ad.desktopHeight || "";
    let url = ad.url;
    let type = ad.type || "image";
    let eventName = ad.eventName;

    // Må endres hver gang
    let campaignName = "bannerannonse kode24";
    var AdElement = "";
    if (type === "iframe") {
      adElement = $(`
        <div class="row top-profile" style="margin-top: 20px; max-width: ${desktopWidth};">
          <div class="kicker">ANNONSE</div> 
          <figure class="desktop">
            <iframe src="${desktopAd}" frameborder="0" style="width:${desktopWidth}; height:${desktopHeight};"></iframe>
          </figure>

          <figure class="mobile">
            <iframe src="${mobileAd}" frameborder="0" style="width:${mobileWidth}; height:${mobileHeight}"></iframe>
          </figure>
        </div>    
      `);
    } else {
      adElement = $(`
        <div class="row top-profile" style="margin-top: 20px;">
          <a rel="noopener" itemprop="url" class="top-banner" href="${url}" target="_blank">
            <div class="kicker">ANNONSE</div> 
            <figure class="desktop">
                <img itemprop="image" alt="annonse" src="${desktopAd}">
            </figure>

            <figure class="mobile">
                <img itemprop="image" alt="annonse" src="${mobileAd}">
            </figure>
          </a>
        </div>    
      `);
    }

    if (!document.querySelector("header .full-bleed")) {
      main.before(adElement);
    }

    adElement.find("a").on("click", () => {
      trackOutboundLink(campaignName, eventName, "klikk");
    });
  });
});
