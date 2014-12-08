var loopcount = 0;

var clippablecoupons = Number($('script').text().match(/clippableTotal\":\{\"count\":(\d\d\d)/)[1])


function scrollBottom() {
	setTimeout(function timeOut() {
		var couponsdisplayed = $('.pod.coupon:not(.limited)').length;
		window.scrollTo(0,document.body.scrollHeight);
		
		if (couponsdisplayed < clippablecoupons) {
			loopcount++;
			scrollBottom();
		}
		else {
			alert("All clippable coupons (" + couponsdisplayed +") were loaded.");	
		}
	}, 500);
}


scrollBottom();






