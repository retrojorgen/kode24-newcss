$(() => {
  function randomNumber(max) {
    return Math.floor(Math.random() * max + 0);
  }

  console.log("updated with iframe");

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
    console.log("ad type", ad);
    // Må endres hver gang
    let campaignName = "bannerannonse kode24";
    var AdElement = "";
    if (type === "iframe") {
      console.log("drawing iframe", ad);
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
      console.log("added banner");
    }

    adElement.find("a").on("click", () => {
      console.log("Log click on banner");
      trackOutboundLink(campaignName, eventName, "klikk");
    });
  });
});
