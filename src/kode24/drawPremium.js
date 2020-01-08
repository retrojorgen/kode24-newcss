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

function getFrontPremiumBanners(callback) {
  getUrl("//api.kode24.no/front/?query=id:70267311", function(data) {
    getUrl(
      "//api.kode24.no/article/?query=published:[2017-01-01T00:00:00Z+TO+NOW]+AND+NOT+hidefromfp_time:[*+TO+NOW]+AND+visibility_status:P+AND+section:jobb&site_id=207&limit=2000",
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
