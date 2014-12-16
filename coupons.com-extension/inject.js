var loopcount = 0;

var clippablecoupons = Number($('script').text().match(/clippableTotal\":\{\"count\":(\d\d\d)/)[1])


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
	$('#myloader').show();
	$(".pod").css("background-color","inherit");
}

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
				var myform ='<div><button type="button" id="cancel">X</button><h2>Enter keywords to display coupons on top of page</h2></div><div class="field" id="searchform"><input type="text" id="searchterm" placeholder="Cereal shampoo chocolate Tide Charmin" /><button type="button" id="search">Find</button></div>';
				var mydiv = $("<div>", {id: "myloader"});
				mydiv.append(myform);
				$('#myloader').replaceWith(mydiv);
				$('#cancel').on('click', function(){
					$('#myloader').hide();
				});
				$('#search').on('click', function(){
					if ($('#searchterm').val() == "") {
						alert("You did not enter a search term.");
					}
					else {
					var keywords = $('#searchterm').val();
					words = keywords.split(/\s+/);
					wordregex = words.join('|');
					$('#myloader').hide();
					searchCoupons(wordregex);
					}
				});

				$('#searchterm').keypress(function(e) {
				    if(e.which == 13) {
				        $('#search').trigger('click');
				    }
				});
				window.scrollTo(0,0);
			}, 3000);
		}
	}, 500);
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
	}
	else {
		alert('No coupons were found with provided keyword(s)');
	}
}




