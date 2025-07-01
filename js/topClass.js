
var topClass = {};

let isMoving = false;

topClass.init = function(){
	if($('.repairTbody').length){
		initFunc();
	}
	$('.del_repair').on('click', function(){
		if (window.confirm('削除しますか？')){
			var seq = $(this).attr('seq');

			var loc_url = './?md=del_repair&seq='+seq;

			window.location.href = loc_url;

		}
		return false;
	});

// 社内連絡関連
	if($('#is_new_message').val()){
		window.sessionStorage.setItem('contact_display', 'display');
	} else {
//		$('#div_contact').hide();
//		window.sessionStorage.setItem('contact_display', 'none');
	}

	$('#a_contact').on('click', function(){
		var display = $('#div_contact').css('display');
		display = display == 'none'?'block':'none';
		$('#div_contact').css({'display':display});
		window.sessionStorage.setItem('contact_display', display);
	});

	if(window.sessionStorage.getItem(['contact_display'])){
		var display = window.sessionStorage.getItem(['contact_display']) == 'none'?'block':'none';
		$('#div_contact').css({'display':window.sessionStorage.getItem(['contact_display'])});

	}
// END 社内連絡関連

	$('.dateSlide, .edit_wdc').on('click', function(){
		var w_scroll_pos = $(window).scrollTop();
		var t_scroll_pos = $('.repairTbody').scrollTop();
		window.sessionStorage.setItem('w_scroll_pos', w_scroll_pos);
		window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);
	});

}

const initFunc = function() {
	$('.scheLine').css({'min-width':$('#calThL').outerWidth()-1,'max-width':$('#calThL').outerWidth()-1});
	topClass.ww_td = $('.scheLine').outerWidth();
	topClass.left_date = new Date($('.calTr th').attr('rel'));
	topClass.th = [];
	$.each($('.calTr th'), function(){
		topClass.th.push({left:$(this).position().left, ww:$(this).outerWidth()});
	});
	topClass.ww_day = topClass.ww_td/topClass.th.length;
	$('div.dummy').css('width', topClass.ww_day-1);
	var td_left = $('.calTr th').offset().left;
	var last_obj = null;
	var top = 2;
	$.each($('div.ui-draggable'), function(){
		var obj = $(this);
		var stdt = new Date(obj.attr('st') + ' 00:00:00');
		var eddt = new Date(obj.attr('ed') + ' 23:00:00');
		var stpos = null; edpos = null;
		$.each($('.calTr th'), function(){
			var pos = $(this).offset();
			var dt = new Date($(this).attr('rel'));
			var nextdt = new Date(dt.getTime());
			nextdt.setDate(nextdt.getDate() + 1);
			if (stdt >= dt && stdt < nextdt){
				stpos = pos.left +topClass.ww_day*(stdt-dt)/(3600*24*1000)-td_left;
			}
			if (eddt >= dt && eddt < nextdt){
				edpos = pos.left + topClass.ww_day*(eddt-dt)/(3600*24*1000)-td_left;
			}
		});
		var left = (stpos==null)? (topClass.ww_day)*(stdt-topClass.left_date)/(3600*24*1000) : stpos
		var width = (stpos==null || edpos==null)? (topClass.ww_day)*(eddt-stdt)/(3600*24*1000) : edpos-stpos;
		obj.css({'left':left, 'width':width, 'height':'inherit'});
		if(last_obj && obj.parent().position().top == last_obj.parent().position().top){
			var obj_right = obj.position().left + obj.outerWidth();
			var last_obj_right = last_obj.position().left + last_obj.outerWidth();
			if(obj.position().left < last_obj_right && obj_right > last_obj.position().left){
				top += 10;
				obj.css({'top': top + 'px', 'height': (obj.height()-top+2) + 'px'});
//				obj.closest('td').css({'height': (top+2) +'em'});
			} else {
				top = 2;
			}
		} else {
			top = 2;
		}

		last_obj = obj;
	});
	$('.repairTbody div.ui-draggable').draggable({
		stack: '.repairTbody div.ui-draggable',
		axis: 'x',
		distance:5,
		grid: [topClass.ww_day,0],
		start: function(e, ui){
			startFunc($(this),e,ui);
		},
		stop: function(e, ui){
			stopFunc($(this),e,ui);
		},
		drag: function(e, ui){
			dragFunc($(this),e,ui);
		},
	});

	$('div.ui-resizable').resizable({
		minHeight: 20,
		autoHide: true,
		handles: "w,e",
		grid: [topClass.ww_day,0],
		distance:3,
		animate: false,
		start: function(e, ui){
			startFunc($(this),e,ui);
		},
		stop: function(e, ui){
			stopFunc($(this),e,ui);
		},
		resize: function(e, ui){
			resizeFunc($(this),e,ui);
		},
	});

	$('td.scheLine').on('click', function() {
		let obj = $(this).closest('tr').find('a.open_wdc');
		let i = 0;
		let timer_id = setInterval(function() {
			if(i++ > 5) clearInterval(timer_id);
			if(!isMoving){
//				console.info("notMoving");
				clearInterval(timer_id);
				obj.trigger("click");
			} else {
//				console.info("Moving");
			}
		}, 200);
	});

}

