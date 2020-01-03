// the scripts that run on the front page

$(function() {
  // add inn premium ads in the news mix on the front page

  // only run if not in article
  if (!$(".article-entity").length) {
    initPremium("#front-articles-list", [
      { type: "premium", row: 3 },
      { type: "premium", row: 5 },
      { type: "carousel", row: 7 },
      { type: "premium", row: 9 },
      { type: "premium", row: 11 },
      { type: "premium", row: 13 },
      { type: "premium", row: 15 },
      { type: "premium", row: 17 },
      { type: "premium", row: 19 },
      { type: "premium", row: 21 },
      { type: "premium", row: 23 },
      { type: "premium", row: 25 }
    ]);
  }
});
