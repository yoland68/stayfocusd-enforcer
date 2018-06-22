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
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const current_window_id = tabs[0].windowId;
    const current_tab_index = tabs[0].index;
    chrome.tabs.create(
      {
        windowId: current_window_id,
        index: current_tab_index,
        url: newUrl,
        active:true 
      }, function(tab){
      chrome.tabs.executeScript(tab.id, { code: `
        setInterval(function() {
          const ids = [
            "laankejkbhbdhmipfmgcngdelahlfoji"
            ];
          let closeWindow = [];
          ids.forEach(function theFunc(id, i) {
            const el = document.querySelector("extensions-manager")
                        .shadowRoot
                        .querySelector("extensions-view-manager")
                        .querySelector("extensions-item-list")
                        .shadowRoot
                        .getElementById(id)
                        .shadowRoot;
            if (el.querySelector(".disabled")) {
                  el.querySelector("cr-toggle").click();
            }
            closeWindow[i] = true
          });
          if (closeWindow.reduce((a,b) => a && b)) {
            window.close();
          }
        }, 20);
        setTimeout(function() {
          window.close();
        }, 2000);`,
        allFrames: true
      }, null);
    });
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

setInterval(Combined, 1000*60*30);

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

/*function connect() {*/
  //var hostName = "com.yoland.stayfocus-enforcer";
  //port = chrome.runtime.connectNative(hostName);
  //port.onMessage.addListener(onNativeMessage);
  //port.onDisconnect.addListener(onDisconnected);
//}

/*connect()*/
