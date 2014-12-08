chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, { file: "jquery-2.1.1.min.js" }, function() {
    chrome.tabs.executeScript(null, { file: "inject.js" });
	});
});

function checkForValidUrl(tabId, changeInfo, tab) {
if (tab.url.indexOf('http://www.coupons.com') == 0) {
chrome.pageAction.show(tabId);
}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);