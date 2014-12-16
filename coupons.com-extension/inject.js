var loopcount = 0;

var clippablecoupons = Number($('script').text().match(/clippableTotal\":\{\"count\":(\d\d\d)/)[1])


// if ($('#myloader').length === 0) {
// var mydiv = $("<div>", {id: "myloader"});
// mydiv.css('background-image', 'URL(' + chrome.extension.getURL('myspinner.gif') + ')'); 
// var mytext = $("<div>", {text: "Loading coupons...."});
// var coupontag = $("<span>", {id: "mycoupontotal", text: $('.pod.coupon:not(.limited)').length});
// mytext.append('<br/><br/>Total coupons loaded: ').append(coupontag);
// mydiv.html(mytext);
// $('body').append(mydiv);
// }

// else {
// 	$('#myloader').show();
// }

var mydiv = $("<div>", {id: "myloader", class: "field"});
var myinput = $("<input>", {id: "searchterm", placeholder: "Search for coupons", type: "text", class: "field"});
var mybutton = $("<button>", {id: "search", type: "button"});
var cancel = $("<button>", {id: "cancel", type: "button"});
mybutton.text("Find");
cancel.text("X");
mydiv.append(myinput, mybutton, cancel);
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
			setTimeout(function(){
				$('#myloader').fadeOut(3000);
				window.scrollTo(0,0);	
			}, 2000);
		}
	}, 500);
}


// scrollBottom();


// $.expr[":"].contains = $.expr.createPseudo(function(arg) {
//     return function( elem ) {
//         return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
//     };
// });



// var keywords = "juice glade";
// words = keywords.split(/\s+/);
// wordregex = words.join('|');

// function searchCoupons(arg){
// 	matchedcoupons = $(".pod.coupon").filter(function() {
// 	return($(this).text().match(new RegExp(arg, 'i')) != null);
// 	});
// 	$.each(matchedcoupons, function(i, item){
// 		var itemparent = $(item).parent();
// 		var temp = $(".pod").filter(function() {
// 			return($(this).text().match(new RegExp(arg, 'i')) == null);
// 			}).first().replaceWith(item);
// 		$(itemparent).prepend(temp);
// 	});
// }




