
var scheClass = {};

scheClass.init = function(){
	scheClass.initFunc();

	$('.scheTbody div.ui-draggable').draggable({
		stack: '.scheTbody div.ui-draggable',
//		containment: '.scheTbody',
		axis: 'x',
//		appendTo: '.scheTbody',
		scroll: false,
//		helper: 'clone',
//		snap: '.dummy',
//		distance:3,
		grid: [scheClass.ww_day/4,10],
		start: function(e, ui){
			scheClass.startFunc($(this),e,ui);
		},
		stop: function(e, ui){
			scheClass.stopFunc($(this),e,ui);
		},
		drag: function(e, ui){
//			scheClass.dragFunc($(this),e,ui);
		},
	});

	$('div.ui-draggable').resizable({
		minHeight: 18,
		autoHide: true,
		handles: "w,e",
		grid: [scheClass.ww_day/4,0],
		distance:3,
		animate: false,
		start: function(e, ui){
			scheClass.startFunc($(this),e,ui);
		},
		stop: function(e, ui){
			scheClass.stopFunc($(this),e,ui);
		},
		resize: function(e, ui){
//			scheClass.resizeFunc($(this),e,ui);
		},
	});

	$('.scheTr td.scheLine').on('click', function(){
		if(scheClass.drag_now) return;

		var td = $(this);
		var wdc_seq = $(this).closest('tr').find('[name=wdc_seq]').val();
		var procNo = $(this).closest('tr').find('[name=procNo]').val();
		var procName = $(this).closest('tr').find('td.procName').text();

		var now_pos_x = event.pageX ;	// 水平の位置座標
		$.each($('.calTr th.day'), function(){
			var pos = $(this).offset();
			var ww = $(this).outerWidth();
			var posx_min = pos.left;
			var posx_max = pos.left + ww;
			if (now_pos_x > posx_min && now_pos_x < posx_max){
				var td_left = td.offset().left;
				var slotNo = Math.floor((now_pos_x - posx_min) / (ww / (scheClass.slotCnt))) + 1;
				var sTime = scheClass.timeSlots[slotNo];
				var eTime = scheClass.timeSlots[slotNo + 1];
				var start_dt = $(this).attr('rel') + ' ' + sTime;
				var end_dt = $(this).attr('rel') + ' ' + eTime;

				var promise = makeMemberSel(procNo,'0');
			    promise.done(function() {
					$('#maskFull').fadeIn();
					$('#schePopWindow input[name=start_dt]').val(start_dt);
					$('#schePopWindow input[name=end_dt]').val(end_dt);
					$('#schePopWindow .button.removeButton').parents('li').hide();
					$('#schePopWindow input[name=title]').val('');
					$('#schePopWindow input[name=wdc_seq]').val(wdc_seq);
					$('#schePopWindow select[name=proces]').val(procNo);
//					$('#schePopWindow td.procName').text(procName);
					$('#schePopWindow select[name=member]').val('0');
					$('#schePopWindow input[name=md]').val('insert');
					$('#schePopWindow').fadeIn();
			    });
			}
		});
	});
	$('select[name=color]').on('change', scheClass.colorSelect);

	$('.dateSlide').on('click', function(){
		var t_scroll_pos = $('.scheTbody').scrollTop();
		window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);
	});

	$('.editOpen').on('click', scheClass.editOpen);

	$('.closeButton a').on('click', function(){
		$('#maskFull').fadeOut();
		$('#schePopWindow').fadeOut();
	});

	$('.saveButton').on('click', function(){
		var md = $('#schePopWindow input[name=md]').val();
		var seq = $('#schePopWindow input[name=seq]').val();
		var wdc_seq = $('#schePopWindow  input[name=wdc_seq]').val();
		var start_dt = $('#schePopWindow input[name=start_dt]').val();
		var end_dt = $('#schePopWindow input[name=end_dt]').val();
		var proces = $('#schePopWindow select[name=proces]').val();
		var member = $('#schePopWindow select[name=member]').val();
//		var memo = $('input[name=memo]').val();

		var dataInput = {md: md, seq: seq, column:{wbs_wdcseq: wdc_seq, wbs_start_dt: start_dt, wbs_end_dt: end_dt, wbs_proces: proces, wbs_wmmseq: member}};
		$.post('./', dataInput, function(res) {
			if (res.status) {
				$('#schePopWindow').fadeOut();
				location.reload();
			}
		}, 'json');
		var t_scroll_pos = $('.scheTbody').scrollTop();
		window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);
	});

	$('.removeButton').on('click', function(){
		if (window.confirm('削除します。よろしいですか？')) {
			var md = $('input[name=md]').val();
			var seq = $('input[name=seq]').val();
			var delfg = 1;

			var dataInput = {md: md, seq: seq, column:{wbs_delfg: delfg}};
			$.post('./', dataInput, function(res) {
				if (res.status) {
					$('#schePopWindow').fadeOut();
					location.reload();
				}
			}, 'json');
		}
		var t_scroll_pos = $('.scheTbody').scrollTop();
		window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);
	});

	$('.editOpen').on('mouseenter', function(e){
		$('.fukidashi').css({'left':e.pageX+10,'top':e.pageY-20});
	});

	$('#container .dateSlide').on('click', function() {
		$('body').css({'cursor':'wait'});
	});

}

