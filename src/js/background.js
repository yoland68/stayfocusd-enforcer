var newUrl = "chrome-extension://laankejkbhbdhmipfmgcngdelahlfoji/options.html"
setInterval(function doIt() {
  chrome.tabs.create({ url: newUrl, active:false }, function(tab){
    chrome.tabs.remove(tab.id);
  });
  return doIt;
}(), 1000*60*10);
