var clippablecoupons = Number($('script').text().match(/clippableTotal\":\{\"count\":(\d\d\d)/)[1]);
var keywords ="";

if ($('#myloader').length === 0) {

	$.expr[":"].contains = $.expr.createPseudo(function(arg) {
	    return function( elem ) {
	        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
	    };
	});
	var mydiv = $("<div>", {id: "myloader"});
	mydiv.css('background-image', 'URL(' + chrome.extension.getURL('myspinner.gif') + ')'); 
	var mytext = $("<div>", {id: "toptext", text: "Loading coupons...."});
	var coupontag = $("<span>", {id: "mycoupontotal", text: $('.pod.coupon:not(.limited)').length});
	mytext.append('<br/><br/>Total coupons loaded: ').append(coupontag);
	mydiv.html(mytext);
	$('body').append(mydiv);
	scrollBottom();
}

else {
	if ($('#myloader:contains("not found")').length>0){
		$('#myloader div h2').text("Enter keywords to display coupons on top of page");
		$('#myloader div h2').css('color', 'white');
	}
	$('#myloader').show();
	$(".pod").css("background-color","inherit");
}

function scrollBottom() {
	setTimeout(function timeOut() {
		var couponsdisplayed = $('.pod.coupon:not(.limited)').length;
		$('#mycoupontotal').text(couponsdisplayed);
		window.scrollTo(0,document.body.scrollHeight);
		
		if (couponsdisplayed < clippablecoupons) {
			scrollBottom();
		}
		else {
			$('#myloader').css('background-image', 'URL(' + chrome.extension.getURL('checkmark.png') + ')');
			$('div#myloader div').text('Loading complete! ').append('<br/><br/> Total coupons: ' + couponsdisplayed );
			setTimeout(function(){
				var myform ='<div id="myloader"><div><button type="button" id="cancel">X</button><h2>Enter keywords to display coupons on top of page</h2></div><div class="field" id="searchform"><input type="text" id="searchterm" placeholder="Cereal shampoo chocolate Tide Charmin" /><button type="button" id="search">Find</button></div></div>';
				// mydiv.append(myform);
				$('#myloader').replaceWith(myform);
				$('#cancel').on('click', function(){
					$('#myloader').hide();
				});
				$('#search').on('click', function(){
					if ($('#searchterm').val() == "") {
						$('#myloader div h2').text('Please enter a keyword.');
						$('#myloader div h2').css('color', 'yellow');
					}
					else {
					keywords = $('#searchterm').val().trim();
					words = keywords.split(/\s+/);
					wordregex = "\\b("+words.join('|')+")s?\\b";
					$('#myloader').hide();
					searchCoupons(wordregex);
					}
				});

				$('#searchterm').keypress(function(e) {
				    if(e.which == 13) {
				        $('#search').trigger('click');
				    }
				});
				$('#searchterm').on('click', function(){
					$(this).select();
				});
				window.scrollTo(0,0);
			}, 3000);
		}
	}, 1500);
}

function searchCoupons(arg){
	matchedcoupons = $(".pod.coupon").filter(function() {
	return($(this).text().match(new RegExp(arg, 'i')) != null);
	}).css("background-color","yellow");
	if (matchedcoupons.length>0){
		$.each(matchedcoupons, function(i, item){
			var itemparent = $(item).parent();
			var temp = $(".pod").filter(function() {
				return($(this).text().match(new RegExp(arg, 'i')) == null);
				}).first().replaceWith(item);
				$(itemparent).prepend(temp);
			});
		window.scrollTo(0,0);
	}
	else {
		$('#myloader div h2').text('\"'+keywords+ '\" not found. Search for something else!');
		$('#myloader div h2').css('color', 'yellow');
		$('#myloader').show();
	}
}


//CODE FOR ADDING ZIP CODE FUNCTIONALITY
// var myzipform ='<div id="myloader">\
// 				<div><button type="button" id="cancel">X</button>\
// 					<h2>Change Coupons.com zipcode?</h2>\
// 				</div>\
// 				<div class="field" id="zipform">\
// 					<button type="button" id="yeszipcode">Yes</button>\
// 					<button type="button" id="nozipcode">No</button>\
// 				</div>\
// 			</div>';

// $('body').append(myzipform);
// $('#cancel').on('click', function(){
// 	$('#myloader').hide();
// });
// $('#nozipcode').on('click', function(){
// 	//logic for no zip code change
// 	return false;
// });
// $('#yeszipcode').on('click', function(){
// 	//logic for zip code change
// 	window.open('TBD');
// 	$('#myloader').remove();
// 	return false;
// });

