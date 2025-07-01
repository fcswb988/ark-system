
var substcarClass = {};

substcarClass.init = function(){
	substcarClass.initFunc();

	$('.scheTbody div.ui-draggable').draggable({
		stack: '.scheTbody div.ui-draggable',
		containment: '.scheTbody',
//		axis: 'x',
		appendTo: '.scheTbody',
		scroll: false,
		helper: 'clone',
		snap: '.dummy',
		distance:5,
//		grid: [substcarClass.ww_day,10],
		start: function(e, ui){
			substcarClass.startFunc($(this),e,ui);
		},
		stop: function(e, ui){
			substcarClass.stopFunc($(this),e,ui);
		},
		drag: function(e, ui){
			substcarClass.dragFunc($(this),e,ui);
		},
	});

	$('div.ui-draggable').resizable({
		minHeight: 20,
		autoHide: true,
		handles: "w,e",
		grid: [substcarClass.ww_day,0],
		distance:3,
		animate: false,
		start: function(e, ui){
			substcarClass.startFunc($(this),e,ui);
		},
		stop: function(e, ui){
			substcarClass.stopFunc($(this),e,ui);
		},
		resize: function(e, ui){
			substcarClass.resizeFunc($(this),e,ui);
		},
	});

	$('.dummy').droppable({
		drop: function(){
			var mscseq = $(this).closest('tr').find('[name=m_substcar]').attr('seq');
			if(mscseq != substcarClass.mscseq){
				substcarClass.mscseq = mscseq;
//				alert("mscseq:" + mscseq);
			}
		}
	});

	$('.scheTbody td').on('click', function(){
		if(substcarClass.drag_now) return;

		var td = $(this);
		var mscseq = $(this).closest('tr').find('[name=m_substcar]').attr('seq');
		var mscname = $(this).closest('tr').find('[name=m_substcar]').text();

		var now_pos_x = event.pageX ;	// 水平の位置座標
		$.each($('.calTr th'), function(){
			var pos = $(this).offset();
			var ww = $(this).outerWidth();
			var posx_min = pos.left;
			var posx_max = pos.left + ww;
			if (now_pos_x > posx_min && now_pos_x < posx_max){
				var td_left = td.offset().left;
				var start_dt = $(this).attr('rel') + ' 00:00:00';
				var end_dt = $(this).attr('rel') + ' 23:00:00';

				$('#maskFull').fadeIn();
				$('.car_name').text(mscname);
				$('input[name=start_dt]').val(start_dt);
				$('input[name=end_dt]').val(end_dt);
				$('.button.removeButton').parents('li').hide();
				$('input[name=title]').val('');
				$('input[name=mscseq]').val(mscseq);
//				$('select[name=color]').val(1);
//				substcarClass.colorSelect();
				$('input[name=md]').val('insert');
				$('#schePopWindow').fadeIn();
			}
		});
	});
//	$('select[name=color]').on('change', substcarClass.colorSelect);

	$('.dateSlide').on('click', function(){
		var w_scroll_pos = $(window).scrollTop();
		window.sessionStorage.setItem('w_scroll_pos', w_scroll_pos);
	});

	$('.editOpen').on('click', substcarClass.editOpen);

	$('.closeButton a').on('click', function(){
		$('#maskFull').fadeOut();
		$('#schePopWindow').fadeOut();
	});

	$('.saveButton').on('click', function(){
		md = $('input[name=md]').val();
		seq = $('input[name=seq]').val();
		mscseq = $('input[name=mscseq]').val();
		start_dt = $('input[name=start_dt]').val();
		end_dt = $('input[name=end_dt]').val();
//		color = $('select[name=color]').val();
		color = $('input[name=color]:checked').val();
		title = $('input[name=title]').val();

		var dataInput = {md: md, seq: seq, mscseq: mscseq, start_dt: start_dt, end_dt: end_dt, title: title, color: color};
		$.post('./', dataInput, function(res) {
			if (res.status) {
				$('#schePopWindow').fadeOut();
				location.reload();
			}
		}, 'json');
	});

	$('.removeButton').on('click', function(){
		if (window.confirm('削除します。よろしいですか？')) {
			md = $('input[name=md]').val();
			seq = $('input[name=seq]').val();
			delfg = 1;

			var dataInput = {md: md, seq: seq, delfg: delfg};
			$.post('./', dataInput, function(res) {
				if (res.status) {
					$('#schePopWindow').fadeOut();
					location.reload();
				}
			}, 'json');
		}
	});

	$('.editOpen').on('mouseenter', function(e){
		$('.fukidashi').css({'left':e.clientX+10,'top':e.clientY-20});
	});


}

