chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, { file: "jquery-2.1.1.min.js" }, function() {
    chrome.tabs.insertCSS(null, {file: "mystyle.css"}, function() {
    chrome.tabs.executeScript(null, { file: "inject.js" });
     });
	});
});

function checkForValidUrl(id, info, tab) {
    if (tab.status !== "complete"){
        console.log("not fully loaded yet");
        return;
    }
	if (tab.url.indexOf('http://www.coupons.com') == 0) {
	chrome.pageAction.show(id);
	}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);