scheClass.startFunc = function(obj,e,ui){
	scheClass.drag_now = true;
	scheClass.start_pos = ui.position.left;
	var wdc_seq = obj.closest('tr').find('input [name=wdc_seq]').val();

	if(e.type == 'resizestart'){
		scheClass.start_width = ui.size.width;
	}
	if(e.type == 'dragstart'){
//		obj.hide();
	}

}

scheClass.stopFunc = function(obj,e,ui){
	var pos_st = obj.offset().left + 5;
	var pos_ed = pos_st + obj.outerWidth() - 10;
	var td_left = $('.calTr th.day').offset().left;
	var start_dt = null; end_dt = null;
	$.each($('.calTr th.day'), function(){
		var pos = $(this).position();
		var ww = $(this).outerWidth();
		var posx_min = pos.left;
		var posx_max = pos.left + ww + 1;
		if (pos_st >= posx_min && pos_st < posx_max){
			var slotNo = Math.round((pos_st - posx_min) / (ww / (scheClass.slotCnt))) + 1;
			var sTime = scheClass.timeSlots[slotNo];
			start_dt = $(this).attr('rel') + ' ' + sTime;
		}
		if (pos_ed > posx_min && pos_ed <= posx_max){
			var slotNo = Math.round((pos_ed - posx_min) / (ww / (scheClass.slotCnt)));
			var eTime = scheClass.timeSlots[slotNo+1];
			end_dt = $(this).attr('rel') + ' ' + eTime;
		}
	});
	if(start_dt==null){
		var d = new Date(scheClass.left_date.getTime());
		var days = Math.floor((pos_st - td_left) / scheClass.ww_day);
		d.setDate(d.getDate() + days);
		var slotNo = Math.round((pos_st - days * scheClass.ww_day - td_left) / (scheClass.ww_day / (scheClass.slotCnt))) + 1;
		var sTime = scheClass.timeSlots[slotNo];
		start_dt = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate() + ' ' + sTime;
	}
	if(end_dt==null){
		var d = new Date(scheClass.left_date.getTime());
		var days = Math.floor((pos_ed - td_left) / scheClass.ww_day);
		d.setDate(d.getDate() + days);
		var slotNo = Math.round((pos_ed - days * scheClass.ww_day - td_left) / (scheClass.ww_day / (scheClass.slotCnt))) + 1;
		var sTime = scheClass.timeSlots[slotNo];
		end_dt = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate() + ' ' + sTime;
	}
	if (true){
		var seq = obj.attr('seq');
		var dataInput = {md: 'update', seq: seq, column:{wbs_start_dt: start_dt, wbs_end_dt: end_dt}};
		$.post('./', dataInput, function(res) {
			res = JSON.parse(res);
			if (res.status) {
				location.reload();
			}
		}, 'html');
	} else {
		obj.css({ left: scheClass.start_pos});
	}
	var t_scroll_pos = $('.scheTbody').scrollTop();
	window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);
	$('body').css({'cursor':'wait'});

}

scheClass.initFunc = function() {
	scheClass.timeSlots = JSON.parse($('#timeSlots').text());
	scheClass.slotCnt = Object.keys(scheClass.timeSlots).length - 1;
	$('td.scheLine').css('min-width', $('.calTr th.day').outerWidth() * 14);
	scheClass.ww_td = $('.scheLine').outerWidth();
	scheClass.left_date = new Date($('.calTr th.day').attr('rel'));
	scheClass.th = [];
	scheClass.ww_day = scheClass.ww_td/$('.calTr th.day').length;
	var td_left = $('.calTr th.day').offset().left;
	var last_obj = null;
	$.each($('div.ui-draggable'), function(){
		var obj = $(this);
		var stdt = new Date(obj.attr('st'));
		var eddt = new Date(obj.attr('ed'));
		var stpos = null; edpos = null;
		$.each($('.calTr th.day'), function(){
			var pos = $(this).offset();
			var dt = new Date($(this).attr('rel'));
			var nextdt = new Date(dt.getTime());
			nextdt.setDate(nextdt.getDate() + 1);
			if (stdt >= dt && stdt < nextdt){
				var slotNo = getTimeSlot(stdt);
				stpos = pos.left +scheClass.ww_day*(slotNo-1) / scheClass.slotCnt - td_left;
			}
			if (eddt >= dt && eddt < nextdt){
				var slotNo = getTimeSlot(eddt);
				edpos = pos.left +scheClass.ww_day*(slotNo - 1) / scheClass.slotCnt - td_left;
			}
		});
		if(stpos==null){
			var d = new Date(stdt.getFullYear(), stdt.getMonth(), stdt.getDate(), 0, 0, 0);
			var slot = getTimeSlot(stdt);
			stpos = scheClass.ww_day*(d - scheClass.left_date)/(3600*24*1000) + scheClass.ww_day*(slot-1) / scheClass.slotCnt;
		}
		if(edpos==null){
			var d = new Date(eddt.getFullYear(), eddt.getMonth(), eddt.getDate(), 0, 0, 0);
			var slot = getTimeSlot(eddt);
			edpos = scheClass.ww_day*(d - scheClass.left_date)/(3600*24*1000) + scheClass.ww_day*(slot-1) / scheClass.slotCnt;
		}
		var width = (stpos==null || edpos==null)? (scheClass.ww_day)*(eddt-stdt)/(3600*24*1000) : edpos-stpos;
		obj.css({'left':stpos, 'width':width, 'height':'1.5em'});
		if(last_obj && obj.parent().position().top == last_obj.parent().position().top){
			var obj_right = obj.position().left + obj.outerWidth();
			var last_obj_right = last_obj.position().left + last_obj.outerWidth() - 0.5;
			if(obj.position().left < last_obj_right && obj_right > last_obj.position().left){
				obj.css({'top':'2.2em'});
				obj.closest('td').css({'height':'4em'});
			}
		}
		last_obj = obj;
	});
}

