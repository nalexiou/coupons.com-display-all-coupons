Display-all-coupons-chrome-extension
===========================================

This is an experimental Google Chrome extension that allows users to load and search all clippable coupons. The code that is distributed here should only be used as a guide to understand techniques to access an HTML document using Javascript/jQuery. Use at your own risk.

1. Load the extension in Google Chrome: settings => extensions => check “developer mode” => load unpacked extension
2. Visit target website
3. A "scissors" icon now appears on the Google Chrome address bar (right side)
4. Now press the "scissors" icon

Extension will first ask if user would like to change zipcode.
If yes, user will be redirected to another site. Otherwise, coupons will begin loading.

The extension will keep refreshing the page until all coupons are displayed on the screen. During this process, if the user clicks on the X, the script will pause. To resume, click the scissors icon again. Once the script finishes running, an alert will display how many coupons were loaded.

Then, the user can search for keywords in the coupons. If found, coupons will be shown at top of page and highlighted yellow. User also can view all clipped coupons by clicking a paper clip icon.

-Created by Nikolaos Alexiou