substcarClass.startFunc = function(obj,e,ui){
	substcarClass.drag_now = true;
	substcarClass.start_pos = ui.position.left;
	var mscseq = obj.closest('tr').find('[name=m_substcar]').attr('seq');
	substcarClass.mscseq = mscseq;

	if(e.type == 'resizestart'){
		substcarClass.start_width = ui.size.width;
	}
	if(e.type == 'dragstart'){
		obj.hide();
	}

	/*
	substcarClass.ww_td = obj.closest('td').outerWidth();
	substcarClass.left_date = new Date($('.calTr th').attr('rel'));
	substcarClass.th = [];
	$.each($('.calTr th'), function(){
		substcarClass.th.push({left:$(this).position().left, ww:$(this).outerWidth()});
	});
*/
}

substcarClass.stopFunc = function(obj,e,ui){
	var stop_st = obj.attr('stop_st');
	var stop_ed = obj.attr('stop_ed');
//	if (window.confirm(stop_st + '～' + stop_ed + 'に変更します')){
	if (true){
		var seq = obj.attr('seq');
		var dataInput = {md: 'update', seq: seq, start_dt: stop_st, end_dt: stop_ed, mscseq: substcarClass.mscseq};
		$.post('./', dataInput, function(res) {
			res = JSON.parse(res);
			if (res.status) {
				location.reload();
			}
		}, 'html');
	} else {
		obj.css({ left: substcarClass.start_pos});
	}

}
substcarClass.dragFunc = function(obj, e, ui){
	var dist = ui.position.left-substcarClass.start_pos;
	var d_st = new Date(obj.attr('st'));
	var d_ed = new Date(obj.attr('ed'));
	var d_now_st = d_st.getTime()+ dist*3600*24*1000/(substcarClass.ww_day);
	var d_now_ed = d_ed.getTime()+ dist*3600*24*1000/(substcarClass.ww_day);

	obj.context.innerText = formatDHour(new Date(d_now_st))+'～'+formatDHour(new Date(d_now_ed));
	obj.attr('stop_st',formatDTime(new Date(d_now_st)));
	obj.attr('stop_ed',formatDTime(new Date(d_now_ed)));
}

substcarClass.resizeFunc = function(obj, e, ui){
	var d_st = new Date(obj.attr('st'));
	var d_ed = new Date(obj.attr('ed'));
	var d_now_st = d_st.getTime();
	var d_now_ed = d_ed.getTime();
	if(ui.position.left != substcarClass.start_pos){	//startが動いている
		d_now_st += (ui.position.left - substcarClass.start_pos)*3600*24*1000/(substcarClass.ww_day);
	} else {		//endが動いている
		d_now_ed += (ui.size.width - substcarClass.start_width)*3600*24*1000/(substcarClass.ww_day);
	}

	obj.context.innerText = formatDHour(new Date(d_now_st))+'～'+formatDHour(new Date(d_now_ed));
	obj.attr('stop_st',formatDTime(new Date(d_now_st)));
	obj.attr('stop_ed',formatDTime(new Date(d_now_ed)));
}

