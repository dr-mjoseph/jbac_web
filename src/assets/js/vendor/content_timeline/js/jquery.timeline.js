/*

Content Timeline 3.3

Date organised content slider.

Copyright (c) 2012 Br0 (shindiristudio.com)

Project site: http://codecanyon.net/
Project demo: http://shindiristudio.com/timeline

*/

(function($){

	// EVENTS.timeline
	
	// init.timeline          : triggered when timeline is initialised
	// scrollStart.timeline   : triggered when item move animation starts
	// scrollEnd.timeline     : triggered when item move animation ends
	// itemOpen.timeline      : triggered on click to open item
	// itemClose.timeline     : triggered on click to close item
	
	// ---------------------------------------------------------
	
	// On KeyPress (left)     : trigger $.timeline('left')
	// On KeyPress (right)    : trigger $.timeline('right')
	
	// ---------------------------------------------------------
    
	// $.timeline(METHODS)
	
	// $.timeline('init')     : initialises timeline
	// $.timeline('destroy')  : clears timeline data
	// $.timeline('left')     : moves one left by one element
	// $.timeline('right')    : moves right by one element
	// $.timeline('open', id) : opens element with 'data-id' = id
	// $.timeline('close', id): closes element with 'data-id' = id
	// $.timeline('goTo', id) : goes to element width 'data-id' = id
	
	var t_methods = {
		init : function( options ) {
			
			 // Default settings
   			var settings = $.extend( {
   				'my_debug'				 :0,
   				'autoplay'				 : false,
   				'autoplay_mob'			 : false,
				'itemClass'              : '.item',       // class used for timeline items
				'itemOpenClass'          : '.item_open',  // class used for item details
				'openTriggerClass'       : '.item',       // class of read more element (default uses whole item to trigger open event)
				'closeText'              : 'Close',       // text of close button in open item
				'itemMargin'             : 10,            // spacing between items
				'scrollSpeed'            : 500,           // animation speed
				'startItem'              : 'last',        // timeline start item id, 'last' or 'first' can be used insted
				'easing'                 : 'easeOutSine', // jquery.easing function for animations,
				'categories'             : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // categories shown above timeline (months are default)
				'nuberOfSegments'        : [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // number of elements per category (number of days)
				'yearsOn'                : true,           // show years (can be any number you use in data-id (elementNumber/category/yearOrSomeOtherNumber))
				'swipeOn'                : true,           // turn on swipe moving function
				'hideTimeline'           : false,
				'hideControles'          : false,          //hides the prev/next controles
				'closeItemOnTransition'	 : false           //if true, closes the item after transition
   			}, options); // Setings
			var my_pfx,my_prop;
			var my_transitions=function() {
          var obj = document.createElement('div'),
              props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
          for (var i in props) {
            if ( obj.style[ props[i] ] !== undefined ) {
              my_pfx = props[i].replace('Perspective','').toLowerCase();
              my_prop = "-" + my_pfx + "-transform";
              return true;
            }
          }
          return false;
        }();
        if(window.console&&settings.my_debug){			
 			console.log('width',{my_pfx:my_pfx,my_prop:my_prop,my_transitions:my_transitions});
 		}
		
			// main queries
        	var my_debug_12=settings.my_debug;
        
			var $this = this;
			
     		var $body = $('body'),
				$items = $this.find(settings.itemClass),
				$itemsOpen = $this.find(settings.itemOpenClass),
				itemWidth = $items.first().width(),
				itemOpenWidth = $itemsOpen.first().width(),
				closeItemOnTransition=settings.closeItemOnTransition;
			my_styel_4_resize_image=function(my_scale){
				if(my_debug_12&&window.console){
					console.log("Resize image");
				}
				$this.find(".item").each(function(i,v){
					var padd=$(v).find(".my_share_items").css('padding-top');
					padd=parseFloat(padd);
					
					var bott=$(v).find(".con_borderImage").offset().top;
					var h=$(v).find(".con_borderImage").height();
					bott+=h;
					var bott_1=$(v).find(".my_timeline_content").offset().top;//+$(v).offset().top;//+$(v).find("h2").outerHeight()+$(v).find(".my_post_date").outerHeight()+h;
					//var bott_1=$(v).offset().top()+$(v).find("h2").outerHeight()+$(v).find(".my_post_date").outerHeight()+h;
					var rel_pos_image=$(v).find(".con_borderImage").offset().top-$(v).offset().top;
					//bott=rel_pos_image+h;
					var h_content=$(v).find(".my_timeline_content").height();
					//bott_1=$(v).height()-h_content;
					//bott_1-=h_content;
					if(my_debug_12&&window.console){
						console.log("Resize image",{rel_pos_image:rel_pos_image,h:h,h_content:h_content,padd:padd,bott:bott,bott_1:bott_1});
					}
					//bott_1+=padd;
					if(bott>bott_1){
						var diff=Math.abs(bott-bott_1);
						//if(diff>padd)diff-=padd/2;
						
						var h=$(v).find(".con_borderImage").height();
						if(typeof $(v).data('my-height')=='undefined'){
							$(v).data('my-height',h);
						}
						h-=diff;
						$(v).find(".con_borderImage").height(h);
						var diff_1=diff/2;
						$(v).find(".con_borderImage img").css('top','-'+diff_1+'px');
						
						if(my_debug_12&&window.console){
							console.log("Resize image for diff",{diff:diff});
						}
					}else {
						var h;
						if(typeof $(v).data('my-height')!='undefined'){
							h=$(v).data('my-height');
							$(v).find(".con_borderImage").height(h);
							
						}
						$(v).find(".con_borderImage img").css('top','');
						if(my_debug_12&&window.console){
							console.log("Resize image for return to original sized");
						}
							
					}
				});
			};
			//var 
			my_500px_window_function=function(){
				var my_trigger_width=settings.my_trigger_width;
				var my_debug=settings.my_debug;
				var itemWidth=parseFloat(settings.my_sizes.card.item_width);
				var itemOpenWidth=parseFloat(settings.my_sizes.active.item_width);
				var itemMargin=parseFloat(settings.my_sizes.card.margin);
				var containerWidth=$this.width();
				containerWidth-=itemMargin;
				if(my_debug){
					if(window.console){
						console.log('Item width',{c_w:containerWidth,i_w:itemWidth,o_w:itemOpenWidth});
					}
				}
				var my_scale=1;
				var my_scale_open=1;
				if(containerWidth<=my_trigger_width){
					if(containerWidth<itemWidth){
						
						my_scale=containerWidth/itemWidth;
						
						//containerWidth-=itemMargin;
						//var containerWidth_1=containerWidth-itemMargin;
						//if($this.hasClass('my_style_style_2') || $this.hasClass('my_style_style_1')){
							var diff=-Math.abs(containerWidth-itemWidth)/2;
							
							$this.find(".item .con_borderImage img").css('left',diff+'px');
						//}
						$this.find(".item").width(containerWidth);
						if($this.find(".my_timeline_content").length>0){
							var my_margin=$this.find(".my_timeline_content").css('margin-left');
							var m_l=parseFloat(my_margin);
							$this.find(".my_timeline_content").width((containerWidth-2*m_l));
						}
						
					}else {
						
						$this.find(".item").width(itemWidth);
						//if($this.hasClass('my_stylk_style_2')|| $this.hasClass('my_style_style_1')){
							$this.find(".item .con_borderImage img").css('left','');
						//}
						if($this.find(".my_timeline_content").length>0){
							var my_margin=$this.find(".my_timeline_content").css('margin-left');
							var m_l=parseFloat(my_margin);
							$this.find(".my_timeline_content").width((itemWidth-2*m_l));
						}
						
					}
					if(containerWidth<itemOpenWidth){
						var diff_1=-Math.abs(containerWidth-itemOpenWidth)/2;
						$this.find(".item_open a.con_borderImage").css('left',diff_1+'px');
						
						my_scale_open=containerWidth/itemOpenWidth;
						$this.find(".item_open").data('my-width',containerWidth);
						$this.find(".item_open").width(containerWidth);
						//$this.find(".item_open a.con_borderImage").width(containerWidth);
						$this.find(".item_open_cwrapper").width(containerWidth);
						
					}else {
						$this.find(".item_open a.con_borderImage").css('left','');
						//$this.find(".item_open a.con_borderImage").width(itemOpenWidth);
						
						$this.find(".item_open").data('my-width',itemOpenWidth);
						$this.find(".item_open").width(itemOpenWidth);
						$this.find(".item_open_cwrapper").width(itemOpenWidth);
						
					}
				}else {
					if(containerWidth<itemWidth){
						my_scale=containerWidth/itemWidth;
						
						//containerWidth-=itemMargin;
						//var containerWidth_1=containerWidth-itemMargin;
						//if($this.hasClass('my_style_style_2') || $this.hasClass('my_style_style_1')){
							var diff=-Math.abs(containerWidth-itemWidth)/2;
							
							$this.find(".item .con_borderImage img").css('left',diff+'px');
						//}
						$this.find(".item").width(containerWidth);
						if($this.find(".my_timeline_content").length>0){
							var my_margin=$this.find(".my_timeline_content").css('margin-left');
							var m_l=parseFloat(my_margin);
							$this.find(".my_timeline_content").width((containerWidth-2*m_l));
						}
						
					}else {
						
					$this.find(".item").width(itemWidth);
					//if($this.hasClass('my_stylk_style_2')|| $this.hasClass('my_style_style_1')){
						$this.find(".item .con_borderImage img").css('left','');
					//}
					if($this.find(".my_timeline_content").length>0){
						var my_margin=$this.find(".my_timeline_content").css('margin-left');
						var m_l=parseFloat(my_margin);
						$this.find(".my_timeline_content").width((itemWidth-2*m_l));
					}
					
					}
					if(containerWidth<itemOpenWidth){
						var diff_1=-Math.abs(containerWidth-itemOpenWidth)/2;
						$this.find(".item_open a.con_borderImage").css('left',diff_1+'px');
						
						my_scale_open=containerWidth/itemOpenWidth;
						//$this.find(".item_open a.con_borderImage").width(containerWidth);
						
						$this.find(".item_open").data('my-width',containerWidth);
						$this.find(".item_open").width(containerWidth);
						$this.find(".item_open_cwrapper").width(containerWidth);
						
					}else {
						$this.find(".item_open a.con_borderImage").css('left','');
						
						$this.find(".item_open").data('my-width',itemOpenWidth);
						$this.find(".item_open").width(itemOpenWidth);
						//$this.find(".item_open a.con_borderImage").width(itemOpenWidth);
						
						$this.find(".item_open_cwrapper").width(itemOpenWidth);
						
					}
				}
				if(my_scale<1){
					//$this.find(".t_left , .t_right").css('display','none');
					//$(head)
				}else {
					//$this.find(".t_left , .t_right").css('display','block');
				}
				$this.find(".item_open").data('my-scale',my_scale_open);
				$this.find(".item_open").data('my-cnt-width',containerWidth);
				if(my_debug&&window.console){
					console.log("Scale new function",{my_scale:my_scale,my_scale_open:my_scale_open});
				}
				return my_scale;
			};
			var my_scale=1;
			var my_scale_1='';
			my_scale=my_500px_window_function();
			// Trigger init event
			$this.trigger('init.Timeline');	
			
				
			// If no index found
			var startIndex = $items.length-1;
			
			// Find index of start element
			if(settings.startItem == 'first')
			{
				startIndex = 0;
			}
			else if (settings.startItem == 'last')
			{
				startIndex = $items.length-1;
			}
			else {
				$items.each(function(index){
					if(settings.startItem == $(this).attr('data-id'))
					{
					startIndex = index;
					return true;
					}
				});	
			}
			$items.each(function(index){
				$(this).attr('data-count', index);
				$(this).next(settings.itemOpenClass).attr('data-count', index);
				if(!$(this).hasClass(settings.openTriggerClass)) {
					$(this).find(settings.openTriggerClass).attr('data-count', index);
					$(this).find(".my_read_more").attr('data-count', index);
				}
				
			});
				
			// Create wrapper elements, and needed properties
			$this.append('<div style="clear:both"></div>');
			$this.css({width: '100%', 'overflow' : 'hidden', marginLeft : 'auto', marginRight : 'auto','text-align': 'center', height:0});
     		
			
			$this.wrapInner('<div class="timeline_items" />');
			/**
     		 * my wrap inner
     		 */
			//$this.wrapInner('<div class="my_timeline_items_wrapper" />');
			/**
			 * end changes
			 */
			
     		$this.find('.timeline_items').css('text-align','left');
			
			if('ontouchstart' in window) {
				$this.addClass('timelineTouch');
				
			}
			
			// ZoomOut placement fix
     		$this.wrapInner('<div class="timeline_items_holder" />');
			if(!settings.hideControles) {
				$this.append('<div class="t_controles"><div class="t_left"></div><div class="t_right"></div></div>');
			}
     		$this.wrapInner('<div class="timeline_items_wrapper" />');
     		$this.find('.timeline_items_holder').css({width: my_w_12+'px', marginLeft : 'auto', marginRight : 'auto'});
			
     		
     		//my_w_12-=40;
     		/**
			 * Set scale items
			 */
			var my_w_12=$this.width();
     		var my_w_item_12=$this.find(".item").width();
			
			my_scale_items_12=function(my_scale){
     	//	if(my_w_12<600){
				var data = $this.data('timeline');
				var	$iholder =  $this.find('.timeline_items:first');
				var my_settings=$this.data('my_settings');
				var my_st=startIndex;
				if(typeof data !='undefined'){
					if(data.currentIndex!='undefined'){
						my_st=data.currentIndex;
					}
				}
				
				
				/*if(typeof my_settings!='undefined'){
					if(typeof my_settings.my_scale!='undefined'){
						my_scale_1=my_settings.my_scale;
					}
				}*/
				/*if(window.console){
					console.log('My settings',{sett:my_settings,my_st:my_st,my_scale_1:my_scale_1});
				}*/
				var my_w_12=$this.width();
	     		var my_w_item_12=$this.find(".item").width();
				//var my_scale=1;
				/*if(window.console){
					console.log('Get scale factor',{my_scale:my_scale,item_width:my_w_item_12,width:my_w_12});
				}*/
				//my_scale=my_w_12/my_w_item_12;
				//my_scale_1=parseFloat($this.find(".timeline_items_wrapper").css(my_prop));
				/*
				if(my_w_item_12>my_w_12){
					my_scale=my_w_12/my_w_item_12;
					if(window.console){
						console.log('Get scale factor',{my_scale:my_scale});
					}
					if(my_transitions){
						my_scale_1=my_scale;
						if(typeof data!='undefined'){
							data.my_scale=my_scale;
						}
						//$this.find(".item").css(my_prop,'scale('+my_scale+')');
						//
						//bilo je pre 
						
						//$this.find(".timeline_items").css(my_prop,'scale('+my_scale+')');
						//$this.find(".my_timeline_items_wrapper").css(my_prop,'scale('+my_scale+')');
						$this.find(".timeline_items_wrapper").width(my_w_item_12);
						$this.find(".timeline_items_wrapper").css(my_prop,'scale('+my_scale+')');
						$this.find(".timeline_items_holder").width(my_w_item_12);
						var my_left_12_123=(my_w_item_12*(1-my_scale))/2;
						$this.find(".timeline_items_wrapper").css('margin-left','-'+my_left_12_123+'px');
						var my_o_w_12=$this.find(".item_open").width()*my_scale;
						
						var my_w_new_12=my_w_item_12;
						var my_scale_1=my_w_new_12/my_o_w_12;
						//$this.find(".item_open").css(my_prop,'scale('+my_scale_1+')');
						if(window.console){
			     			console.log('width',{w:my_o_w_12,my_scale_1:my_scale_1});
						}
						//$("#tl"+settings.my_id).append('<style type="text/css" id="my_timeline_css_'+settings.my_id+'">.timeline .item_open_cwrapper,.timeline .item_open, #content .timeline .item_open {width:'+my_w_new_12+'px !important;};</style>');
						//$this.find(".timeline_items_holder").css(my_prop,'scale('+my_scale+')');
						
					}
					else {
						//$this.find(".item").css('width',my_w_12+'px');
					}
					
				}else if(my_scale_1!=''){
					$this.find(".timeline_items_wrapper").css('width','');
					$this.find(".timeline_items_wrapper").css(my_prop,'');
					$this.find(".timeline_items_holder").css('width','');
				//	var my_left_12_123=(my_w_item_12*(1-my_scale))/2;
					$this.find(".timeline_items_wrapper").css('margin-left','');
					
				}
				*/
				var my_width=my_w_12;
				var my_scale_1=1;	
				var itemWidth=$this.find(".item").width();
				if(my_debug_12&&window.console){
					console.log("Reposition element",{containerWidth:my_width,itemWidth:itemWidth});
					
				}
				if((my_scale<1||my_scale==1)&&my_scale_1!=''&&(typeof my_settings!='undefined') ){
					if(my_st==0){
						//margin+=(itemWidth/2);
						if(my_scale<1){
							margin=0;
						}
						else margin=(my_width-itemWidth-my_settings.itemMargin)/2;
					}
					if(my_st>0){
						if(my_scale<1){
							//bilo pre margin=-(startIndex)*(itemWidth)+(startIndex)*(settings.itemMargin*2*my_scale);
							margin=-(my_st)*(itemWidth)-(my_st)*(my_settings.itemMargin);
							//margin+='%';
							//width*=my_scale;
						}
						else margin=-(my_st)*(itemWidth+my_settings.itemMargin)+(my_width-itemWidth-my_settings.itemMargin)/2;
						//margin=-(startIndex-1/2)*(itemWidth+settings.itemMargin);
						//margin=(startIndex-1)*(iteWidth+
					}
					//$this.timeline("my_debug","Margin",{margin:margin,startIndex:startIndex});
					//margin=my_margin;
					if(my_debug_12&&window.console){
						console.log("Scale margin Margin",{width:my_timeline_width,start:my_st,margin:margin});
					}
						//$this.timeline("my_debug","margin",{margin:margin,width:my_timeline_width});
					
					// Set margin so start element would place in midle of the screen	
					
					//data.margin=margin;
					//if(typeof data.open=='undefined' || (!data.open)){
					if(true){ //alwas call this
					$iholder.css({marginLeft: margin});
						//$iholder.css({marginLeft: margin});
						data.margin=margin;
					}
						else {
						var my_width_1=data.itemWidth+data.options.itemMargin;
						//var my_diff=Math.abs(margin)-Math.abs(data.margin);
						var my_width=$this.find(".timeline_items_wrapper").width();
						var my_open_width=data.itemOpenWidth;
						var my_diff=0;
						//data.my_diff_window_resize=my_diff;
						if(typeof data!='undefined'){
							$this.timeline("my_debug","Scale Factors",{my_scale:my_scale,my_scale_1:data.my_scale_1});
						}
						if((my_scale==1)&&(data.my_scale_1<1)){
							//my_diff=-(my_width-my_width_1)/2;
							//problem sa scale==1 i scale<1
							if(my_debug_12&&window.console){
								console.log("My scale_1 <1 my_scale==1",my_diff);
							}
							var my_old_width=my_settings.my_width_12;
							my_diff=-(my_width-my_old_width)
							
							data.my_diff_window_resize=my_diff/2;
							my_settings.my_width_12=my_width;
							//data.margin+=my_diff/2;
						}else if((my_scale<1)&&(data.my_scale_1==1)){
							//my_diff=(my_width-my_width_1)/2;
							var my_old_width=my_settings.my_width_12;
							my_diff=-(my_width-my_old_width)
							if(my_debug_12&&window.console){
								console.log("My scall1 <1 my_scale_1==1",my_diff);
							}
							my_settings.my_width_12=my_width;
							data.my_diff_window_resize=-my_diff/2;
							//data.margin-=my_diff/2;
						}else {
							
							var my_old_width=my_settings.my_width_12;
							my_diff=-(my_width-my_old_width);//+my_open_width;
							if(my_debug_12&&window.console){
								console.log("My scale is same <1",{width:my_width,my_diff:my_diff,old_width:my_old_width});
							}
							my_settings.my_width_12=my_width;
							
						}
						if(my_debug_12&&window.console){
								console.log("My scale function Diff margin",{my_scale:my_scale,my_scale_1:data.my_scale_1,my_diff:my_diff});
						}
						//data.margin+=my_diff;
						//$iholder.css({marginLeft: data.margin});
						
					}
				}
				if(typeof data!='undefined'){
					if(my_debug_12&&window.console){
						console.log('Get scale factor',{my_scale_1:data.my_scale_1});
					}
					data.my_scale_1=my_scale;
				
				}
				//my_scale_1=my_scale;
				return my_scale;
			}
	//		}
			//We dont use this method for scalling items beacuse some issues
			//on timeline
			my_scale=my_scale_items_12(my_scale);
     		itemWidth = $items.first().width();
     		if(window.console&&settings.my_debug){
     			console.log('width',{itemWidth:itemWidth,width:my_w_12,item:my_w_item_12,my_scale:my_scale});
     		}
			/**
			 * 
			 */
			
			$items.css({paddingLeft:0 , paddingRight:0, marginLeft: settings.itemMargin/2, marginRight: settings.itemMargin/2, float: 'left', position:'relative'});
			
			$itemsOpen.each(function(){
				$(this).prepend('<div class="t_close" data-count="'+$(this).attr('data-count')+'" data-id="'+$(this).attr('data-id')+'">'+settings.closeText+'</div>');
				$(this).wrapInner('<div class="'+settings.itemOpenClass.substr(1)+'_cwrapper"  />').find('div:first').css({position: 'relative'});
				$(this).css({width: 0, padding:0 , margin: 0, float: 'left', display : 'none', position : 'relative', overflow : 'hidden'});
			});
			
				
			// Get new queries
			var	$iholder =  $this.find('.timeline_items:first'),
				$line = $this.find('.t_line_wrapper:first'),
				margin = 300/2 - (itemWidth + settings.itemMargin)*(1/2 + startIndex) ,
				width = (itemWidth + settings.itemMargin)*$items.length + (itemOpenWidth + settings.itemMargin) + 660 ,
				data = $this.data('timeline');
			var my_timeline_width=$this.width();
			var my_margin=(my_timeline_width/2);
			var my_width=$this.find(".timeline_items_wrapper").width();
			/**
			 * Set start margin to center position of timeline
			 */			
			if(startIndex==0){
				if(my_scale<1){
					margin=0;
				}
				else margin=(my_width-itemWidth-settings.itemMargin)/2;
			}
			if(startIndex>0){
				if(my_scale<1){
					margin=-(startIndex)*(itemWidth)-(startIndex)*(settings.itemMargin);
				}
				else margin=-(startIndex)*(itemWidth+settings.itemMargin)+(my_width-itemWidth-settings.itemMargin)/2;
			}
			if(window.console&&settings.my_debug){
				console.log("Margin",{width:my_timeline_width,start:startIndex,margin:margin});
			}
			
			// Set margin so start element would place in midle of the screen	
			$iholder.css({width: width, marginLeft: margin});
			/**
     		 * Chnages
     		 */
     		
			
			
			// If the plugin hasn't been initialized yet
			if (!data){
     		$this.data('timeline', {
					currentIndex  : startIndex,
					itemCount     : $items.length,
					margin        : margin,
					itemWidth     : itemWidth,
					itemOpenWidth : itemOpenWidth,
					lineMargin    : 0,
					lineViewCount : 0,
					options       : settings,
					items         : $items,
					iholder       : $iholder,
					open          : false,
					noAnimation   : false,
					marginResponse: false,
					mousedown     : false,
					my_open_item_center_12:false,
					mousestartpos : 0,
					
				});
			}
			
			settings.my_scale=my_scale;
			settings.my_width_12=$this.find(".timeline_items_wrapper").width();;
			if(!settings.hideTimeline) {
				$this.timeline('createElements');
				if($this.hasClass('timelineClean')) {
				}
			}
			
     		var data=$this.data('timeline');
     		data.my_scale=my_scale;
     		data.my_scale_1=my_scale;
			$this.data('my_settings',settings);
			$this.timeline("my_debug","Autoplay set timeout",settings);
			if($this.hasClass('my_style_style_4')){
				my_styel_4_resize_image(my_scale);
			}
			/**
			 * Autoplay function
			 */	
			settings.my_autoplay_function='';
			settings.my_stop_autoplay=false;
			my_autoplay_function_12=function(){
				//var $this=this;
				$this.timeline('my_autoplay');
			};
			if(settings.autoplay){
				$this.timeline("my_debug","AutoplayStep",settings.autoplay_step);
				if(settings.is_mobile&&settings.autoplay_mob){
					$this.timeline("my_debug","Autoplay for mobil",settings.autoplay_mob);
					settings.my_autoplay_function=setTimeout(my_autoplay_function_12,settings.autoplay_step);
					$this.data('my_settings',settings);
					$this.bind('touchstart',function(e){
						settings.my_stop_autoplay=true;
						$this.timeline("my_debug","Autoplay touch stop autoplay");
						$this.data('my_settings',settings);
						/*if(settings.my_autoplay_function!=''){
							clearTimeout(settings.my_autoplay_function);
						}*/
						
						/*if(settings.my_autoplay_function!=''){
							clearTimeout(settings.my_autoplay_function);
							settings.my_autoplay_function=setTimeout(my_autoplay_function_12,settings.autoplay_step*6);
							$this.data('my_settings',settings);
						}*/
					});
					$this.bind('touchend',function(e){
						settings.my_stop_autoplay=false;
						$this.timeline("my_debug","Autoplay touch end set new timeout");
						$this.data('my_settings',settings);
						
						if(settings.my_autoplay_function!=''){
							clearTimeout(settings.my_autoplay_function);
							settings.my_autoplay_function=setTimeout(my_autoplay_function_12,settings.autoplay_step*4);
							$this.data('my_settings',settings);
						}
					});
				}else if(!settings.is_mobile){
					$this.timeline("my_debug","Autoplay set timeout",settings.autoplay_step);
					settings.my_autoplay_function=setTimeout(my_autoplay_function_12,settings.autoplay_step);
					$this.data('my_settings',settings);
					$this.bind('mouseenter',function(e){
						settings.my_stop_autoplay=true;
						$this.timeline("my_debug","Autoplay mouseover clear timeout");
						$this.data('my_settings',settings);
						/*if(settings.my_autoplay_function!=''){
							clearTimeout(settings.my_autoplay_function);
							settings.my_autoplay_function=setTimeout(my_autoplay_function_12,settings.autoplay_step);
							$this.data('my_settings',settings);
						}*/
					});
					$this.bind('mouseleave',function(e){
						settings.my_stop_autoplay=false;
						$this.timeline("my_debug","Autoplay set timeout mouseout");
						$this.data('my_settings',settings);
						/*if(settings.my_autoplay_function!=''){
							clearTimeout(settings.my_autoplay_function);
							settings.my_autoplay_function=setTimeout(my_autoplay_function_12,settings.autoplay_step);
							$this.data('my_settings',settings);
						}*/
					});
				}
			}
			var myh12=$this.find(".item").height();//$(".t_left").height();
			var mydiff=0;
			myh12-=mydiff;//*2;
			var my_top_12=$this.find(".timeline_items_wrapper").css('margin-top');
			$this.find(".t_left , .t_right").css({top:my_top_12,height:myh12+'px'});
			var my_class_12_123='';
			$this.find(".t_left , .t_right").on('click',function(){
				
			});
			var my_scrolling_12_123=false;
			$this.find(".t_left , .t_right").on("mouseenter",function(e){
				//return;
				var $p=$(this);
				my_slider_set_timeout_12=setTimeout(function(e){
				//var $p=$(e.target);	
				$p.finish();
				$this.find(".timeline_items_holder").finish('my_left_12');
				
				var w=$p.width();
				$p.data('my-w-12',w);
				w+=20;
			var m_l=$this.find(".timeline_items").css('margin-left');
			$this.find(".timeline_items").data('my-l-12',m_l);
				
				m_l=parseFloat(m_l);
				$this.timeline("my_debug","mouse eneter",{w:w,m_l:m_l});
				if($p.hasClass("t_left")){
					m_l=100;
					my_class_12_123='t_left';
				}else {
					my_class_12_123='t_right';
					m_l=-100;
				}
				//$p.unbind("mouseleave",my_slider_mouse_leave_arrows);
				//$p.on('mouseleave',my_slider_mouse_leave_arrows);
				$p.animate({width:w},350,function(){
					
				});
				
				$this.find(".timeline_items_holder").animate({'margin-left':m_l,'queue':'my_left_12'},350);
				my_slider_set_timeout_12='';
				var data = $this.data('timeline');
				
				//data.margin=m_l;
			},130);
			});
			my_slider_mouse_leave_arrows=function(e){
				//return;
				//if(typeof data.open!='undefined' && data.open)return;
				if(my_slider_set_timeout_12!=''){
						clearTimeout(my_slider_set_timeout_12);
						return;
				};
				$(this).finish();
				$this.find(".timeline_items_holder").finish('my_left_12');
				
				var w=$(this).width();
				w-=20;
				var m_l=$this.find(".timeline_items").css('margin-left');
				m_l=parseFloat(m_l);
				$this.timeline("my_debug","Mouse leave",{w:w,m_l:m_l,cl:my_class_12_123});
				if(my_class_12_123=="t_left"){
					m_l=0;
				}else {
					m_l=0;
				}
				
				$(this).animate({width:w},350,function(){
					
				});
				$this.find(".timeline_items_holder").animate({'margin-left':m_l,'queue':'my_left_12'},350);
				//var data = $this.data('timeline');
				//data.margin=m_l;
			};//);
			$this.on("mouseleave",function(e){
				$this.find(".t_left , .t_right").animate({opacity:0},150);
			});
			$this.on("mouseenter",function(e){
				$this.find(".t_left , .t_right").animate({opacity:1},150);
			});
			$this.find(".t_left , .t_right").on("mouseleave",my_slider_mouse_leave_arrows);
			my_center_style_3=function(){
				var c=$this.attr('class');
				//console.log("Window.load",c)
				if($this.hasClass('my_style_style_3')){
					$this.find(settings.itemClass).each(function(i,v){
						var i_h=$this.find('img').height();
						var t_h=$(v).find(".my_timeline_content").outerHeight();
						var it_h=$this.find('.item').height();
						var top=it_h-i_h-t_h;
						var p=0;
						if(top>0){
							p=top/2;
					
						}
						//console.log("Center style",{image_h:i_h,t_h:t_h,it_h:it_h,left:left,p:p});
							$this.timeline("my_debug","Center style",{image_h:i_h,t_h:t_h,it_h:it_h,top:top,p:p});
							if(p!=0){
								$(v).find(".my_timeline_content").css('bottom',p+'px');
							}
				
				});
				}
			};
			//var my_click_12_left=false,my_click_12_right=false;
			my_center_style_3();
			// Bind keyLeft and KeyRight functions
			$(document).keydown(function(e){
				if (e.keyCode == 37) { 
					$this.timeline('left');
					return false;
				}
				if (e.keyCode == 39) {
					$this.timeline('right');
					return false;
				}
			});
			
			// Respond to window resizing
			$(window).resize(function() {
				
				//var id = $this.find('.active:first').attr('href').substr(1);
				/**
				 * my chnage
				 */
				var my_w=$this.width();
				var my_l=$this.find(".t_line_holder").width();
				/*if(window.console){
					console.log('Widths',{my_w:my_w,my_l:my_l});
				}*/
				
					var my_diff=my_w-my_l;
					//var my_diff=my_w-my_l;
				if(my_diff<60&&my_diff>0){	
					/*if(window.console){
						console.log('Diff',{my_diff:my_diff});
					}*/
					if(my_diff>0){
						var my_p=my_diff/2+4;
						$this.find('#t_line_left').css('left','-'+my_p+'px');
						$this.find('#t_line_right').css('right','-'+my_p+'px');
						
					}
				}
				var my_w_12=$this.width();
				if($this.hasClass('my_style_style_4')){
					my_styel_4_resize_image(my_scale);
				}
				/**
				 * set width of content on full widt
				 */
				/*var my_w_item_12=$this.find(".item").width();
				if(my_w_12<500){
					if(my_w_item_12>my_w_12){
						$this.find(".item").css('width',my_w_12);
						
					}
				}*/
	     		/*if(window.console){
	     			console.log('width',my_w_12);
	     		}*/
	     		//my_w_12-=40;
				$this.find('.timeline_items_holder').css({width: my_w_12+'px'});
				/*
				 * end changes
				 */
				
				my_scale=my_500px_window_function();
				my_scale_items_12(my_scale);
				
				if(my_debug_12&&window.console){
					console.log('Scale factor',my_scale);
				}
				my_500px_window_function();
				var my_settings=$this.data('my_settings');
				my_settings.my_scale=my_scale;
				$this.data('my_settings',my_settings);
				var data = $this.data('timeline');
				data.my_resize_12=true;
				var my_width=$this.find(".timeline_items_wrapper").width();
				var width;
				//bug when change or resize view from smaller to grater this width stays
				//same from previous width
				/*if(my_width<610){
					width=260;
				}else {
					width =  data.itemOpenWidth;	
				}*/
				width=$this.find(".item_open").width();
				var my_scale_open=$this.find(".item_open").data('my-scale');
				if(data.open){
					if(typeof data != 'undefined') {
					var id = $items.eq(data.currentIndex).attr('data-id');
					/*
					itemWidth = $items.first().width(),
					itemOpenWidth = $itemsOpen.first().find('div:first').width();
					
					data.margin += data.itemCount*(data.itemWidth-itemWidth);
					data.itemWidth = itemWidth;
					
					if(data.open) data.margin += (data.itemOpenWidth-itemOpenWidth)/2;
					data.itemOpenWidth = itemOpenWidth;
					
					
					if($('body').width() < 767 && data.open && !data.marginResponse) {
						data.margin -= (itemWidth+settings.itemMargin)/2;
						data.marginResponse = true;
					}
					else if($('body').width() >= 767 && data.marginResponse && data.open) {
						data.margin += (itemWidth+settings.itemMargin)/2;
						data.marginResponse = false;
					}
					*/
					//var my_scale=data.my_scale;
					var my_diff_pos=0;
					width =  data.itemOpenWidth;
					var my_width_12=$this.find(".item_open").data('my-width');
					if(typeof my_width_12!='undefined'){
						$this.timeline("my_debug","Open Change open width",{width:width,my_width_12:my_width_12});
						width=my_width_12;
						
					}
					$this.timeline("my_debug","Resize scale factors",{my_scale:my_scale,my_scale_open:my_scale_open});
					
					var my_width=$this.find(".timeline_items_wrapper").width();
					if(my_scale<1 || my_scale_open<1){
						
						var my_o_12_w=width;//$this.find(".item_open").width();
						var my_12_w=$this.find(".item").width();
						var itemWidth=my_12_w;
						var containerWidth=my_width;
						if(my_scale_open<1&&my_scale==1){
							var leftOrRight=Math.abs(containerWidth-itemWidth-data.options.itemMargin)/2;
							my_diff_pos=-(leftOrRight+data.options.itemMargin+itemWidth);
							
						}
						else {
							// blio je my_diff_pos=-((my_width+data.options.itemMargin+width)/2);//-((data.itemWidth)+(data.options.itemMargin))/2-(my_o_12_w/2);
							if(my_scale<1){
								my_diff_pos=-(my_width+width)/2;
							}
							else my_diff_pos=-((itemWidth+data.options.itemMargin+width)/2);//-((data.itemWidth)+(data.options.itemMargin))/2-(my_o_12_w/2);//my_diff_pos=-(my_width+data.optons)
						}
						$this.timeline("my_debug","Resize Calculate position scale<1",{itemWidth:itemWidth,openWidth:width,containerWidth:my_width,my_scale_1:my_scale_1,my_scale:my_scale,my_diff_pos:my_diff_pos});
						
						data.my_diff_pos=my_diff_pos;
					}else {
						//var my_old_width=my_settings.my_width_12;
						//my_diff=-(my_width-my_old_width)
						/*if(window.console){
							console.log("My scall1 <1 my_scale_1==1",my_diff);
						}*/
						my_diff_pos=-((data.itemWidth)+(data.options.itemMargin))/2-((width+data.options.itemMargin)/2);
							
						$this.timeline("my_debug","Resize Calculate position scale==1",{my_scale:my_scale,my_diff_pos:my_diff_pos});
						
						my_settings.my_width_12=my_width;
						data.my_diff_pos=my_diff_pos;
					}
					
					//data.my_diff_window_resize=-my_diff/2;
					
					data.margin+=my_diff_pos;
					$this.timeline("my_debug","Data margin",{my_scale:my_scale,my_diff_pos:my_diff_pos,margin:data.margin});
					
					data.iholder.css('margin-left',data.margin);
					
					/**
					 * Pre bilo menjam samo margine 
					 *
					data.noAnimation = true;
					//$this.timeline('close',id,data.my_count);
					$this.timeline('goTo', id,data.my_count);
					*/
				}
				}
			});
			
			
				$(document).ready(function(){
					
					$('.timeline_items .item img').on('dragstart', function(event) { 
					if (!($(this).hasClass('timeline_rollover_bottom')))
						event.preventDefault();
 				});
	
			
		 	$('.timeline_items .timeline_rollover_bottom').on('dragstart', function(event) { 
	
					$(this).addClass("disableClick");
					event.preventDefault();
 				});
		 	/*$('.timeline_items .my_open_dialog').on('mousedown',function(e){
		 		e.preventDefault();
				e.stopPropagation();
		 	});
		 	$("#my_timeline_share_click").on('mousedown',function(e){
		 		e.preventDefault();
				e.stopPropagation();
		 	});*/
 				
				 $('.timeline_items .timeline_rollover_bottom').on('mousedown', function(event) { 
					 if (!$(this).is("hover")) {
						$(this).removeClass("disableClick");
							}
 							});
 
						 $('.timeline_items .timeline_rollover_bottom').on('click', function(event) { 
						if ($(this).hasClass('disableClick')) {
						event.preventDefault();
						event.stopPropagation();
						}
						$(this).removeClass('disableClick')
						 });
						 
						 
				});
			
			// Bind left on click
			$this.find('.t_left').click(function(){
				var data = $this.data('timeline'),
				speed = data.options.scrollSpeed;
				//data.margin+=100;
				var my_do=false;
				data.my_click_12_left=false;
				//$this.find(".timeline_items").finish();
				if (data.currentIndex > 0){
					my_do=true;
					$this.find(".t_left , .t_right").animate({opacity:0},100);
					data.my_click_12_left=true;
				}
				
				$this.timeline('left');
				if(my_do){
				setTimeout(function(){
					$this.find(".t_left , .t_right").animate({opacity:1},100);	
					data.my_click_12_left=false;
				},speed);
				}
				
			});
			
			// Bind right on click
			$this.find('.t_right').click(function(){
				//$this.find(".timeline_items").finish();
				var data = $this.data('timeline'),
				speed = data.options.scrollSpeed;
				//data.margin-=100;
				var my_do=false;
				
				data.my_click_12_right=false;
				if (data.currentIndex < data.itemCount-1){
					my_do=true;
					data.my_click_12_right=true;
					$this.find(".t_left , .t_right").animate({opacity:0},100);
				}
				$this.timeline('right');
				if(my_do){
				setTimeout(function(){
					$this.find(".t_left , .t_right").animate({opacity:1},100);	
					data.my_click_12_right=false;
				},speed);
				}
				
			});
			
			// SWIPE bind
			
			if(settings.swipeOn) {
				$items.find('*').each(function(){
					$(this).css({'-webkit-touch-callout': 'none',
								'-webkit-user-select': 'none',
								'-khtml-user-select': 'none',
								'-moz-user-select': 'none',
								'-ms-user-select': 'none',
								'user-select': 'none'});
				});
				$this.bind('touchstart',function(e){
					$this.timeline('touchStart', e);
				});
				
				
				$this.find(settings.itemClass).mousedown(function(e){
					var c=$(e.target).attr('class');
					/*if(window.console){
						console.log('c',c);
					}*/
					if($(e.target).hasClass("my_open_dialog")){
						return;
					}
					if($(e.target).hasClass("my_icon")){
						return;
					}
					$this.timeline('mouseDown', e.pageX);
				});
				
				
				$(document).bind('touchend',function(e){
					data = $this.data('timeline');
					$this.timeline('touchEnd', data.touchpos);
				});
				
				$(document).mouseup(function(e){
					var c=$(e.target).attr('class');
					/*if(window.console){
						console.log('c',c);
					}*/
					if($(e.target).hasClass("my_open_dialog")){
						return;
					}
					if($(e.target).hasClass("my_icon")){
						return;
					}
					var data = $this.data('timeline');
					if(typeof data != 'undefined' && data.mousedown) {
						$this.timeline('mouseUp', e.pageX);
					}
				});
			}
			
			
			
			// Bind open on click
			$this.find(settings.openTriggerClass).click(function(){
				$this.timeline("my_debug","Click on read more",{id:$(this).attr('data-id'), count:$(this).attr('data-count')});
				
				$this.timeline('goTo',$(this).attr('data-id'), $(this).attr('data-count'), true);
			});
			$this.find(".my_read_more").click(function(){
				$this.timeline("my_debug","Click on read more",{id:$(this).attr('data-id'), count:$(this).attr('data-count')});
				
				$this.timeline('goTo',$(this).attr('data-id'), $(this).attr('data-count'), true);
				
			});

			// Bind close on click
			$this.find('.t_close').click(function(){
				$this.timeline("my_debug","Click cloce open",{id:$(this).attr('data-id'), count:$(this).attr('data-count')});
				
				$this.timeline('close',$(this).attr('data-id'),$(this).attr('data-count'));
			});
			
			// Show when loaded
			$this.css({height: 'auto'}).show();
			$this.prev('.timelineLoader').hide();
			
			// Reposition nodes due to their width
			$this.find('.t_line_node').each(function(){
				if($(this).width() < 10) $(this).width(12);
				$(this).css({marginLeft: -$(this).width()/2});
			});
			/**
			 * Changes width
			 */
			var my_w=$this.width();
			var my_l=$this.find(".t_line_holder").width();
			/*if(window.console){
				console.log('Widths',{my_w:my_w,my_l:my_l});
			}*/
			//if(my_w<280){
				var my_diff=my_w-my_l;
			if(my_diff<60&&my_diff>0){	
				/*if(window.console){
					console.log('Diff',{my_diff:my_diff});
				}*/
				if(my_diff>0){
					var my_p=my_diff/2+4;
					$this.find('#t_line_left').css('left','-'+my_p+'px');
					$this.find('#t_line_right').css('right','-'+my_p+'px');
					
				}
				/*var my_w_1=my_w-40;
				var my_style=$this.find(".t_line_holder").attr('style');
				if(window.console){
					console.log('Style',my_style);
				}
				my_style=my_style.replace('width:100%;','width:'+my_w_1+'px !important;');
				if(window.console){
					console.log('Style new',my_style);
				}
				$this.find(".t_line_holder").attr('style',my_style);
				//$this.find(".timeline_line").css('width',my_w_1+'px !important')
				*/
			}else {
				$this.find('#t_line_left').css('left','');
				$this.find('#t_line_right').css('right','');
				
			}
			/**
			 * changes
			 */
			return $this;
		},
		
		// Clear data
		destroy : function( ) {
			$(document).unbind('mouseup');
			$(window).unbind('resize');
			var $this = this,
				data = $this.data('timeline');
			$this.removeData('timeline');
			
		},
		
		touchStart : function(evt) {
			var $this = this,
				data = $this.data('timeline'),
				xmargin = 0;
			data.xpos = evt.originalEvent.touches[0].pageX,
			data.ypos = evt.originalEvent.touches[0].pageY;
			data.mousedown = true;
			data.touchHorizontal = false;
			data.mousestartpos = data.xpos;
			$this.unbind('touchmove');
			$this.bind('touchmove', function(e){
				var newx = e.originalEvent.touches[0].pageX,
					newy = e.originalEvent.touches[0].pageY;
				if(data.mousedown && !data.touchHorizontal) {
					if(Math.abs(newx-data.xpos) > Math.abs(newy-data.ypos)) {
						data.touchHorizontal = true;
					}
				}
				else if(data.touchHorizontal) {
					e.preventDefault();
					data.touchpos = e.originalEvent.touches[0].pageX;
					xmargin = data.margin - data.xpos + e.originalEvent.touches[0].pageX;
					data.iholder.css('marginLeft', xmargin + 'px');
				}
				data.mousedown = false
			});
		},
		
		mouseDown : function(xpos) {
			
			var $this = this,
				data = $this.data('timeline'),
				xmargin = 0;
			data.mousedown = true;
			data.mousestartpos = xpos;
			
			$('body').css('cursor','move');
			$(document).mousemove(function(e){
				xmargin = data.margin - xpos + e.pageX;
				data.iholder.css('marginLeft', xmargin + 'px');
			});
		},
		
		touchEnd : function(xpos) {
			var $this = this,
				data = $this.data('timeline'),
				itemWidth = data.itemWidth + data.options.itemMargin,
				itemC = data.currentIndex,
				mod = 0,
				xmargin = xpos - data.mousestartpos;
			itemWidth=$this.find(".item").width()+data.options.itemMargin;
			var my_calc_old_1=-itemWidth/2;
			var my_calc_old_2=itemWidth/2;
			var my_del=Math.floor(itemWidth/data.options.my_del);
			if(my_del>5)my_del=5;
			
			my_calc_old_1=-itemWidth/my_del;
			my_calc_old_2=itemWidth/my_del;
			
			if(typeof data.touchHorizontal != 'undefined' && data.touchHorizontal) {
				data.touchHorizontal = false;
				
				itemC -= parseInt(xmargin/itemWidth);
				mod = xmargin%itemWidth;
				$this.timeline("my_debug","touchend",{xmargin:xmargin,mod:mod,my_del:my_del,my_calc_old_1:my_calc_old_1,my_calc_old_2:my_calc_old_2});
				
				if (xmargin < 0 && mod < my_calc_old_1) {
					itemC++;
				}
				if (xmargin > 0 && mod > my_calc_old_2) {
					itemC--;
				}
				
				if(itemC < 0) {
					itemC = 0;
				}
				if(itemC >= data.itemCount) {
					itemC = data.itemCount-1;
				}
				
				$this.timeline('goTo', data.items.eq(itemC).attr('data-id'), data.items.eq(itemC).attr('data-count'));
				if (data.options.closeItemOnTransition)
					$this.timeline('close', data.items.eq(itemC).attr('data-id'));
			}
		},
		
		mouseUp : function(xpos) {
			
			var $this = this,
				data = $this.data('timeline'),
				itemWidth = data.itemWidth + data.options.itemMargin,
				itemC = data.currentIndex,
				mod = 0,
				xmargin = xpos - data.mousestartpos;
			data.mousedown = false;
			itemWidth=$this.find(".item").width()+data.options.itemMargin;
			var my_calc_old_1=-itemWidth/2;
			var my_calc_old_2=itemWidth/2;
			var my_del=Math.floor(itemWidth/data.options.my_del);
			if(my_del>5)my_del=5;
			
			my_calc_old_1=-itemWidth/my_del;
			my_calc_old_2=itemWidth/my_del;
			
			$(document).unbind('mousemove');
			$('body').css('cursor','auto');
			
			itemC -= parseInt(xmargin/itemWidth);
			mod = xmargin%itemWidth;
			$this.timeline("my_debug","Mouse Up",{xmargin:xmargin,mod:mod,my_del:my_del,my_calc_old_1:my_calc_old_1,my_calc_old_2:my_calc_old_2});
			
			if (xmargin < 0 && mod < my_calc_old_1) {
				itemC++;
			}
			if (xmargin > 0 && mod > my_calc_old_2) {
				itemC--;
			}
			
			if(itemC < 0) {
				itemC = 0;
			}
			if(itemC >= data.itemCount) {
				itemC = data.itemCount-1;
			}
			
			$this.timeline('goTo', data.items.eq(itemC).attr('data-id'), data.items.eq(itemC).attr('data-count'));
			if (data.options.closeItemOnTransition)
					$this.timeline('close', data.items.eq(itemC).attr('data-id'));
			
		},
		
		open : function (id, data_count) {
			
			var $this = this,
				data = $this.data('timeline'),
				$items = $this.find(data.options.itemOpenClass),
				speed = data.options.scrollSpeed,
				width =  data.itemOpenWidth,
				easing = data.options.easin,
				itemMargin = data.options.itemMargin;
			var my_width_12=$this.find(".item_open").data('my-width');
			if(typeof my_width_12!='undefined'){
				$this.timeline("my_debug","Open Change open width",{width:width,my_width_12:my_width_12});
				width=my_width_12;
			}
			$this.find(".item_open_cwrapper").width(width);
			
			
			var my_settings=$this.data('my_settings');
			var my_scale=my_settings.my_scale;
			var my_scale_open=$this.find(".item_open").data('my-scale');
			if((my_scale<1) ||(my_scale_open<1)){
				var my_start_item=0;
				var my_end_item=1;
				var my_count=1;
				$this.timeline("my_debug","Open Start end pos scale<1",{my_start:my_start_item,my_end:my_end_item,my_count:my_count,my_scale:my_scale});
				var my_width=$this.find(".timeline_items_wrapper").width();
				/*if(my_width<610){
					width=260;
					
				}*/
				//my_widthdata.options.itemMargin;
				$this.timeline("my_debug","Open open width",{width:width});
				var itemWidth=$this.find(".item").width();
				var my_width_1=itemWidth+data.options.itemMargin;
				$this.timeline("my_debug","Open my_scale<1",{itemWidth:itemWidth,my_width_1:my_width_1});
			}else {
			var my_visible_area_left=Math.abs(data.margin);
			var my_width=$this.find(".timeline_items_wrapper").width();
			var my_left=$this.find(".timeline_items_wrapper").offset().left;
			var my_visible_area_right=data.margin+my_width;
			var my_width_1=data.itemWidth+data.options.itemMargin;
			var my_start_item=Math.floor(Math.abs(my_visible_area_left)/my_width_1);
			var my_end_item=my_start_item+Math.ceil(my_width/my_width_1)-1;
			var my_total_items=Math.ceil(my_width/my_width_1);
			var my_pos_12=Math.floor(my_total_items/2);
			var my_pos=my_pos_12;
			$this.timeline("my_debug","Set correct position ",{my_pos_12:my_pos_12,my_total_items:my_total_items,my_width_1:my_width_1,my_pos_12:my_pos_12});
			
			
			var my_inner_items=Math.ceil(my_width/my_width_1);
		/*	if(my_width<610){
				width=260;
			}*/
			$this.timeline("my_debug","Open open width",{width:width,my_width:my_width});
			$this.timeline("my_debug","Open Start end pos scale=1",{id:id,inner:my_inner_items,data_count:data_count,left:my_visible_area_left,right:my_visible_area_right,my_width_1:my_width_1,my_start:my_start_item,my_end:my_end_item});
			$this.timeline("my_debug","Open Start end pos scale=1",{width:width,my_start_item:my_start_item,my_end_item:my_end_item});
			var my_pom=0;
			var my_curr=data.currentIndex;
			var my_left;
			var my_margin,my_margin_abs;
			var my_diff_left,my_diff_right,my_diff_pos;
			var my_move=0;
			var my_center_pos;
			var my_pos_right=0,my_pos_left=0;
			if(typeof data.my_pos_curr!='undefined'){
				$this.timeline("my_debug","Open Correct position",{my_curr:my_curr,new_pos:data.my_pos_curr});
				
				my_curr=data.my_pos_curr;
				
			}
			$this.timeline("my_debug","Open position",{my_curr:my_curr,new_pos:data.my_pos_curr});
			
			if(data.margin>0){
				my_start_item=0;
				my_end_item=my_start_item+Math.ceil(my_width/my_width_1)-1;
				/*my_pos=0;
				if(data_count>0){
					my_pos=data_count-1;
				}*/
				my_pos_left=0;//data.margin;//+data.options.itemMargin;
			}
			/*if(my_curr==0){
				my_start_item=0;
				my_end_item+=Math.ceil(my_width/my_width_1)-1;
			}*/
			my_margin=data.margin;
			my_margin_abs=Math.abs(my_margin);
			my_center_pos=(my_margin_abs)+my_width/2;
			$this.timeline("my_debug","Open position",{my_margin:my_margin,my_margin_abs:my_margin_abs,my_center_pos:my_center_pos});
			
			
			if(my_curr>0){
				if(data.margin<0){
				/*$items.each(function(){
					var my_count=$(this).attr('data-count');
					if ($(this).attr('data-id') == id) {
						my_pos=$(this).attr('data-count')-my_start_item;
					}
				})*/;
				//$items.each(function(){
				//	var my_count=parseInt($(this).attr('data-count'));
				//	var ci12=0;
				//	if(my_count==my_start_item){
						var my_left_off=$this.offset().left;	
						
						var my_left_off_1=0;
						if(my_start_item>0){
							my_left_off_1=my_width_1*(my_start_item);
						}
						my_diff_left=my_left_off_1-my_margin_abs;
						$this.timeline("my_debug","Open Calcl left",{my_left_off:my_left_off,my_left_off_1:my_left_off_1,my_diff_left:my_diff_left});
						
						if(my_diff_left<0){
							my_diff_left=my_width_1+my_diff_left;
						}
						$this.timeline("my_debug","Open Calcl left",{my_left_off:my_left_off,my_left_off_1:my_left_off_1,my_diff_left:my_diff_left});
						
					/*if(ci12==0){
						var my_left_off;
						my_left_off=$(this).offset().left;	
						var my_left_off_1=$this.find(".timeline_items_holder").offset().left;
						my_diff_left=my_left_off-my_left_off_1;
						if(my_diff_left<0){
							my_diff_left=my_width_1+my_diff_left;
						}
						$this.timeline("my_debug","Calcl left",{my_left_off:my_left_off,my_left_off_1:my_left_off_1})
						
					}*/
					/*ci12++;
					return false;
					}
				});*/
				my_pos_left=my_margin_abs+my_diff_left;
				$this.timeline("my_debug","Open position",{my_pos_left:my_pos_left,my_margin:my_margin,my_margin_abs:my_margin_abs,my_center_pos:my_center_pos});
				}
			}else {
				my_pos_left=data.margin;
			}
			}
			$items.each(function(){
				var my_count=$(this).attr('data-count');
				if ($(this).attr('data-id') == id) {
					
					//if (!data_count || data_count == $(this).attr('data-count') && ((my_count>=my_start_item)&&(my_count<=my_end_item))) {
					if (!data_count || data_count == $(this).attr('data-count')){	
					//if (data_count == $(this).attr('data-count') && ((my_count>=my_start_item)&&(my_count<=my_end_item))){
						//data.my_open_item_center_12=true;
						//$this.data('timeline',data);
						$this.timeline("my_debug","Set correct position ",{my_pos:my_pos,my_pos_12:my_pos_12});
						//$(this).attr('data-count')-my_start_item;
						
						var $newThis = $(this);
						
						var data_count_temp = $(this).attr('data-count');
					/*console.log($(data.options.itemClass+'[data-count="'+data_count_temp+'"] div.read_more').length);
					console.log(data.options.itemClass);
					console.log($(this).attr('data-count'));*/
					
						if ($(data.options.itemClass+'[data-count="'+data_count_temp+'"] > .read_more[href="#"]').length == 0 || $(data.options.itemClass+'[data-count="'+data_count_temp+'"] > .my_read_more[href="#"]').length == 0 ) {
							
						// Trigger itemOpen event
						$this.trigger('itemOpen.Timeline');
						
						// Open content and move margin	
//						
						$(this).stop(true).show().animate({width: width, marginLeft: itemMargin/2, marginRight: itemMargin/2}, speed, easing);
						
						if (typeof $(this).attr('data-access') != 'undefined' && $(this).attr('data-access') != '') {
							var action = $(this).attr('data-access');
							$.post(action, function(data){
								
								$('body').append('<div class="ajax_preloading_holder" style="display:none"></div>');
								$('.ajax_preloading_holder').html(data);
								if ($('.ajax_preloading_holder img').length > 0 ) {
									$('.ajax_preloading_holder img').load(function() {  
										$newThis.find('.item_open_content').html(data);
										$('.ajax_preloading_holder').remove();
										$(this).attr('data-access', '');
										
										/* trigger */
										var event = jQuery.Event( 'ajaxLoaded.timeline' );
										event.element = $newThis.find('.item_open_content');
										$( "body" ).trigger( event );
										$this.trigger(event);
										var my_scale_open=$this.find(".item_open").data('my-scale');
										$this.timeline("my_debug","My open scale",my_scale_open);
										if(my_scale_open<1){
											var containerWidth=$this.find(".item_open").data('my-cnt-width');
											var itemOpenWidth=parseFloat(my_settings.my_sizes.active.item_width);	
											var diff=-(Math.abs(containerWidth-itemOpenWidth))/2;
											$this.find(".item_open a.con_borderImage ").css('left',diff+'px');
											$this.timeline("my_debug","My open scale",{cntWidth:containerWidth,itemOpenWidth:itemOpenWidth,diff:diff});
											
										}else {
											$this.find(".item_open a.con_borderImage ").css('left','');
										}
									});
								}
								else {
									$newThis.find('.item_open_content').html(data);
									$('.ajax_preloading_holder').remove();
									$(this).attr('data-access', '');
									
									/* trigger */
									var event = jQuery.Event( 'ajaxLoaded.timeline' );
									event.element = $newThis.find('.item_open_content');
									$( "body" ).trigger( event );
									$this.trigger(event);
									var my_scale_open=$this.find(".item_open").data('my-scale');
									$this.timeline("my_debug","My open scale",my_scale_open);
									if(my_scale_open<1){
										var containerWidth=$this.find(".item_open").data('my-cnt-width');
										var itemOpenWidth=parseFloat(my_settings.my_sizes.active.item_width);	
										var diff=-(Math.abs(containerWidth-itemOpenWidth))/2;
										$this.find(".item_open a.con_borderImage ").css('left',diff+'px');
										$this.timeline("my_debug","My open scale",{cntWidth:containerWidth,itemOpenWidth:itemOpenWidth,diff:diff});
										
									}else {
										$this.find(".item_open a.con_borderImage ").css('left','');
									}
								}
								
							});
						}
						var my_scale_open=$this.find(".item_open").data('my-scale');
						$this.timeline("my_debug","My open scale",my_scale_open);
						if(my_scale_open<1){
							var containerWidth=$this.find(".item_open").data('my-cnt-width');
							var itemOpenWidth=parseFloat(my_settings.my_sizes.active.item_width);
							var diff=-(Math.abs(containerWidth-itemOpenWidth))/2;
							$this.timeline("my_debug","My open scale",{cntWidth:containerWidth,itemOpenWidth:itemOpenWidth,diff:diff});
							$this.find(".item_open a.con_borderImage ").css('left',diff+'px');
						}else {
							$this.find(".item_open a.con_borderImage ").css('left','');
						}
						if($('body').width() < 767) {
						//	data.margin -= (data.itemWidth+data.options.itemMargin)/2;
							data.marginResponse = true;
						}
						else {
							data.marginResponse = false;
						}
						//data.margin -= (width + data.options.itemMargin + data.itemWidth)/2 - data.itemWidth/2;
						//data.margin-=(width+data.options.iyemMargin+data.itemWidth)
						//data.margin-=(my_pos+1)*my_width_1-(my_width_1-width)/2;
						if(my_scale==1&&my_scale_open==1){
						my_margin=data.margin;
						my_margin_abs=Math.abs(my_margin);
						my_center_pos=(my_margin_abs)+my_width/2;
						$this.timeline("my_debug","Open position",{my_pos:my_pos,my_width_1:my_width_1,my_pos_left:my_pos_left,my_margin:my_margin,my_margin_abs:my_margin_abs,my_center_pos:my_center_pos});
						$this.timeline("my_debug","Open position",{my_curr:my_curr,new_pos:data.my_pos_curr});
						if(data.margin>0){
							my_center_pos=my_width/2;
							my_pos_left=my_center_pos+width;
							my_diff_pos=-(my_width_1/2+width/2);
						}else {
						if(my_curr>0){
							if(my_pos>0){
								/*if(my_diff_left<my_width_1&&my_pos>1){
									my_pos_left+=(my_pos)*my_width_1+width/2;
								}else 
								*/
								my_pos_left+=(my_pos)*my_width_1;
								$this.timeline("my_debug","Open Position left is ",{my_pos_left:my_pos_left,my_center_pos:my_center_pos});
								
								if(my_pos_left>my_center_pos){
									my_pos_left+=width/2;
									my_diff_pos=my_center_pos-my_pos_left;
								}else {
									
									var my_diff_1=my_center_pos-my_pos_left;
									var my_diff_2=width-my_diff_1;
									
									if(my_diff_2<width){
										my_diff_pos=-my_diff_2/2;
										
									}else {
										my_pos_left-=width/2;
										my_diff_pos=my_center_pos-my_pos_left;
										
									}
									$this.timeline("my_debug","Open Position is smaller",{my_diff_1:my_diff_1,my_diff_2:my_diff_2,my_diff_pos:my_diff_pos});
									
								}
								
							}else {
								my_pos_left+=(my_pos)*my_width_1;
								$this.timeline("my_debug","Open Position left is ",{my_pos_left:my_pos_left,my_center_pos:my_center_pos});
								
								if(my_pos_left>my_center_pos){
									my_pos_left+=width/2;
									my_diff_pos=my_center_pos-my_pos_left;
								}else {
									
									var my_diff_1=my_center_pos-my_pos_left;
									var my_diff_2=width-my_diff_1;
									if(my_diff_2<width){
										my_diff_pos=-my_diff_2/2;
										//my_pos_left+=my_diff_2/2;
										}else {
											my_pos_left-=width/2;
											my_diff_pos=my_center_pos-my_pos_left;
										}
									//my_pos_left+=my_diff_1/2;
								}
								
							}
							
						}else {
							/*var my_visible_area_left=Math.abs(data.margin);
							var my_width=$this.find(".timeline_items_wrapper").width();
							var my_left=$this.find(".timeline_items_wrapper").offset().left;
							var my_visible_area_right=data.margin+my_width;
							var my_width_1=data.itemWidth+data.options.itemMargin;
							var my_start_item=Math.floor(Math.abs(my_visible_area_left)/my_width_1);
							var my_end_item=my_start_item+Math.ceil(my_width/my_width_1)-1;
							var my_total_items=Math.ceil(my_width/my_width_1);
							var my_pos_12=Math.floor(my_total_items/2);
							my_margin=data.margin;
							my_margin_abs=Math.abs(my_margin);
							my_center_pos=(my_margin_abs)+my_width/2;
							//my_left=0;
							//my_pos_left=my_width_1+width/2;//+data.options.itemOpenMargin;
							//my_diff_pos=my_center_pos-my_pos_left;
							*/
							my_diff_pos=-(my_width_1/2+width/2);
							//my_diff_pos=-(my_width_1/2+itemWidth/2);
							
						}
						}
						my_diff_pos-=data.options.itemMargin/2;
						data.my_diff_pos=my_diff_pos;
						$this.timeline("my_debug","Open Position",{my_diff_1:my_diff_1,my_width:my_width,my_width_1:my_width_1,my_pos_left:my_pos_left,my_pos:my_pos,my_left:my_left,my_diff_left:my_diff_left,my_curr:my_curr,margin_abs:my_margin_abs,my_center_pos:my_center_pos,my_diff_pos:my_diff_pos,margin:data.margin});
						
						}else {
							var my_o_12_w=width;//$this.find(".item_open").width();
							var my_12_w=$this.find(".item").width();
							var itemWidth=my_12_w;
							var containerWidth=my_width;
							var my_scale_open=$this.find(".item_open").data('my-scale');
							if(my_scale_open<1&&my_scale==1){
								var leftOrRight=Math.abs(containerWidth-itemWidth-data.options.itemMargin)/2;
								my_diff_pos=-(leftOrRight+data.options.itemMargin+itemWidth);
							}
							else my_diff_pos=-(width/2+my_width_1/2+data.options.itemMargin/2);//((data.itemWidth)+(data.options.itemMargin))/2-(my_o_12_w/2);
							$this.timeline("my_debug","Open Position",{my_o_12_w:my_o_12_w,my_scale:my_scale,my_diff_pos:my_diff_pos});
							
							data.my_diff_pos=my_diff_pos;
							
						}
						
						/*if(typeof data.my_click_12_left!='undefined' && data.my_click_12_left){
							my_diff_pos+=100;
						}else if(typeof data.my_click_12_right!='undefined' && data.my_click_12_right){
							my_diff_pos-=100;
						}*/
						data.margin+=my_diff_pos;
						/*if(data.my_resize_12!='undefined' && data.my_resize_12){
							data.margin-=data.my_diff_window_resize;
							data.my_resize_12=false;
							$this.timeline("my_debug"," Open position my diff",data.my_diff_window_resize);
							
						}*/
						
						/*if(my_pos>0){
							my_pom=(my_width-width-(my_pos*my_width_1))/2;
							data.margin=-(width)-my_pom;
						}else {
						*/
						/*
						if(data.currentIndex==my_count&&my_count==0){
								//my_pos=1;
								
							}else if(my_count==data.currentIndex&&my_count==(data.items.length-1)){
								//my_pos=1;
							}else{
								
							}
							var left=$(this).offset().left;
							var my_pom_left=left-my_left;
							//var my_pom_right=my_width-left
							var my_pom_right=0;
							if(my_pom_left>0){
								my_pom_right=my_width-(left+my_width_1);
							}
							if(my_pom_left<0){
								data.margin+=(my_width-width-Math.abs(my_width_1-my_pom_left))/2;//+Math.abs(my_pom_left);
							}else {
								
							}
							
							$this.timeline("my_debug","Position",{left_d:my_left,pom_r:my_pom_right,pom_l:my_pom_left,left:left,margin:data.margin});
							/*if(my_pos>0){
								//my_pom=(my_width-width+(my_pos*my_width_1))/2;
								//data.margin=-(my_width-width)/2-my_pom;
								
							}else {
								
							}*/
							
						
						//$this.timeline("my_debug","Pomeraj",{my_pom:my_pom,my_pos:my_pos});
						
						//if (false)
						/*if(data.my_resize_12!='undefined' && data.my_resize_12){
							//data.margin+=data.my_diff_window_resize;
							//$this.timeline("my_debug","Open Change global margin",data.my_diff_window_resize);
							//data.iholder.css('margin-left',data.margin);
						}
						else {
						*/
						if(false){
							data.iholder.stop(true).animate({marginLeft : data.margin}, speed, easing,function(){
							//data.my_open_item_center_12=false;
							//$this.data('timeline',data);
						});
						}
						//}
						data.open = id;
						data.my_count=$(this).attr('data-count');
					}}
				}
				
			});
			return $this;
			
			
		},
		
		close : function (id, idOpen, dataCountOpen) {
			var $this = this,
				data = $this.data('timeline'),
				$items = $this.find(data.options.itemOpenClass),
				speed = data.options.scrollSpeed,
				width =  data.itemOpenWidth,
				easing = data.options.easing;
			var my_visible_area_left=data.margin;
			var my_width=$this.find(".timeline_items_wrapper").width();
			var my_visible_area_right=data.margin+my_width;
			var my_width_1=data.itemWidth+data.options.itemMargin;
			var my_start_item=Math.floor(Math.abs(my_visible_area_left)/my_width_1);
			var my_end_item=my_start_item+Math.floor(my_width/my_width_1);
				
				
			$items.each(function(){
				var my_count=$(this).attr('data-count');
				
				if ($(this).attr('data-id') == id && $(this).is(":visible")) {
					// Trigger itemOpen event
					$this.trigger('itemClose.Timeline');
					var my_pos=$(this).attr('data-count')-my_start_item;
					
					// Close content and move margin	
					$(this).stop(true).animate({width: 0, margin:0}, speed, easing, function(){$(this).hide();});
					/*if (data.marginResponse) {
						data.margin += (data.itemWidth+data.options.itemMargin)/2;
					}*/
					//$this.timeline("my_debug","Margin differenec",{my_diff:data.my_diff_pos});
					
					
					//data.margin += (width + data.options.itemMargin)/2;
					data.margin+=Math.abs(data.my_diff_pos);//(width)+my_pos*width;
					
					data.iholder.stop(true).animate({marginLeft : data.margin}, speed, easing);
					data.open = false;
				}
			});
			if(idOpen) {
				/*
				 * commented by dragan dont open item because some margins are not ok
				 * remove this functionality
				*/
				if ($(this).find('.item[data-count="'+dataCountOpen+'"] a.read_more[href="#"]').length==0 || $(this).find('.item[data-count="'+dataCountOpen+'"] a.my_read_more[href="#"]').length==0){
				
				//if(data.my_resize_12!='undefined' && data.my_resize_12)
				$this.timeline("my_debug","Close Open an item",{idOpen:idOpen,dataCount:dataCountOpen});	
				$this.timeline('open', idOpen, dataCountOpen);
				/*setTimeout(function(){
					var data = $this.data('timeline');
					data.my_resize_12=false;
					
				},speed);*/
				}
			}
			return $this;
		},
		my_debug:function(t,o){
			var $this = this;
			var settings=$this.data('my_settings');
			if(settings.my_debug){
				if(window.console){
					console.log("Timeline\n"+t,o);
				}
			}
		},
		my_autoplay:function(){
			var $this = this,
			data = $this.data('timeline'),
			speed = data.options.scrollSpeed,
			easing = data.options.easing;
			var settings=$this.data('my_settings');
			if(settings.my_stop_autoplay || data.open || $(".pp_fade").is(":visible")){
				$this.timeline("my_debug","Autoplay is disabled",{s:settings});
				var t=settings.autoplay_step;
				if(settings.is_mobile)t=t*4;
				settings.my_autoplay_function=setTimeout(my_autoplay_function_12,t);	
				$this.data('my_settings',settings);
				
				return;
			}
			if (data.currentIndex == data.itemCount-1)
			{
				settings.my_dir='left';
			}else if(data.currentIndex==0){
				settings.my_dir='right';	
			}else if(typeof settings.my_dir=='undefiined'){
				settings.my_dir='right';
			}
			if(settings.my_dir=='right'){
				$this.timeline('right');
			}else {
				$this.timeline('left');
			}
			$this.data('my_settings',settings);
			$this.timeline("my_debug","Autoplay",settings.my_dir);
			setTimeout(function(){
			settings.my_autoplay_function=setTimeout(my_autoplay_function_12,settings.autoplay_step);	
			$this.data('my_settings',settings);
			},settings.scrollSpeed);
		},
		// Move one step left
		right : function() { 
			var $this = this,
				data = $this.data('timeline'),
				speed = data.options.scrollSpeed,
				easing = data.options.easing;
			if (data.currentIndex < data.itemCount-1)
			{
				var dataId = data.items.eq(data.currentIndex+1).attr('data-id');
				var dataCount = data.items.eq(data.currentIndex+1).attr('data-count');
				$this.timeline('goTo', dataId, dataCount);
				if (data.options.closeItemOnTransition)
					$this.timeline('close', dataId);
			}
			else
			{
				data.iholder.stop(true).animate({marginLeft : data.margin-50}, speed/2, easing).animate({marginLeft : data.margin}, speed/2, easing);
			}
			return $this
		},
		
		// Move one step right
		left : function( ) { 
			var $this = this,
				data = $this.data('timeline'),
				speed = data.options.scrollSpeed,
				easing = data.options.easing;
			if (data.currentIndex > 0)
			{
				var dataId = data.items.eq(data.currentIndex-1).attr('data-id');
				var dataCount = data.items.eq(data.currentIndex-1).attr('data-count');
				$this.timeline('goTo', dataId, dataCount);
				if (data.options.closeItemOnTransition)
					$this.timeline('close', dataId);
			}
			else
			{
				data.iholder.stop(true).animate({marginLeft : data.margin+50}, speed/2, easing).animate({marginLeft : data.margin}, speed/2, easing);
			}
			return $this;
		},
		
		// Go to item
		goTo : function (id, data_count, openElement) {
			
			var $this = this,
				data = $this.data('timeline'),
				speed = data.options.scrollSpeed,
				easing = data.options.easing,
				$items = data.items,
				timelineWidth = $this.find('.timeline_line').width(),
				count = -1,
				found = false;
			var my_settings=$this.data('my_settings');
			var my_scale=my_settings.my_scale;
			$this.timeline("my_debug","Go to scale",{id:id,data_count:data_count,scale:my_scale});
			
			if(data.my_open_item_center_12){
				$this.timeline("my_debug","open item return");
				return;	
			}
			// Find item index
			$items.each(function(index){
				if(id == $(this).attr('data-id'))
				{
					if (!data_count || data_count == $(this).attr('data-count'))
					{
						found = true;
						count = index;
						return false;
					}
				}
			});
			
			// Move if fount
			if(found)
			{
				// Move lineView to current element
				var $nodes = $this.find('.t_line_node');
				$nodes.removeClass('active');
				var $goToNode = $nodes.parent().parent().find('[href="#'+id+'"]').addClass('active');
				data.lineMargin = -parseInt($goToNode.parent().parent().attr('data-id'),10)*100;
				
				// check if responsive width
				if($this.find('.t_line_view:first').width() > $this.find('.timeline_line').width()) {
					data.lineMargin *=2;
					if ($goToNode.parent().hasClass('right')) data.lineMargin -= 100;
				}
					
				if(data.noAnimation){
					data.noAnimation = false;
					
					$this.find('.t_line_wrapper').stop(true).css({marginLeft : data.lineMargin+'%'});
				}	
				else {
					$this.find('.t_line_wrapper').stop(true).animate({marginLeft : data.lineMargin+'%'}, speed, easing );
				}

				
				if(data.open) {
					/*if(data_count){
						data.my_pos_curr=count;
					}*/
					$this.timeline('close', data.open, id, data_count);
					delete data.my_pos_curr;
					
					$this.timeline("my_debug","Go to Close postion",data.open);
				}
				else if (openElement) {
					delete data.my_pos_curr;
					$this.timeline("my_debug"," Go To Open postion",openElement);
					/*console.log($(this).find('.item[data-count="'+data_count+'"] a.read_more[href="#"]').length==0)
					if ($(this).find('.item[data-count="'+data_count+'"] a.read_more[href="#"]').length==0)*/
					//data.my_pos_curr=data_count;
					$this.timeline('open', id, data_count);
					delete data.my_pos_curr;
					
						
				}
				delete data.my_pos_curr;
				
				// Trigger ScrollStart event
				$this.trigger('scrollStart.Timeline');
					
				// Scroll
				var my_pre_index_123=data.currentIndex;	
				var itemWidth=$this.find(".item").width();
				if(my_scale==1){
					data.margin += (itemWidth + data.options.itemMargin)*(data.currentIndex - count);
				} else {
					//var my_w_12=$this.find(".timeline_items_holder").width();
					//data.margin+=((my_w_12+data.options.itemMargin)*(data.currentIndex - count));
					data.margin+=(data.currentIndex - count)*(itemWidth)+(data.currentIndex - count)*(data.options.itemMargin);
				}
				
				data.currentIndex = count;
				$this.timeline("my_debug","Go To Count",{curr:data.currentIndex,width:data.itemWidth,my_scale:my_scale,count:count,pre:my_pre_index_123,margin:data.margin});
				
				/**
				 * Code for changing margin
				 */
				var my_width=$this.find(".timeline_items_wrapper").width();
				var my_margin=data.margin+(data.current_index-count)*(data.itemWidth+data.itemMargin)+(my_width-data.itemWidth-data.itemMargin)/2
					
				/*if(data.currentIndex ==0 && my_pre_index_123==1){
					data.margin+=(data.itemWidth/2);
					
				}else if (data.currentIndex ==1 && my_pre_index_123==0){
					data.margin-=(data.itemWidth/2);
				}*/
				$this.timeline("my_debug","Go to Count",{count:count,pre:my_pre_index_123,margin:data.margin,my_margin:my_margin});
				
				var multiply = (parseInt(data.iholder.css('margin-left')) - data.margin)/data.itemWidth;				
				/*if(data.my_resize_12!='undefined' && data.my_resize_12){
					
				}else {
				*/
				/*if(data.my_resize_12!='undefined' && data.my_resize_12){
					data.margin+=data.my_diff_window_resize;
					$this.timeline("my_debug","Open Change global margin",data.my_diff_window_resize);
					data.iholder.css('margin-left',data.margin);
					data.my_diff_window_resize=0;
				}*/
				data.iholder.stop(true).animate({marginLeft : data.margin}, speed+(speed/5)*(Math.abs(multiply)-1), easing, function(){
					// Trigger ScrollStop event
					$this.trigger('scrollStop.Timeline');
				});
				//}
			}
			return $this;
		},
		
		// move line to the left
		lineLeft : function() {
			var $this = this,
				data = $this.data('timeline'),
				speed = data.options.scrollSpeed,
				easing = data.options.easing;
			if (data.lineMargin != 0 && data.options.categories) {
				data.lineMargin += 100;
				$this.find('.t_line_wrapper').stop(true).animate({marginLeft : data.lineMargin+'%'}, speed, easing);
			}
			
		},
		
		// move line to the right
		lineRight : function() {
			var $this = this,
				data = $this.data('timeline'),
				speed = data.options.scrollSpeed,
				easing = data.options.easing;
			if ($this.find('.t_line_view:first').width() > $this.find('.timeline_line').width())
				var viewCount = data.lineViewCount*2;
			else
				var viewCount = data.lineViewCount;
				
			if (data.lineMargin != -(viewCount-1)*100 && data.options.categories) {
				data.lineMargin -= 100;
				$this.find('.t_line_wrapper').stop(true).animate({marginLeft : data.lineMargin+'%'}, speed, easing);
			}
			
		},
		
		// Create timeline elements and css dependent properties
		createElements : function() {
			var $this = this,
				data = $this.data('timeline'),
				$items = data.items;
				
			var html = '\n' +
'    <div class="timeline_line" style="text-align: left; position:relative; margin-left:auto; margin-right:auto;">\n' +
'	 </div>\n';
			$this.prepend(html);
			var	timelineWidth = $this.find('.timeline_line').width(),
				nodes = new Array(),
				months = [''].concat(data.options.categories);
				monthsDays = [0].concat(data.options.nuberOfSegments),
				minM = months.length,
				minY = 99999,
				maxM = 0,
				maxY = 0;
				if(!data.options.yearsOn) maxY = 99999;
			
			var yearsArr = {};
			if(!data.options.categories) {
				$items.each(function(){
					var dataId = $(this).attr('data-id'),
						dataArray = dataId.split('/'),
						d = parseInt(dataArray[0],10),
						m = ($.inArray(dataArray[1],months) != -1) ? $.inArray(dataArray[1],months) : parseInt(dataArray[1],10),
						y = parseInt(dataArray[2],10);
					if(d < minY) minY = d;
					if(d > maxY) maxY = d;
				});
				minY -= 10;
				maxY += 10;
			}
			// find timeline date range and make node elements	
			var myMinYear=2000000,myMaxYear=0,myYearsCount=0,myYearsArr={};
			if(data.options.my_is_years){
				$items.each(function(index){
					var dataId = $(this).attr('data-id'),
					nodeName = $(this).attr('data-name'),
					dataDesc = $(this).attr('data-description'),
					dataArray = dataId.split('/');
					var y=parseInt(dataArray[0]);
					if(typeof yearsArr[y] == 'undefined') {
						myYearsCount++;
						myYearsArr[y] = myYearsCount;
					}
					if(y<myMinYear){
						myMinYear=y;
					}
					if(y>myMaxYear){
						myMaxYear=y;
					}
			
				});
				if(window.console&&data.options.my_debug){
					console.log('Min max years',{min:myMinYear,max:myMaxYear,yearsCount:myYearsCount});
					
					
				}
			}
			//}else {*/
				var myCount=0,myCountSegments=-1,myYearsSegments={},myYearsSegmentsStr={};
				var myIncrementSegment=true;
			$items.each(function(index){
				var dataId = $(this).attr('data-id'),
					nodeName = $(this).attr('data-name'),
					dataDesc = $(this).attr('data-description'),
					dataArray = dataId.split('/'),
					d = parseInt(dataArray[0],10),
					m = ($.inArray(dataArray[1],months) != -1) ? $.inArray(dataArray[1],months) : parseInt(dataArray[1],10),
					y = parseInt(dataArray[2],10);
				
					
				
				if(data.options.my_is_years){
					if(myYearsCount<=18){
						if(typeof myYearsSegments[0]=='undefined'){
							myYearsSegments[0]=[];
						}
						var isActive = (index == data.currentIndex ? ' active' : '');
						//var y1=d;
						//var y=y1;
						var y1=y;
						var leftPos;
						var pIndex=myYearsArr[y];
						leftPos=(100/(myYearsCount+1))*(index+1);
						var isActive = (index == data.currentIndex ? ' active' : '');
						var nName = ((typeof nodeName != 'undefined') ? nodeName : d);
						// Store node element
						nodes[dataId] = '<a href="#'+dataId+'" class="t_line_node'+isActive+'" style="left: '+leftPos+'%; position:absolute; text-align:center;">'+nName;
						
						if(typeof dataDesc != 'undefined') nodes[dataId]+= '<span class="t_node_desc '+(dataDesc ? '' : 't_node_desc_empty')+'" style="white-space:nowrap; position:absolute; z-index: 1;" ><span>'+dataDesc+'</span></span>';
						
						nodes[dataId]+='</a>\n';
						if(typeof yearsArr[y] == 'undefined') {
							
							if(window.console&&data.options.my_debug){
								console.log('ADD Segemnt',{year:y,count:myCountSegments});
							}
							yearsArr[y] = {};
							if(myCount==0){
								myYearsSegmentsStr[0]=y+'-';
							}else if(myCount==(data.options.my_show_years-1)){
								myYearsSegmentsStr[0]+=y;
							}else if(index==(myYearsCount-1)){
								myYearsSegmentsStr[0]+=y;
							}
							var l=myYearsSegments[0].length;
							myYearsSegments[0][l]=nodes[dataId];
							
							myCount++;
						}
						
					}else {
					
					if(myIncrementSegment&&(myCount%data.options.my_show_years==0)){
						myCountSegments++;
						myCount=0;
					}
					if(typeof myYearsSegments[myCountSegments]=='undefined'){
						myYearsSegments[myCountSegments]=[];
					}
					//if(typeof yearsArr[y][m] == 'undefined') yearsArr[y][m] = {};
					//yearsArr[y][m][d] = dataId;
					var isActive = (index == data.currentIndex ? ' active' : '');
					//var y1=d;
					var y1=y;
					var leftPos;
					var pIndex=myYearsArr[y];
					leftPos=(100/(data.options.my_show_years+1))*(myCount+1);
					var nName = ((typeof nodeName != 'undefined') ? nodeName : d);
					// Store node element
					nodes[dataId] = '<a href="#'+dataId+'" class="t_line_node'+isActive+'" style="left: '+leftPos+'%; position:absolute; text-align:center;">'+nName;
					
					if(typeof dataDesc != 'undefined') nodes[dataId]+= '<span class="t_node_desc '+(dataDesc ? '' : 't_node_desc_empty')+'" style="white-space:nowrap; position:absolute; z-index: 1;" ><span>'+dataDesc+'</span></span>';
					
					nodes[dataId]+='</a>\n';
					//if(typeof myYearsSegments[myCountSegments])
					if(typeof yearsArr[y] == 'undefined') {
						myIncrementSegment=true;
						if(window.console&&data.options.my_debug){
							console.log('ADD Segemnt',{year:y,count:myCountSegments});
						}
						yearsArr[y] = {};
						if(myCount==0){
							myYearsSegmentsStr[myCountSegments]=y+'-';
						}else if(myCount==(data.options.my_show_years-1)){
							myYearsSegmentsStr[myCountSegments]+=y;
						}else if(index==(myYearsCount-1)){
							myYearsSegmentsStr[myCountSegments]+=y;
						}
						var l=myYearsSegments[myCountSegments].length;
						myYearsSegments[myCountSegments][l]=nodes[dataId];
						
						myCount++;
					}else {
						if(myCount==0){
							myIncrementSegment=false;
							
						}
					}
					}
				}
				else {
					if(typeof yearsArr[y] == 'undefined') yearsArr[y] = {};
					if(typeof yearsArr[y][m] == 'undefined') yearsArr[y][m] = {};
					yearsArr[y][m][d] = dataId;
					var isActive = (index == data.currentIndex ? ' active' : '');
				
				if(data.options.categories) {
					var leftPos;
					leftPos = (100/monthsDays[m])*d;
				}
				else {
					var leftPos = (100/(maxY-minY))*(d-minY);
				}
				var nName = ((typeof nodeName != 'undefined') ? nodeName : d);
				// Store node element
				nodes[dataId] = '<a href="#'+dataId+'" class="t_line_node'+isActive+'" style="left: '+leftPos+'%; position:absolute; text-align:center;">'+nName;
				
				if(typeof dataDesc != 'undefined') nodes[dataId]+= '<span class="t_node_desc '+(dataDesc ? '' : 't_node_desc_empty')+'" style="white-space:nowrap; position:absolute; z-index: 1;" ><span>'+dataDesc+'</span></span>';
				
				nodes[dataId]+='</a>\n';
				
			}
			});
			//}
			// Make wrapper elements	
			html = '\n' +
'		<div id="t_line_left" style="position: absolute;"></div><div id="t_line_right" style="position: absolute;"></div>\n' +
'		<div class="t_line_holder" style="position:relative; overflow: hidden; width:100%;">\n' + 
'			<div class="t_line_wrapper" style="white-space:nowrap;">\n';
			
			// Prepare for loop, every view has 2 months, we show both if first has nodes in it
			
			if (!data.options.categories) {
				html += 
				'<div class="t_line_view" data-id="'+cnt+'" style="position:relative; display:inline-block; width:100%;">\n'+
				'					<div class="t_line_m" style="width:100%; border:0; position:absolute; top:0;">\n';
				for (var x in nodes) {
					html += nodes[x];
				}
				html += '</div>\n'+
				'</div>';
			}
			else {
				if(data.options.my_is_years){
					
					var cnt = 0;
					var firstMonth = true;
					var myCountT=0;
					if(window.console&&data.options.my_debug){
						console.log('Years sefgments',myYearsSegments);
						console.log('Years segemnts str',myYearsSegmentsStr);
					}
					if(myYearsCount<=18){
						html += 
							'<div class="t_line_view" data-id="'+cnt+'" style="position:relative; display:inline-block; width:100%;">\n'+
							'					<div class="t_line_m" style="width:100%; border:0; position:absolute; top:0;">\n';
						$.each(myYearsSegments[0],function(i,mySegments){
							html+=mySegments
						});
							html += '</div>\n'+
							'</div>';
					}else {
					//for(var mySegments in myYearsSegments){
					$.each(myYearsSegments,function(i,mySegments){	
						
						/*	html += 
								'<div class="t_line_view" data-id="'+cnt+'" style="position:relative; display:inline-block;">\n'+
				'					<div class="t_line_m" style="position:absolute; top:0;">\n'+
				'						<h4 class="t_line_month" style="position:abolute; width:100% top:0; text-align:center;">'+months[mnth]+(data.options.yearsOn ? '<span class="t_line_month_year"> '+(yr < 0 ? (-yr)+' B.C.' : yr)+'</span>' : '' )+'</h4>\n';
									
							*/
						if (firstMonth) {
							firstMonth = !firstMonth;
							html += 
						'<div class="t_line_view" data-id="'+cnt+'" style="position:relative; display:inline-block;">\n'+
		'					<div class="t_line_m" style="position:absolute; top:0;">\n'+
		'						<h4 class="t_line_month" style="position:abolute; width:100% top:0; text-align:center;">'+(data.options.yearsOn? '<span class="t_line_month_year">'+myYearsSegmentsStr[i]+'</span>' : '' )+'</h4>\n';
							
							// Fill with nodes	
							/*for (dy in yearsArr[yr][mnth]) {
								html+= nodes[yearsArr[yr][mnth][dy]];
								
							}*/
							$.each(mySegments,function(my_i,my_v){
								html+=my_v;
							});
							html +=
		'					</div> <!-- KRAJ PRVOG -->\n';
							/*if(i==(myCountSegments)){
								cnt++;
								
							}*/
						}
						else {
							firstMonth = !firstMonth;
							html +=
		'					<div class="t_line_m right" style="position:absolute; top:0;">\n'+
		'						<h4 class="t_line_month" style="position:abolute; width:100% top:0; text-align:center;">'+(data.options.yearsOn ? '<span class="t_line_month_year"> '+myYearsSegmentsStr[i]+'</span>' : '' )+'</h4>\n';
		
							// Fill with nodes	
							/*for (dy in yearsArr[yr][mnth]) {
								html+= nodes[yearsArr[yr][mnth][dy]];
								
							}*/
							$.each(mySegments,function(my_i,my_v){
								html+=my_v;
							});
							html +=
		'					</div><!-- KRAJ DRUGOG -->\n'+
		'					<div style="clear:both"></div>\n'+
		'				</div>';
							cnt++;
							
						}
						
						//cnt++;
						//html +=
						//	'					</div> <!-- KRAJ PRVOG -->\n';
						//myCountT++;
					//}
				});
					if (!firstMonth) {
						html +=
		'					<div class="t_line_m right" style="position:absolute; top:0;">\n'+
		'						<h4 class="t_line_month" style="position:abolute; width:100% top:0; text-align:center;"></h4>\n'+
		'					</div>\n'+
		'					<div style="clear:both"></div>\n'+
		'				</div>';
						cnt++;
					}
					}
				}else {
				var firstMonth = true;
				var cnt = 0;
				for(var yr in yearsArr) {
					for(var mnth in yearsArr[yr]) {
						if (firstMonth) {
							firstMonth = !firstMonth;
							html += 
						'<div class="t_line_view" data-id="'+cnt+'" style="position:relative; display:inline-block;">\n'+
		'					<div class="t_line_m" style="position:absolute; top:0;">\n'+
		'						<h4 class="t_line_month" style="position:abolute; width:100% top:0; text-align:center;">'+months[mnth]+(data.options.yearsOn ? '<span class="t_line_month_year"> '+(yr < 0 ? (-yr)+' B.C.' : yr)+'</span>' : '' )+'</h4>\n';
							
							// Fill with nodes	
							for (dy in yearsArr[yr][mnth]) {
								html+= nodes[yearsArr[yr][mnth][dy]];
								
							}
							html +=
		'					</div> <!-- KRAJ PRVOG -->\n';
						}
						else {
							firstMonth = !firstMonth;
							html +=
		'					<div class="t_line_m right" style="position:absolute; top:0;">\n'+
		'						<h4 class="t_line_month" style="position:abolute; width:100% top:0; text-align:center;">'+(typeof months[mnth] !== 'undefined' ? months[mnth] : '')+(data.options.yearsOn ? '<span class="t_line_month_year"> '+yr+'</span>' : '' )+'</h4>\n';
		
							// Fill with nodes	
							for (dy in yearsArr[yr][mnth]) {
								html+= nodes[yearsArr[yr][mnth][dy]];
								
							}
							html +=
		'					</div><!-- KRAJ DRUGOG -->\n'+
		'					<div style="clear:both"></div>\n'+
		'				</div>';
							cnt++;
							
						}
					}
				}
				if (!firstMonth) {
					html +=
	'					<div class="t_line_m right" style="position:absolute; top:0;">\n'+
	'						<h4 class="t_line_month" style="position:abolute; width:100% top:0; text-align:center;"></h4>\n'+
	'					</div>\n'+
	'					<div style="clear:both"></div>\n'+
	'				</div>';
					cnt++;
				}
			
				}
			
					
				html +=	'\n' +				
'				<div style="clear:both"></div>\n'+
'			</div>\n'+
'		</div>\n';
			
			}
			
			// Set number of View elements
			data.lineViewCount = cnt;
			// Add generated html and set width & margin for dinamic timeline 
			$this.find('.timeline_line:first').html(html);
			$this.find('.t_line_node').each(function(){
				var $thisNode = $(this);
				$(this).find('span').hide();
				$(this).hover(function(){
					$items.each(function(){
						if($(this).attr('data-id') == $thisNode.attr('href').substr(1)) {
							$(this).addClass('item_node_hover');
						}
					});
					var $this=$(this).parents('.timeline');
					var settings=$this.data('my_settings');
					$this.timeline('my_debug','Hover',{s:settings});
					if(settings.is_mobile==0){
					/**
					 * changes bug not view hover
					 * dragan
					 */
					var my_data_id_12=$(this).parents(".t_line_view").data('id');
					/*if(window.console){
						console.log("Data id",my_data_id_12);
						
					}*/
					var $my_i=$this.find(".t_line_view");
					$my_i.each(function(i,v){
						var my_data_new_id_12=$(v).data('id');
						if(my_data_new_id_12!=my_data_id_12){
							$(v).css('visibility','hidden');
							/*if(window.console){
								console.log("Hide id",my_data_new_id_12);
								
							}*/
						}
					});
					/*var c=$this.find(".t_line_view").length-1;
					
					/*if(data_id>1){
						prev=data_id-1;
					}*/
					
					$this.find(".t_line_holder").css('overflow','');
					/**
					 * end changes
					 */
					$(this).find('span').css('display','block');
					}else {
						
					}
				}, function(){
					var $this=$(this).parents('.timeline');
					var settings=$this.data('my_settings');
					$this.timeline('my_debug','Hover out',{s:settings});
					
					if(settings.is_mobile==0){
					$this.find(".t_line_holder").css('overflow','hidden');
					var my_data_id_12=$(this).parents(".t_line_view").data('id');
					/*if(window.console){
						console.log("Data id",my_data_id_12);
						
					}*/
					var $my_i=$this.find(".t_line_view");
					$my_i.each(function(i,v){
						var my_data_new_id_12=$(v).data('id');
						if(my_data_new_id_12!=my_data_id_12){
							//$(v).show();
							$(v).css('visibility','visible');
							/*if(window.console){
								console.log("Show id",my_data_new_id_12);
								
							}*/						}
					});
					$(this).find('span').css('display','none');
					$('.item_node_hover').removeClass('item_node_hover');
					}
				});
				
				//Position lineView to selected item
				if($(this).hasClass('active')) {
					data.lineMargin = -parseInt($(this).parent().parent('.t_line_view').attr('data-id'),10)*100;
					$this.find('.t_line_wrapper').css('margin-left', data.lineMargin+'%');
				}
				// Bind goTo function to click event
				$(this).click(function(e){
					e.preventDefault();
					$this.find('.t_line_node').removeClass('active');
					$(this).addClass('active');
					$this.timeline('goTo', $(this).attr('href').substr(1));
					if (data.options.closeItemOnTransition)
						$this.timeline('close', $(this).attr('href').substr(1));
					/*console.log($(this));*/
					
					/*if ($this.find('.item[data-count="'+$(this).attr('data-count')+'"] a.read_more[href="#"]').length==0)
					$this.timeline('close', $(this).attr('href').substr(1));*/
				});
			});
			
			$this.find('#t_line_left').click(function(){
				$this.timeline('lineLeft');
			});
			
			$this.find('#t_line_right').click(function(){
				$this.timeline('lineRight');
			});
			
		}
	};

	// Initiate methods
	$.fn.timeline = function( method ) {
    
		if ( t_methods[method] ) {
			return t_methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return t_methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.timeline' );
		}    
  
	};





})(jQuery);