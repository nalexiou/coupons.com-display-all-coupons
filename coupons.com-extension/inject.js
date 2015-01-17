//setup variables

var clippablecoupons = Number($('script').text().match(/clippableTotal\":\{\"count\":(\d\d\d)/)[1]);
var keywords ="";
var stopexecution = true;
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
	var cancelbutton = $("<button>", {id: "cancel", text: "X"});
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
		$('#searchterm').attr('placeholder', 'Cereal shampoo chocolate Tide Charmin').val('');
		$('#myloader div h2').text(formtext).css('color', '#3C7577');
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
	var mytext = $("<div>", {id: "toptext", text: "Loading complete!"});
	mytext.append('<br/><br/> Total coupons: ' + couponsdisplayed );
	$('div#myloader div').replaceWith(mytext);
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

function customBackground(){
	$('#myloader').css({'background-image': 'URL(' + chrome.extension.getURL('snow.gif') + ')', 'background-repeat': 'repeat'}); 
	$('div#myloader').css('background-color', 'transparent');
	$('div#myloader h2').css({'color': '#3C7577', 'display': 'inline-block'});	
}

function setupSearchForm(){
	var searchform ='<div id="myloader"><div><button type="button" id="cancel">X</button><h2>Enter keywords to display coupons on top of page</h2></div><div class="field" id="searchform"><input type="text" id="searchterm" placeholder="Cereal shampoo chocolate Tide Charmin" /><button type="button" id="search">Find</button></div></div>';
	//replace current form with Search Form
	$('#myloader').replaceWith(searchform);
	$("<div>", {id: "couponsfound", html: "&nbsp;"}).appendTo($('#myloader div h2'));
	//customBackground();
	var displayclippedelement = $("<button>", {id: "displayclipped", title: "Display clipped coupons"});
	displayclippedelement.css({'background-image': 'URL(' + chrome.extension.getURL('clip.png') + ')', 'background-repeat': 'no-repeat', 'background-position': 'center center'}); 
	displayclippedelement.hide();
	$('#cancel').before(displayclippedelement);
	var removeclippedelement = $("<button>", {id: "removeclipped", title: "Unclip clipped coupons"});
	removeclippedelement.css({'background-image': 'URL(' + chrome.extension.getURL('unclip.png') + ')', 'background-repeat': 'no-repeat', 'background-position': 'center center'}); 
	removeclippedelement.hide();
	$('#cancel').before(displayclippedelement,removeclippedelement);
	displayClipButtons();

	var flattrbtn = "<script id='fb8bxyd'>(function(i){var f,s=document.getElementById(i);f=document.createElement('iframe');f.src='//api.flattr.com/button/view/?uid=nalexiou&button=compact&url='+encodeURIComponent(document.URL);f.title='Flattr';f.height=20;f.width=110;f.style.borderWidth=0;s.parentNode.insertBefore(f,s);})('fb8bxyd');</script>"
	var donatebtn = '<br><br><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">'
		+ '<input type="hidden" name="cmd" value="_s-xclick">'
		+ '<input type="hidden" name="hosted_button_id" value="EKUQK44Z784BE">'
		+'<input type="image" src="http://i.imgur.com/ecYyvOj.png" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">'
		+'<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form>'

	$('#myloader').append(flattrbtn, donatebtn);

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
			
			$('#myloader div h2').css('color', '#3C7577');
		}
		else {
		var wordregex = keywordsToRegex($('#searchterm').val());
		searchCoupons(wordregex);
		}
	});
	$('#searchterm').keyup(function(e) {
	    if(e.which == 13) {
	        $('#search').trigger('click');
	    }
	    else if ($('#searchterm').val() != "") {
	    	var wordregex = keywordsToRegex($('#searchterm').val());
	    	var totalmatchedcoupons = $('.pod.coupon:matchRegex('+ wordregex +')').length;
	    	if (totalmatchedcoupons >0) {
	    	$('#couponsfound').text("Total coupons found: " + totalmatchedcoupons);
	    	}
	    	else {
	    		$('#couponsfound').html("&nbsp;");
	    	}
	    }
	    else {
	    	$('#couponsfound').html("&nbsp;");
	    }
	});
	$('#searchterm').on('click', function(){
		$(this).select();
	});
	window.scrollTo(0,0);
}

function keywordsToRegex(arg){
			var words = arg.trim().split(/\s+/);
			return "(?:^|[^’'])\\b("+words.join('|')+")s?\\b";
}

function scrollBottom() {
	if (stopexecution === false) {
		setTimeout(function timeOut() {
			//get current coupon count displayed on page
			couponsdisplayed = $('.pod.coupon:not(.limited)').length;
			//display current coupon count
			$('#mycoupontotal').text(couponsdisplayed);
			//scroll to bottom
			$('html, body').animate({ scrollTop: $(document).height()-$(window).height() }, 300);
			
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
    	return new RegExp(arg, 'i').test($(elem).text());
    };
});

function swapElements(arg1, arg2){
	var itemparent = $(arg1).parent();
	var itemindex = $(arg1).index();
	var temp = arg2.replaceWith(arg1);
	if (itemindex === 0) {
		$(itemparent).prepend(temp);
	}
	else {
		$(itemparent).children().eq(itemindex - 1).after(temp);
	}
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
		$('#myloader div h2').css('color', 'red');
	}
}



