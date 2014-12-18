//setup variables

var clippablecoupons = Number($('script').text().match(/clippableTotal\":\{\"count\":(\d\d\d)/)[1]);
var keywords ="";

init();


function init() {

	if (!formPresent()) {
		$('body').append(myform);
		scrollBottom();
	}
	else {
		displayForm();
	}
}

function formPresent() {

	if ($('#myloader').length > 0) {
		return true;
	}

	else {

		return false;
	}
}

//construct form
function myform(){
	var mydiv = $("<div>", {id: "myloader"});
	mydiv.css('background-image', 'URL(' + chrome.extension.getURL('myspinner.gif') + ')'); 
	var mytext = $("<div>", {id: "toptext", text: "Loading coupons...."});
	var coupontag = $("<span>", {id: "mycoupontotal", text: $('.pod.coupon:not(.limited)').length});
	mytext.append('<br/><br/>Total coupons loaded: ').append(coupontag);

	return mydiv.append(mytext);
}

function displayForm(){
	//reset form text if keywords were not found
	if ($('#myloader:contains("not found")').length>0){
		var formtext = "Enter keywords to display coupons on top of page";
		$('#myloader div h2').text(formtext).css('color', 'white');
	}
	//display form
	$('#myloader').show();
	//remove highlight from coupons
	$(".pod").css("background-color","inherit");
}

function displayTotalCoupons(){
	$('#myloader').css('background-image', 'URL(' + chrome.extension.getURL('checkmark.png') + ')');
	$('div#myloader div').text('Loading complete! ').append('<br/><br/> Total coupons: ' + couponsdisplayed );
}

function setupSearchForm(){
	var searchform ='<div id="myloader"><div><button type="button" id="cancel">X</button><h2>Enter keywords to display coupons on top of page</h2></div><div class="field" id="searchform"><input type="text" id="searchterm" placeholder="Cereal shampoo chocolate Tide Charmin" /><button type="button" id="search">Find</button></div></div>';
	//replace current form with Search Form
	$('#myloader').replaceWith(searchform);
	//setup event listeners for search form
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
}

function scrollBottom() {
	setTimeout(function timeOut() {
		//get current coupon count displayed on page
		couponsdisplayed = $('.pod.coupon:not(.limited)').length;
		//display current coupon count
		$('#mycoupontotal').text(couponsdisplayed);
		//scroll to bottom
		window.scrollTo(0,document.body.scrollHeight);
		
		//recursive call - if all coupons are not displayed, keep scrolling to bottom
		if (couponsdisplayed < clippablecoupons) {
			scrollBottom();
		}
		//coupons finished loading
		else {
			displayTotalCoupons();//display Total Coupon count
			//setup search form
			setTimeout(
				setupSearchForm, 3000);
			}
	}, 500);
}


$.expr[":"].matchRegex = $.expr.createPseudo(function(arg) {
    return function( elem ) {
    	return $(elem).text().match(new RegExp(arg, 'i')) != null;
    };
});


function searchCoupons(arg){
	//get matched coupons based on keywords
	var matchedcoupons = $('.pod.coupon:matchRegex('+arg+')');
	//set matched coupons to yellow
	matchedcoupons.css('background-color','yellow');
	//bubble matched coupons to top
	if (matchedcoupons.length>0){
		$.each(matchedcoupons, function(i, item){
			var itemparent = $(item).parent();
			var temp = $('.pod:not(:matchRegex('+arg+'))').first().replaceWith(item);
			// var temp = $(".pod").filter(function() {
			// 	return($(this).text().match(new RegExp(arg, 'i')) == null);
			// 	});
			$(itemparent).prepend(temp);
		});
		window.scrollTo(0,0);
	}
	//there were no matched coupons. update search form and display it
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

