chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);

    $(".blob-code-inner").click(function() {
      $(".blob-code-inner").css("background-color", "red");
      BetterReview.PullRequests();
    });
  }
  }, 10);
});