substcarClass.initFunc = function() {
	substcarClass.ww_td = $('.scheLine').outerWidth();
	substcarClass.left_date = new Date($('.calTr th').attr('rel'));
	substcarClass.th = [];
	$.each($('.calTr th'), function(){
		substcarClass.th.push({left:$(this).position().left, ww:$(this).outerWidth()});
	});
	substcarClass.ww_day = substcarClass.ww_td/substcarClass.th.length;
	$('.calTr th').css('min-width', substcarClass.ww_day-1);
	$('div.dummy').css('width', substcarClass.ww_day-1);
	var td_left = $('.calTr th').offset().left;
	var objs = []; var poss = [0];
	var overlap_pos = [];
	$.each($('div.ui-draggable'), function(){
		var obj = $(this);
		var stdt = new Date(obj.attr('st'));
		var eddt = new Date(obj.attr('ed'));
		var stpos = null; edpos = null; lastdt = null;
		$.each($('.calTr th'), function(){
			var pos = $(this).offset();
			var dt = new Date($(this).attr('rel'));
			var nextdt = new Date(dt.getTime());
			nextdt.setDate(nextdt.getDate() + 1);
			if (stdt >= dt && stdt < nextdt){
				stpos = pos.left +substcarClass.ww_day*(stdt-dt)/(3600*24*1000)-td_left;
			}
			if (eddt >= dt && eddt < nextdt){
				edpos = pos.left + substcarClass.ww_day*(eddt-dt)/(3600*24*1000)-td_left;
			}
			lastdt = nextdt;
		});
		var left = (stpos==null)? (substcarClass.ww_day)*(stdt-substcarClass.left_date)/(3600*24*1000) : stpos
		var width = (stpos==null || edpos==null)? (substcarClass.ww_day)*(eddt-stdt)/(3600*24*1000) : edpos-stpos;
		obj.css({'left':left, 'width':width, 'height':'1.7em'});
		if(stdt < lastdt){
			var v_left = (stpos==null)? 0-left : 0;
			var v_right = (edpos==null)? obj.parent().width() - left : width;
			var obj_title = obj.find('.wsuTitle');
			obj_title.css({'left': (v_right+v_left-obj_title.width())/2});
		}
		if(objs.length){
			if(obj.parent().position().top == objs[0].parent().position().top){
				var obj_right = obj.position().left + obj.outerWidth();
				$.each(objs, function(index, other_obj) {
					var other_obj_right = other_obj.position().left + other_obj.outerWidth();
					if(obj.position().left < other_obj_right && obj_right > other_obj.position().left){
						overlap_pos.push(poss[index]);
					}
				});
				overlap_pos.sort();
				for(var pos = 0; pos == overlap_pos[pos]; pos++) {}
				if(pos > 0){
					var obj0_top = Number(objs[0].css('top').replace(/px/g, ''));
					obj.css({'top':(obj0_top+22*pos)+'px'});
				}
				poss.push(pos);
				overlap_pos = [];
			} else {
				var bottom_pos = Math.max(...poss);
				if(bottom_pos > 0){
					var td_height = Number(objs[0].closest('td').css('height').replace(/px/g, ''));
					objs[0].closest('td').css({'height':(td_height+22*bottom_pos)+'px'});
				}
				objs = [];
				poss = [0];
			}
		}
		objs.push(obj);
	});

}

$(document).ready(substcarClass.init);

$(document).ready(function(){
//	substcarClass.initFunc();
});

var timer = false;
$(window).resize(function(){
	if(substcarClass.drag_now) return;
    if (timer !== false) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
		substcarClass.initFunc();
    }, 200);
});

substcarClass.editOpen = function(){
	if(substcarClass.drag_now) return false;

	var mscname = $(this).closest('tr').find('[name=m_substcar]').text();

	$('#maskFull').fadeIn();

	var param = {};
	param.md = 'load';
	param.seq = $(this).attr('seq');

	$.post('./', param, function(res){
		if (res.status) {
			$('.car_name').text(mscname);
			$('input[name=mscseq]').val(res.cols.wsu_mscseq);
			$('input[name=start_dt]').val(res.cols.wsu_start_dt);
			$('input[name=end_dt]').val(res.cols.wsu_end_dt);
			$('input[name=title]').val(res.cols.wsu_title);
			$('input[name=color]').val([res.cols.wsu_color]);
			$('.button.removeButton').parents('li').show();
			$('input[name=seq]').val(res.cols.wsu_seq);
			$('input[name=md]').val('update');
			$('#schePopWindow').fadeIn();
		}
	}, 'json');
	return false;
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

const formatDHour = function(dtime){
	var s_dtime = formatDTime(dtime);
	var d_part = s_dtime.match(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).*$/);
	return d_part[2]+'/'+d_part[3]+' '+d_part[4]+':00';
}

substcarClass.nowColor = false;
substcarClass.colorSelect = function(){
	if (substcarClass.nowColor){
		$('select[name=color]').removeClass(substcarClass.nowColor);
	}

	var col_num = $('select[name=color]').val();
	substcarClass.nowColor = 'color'+col_num;

	$('select[name=color]').addClass(substcarClass.nowColor);

	return false;
}
