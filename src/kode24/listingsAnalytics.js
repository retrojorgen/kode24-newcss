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
