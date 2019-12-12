(function() {
  var seenthisScript = document.getElementById('seenthisScript');
  var scriptUrl = seenthisScript.getAttribute('src');
  window.seenthisScriptURL = scriptUrl;
  var htmlUrl = scriptUrl.replace('script.js', 'index.html')
  function load(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        callback(xhr.response);
      }
    }
    xhr.open('GET', url, true);
    xhr.send();
  }

  load(htmlUrl, function (response) {
    document.write(response);
  });
})();
