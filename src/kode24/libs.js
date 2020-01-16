// code that is reused across multiple files
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }
}

function newShuffledArray(array) {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // eslint-disable-line no-param-reassign
  }
  return newArray;
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

// returns a div with the correct aside class
function getAside() {
  return $("<div></div>").addClass("aside-desktop");
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
    "//api.kode24.no/article/?query=published:[2017-01-01T00:00:00Z+TO+NOW]+AND+visibility_status:P+AND+section:annonse&limit=10&orderBy=published&site_id=207",
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
        '"&limit=10&orderBy=published&site_id=207',
      function(data) {
        callback(data.result, tag);
      }
    );
  });
}

function getArticleId() {
  var articleUrl = "";
  if ($(".article-entity meta:first").attr("content").length) {
    articleUrl = $(".article-entity meta:first").attr("content");
  } else {
    var articleUrl = window.location.href;
  }
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
    '<div class="aside-container ads"><h3>Ledige stillinger</h3></div>'
  );
  // if there are any premium ads

  if (premiumAdsList.length) {
    var premiumAdElements = premiumAdsList.map(ad => drawPremiumAdElement(ad));
    adsContainer.append(premiumAdElements);
  }

  adsContainer.append(getRegularAdsElements(adsList));

  adsContainer.append(
    '<div class="adslist-see-more"><a href="//kode24.no/jobb/"><span>Se alle stillinger (' +
      (adsList.length + premiumAdsList.length) +
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

function getRegularAdsElements(adsList) {
  var regularAds = $('<div class="regular-ad"></div>');
  shuffleArray(adsList);
  adsList.forEach(function(ad) {
    if (ad.visibility_status === "P") {
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

function getRandomItemFromArray(itemsArray) {
  return itemsArray[Math.floor(Math.random() * itemsArray.length)];
}

function drawPremiumAdElement(premiumAd, compact) {
  var cities = getCitysFromTags(premiumAd.tags);
  var premiumAdElement = $(`<a class="premium-ad ad" href="//kode24.no${
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

  return premiumAdElement;
}
