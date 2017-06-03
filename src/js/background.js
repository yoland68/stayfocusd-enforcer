function doIt() {
  const newUrl = "chrome-extension://laankejkbhbdhmipfmgcngdelahlfoji/options.html";
  chrome.tabs.create({ url: newUrl, active:false }, function(tab){
    chrome.tabs.remove(tab.id);
  });
}
setInterval(doIt, 1000*60*10);

function EnableIt() {
  const newUrl = "chrome://extensions-frame/";
  chrome.tabs.create({ url: newUrl, active:false }, function(tab){
    chrome.tabs.executeScript(null, {code: `
      (function() {
        const ids = [
          "laankejkbhbdhmipfmgcngdelahlfoji",
          "dbpndlofcgbjmnpinbmhligbinkdndcg"];
        ids.forEach(function theFunc(id) {
          if (!document.getElementById(id)) {
            alart(id + " element is not found");
          } else {
            const el = document.getElementById(id).getElementsByClassName(
                    "enable-text")[0];
            if (window.getComputedStyle(el).getPropertyValue("display") == "inline") {
                  el.click();
            }
          }
        });
      })();`,
      runAt: "document_end", // Must run at the end of the document so element
                             // in dom can be found
      allFrames: true
    }, function(result) { 
      setTimeout(function() {chrome.tabs.remove(tab.id)}, 100);
    });
  });
};

chrome.browserAction.onClicked.addListener(function(activeTab) {
  EnableIt();
  setTimeout(doIt, 200);
})
