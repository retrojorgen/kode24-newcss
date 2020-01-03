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
            <figure class="image-contain" style="background-image: url(https://dbstatic.no/${ad.image}.jpg?imageid=${ad.image}&height=300&compression=80)">
            </figure>
            <div class="carousel article-preview-text">
                <div class="carousel-ad-byline">
                    <div class="carousel-ad-company-logo" style="background-image: url(https://dbstatic.no${ad.full_bylines[0].imageUrl})">
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
    <a href="/jobb" class="more-jobs"><span>Se alle ledige stillinger (${ads.length})</span></a>
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
