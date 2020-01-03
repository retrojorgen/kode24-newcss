// All the code that needs to be initialised in articles
$(function() {
  // only run if article
  if ($(".article-entity").length) {
    initCarousel(".row.facebook-comments");

    // start the code highlighter
    hljs.initHighlightingOnLoad();
    hljs.initLineNumbersOnLoad();
  }
});
