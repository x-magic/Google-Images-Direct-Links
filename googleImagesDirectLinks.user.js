// ==UserScript==
// @name		Google Images direct links
// @version		1.2
// @downloadURL	https://github.com/svArtist/Google-Images-Direct-Links/raw/master/googleImagesDirectLinks.user.js
// @namespace	Google
// @author		Benjamin Philipp <benjamin_philipp [at - please don't spam] gmx.de>
// @description	Add direct links to the Google Images search results. LeftClick to open image, CTRL+LeftClick to open source page
// @include		/^https?:\/\/(www\.)*google\.[a-z\.]{2,5}\/search.*tbm=isch.*/
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @run-at		document-body
// ==/UserScript==

var maxtries = 10;

var idle = true;
var disableUpdate = false;

function updatePage()
{
	if($("#directLinkStyles").length<=0){
		disableUpdate = true;
		$("head").append("\
		<style id='directLinkStyles'>\
		.linkToTarget{\
			box-shadow: 3px 5px 10px rgba(0,0,0,0.5); \
			position: absolute; \
			right:0; top:0; \
			opacity: 0.5; \
			background-color: rgba(255,255,255,0.3);\
			transition: background-color 0.5s, opacity 0.5s \
		}\
		.linkToTarget:hover{\
			opacity: 1; \
			background-color: rgba(255,255,255,1);\
		}\
		.linkToTargetLink, .linkToTarget>span{\
			color: rgba(200,200,200, 0.7)!important; \
			padding: 3px 10px; \
			font-size: 28pt; \
			display: block; \
			font-weight: bold; \
			text-decoration: none;\
			transition: color 0.5s, font-size 0.5s, padding 0.5s; \
		}\
		.linkToTargetLink:hover{\
			color: rgba(155,177,233, 1)!important; \
			padding:8px 20px; \
			font-size: 36pt; \
		} \
		.linkswait{ \
			box-shadow: 0 0 20px #f00; \
			border: 2px solid #f00; \
			border-radius: 5px; \
		</style>");
		disableUpdate = false;
	}

	$(".rg_di.rg_bx a.rg_l:not(.linksdone):not([href='#'])").each(function(){
		var tp = this;
		var tppar = $(this).parent();
		var imin = tp.href.indexOf("imgurl=");
		if(imin<0)
		{
            $(tp).attr("resTries", $(tp).attr("resTries")?$(tp).attr("resTries")*1+1:1);
            if($(tp).attr("resTries")*1>=maxtries){
                console.log("This Link won't come up with a good fragment: " + $(tp).find("img")[0].src);
                return true;
            }
			updater();
			return true;
		}
		var linkconts = tp.href.substr(imin+7);
		var piclink = linkconts.substr(0,linkconts.indexOf("&"));
		var reflink = linkconts.substr(linkconts.indexOf("imgrefurl=")+10);
		reflink = decodeURIComponent(reflink.substr(0, reflink.indexOf("&")));
		piclink = decodeURIComponent(piclink);
		disableUpdate = true;
		var dirlink = $("<a class='linkToTargetLink' href='" + piclink + "' reflink='" + reflink + "' target='_blank'>+</a>");
		$(dirlink).click(function(e){
			var t = this;
			if(e.ctrlKey){
				window.open($(t).attr("reflink"));
				return false;
			}
			window.open(t.href);
			return false;
		});
		$(tppar).find(".linkToTarget.temp").remove();
        $(this).removeClass("linkswait");
		$(tppar).append($("<div/>", {class: 'linkToTarget'}).append(dirlink));
		$(this).addClass("linksdone");
        successlink = this;
		disableUpdate = false;
	});
    var notready = false;
    $(".rg_di.rg_bx a.rg_l[href='#']:not(.linksdone)").each(function(){
        notready = true;
        if(!$(this).hasClass("linkswait")){
            $(this).addClass("linkswait");
            $(this).parent().append("<div class='linkToTarget temp'><span>...</span></div>");
        }
    });
	if(notready){
		updater();
	}
}

function updater(t = 1000){
	if(idle)
	{
		idle = false;
		updaterequest = false;
		updatePage();
		idletimer = setTimeout(function(){
			idle = true;
			if(updaterequest)
				updatePage();
		}, t);
	}
	else
	{
		updaterequest = true;
	}
}

var bodyObserver = false;
function observeResults(){
	// console.log("observing");
	resultsObserver = new MutationObserver(updater);
	resultsObserver.observe($("#ires #rg")[0], {subtree: true, childList: true});
	if(bodyObserver !== false)
		bodyObserver.disconnect();
}


if($("#ires #rg").length>0){
	observeResults();
}
else{
	bodyObserver = new MutationObserver(function(mutations){
		if(disableUpdate || !idle){
			return;
		}
		if($("#ires #rg").length>0)
		{
			observeResults();
		}
	});
	bodyObserver.observe($("body")[0], {subtree: true, childList: true});
}
updatePage();
