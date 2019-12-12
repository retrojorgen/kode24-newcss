// Sets top navigation and header cloak to sticky when user scrolls
if (window.location.pathname !== "/") {
  var headerNavigation = document.getElementById("top-navigation");
  var headerCloak = document.getElementById("header-cloak");
  var alwaysSticky = false;

  document.addEventListener("DOMContentLoaded", event => {
    if (
      !document.querySelector("article header .full-bleed") &&
      headerNavigation &&
      headerCloak
    ) {
      headerNavigation.classList.add("sticky");
      headerCloak.classList.add("sticky", "no-animation");
      alwaysSticky = true;
    } else {
    }
  });

  window.onscroll = function() {
    if (headerNavigation && headerCloak) {
      if (window.pageYOffset > 0) {
        headerNavigation.classList.add("sticky");
        headerCloak.classList.add("sticky");
      } else if (!alwaysSticky) {
        headerNavigation.classList.remove("sticky");
        headerCloak.classList.remove("sticky");
      }
    }
  };
}
