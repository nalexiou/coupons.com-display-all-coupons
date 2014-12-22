chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, { file: "jquery-2.1.1.min.js" }, function() {
        chrome.tabs.insertCSS(null, {file: "mystyle.css"}, function() {
            chrome.tabs.executeScript(null, { file: "inject.js" });
        });
    });
});

function displayPageAction(tabid){
    chrome.tabs.get(tabid, function(tab){
        console.log(tab.status);
        if (tab.status !== "complete"){
            return;
        }
        if (tab.url.indexOf('http://www.coupons.com') == 0) {
            chrome.pageAction.show(tabid);
        }
    });
}

function checkForValidUrl(id, info, tab) { 
    displayPageAction(id);
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

