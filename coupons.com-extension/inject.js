var loopcount = 0;

var clippablecoupons = Number($('script').text().match(/clippableTotal\":\{\"count\":(\d\d\d)/)[1])


var mydiv = $("<div>", {id: "myloader"});
mydiv.css('background-image', 'URL(' + chrome.extension.getURL('myspinner.gif') + ')'); 
var mytext = $("<div>", {text: "Loading coupons...."});
var coupontag = $("<span>", {id: "mycoupontotal", text: $('.pod.coupon:not(.limited)').length});
mytext.append('<br/><br/>Total coupons loaded: ').append(coupontag);
mydiv.html(mytext);
$('body').append(mydiv);

function scrollBottom() {
	setTimeout(function timeOut() {
		var couponsdisplayed = $('.pod.coupon:not(.limited)').length;
		$('#mycoupontotal').text(couponsdisplayed);
		window.scrollTo(0,document.body.scrollHeight);
		
		if (couponsdisplayed < clippablecoupons) {
			loopcount++;
			scrollBottom();
		}
		else {
			$('#myloader').css('background-image', 'URL(' + chrome.extension.getURL('checkmark.png') + ')');
			$('div#myloader div').text('Loading complete! ').append('<br/><br/> Total coupons: ' + couponsdisplayed );
			$('#myloader').fadeOut(6000);
			window.scrollTo(0,0);	
		}
	}, 500);
}


scrollBottom();






