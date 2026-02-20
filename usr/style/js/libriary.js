
function ResponsiveBgImage (objectName){			 
	var $this = objectName;
			
	var d = $this.data();
	var documentWidth = $(document).width();
	var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
	
	var breakpoint = false;
	var background = false;
						
		 if ( documentWidth < 481 ) breakpoint = 1;
	else if ( documentWidth > 480  && documentWidth < 769  ) breakpoint = 2;
	else if ( documentWidth > 768  && documentWidth < 1025 ) breakpoint = 3;
	else if ( documentWidth > 1024 && documentWidth < 1441 ) breakpoint = 4;
	else if ( documentWidth > 1440 ) breakpoint = 5;
						
	if (pixelRatio > 1 && breakpoint < 5) breakpoint = breakpoint+1;

	switch(breakpoint)
		{
			case 1: if (d.srcXSmall) { background = d.srcXSmall; break; }
			case 2: if (d.srcSmall)  { background = d.srcSmall;  break; }
			case 3: if (d.srcMedium) { background = d.srcMedium; break; }
			case 4: if (d.srcLarge)  { background = d.srcLarge;  break; }
			case 5: if (d.srcXLarge) { background = d.srcXLarge; break; }
		}
							
	if (background && d.srcCurrentBreakPoint!= breakpoint) {
			
			background = 'url(' + background + ')';
			
			$this.stop().animate({opacity: 0},50, function() {
				$this
					.css({'background-image': background})
					.animate({opacity: 1}, 250);
				d.srcCurrentBreakPoint = breakpoint;
			});
			
			return true;
		}

	return false;
}


function ResponsiveMasonry (objectName){			 
	var $this = objectName;
	var d = $this.data();
				
	if( $this.width() != d.ContainerWidth )
		{
			$this.masonry('destroy');
			$this.stop().animate({opacity: 0}, 0, function() {
				$this.masonry({
						containerStyle: null,
						itemSelector: '.col',
						columnWidth: '.grid-sizer',
						gutter: 0,
						isResizeBound:false,
						transitionDuration: '0.25s'
					})
				$this.animate({opacity: 1}, 250);
				d.ContainerWidth = $this.width();
			});

			return true;
		}

	return false;
}





$(document).ready(

function() {

// check SVG
    var SVGsupport = false;
    try {
        var svg = document.createElementNS( "http://www.w3.org/2000/svg", 'svg' );
        SVGsupport = typeof svg.createSVGPoint == 'function';
    } catch(e){}
    if ( ! SVGsupport ) $('body').addClass('no-svg');

// fix IOs Bugs
	if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod')
		{
			$('html:not(:animated),body:not(:animated)').scroll(0,0);
			if ($('.bg-fixed').length > 0) $('.bg-fixed').removeClass('bg-fixed');
		}
    
        
// responsive image
	if($(".responsive-bg").length > 0) $(".responsive-bg").each(function(index){ ResponsiveBgImage ($(this)); });

// create Masonry
	if($(".masonry").length > 0) $(".masonry").each(function(index){ ResponsiveMasonry ($(this)); });
	
        
// menu
	if($(".button-mobile").length > 0) {
	
		  $(".button-mobile a").click(function(event){
		    $("header .menu-toggle").toggleClass("active");
		    return false;
		  });
		  
		  $("header .menu-toggle a").click(function(event){
		    $("header .menu-toggle").removeClass("active");
		  });
		  
		  $("header .menu .logo a").click(function(event){
		    $("header .menu-toggle").removeClass("active");
		  });
	}
	
	if($(".height-body").length > 0) $(".height-body").height($('body').height() - ($('header').height()-3));
	
// projekt-list
	
	if($('.projects-list a').length > 0) {
	
		  $(".projects-list a").mouseover( function(event){ $(this).addClass("active"); });
		  $(".projects-list a").mouseout( function(event){ $(this).removeClass("active"); });
		  
		  $(".projects-list a").click(function(event){
		  
		    	if(!$(this).hasClass("active"))
		    		{
			    		$(this).addClass("active");
			    		(event.preventDefault) ? event.preventDefault() : event.returnValue = false;
						return false;
		    		}
		    	return true;
		  });
	}
	
// smooth scroll

	if($('a.scroll').length > 0) {

		  $("a.scroll").click(function(event){
		  
		    	if($(this).attr("href"))
		    		{
		    			var target = $(this).attr("href");
		    			var destination = $(target).offset().top;
		    			
		    			if (destination > -1)
		    				{
		    					var speed = parseInt(Math.abs(($(this).offset().top - destination)/2));
		    					$('html:not(:animated),body:not(:animated)').animate( { scrollTop: destination}, speed, function() {
		    						window.location.hash = target;
		    						
		    						if ($('.focused').length > 0) $('.focused').removeClass('focused');
		    						$(target).addClass('focused');
		    						
		    						});
		    				}
		    			
						return false;
		    		}
		    	return true;
		  });
	}

// get focus 
	if ($('.focused').length > 0) { $('html:not(:animated),body:not(:animated)').scrollTop($('.focused').eq(0).offset().top); }


    }
);

$(window).bind("resize", function(e) {

	if($(".responsive-bg").length > 0) $(".responsive-bg").each(function(index){ ResponsiveBgImage ($(this)); });
	 
	if($(".masonry").length > 0) $(".masonry").each(function(index){ ResponsiveMasonry ($(this)); });
	
	if($(".height-body").length > 0) $(".height-body").height($('body').height() - ($('header').height()-3));
	
	if ($('.focused').length > 0) { $('html:not(:animated),body:not(:animated)').scrollTop($('.focused').eq(0).offset().top); }
 
});
