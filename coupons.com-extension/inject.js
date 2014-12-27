//setup variables

var clippablecoupons = Number($('script').text().match(/clippableTotal\":\{\"count\":(\d\d\d)/)[1]);
var keywords ="";
var stopexecution = true;
var clippablecoupons = 50;
var overlay = {
	    show: function () {
        	$("#lightbox").hide().addClass('spotlight').fadeIn("slow");
    	},
    	hide: function () {
    		$("#lightbox").fadeOut("slow", function() {
    			$(this).removeClass('spotlight');	
			});
		}
}

init();
	
function init() {
	if (!formPresent()) {
		$('body').append(myZipChangeForm);
		overlay.show();
		$('#cancel').on('click', function(){
			$('#myloader').hide();
			overlay.hide();
		});
		$('#nozipcode').on('click', function(){
			$('#myloader').replaceWith(myform);
			//allow user to stop script when clicking the x button
			$('#cancel').on('click', function(){
				$('#myloader').hide();
				overlay.hide();
				stopexecution = true;
			});
			stopexecution = false;
			scrollBottom();
		});
		$('#yeszipcode').on('click', function(){
			//logic for zip code change
			$('#myloader div h2').html('You will be directed to a page to change the Coupons.com zip code. Once you change the zip code, please return to Coupons.com to load all coupons.');
			$('#zipform button').hide();
			$('#zipform').append('<button type="button" id="agree">I agree, take me there</button>');
			$('#zipform').append('<button type="button" id="disagree">Skip zip code change</button>');
			$('#agree').on('click', function(){
				window.location ='http://print.coupons.com/couponweb/Offers.aspx?pid=13735&nid=20&zid=yy07';
			});
			$('#disagree').on('click', function(){
				$('#nozipcode').trigger('click');
			});			
		});
	}
	else {
		displayForm();
		if  ($('.pod.coupon:not(.limited)').length < clippablecoupons && $('#toptext').length>0) {
			stopexecution = false;
			scrollBottom();
		}
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

function myZipChangeForm(){


	return	$('<div id="lightbox"></div>\
					<div id="myloader">\
					<div><button type="button" id="cancel">X</button>\
					<h2>Would you like to view coupons for a specific zipcode?\
					(Coupons.com offers vary by zipcode)</h2>\
				</div>\
				<div class="field" id="zipform">\
					<button type="button" id="yeszipcode">Yes</button>\
					<button type="button" id="nozipcode">No</button>\
				</div>\
			</div>');
}


//construct loading form
function myform(){
	var mydiv = $("<div>", {id: "myloader"});
	mydiv.css('background-image', 'URL(' + chrome.extension.getURL('myspinner.gif') + ')'); 
	//var canceldiv = $("<div>");
	var cancelbutton = $("<button>", {id: "cancel", text: "X"});
	//canceldiv.append(cancelbutton);
	mydiv.append(cancelbutton);
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
	displayClipButtons();
	overlay.show();
	//remove highlight from coupons
	$(".pod").css("background-color","inherit");
}

function displayTotalCoupons(){
	$('#myloader').css('background-image', 'URL(' + chrome.extension.getURL('checkmark.png') + ')');
	$('div#myloader div').text('Loading complete! ').append('<br/><br/> Total coupons: ' + couponsdisplayed );
}
function displayClipButtons(){
	if ($('.pod.coupon:has(span.box.clip-box.clip-action:visible)').length > 0) {
		$('#displayclipped').show();
		$('#removeclipped').show();
	}
	else {
		$('#displayclipped').hide();
		$('#removeclipped').hide();
	}
}

function setupSearchForm(){
	var searchform ='<div id="myloader"><div><button type="button" id="cancel">X</button><h2>Enter keywords to display coupons on top of page</h2></div><div class="field" id="searchform"><input type="text" id="searchterm" placeholder="Cereal shampoo chocolate Tide Charmin" /><button type="button" id="search">Find</button></div></div>';
	//replace current form with Search Form
	$('#myloader').replaceWith(searchform);
	$('#myloader').css({'background-image': 'URL(' + chrome.extension.getURL('confetti.png') + ')', 'background-repeat': 'repeat'}); 

	var displayclippedelement = $("<button>", {id: "displayclipped", title: "Display clipped coupons"});
	displayclippedelement.css({'background-image': 'URL(' + chrome.extension.getURL('clip.png') + ')', 'background-repeat': 'no-repeat', 'background-position': 'center center'}); 
	displayclippedelement.hide();
	$('#cancel').before(displayclippedelement);
	var removeclippedelement = $("<button>", {id: "removeclipped", title: "Unclip clipped coupons"});
	removeclippedelement.css({'background-image': 'URL(' + chrome.extension.getURL('unclip.png') + ')', 'background-repeat': 'no-repeat', 'background-position': 'center center'}); 
	removeclippedelement.hide();
	$('#cancel').before(displayclippedelement,removeclippedelement);
	$('div#myloader').css('background-color', 'navy');
	$('div#myloader h2').css({'background-color': 'navy', 'display': 'inline-block'});	
	displayClipButtons();
	$('#displayclipped').on('click', function(){
		displayClipped();
	});
	$('#removeclipped').on('click', function(){
		removeClipped();
	});
	//setup event listeners for search form
	$('#cancel').on('click', function(){
		$('#myloader').hide();
		overlay.hide();
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
	if (stopexecution === false) {
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
	else {

		return false;
	}
}

//Regex selector
$.expr[":"].matchRegex = $.expr.createPseudo(function(arg) {
    return function( elem ) {
    	return $(elem).text().match(new RegExp(arg, 'i')) != null;
    };
});

function swapElements(arg1, arg2){
	var itemparent = $(arg1).parent();
	var temp = arg2.replaceWith(arg1);
	$(itemparent).prepend(temp);
}

function displayClipped(){
	//get clipped coupons
	var clippedCoupons = $('.pod.coupon:has(span.box.clip-box.clip-action:visible)');
	//bubble clipped coupons to top
	$.each(clippedCoupons, function(i, item){
		var ununclipped = $('.pod.coupon:has(span.box.clip-box.clip-action:not(:visible))').first();
		swapElements(item,ununclipped);
	});
	$('#myloader').hide();
	overlay.hide();
	window.scrollTo(0,0);
}

function removeClipped(){
	//unclip Clipped coupons
	$('.clipped-view').has('span.box.clip-box.clip-action:visible').find('span.box.clip-box.unclip-action').trigger('click');
	//hide form and scroll to top
	$('#myloader').hide();
	overlay.hide();
	window.scrollTo(0,0);
}

function searchCoupons(arg){
	//get matched coupons based on keywords
	var matchedcoupons = $('.pod.coupon:matchRegex('+arg+')');
	//set matched coupons to yellow
	matchedcoupons.css('background-color','yellow');
	//bubble matched coupons to top
	if (matchedcoupons.length>0){
		$.each(matchedcoupons, function(i, item){
			var unmatched = $('.pod:not(:matchRegex('+arg+'))').first();
			swapElements(item,unmatched);
		});
		$('#myloader').hide();
		overlay.hide();
		window.scrollTo(0,0);
	}
	//there were no matched coupons. update search form and display it
	else {
		$('#myloader div h2').text('\"'+keywords+ '\" not found. Search for something else!');
		$('#myloader div h2').css('color', 'yellow');
	}
}



