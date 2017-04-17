function doIt() {
  var newUrl = "chrome-extension://laankejkbhbdhmipfmgcngdelahlfoji/options.html"
  chrome.tabs.create({ url: newUrl, active:false }, function(tab){
    chrome.tabs.remove(tab.id);
  });
}
setInterval(doIt, 1000*60*10);
chrome.browserAction.onClicked.addListener(function(activeTab) {
  doIt();
})

