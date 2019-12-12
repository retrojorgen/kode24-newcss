function adCounterToTopNav(numberOfAds) {
  $("#nav-top ul li a.jobb").append(
    `<span class="nav-badge">${numberOfAds}</span>`
  );
}
