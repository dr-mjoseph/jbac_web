jQuery(document).ready(function($){


	my_debug=false;
	function debug(t,o){
		if(my_debug){
			if(typeof window.console !='undefined'){
				console.log(t,o);
			}
		}
	}
	var my_showed_dialog=false;
	$("body").click(function(e){

		if(my_showed_dialog){

			debug('Close Dialog');
			$("#my_timeline_share_click").animate({opacity:0},function(){
				my_showed_dialog=false;
			});

		}
	});
	my_timeline_click_element='';
	$(document).on('click',".my_like_post",function(e){
		var liked=$(this).data('liked');
		if(liked==1)return;
		var post_id=$(this).data('post-id');
		var val=$(this).data('var');
		var my_id=$(this).data('id');
		var data={
				action:'ctimeline_like_post',
				val:val,
				post_id:post_id,
				nonce:my_timeline_front_ajax_nonce,
				my_id:my_id
			};

		debug("Post data",data);
		$.ajax({
			url:my_timeline_front_ajax_url,
			dataType:'json',
			data:data,
			cache:false,
			timeout:30000,
			type:'POST',
			success:function(data,status,jq){
				debug("Return data",data);
				if(data.error==0){
					$(".my_like_post[data-id='"+data.id+"']").data('val',data.val);
					$(".my_like_post[data-id='"+data.id+"']").find('span').html('&nbsp;'+data.val);
					$(".my_like_post[data-id='"+data.id+"']").data('liked',1);
				}else {
					alert(data.msg);
				}
			},
			error:function(jq,status){
				alert('Error');
			}
		});
	});
	$(document).on('click',"#my_timeline_share_click li",function(e){
		e.preventDefault();
		//$("#my_timeline_share_click").fadeOut(100);
		//self.getViewport();
		//var v_ww=self.viewport['w'];
		//var v_hh=self.viewport['h'];
		var v_ww=window.outerWidth;
		var v_hh=window.outerHeight;
		var ww=800;
		var hh=400;
		if(v_ww<ww){
			ww=v_ww;
		}
		if(v_hh<hh){
			hh=v_hh;
		}
		var left=Math.floor((v_ww-ww)/2);
		var top=Math.floor((v_hh-hh)/2);
		var href=$(this).find('a').attr('href');
		debug('Open window',href);
		var win=window.open(href, "my_social_share", "scrollbars=1,menubar=0,location=0,toolbar=0,status=0,width="+ww+", height="+hh+", top="+top+", left="+left);

	});
	$(document).on('click','.my_open_dialog',function(e){
		e.preventDefault();
		e.stopPropagation();
		var html=$(this).find(".my_timeline_share div").html();
		var id=$(this).find(".my_timeline_share div ul").data('id');
		var off=$(this).offset();
		var top=off.top-60;
		var left=off.left;
		left=left-(160/2)+$(this).width()/2-5;
		debug("Open toltip",{off:off,top:top,left:left,html:html,id:id});
		if(my_showed_dialog){
			return;
			debug('Close Dialog Open dialog');
			var t_id=$("#my_timeline_share_click").data('id');
			debug('T_id',t_id);
			/*$("#my_timeline_share_click").fadeOut(100,function(){
				$('body').append('<div id="my_timeline_share_click" style="display:none">'+html+'</div>')
					setTimeout(function(){
					$("#my_timeline_share_click").css('top',top+'px').css('left',left+'px').fadeIn(function(){
					my_showed_dialog=true;
					},100);
				});
			});*/
			if(t_id==id){
				$("#my_timeline_share_click").animate({'opacity':0},function(){
					my_showed_dialog=false;
				});
			}else {
			$("#my_timeline_share_click").animate({'opacity':0},function(){
				if($("#my_timeline_share_click").length==0){
					$('body').append('<div id="my_timeline_share_click" style="display:none">'+html+'</div>');
				}else {
					$("#my_timeline_share_click").attr('data-id',id);
					$("#my_timeline_share_click").html(html);
				}
				$("#my_timeline_share_click").css('top',top+'px').css('left',left+'px').css('opacity',0).animate({'opacity':1},function(){
					my_showed_dialog=true;
				});
			});
			}
		}else {
		/*$('body').append('<div id="my_timeline_share_click">'+html+'</div>').hide().css('top',top+'px').css('left','left'+'px').fadeIn(function(){
			my_showed_dialog=true;
		});*/
			if($("#my_timeline_share_click").length==0){
				$('body').append('<div data-id="'+id+'" id="my_timeline_share_click" style="opacity:0;">'+html+'</div>');
			}else {
				$("#my_timeline_share_click").attr('data-id',id);
				$("#my_timeline_share_click").html(html);
			}
			/*setTimeout(function(){
				*$("#my_timeline_share_click").css('top',top+'px').css('left',left+'px').fadeIn(function(){
			my_showed_dialog=true;
			},100);*/
				$("#my_timeline_share_click").css('top',top+'px').css('left',left+'px').css('opacity',0).animate({'opacity':1},function(){
					my_showed_dialog=true;


		});

		}
	});
});