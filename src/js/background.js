function removeAgars() {
  chrome.tabs.query({url: "http://agar.io/*"}, function(tabArr) {
    tabArr.forEach(function(tab) {
      chrome.tabs.remove(tab.id);
    });
  });
}

function reloadSF() {
  const newUrl = "chrome-extension://laankejkbhbdhmipfmgcngdelahlfoji/options.html";
  chrome.tabs.create({ url: newUrl, active:false }, function(tab){
    chrome.tabs.remove(tab.id);
  });
}

function enableExtensions() {
  const newUrl = "chrome://extensions-frame/";
  chrome.tabs.create({ url: newUrl, active:false }, function(tab){
    chrome.tabs.executeScript(tab.id, {code: `
      setInterval(function() {
        const ids = [
          "laankejkbhbdhmipfmgcngdelahlfoji",
          "hkpbllilogbchodhfhelfdlgcfgamcng"];
        let closeWindow = [];
        ids.forEach(function theFunc(id, i) {
          if (!document.getElementById(id)) {
            closeWindow[i] = false
          } else {
            const el = document.getElementById(id).getElementsByClassName(
                    "enable-text")[0];
            if (window.getComputedStyle(el).getPropertyValue("display") == "inline") {
                  el.click();
            }
            closeWindow[i] = true
          }
        });
        if (closeWindow.reduce((a,b) => a &&b)) {
          window.close();
        }
      }, 50);
      setTimeout(function() {
        window.close();
      }, 200)`,
      allFrames: true
    }, null);
  });
};

function Combined() {
  enableExtensions();
  setTimeout(reloadSF, 200);
}

setInterval(Combined, 1000*60*10);
chrome.browserAction.onClicked.addListener(function(activeTab) {
  Combined();
})

chrome.management.onEnabled.addListener(function (info) {
  if (info.id == "dbpndlofcgbjmnpinbmhligbinkdndcg") {
    removeAgars();
  }
});
