function adCounterToTopNav(numberOfAds) {
  console.log("adding counter");
  $("#nav-top ul li a.jobb").append(
    `<span class="nav-badge">${numberOfAds}</span>`
  );
}
