var port = null;

function removeAgars() {
  chrome.tabs.query({url: "http://agar.io/*"}, function(tabArr) {
    tabArr.forEach(function(tab) {
      chrome.tabs.remove(tab.id);
    });
  });
}

function followInsta() {
  const darkCode = `
      var aTags = document.getElementsByTagName("button");
      var searchText = "Follow";
      var found;
      
      for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText) {
          found = aTags[i];
          found.click()
          break;
        }
      }
      `
  chrome.tabs.query({url: "https://www.instagram.com/*"}, function(tabArr) {
    tabArr.forEach(function(tab) {
      chrome.tabs.executeScript(tab.id, {code: darkCode});
    });
  });
}

function removeDistractingSites() {                                             
  chrome.tabs.query(                                                            
      {                                                                         
        url: [                                                                  
          'http://arstechnica.com/*',                                           
          'https://memegen.googleplex.com/*',                                   
          'https://arstechnica.com/*',                                          
          'https://amazon.com/*',
          'https://www.amazon.com/*',
          'https://www.theverge.com/*',                                         
          'https://www.youtube.com/*',                                         
          'https://youtube.com/*',                                         
          'https://techcrunch.com/*',                                           
        ]                                                                       
      },                                                                        
      function(tabArr) {                                                        
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
  reloadSF();
  removeDistractingSites();
}

setInterval(reloadSF, 1000*60*10);
setInterval(removeDistractingSites, 1000*60*5);

chrome.browserAction.onClicked.addListener(function(activeTab) {
  Combined();
  //followInsta();
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
