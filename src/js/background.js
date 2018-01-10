var port = null;

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

function enableChromeTheme(setDark) {
  const deluminatePopWindowUrl= "chrome-extension://iebboopaeangfpceklajfohhbpkkfiaa/popup.html";
  const lightCode = `
        const button = document.getElementById("toggle");
        if (button.firstElementChild.textContent == "Disable") {
          el.click();
        }
        window.close();
        `
  const darkCode = `
        const button = document.getElementById("toggle");
        if (button.firstElementChild.textContent == "Enabled") {
          el.click();
        }
        window.close();
        `
  if (setDark) {
    chrome.tabs.create({url: deluminatePopWindowUrl, active:false}, function(tab) {
      chrome.tabs.executeScript(tab.id, {code: darkCode});
    });
  } else {
    chrome.tabs.create({url: deluminatePopWindowUrl, active:false}, function(tab) {
      chrome.tabs.executeScript(tab.id, {code: lightCode});
    });
  }
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
        if (closeWindow.reduce((a,b) => a && b)) {
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

function sendFinishJobNotification(success, info) {
  const iconUrl = success ? 'icons/thumb_up.png' : 'icons/thumb_down.png';
  chrome.notifications.create("jobFinished", {
    type: "basic",
    title: "Job Finished",
    isClickable: false,
    iconUrl: chrome.runtime.getURL(iconUrl),
    message: ">>> " + info});
}

function connect() {
  var hostName = "";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

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

function onNativeMessage(message) {
  console.log(JSON.sringify(message));
}

function onDisconnect() {
  console.log("failed to connect");
}

function connect() {
  var hostName = "com.yoland.stayfocus-enforcer";
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
}

connect()