$(document).ready(function(){
	var hsize = $(window).height() - $(".scheTbody").offset().top -20;
	$(".scheTbody").css("height", hsize + "px");
	if(window.sessionStorage.getItem(['t_scroll_pos']) && $('.scheTbody').length){
		window.onload = function (){
			$('.scheTbody').scrollTop(window.sessionStorage.getItem(['t_scroll_pos']));
			window.sessionStorage.removeItem(['t_scroll_pos']);
		}
	}

	scheClass.init();
//	$(document).css({'cursor':'auto'});
});

var timer = false;
$(window).resize(function(){
	if(scheClass.drag_now) return;
    if (timer !== false) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
		scheClass.initFunc();
    }, 200);
});

scheClass.editOpen = function(){
	if(scheClass.drag_now) return false;

	$('#maskFull').fadeIn();

	var param = {};
	param.md = 'load';
	param.seq = $(this).attr('seq');

	$.post('./', param, function(res){
		if (res.status) {
			var promise = makeMemberSel(res.proces, res.member);
		    promise.done(function() {
				$('#schePopWindow input[name=start_dt]').val(res.start_dt);
				$('#schePopWindow input[name=end_dt]').val(res.end_dt);
				$('#schePopWindow select[name=proces]').val(res.proces);
				$('#schePopWindow select[name=member]').val(res.member);
				$('#schePopWindow input[name=seq]').val(res.seq);
				$('#schePopWindow input[name=wdc_seq]').val(res.wdc_seq);
				$('#schePopWindow input[name=md]').val('update');
				$('#schePopWindow').fadeIn();
		    });
		}
	}, 'json');
	return false;
}

const makeMemberSel = function(proc, val) {
	var defer = $.Deferred();
	var param = {};
	param.md = 'get_member_list';
	param.proc = proc;

	// member
	$.post('./', param, function(res){
		var optionList = res.memberList;
		var select = $('select[name=member]');
		var keys = Object.keys(optionList);
		select.children().remove();
		keys.forEach(function(key, i){
		  /// option要素を動的に生成＆追加
		  var content = this[key];
		  var option = $('<option>')
		    .text(content['sel_val'])
		    .val(content['sel_num']);
		  select.append(option);
		}, optionList);
		select.val(val);
	}, 'json');
	return defer.resolve();
}

const makeProcSel = function(type, val) {
	var defer = $.Deferred();
	var param = {};
	param.md = 'get_proces_list';
	param.type = type;

	$.post('./', param, function(res){
		var optionList = res.memberList;
		var select = $('select[name=proces]');
		var keys = Object.keys(optionList);
		select.children().remove();
		keys.forEach(function(key, i){
		  /// option要素を動的に生成＆追加
		  var content = this[key];
		  var option = $('<option>')
		    .text(content['sel_val'])
		    .val(content['sel_num']);
		  select.append(option);
		}, optionList);
		select.val(val);
	}, 'json');
	return defer.resolve();
}

scheClass.formatDTime = function(dtime){
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

scheClass.formatDHour = function(dtime){
	var s_dtime = scheClass.formatDTime(dtime);
	var d_part = s_dtime.match(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).*$/);
	return d_part[2]+'/'+d_part[3]+' '+d_part[4]+':00';
}

const getTimeSlot = function(dtime){
	var d = new Date(dtime);
	var hhmm = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
	var slotNo = 1;
	for(i=1; i <= Object.keys(scheClass.timeSlots).length; i++){
		if(hhmm >= scheClass.timeSlots[i]){
			slotNo = i;
		}
	}
	return(slotNo);

}