const startFunc = function(obj,e,ui){
	topClass.drag_now = true;
	topClass.start_pos = ui.position.left;
	if(e.type == 'resizestart'){
		topClass.start_width = ui.size.width;
	}
}

const stopFunc = function(obj,e,ui){
	try{
		isMoving = true;
		var stop_st = obj.attr('stop_st');
		var stop_ed = obj.attr('stop_ed');
		var type = obj.attr('data-type');
		var seq = obj.attr('seq');
		var dataInput = {md: 'move_date', seq: seq, type: type, targ_date: stop_st};
		if(e.type == 'resizestop'){
			dataInput['end_dt'] = stop_ed;
		}
		$.post('./', dataInput, function(res) {
			if (res.status) {
				var w_scroll_pos = $(window).scrollTop();
				var t_scroll_pos = $('.repairTbody').scrollTop();
				window.sessionStorage.setItem('w_scroll_pos', w_scroll_pos);
				window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);
				isMoving = false;
				location.reload();
			}
		}, 'json');
	} catch (e) {
		isMoving = false;
		console.error("エラー：", e.message);
	} finally {
	}

}

const dragFunc = function(obj, e, ui){
	var dist = ui.position.left-topClass.start_pos;
	var d_st = new Date(obj.attr('st'));
	var d_ed = new Date(obj.attr('ed'));
	var d_now_st = d_st.getTime()+ dist*3600*24*1000/(topClass.ww_day);
	var d_now_ed = d_ed.getTime()+ dist*3600*24*1000/(topClass.ww_day);

	obj.attr('stop_st', formatDTime(new Date(d_now_st)));
	obj.attr('stop_ed', formatDTime(new Date(d_now_ed)));
}

const resizeFunc = function(obj, e, ui){
	var d_st = new Date(obj.attr('st'));
	var d_ed = new Date(obj.attr('ed'));
	var d_now_st = d_st.getTime();
	var d_now_ed = d_ed.getTime();
	if(ui.position.left != topClass.start_pos){	//startが動いている
		d_now_st += (ui.position.left - topClass.start_pos)*3600*24*1000/(topClass.ww_day);
	} else {		//endが動いている
		d_now_ed += (ui.size.width - topClass.start_width)*3600*24*1000/(topClass.ww_day);
	}

	obj.attr('stop_st', formatDTime(new Date(d_now_st)));
	obj.attr('stop_ed', formatDTime(new Date(d_now_ed)));
}

const formatDTime = function(dtime){
	// 時間単位で丸める yyyy-mm-dd hh:mm
	dtime.setMinutes(Math.round(dtime.getMinutes() / 60) * 60);
	var year = dtime.getFullYear();
	var month = dtime.getMonth() + 1;
	var day = dtime.getDate();
	var hour = dtime.getHours();
	var minute = dtime.getMinutes();
	var second = dtime.getSeconds();
	return year+'-'+month+'-'+day+' '+hour+':'+minute+':00' ;
}


$(document).ready(function()
{
//	var hsize = $(window).height() - $(".repairTbody").offset().top -20;
//	$(".repairTbody").css("height", hsize + "px");
	if(window.sessionStorage.getItem(['t_scroll_pos']) && $('.repairTbody').length){
		window.onload = function (){
			$(window).scrollTop(window.sessionStorage.getItem(['w_scroll_pos']));
			$('.repairTbody').scrollTop(window.sessionStorage.getItem(['t_scroll_pos']));
			window.sessionStorage.removeItem(['t_scroll_pos']);
		}
	}
	topClass.init();
});

/* 旧コード
$(document).ready(topClass.init);

	$('.repairTbody div.ui-draggable').draggable({
		stack: '.repairTbody td.ui-draggable',
		containment: 'parent',
		start: function(e, ui){
			startFunc($(this),e, ui)
		},
		stop: function(e, ui){
			var p_offset = $(this).closest('td').offset();
			var obj_size_ww = $(this).width();

			var move_obj = $(this);
			if(!$(move_obj).attr('data-type')) {
				$(move_obj).css({ left: 'inherit', top: 'inherit'});
				return false;
			}
			$.each($('.calTr th'), function(){
				var pos = $(this).offset();
				var ww = $(this).outerWidth();

				var posx_min = pos.left;
				var posx_max = pos.left + ww;

				var now_pos_x = ui.offset.left + Math.round(obj_size_ww / 2);

				if (now_pos_x > posx_min && now_pos_x < posx_max){
					var targ_date = $(this).attr('rel');

					if (window.confirm(targ_date+'に変更しますか？')){
						var tp = $(move_obj).attr('data-type');
						var seq = $(move_obj).attr('seq');

						targ_date = targ_date.replaceAll('/','-');
						var param = location.search;
						if(param.length == 0) param = '?';
						if(param.indexOf("&md")>0){
							param = param.substring(0, param.indexOf("&md"));
						}
						var loc_url = './'+param+'&md=move_date&type='+tp+'&seq='+seq+'&targ_date='+targ_date;
						var w_scroll_pos = $(window).scrollTop();
						var t_scroll_pos = $('.repairTbody').scrollTop();
						window.sessionStorage.setItem('w_scroll_pos', w_scroll_pos);
						window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);

						window.location.href = loc_url;

					} else {
						$(move_obj).css({ left: 'inherit', top: 'inherit'});
					}
					return false;
				}
			});
		},
		update: function(e, ui) {
		}
	});
*/

