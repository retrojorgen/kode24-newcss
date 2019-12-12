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
