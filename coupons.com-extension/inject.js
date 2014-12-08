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
			alert("Extension finished running. Coupons displayed: " + couponsdisplayed);	
		}
	}, 500);
}


scrollBottom();






