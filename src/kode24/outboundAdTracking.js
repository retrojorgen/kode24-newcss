// tracks clicks on outboundlinks
/**
* Funksjon som sporer klikk på en utgående link i Analytics.
* Denne funksjonen tar en gyldig nettadressestreng som argument og bruker denne strengen
* som aktivitetsetikett. Hvis transportmetoden angis som «beacon», kan treffet sendes
* med «navigator.sendBeacon» i nettlesere som støtter dette.
*/
var trackOutboundLink = function (url, eventCategory, eventAction) {
  ga('send', 'event', {
    eventCategory: eventCategory,
    eventAction: eventAction,
    eventLabel: url,
    transport: 'beacon'
  });
}

$(function () {
  console.log("tracking outboud");
  $("a").click(function (event) {
    console.log("tracked");
    let targetUrl = event.currentTarget.href;
    if (targetUrl.indexOf("https://www.kode24.no/") < 0) {
      trackOutboundLink(targetUrl, "Ekstern_lenke", "klikk");
      console.log("Went to", targetUrl);
    }
  })
})