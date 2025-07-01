
var calendarClass = {};

calendarClass.init = function(){
	$('.calendarView li.memoPickup, .calendarView li.repairPickup, .calendarView li.procPickup').draggable({
//		helper: 'clone',//クローン（残像）を出す設定
		containment: '.calendarView',
		distance: 5,
		start: function(){
			calendarClass.drag_now = true;
		},
		stop: function(e, ui){
			calendarClass.dragStop(e, ui, $(this));
		},
		update: function(e, ui) {
		}
	});
	$('.calendarView li.timePickup').draggable({
		containment: '.time_list',
		distance: 5,
		start: function(){
			calendarClass.drag_now = true;
		},
		stop: function(e, ui){
			calendarClass.dragStop(e, ui, $(this));
		},
		update: function(e, ui) {
		}
	});

	$('.timepicker').timepicker({
		timeFormat: 'HH:mm',
		interval: 15,
		minTime: '9',
		maxTime: '19:45',
		dynamic: false,
		dropdown: true,
		scrollbar: false
	});

	if ($('.calendarView').length){
		$(".w_toggle").on("click", function () {
			// タイトルにopenクラスを付け外しして矢印の向きを変更
			var th = $(this).closest('th');
			th.toggleClass("narrow", 100);
			setTimeout(function() {
				th.find("span").text(th.hasClass("narrow")?"≫":"≪");
			}, 200);
		});

		$('.overView').on('click', calendarClass.calendarClass);
		$('.overViewClose').on('click', calendarClass.calendarClassClose);
		$('.closeButton a').on('click', calendarClass.calendarClassClose);
		$('#maskFull').on('click', calendarClass.calendarClassClose);
		$('.memoView').on('click', calendarClass.memoNewOpen);
		$('a.memoPickup, a.timePickup').on('click', calendarClass.memoPickupOpen);
//		$('a.timePickup').on('click', calendarClass.memoPickupOpen);
		$('.holidayPickup').on('click', calendarClass.holidayPickupOpen);
		$('.procPickup').on('click', calendarClass.wdcProcPickupOpen);

		$('.carPickup').on('contextmenu', function(e) {
			$('.repairMenu').css('display', 'block');
			$('.repairMenu').css({'top':e.clientY + 0, 'left':e.clientX + 0});
			$('.repairMenu .cm_wdc_title input[name=title]').val($(this).find("p").first().text());
			$('.repairMenu input[name=seq]').val($(this).attr('rel'));
			var obj_fix_title = $('.repairMenu .cm_wdc_delivered_fix .fix_text');
			var fixed = $(this).find('.fixed').text().length > 0;
			obj_fix_title.text(fixed? '解除':'');
			$('.repairMenu .cm_wdc_delivered_fix input[name=fixed]').val(fixed? 0:1);
			return false;
		});

		$('.cm_wdc_title').on('click', calendarClass.wdcTitlePickupOpen);
		$('.cm_wdc_delivered_fix').on('click', function(e) {
				$('form#delivered_fix').submit();
		});

		$('.daily').on('contextmenu', function(e) {
			$('.dailyMenu').css('display', 'block');
			$('.dailyMenu').css({'top':e.clientY + 0, 'left':e.clientX + 0});
			$('.dailyMenu input[name=selDate]').val($(this).attr('rel'));
			return false;
		});
		$('.dailyMenu .cm_memo').on('click', calendarClass.memoNewOpen);

		$('.dailyMenu .cm_proc').on('click', calendarClass.wdcProcPickupOpen);

		$('.dayView').on('contextmenu', function(e) {
			$('.dayMenu').css('display', 'block');
			$('.dayMenu').css({'top':e.clientY + 0, 'left':e.clientX + 0});
			$('.dayMenu .cm_day_title input[name=selDate]').val($(this).closest('td').attr('rel'));
			$('.dayMenu .cm_day_title input[name=isHoliday]').val($(this).closest('td').hasClass('holiday'));

			return false;
		});
		$('.cm_day_title').on('click', function() {
			calendarClass.holidayPickupOpen($(this).find('input[name=selDate]').val(),$(this).find('input[name=isHoliday]').val());
		});
		$(document).click(function() {
			$('.menu').hide();
		});
		$('.hourly').on('click', calendarClass.memoNewOpen);
		$('.daily').on('click', calendarClass.selDate);
/*
		$('.dayView').on('click', function(e) {
			calendarClass.selDate($(this));
			e.stopPropagation();
		});
*/
		$('li.carPickup, li.memoPickup, li.procPickup, li.registPickup').on('click contextmenu', function(e) {
			e.stopPropagation();
		});

		$('.calendarRemoveButton').on('click', calendarClass.calendarRemoveButton);
		$('.calendarSaveButton').on('click', calendarClass.calendarSaveButton);
		$('.holidayRemoveButton').on('click', calendarClass.holidayRemoveButton);
		$('.holidaySaveButton').on('click', calendarClass.holidaySaveButton);
		$('.wdcTitleRemoveButton').on('click', calendarClass.wdcTitleRemoveButton);
		$('.wdcTitleSaveButton').on('click', calendarClass.wdcTitleSaveButton);
		$('.wdcProcRemoveButton').on('click', calendarClass.wdcProcRemoveButton);
		$('.wdcProcSaveButton').on('click', calendarClass.wdcProcSaveButton);
		$('#wdcProcWindow input[name=proc]').on('change', function() {
			calendarClass.makeDirectionSel($('#wdcProcWindow input[name=proc_date]').val(),$(this).val());
			calendarClass.makeMemberSel($('#wdcProcWindow select[name=sel_wmm]'), $(this).val(),'0');
			calendarClass.makeMemberSel($('#wdcProcWindow select[name=sel_wmm2]'), $(this).val(),'0');
		});

		$('.printCal').on('click', function() {
			// 隠したい要素
			var hideSelector = "#header,#breadcrumb,.noprint";
			// 要素を非表示
			$(hideSelector).hide();
			$('.cal_list a').css({'color':'#222'});
			$('a.repairPickup,a.procPickup').css({'border':'2px solid #222'});
			// 印刷日時表示
			calendarClass.setPrintDate('show');
			window.print();
			// 要素を表示
			$(hideSelector).show();
			$('.cal_list a').css({'color':''});
			$('a.repairPickup,a.procPickup').css({'border':''});
			// 印刷日時非表示
			calendarClass.setPrintDate('hide');
		});

		$('.printCalHoliday').on('click', function() {
			// 隠したい要素
			var hideSelector = "#header,#breadcrumb,#tbl_no_decided,#div_hourly, .noprint";
			// 要素を非表示
			$(hideSelector).hide();
			$('li.memoPickup').css({'list-style': 'none'});
			$('a.memoPickup, li.sun').css({'cssText': 'font-size: 27px; border:2px solid #222; color:black; background:white !important;'});
			$('li.carPickup,li.procPickup,li.memo, li.registPickup').css({'display':'none'});
			$('a.dayView span, .titleIcon').css({'font-size': 'xx-large', 'font': 'boled', 'width':'auto' });
			$('.cal_list th').css({'font-size': 'xx-large', 'font': 'boled'});
			var height = $('[name=weeks]').val() > 5 ? '185px' : '220px';
			$('tbody.cal_list td').css({'height': height});
			// 印刷日時表示
			calendarClass.setPrintDate('show');
			window.print();
			// 要素を表示
			$(hideSelector).show();
			$('li.memoPickup').css({'list-style': ''});
			$('a.memoPickup, li.sun').css({'font-size': '', 'border':'', 'color':'', 'background':''});
			$('li.carPickup,li.procPickup,li.memo, li.registPickup').css({'display':''});
			$('.cal_list th, a.dayView span, .titleIcon').css({'font-size': '', 'font': '', 'width':''});
			$('tbody.cal_list td').css({'height': ''});
			calendarClass.setPrintDate('hide');
		});

//		$('select[name=wcd_color]').on('change', calendarClass.colorSelect);
//		calendarClass.colorSelect();
	}

	if(window.sessionStorage.getItem(['change_sel_date'])){
		let th = $('#sel_date');
		th.toggleClass('colorNoWwl');
		setTimeout(function () {th.toggleClass('colorNoWwl')}, 500);
		window.sessionStorage.removeItem(['change_sel_date']);
	}
	calendarClass.ajustTbodyHeight();

}

calendarClass.dragStop = function(e, ui, obj){
	var p_offset = obj.closest('td').offset();
	var obj_size_ww = obj.width();
	var obj_size_hh = obj.height();

	var move_obj = obj;

	$.each($('.calendarView td'), function(){
		var pos = $(this).offset();
		var ww = $(this).outerWidth();
		var hh = $(this).outerHeight();

		var posx_min = pos.left;
		var posx_max = pos.left + ww;
		var posy_min = pos.top;
		var posy_max = pos.top + hh;

		var now_pos_x = ui.offset.left + Math.round(obj_size_ww / 2);
		var now_pos_y = ui.offset.top + Math.round(obj_size_hh / 2);

		if (now_pos_x > posx_min && now_pos_x < posx_max && now_pos_y > posy_min && now_pos_y < posy_max){

			if ($(this).attr('rel')) {
				var src_date = move_obj.closest('td').attr('rel');
				var tp = move_obj.find('a').attr('data-type');
				var seq = move_obj.find('a').attr('rel');

				if ($(this).hasClass('daily')){
					// 日別エリア
					var targ_date = $(this).attr('rel');
					if(new Date(src_date).getTime() == new Date(targ_date).getTime()){
						move_obj.css({ left: 'inherit', top: 'inherit'});
						return false;
					}
					var loc_url = calendarClass.getUrl(window.location.href) + '&md=move_date&seq='+seq+'&type='+tp+'&targ_date='+targ_date;
					window.location.href = loc_url;

				} else if ($(this).hasClass('hourly')) {
					// 時間帯エリア
					var tbody = move_obj.closest('tbody');
					var src = tbody.attr('class');
					var targ_date = $('#sel_date').text().replaceAll("/","-");
					if(tbody.hasClass('cal_list')){
						if(new Date(src_date).getTime() != new Date(targ_date).getTime()){
							alert("異なる日のデータです！");
							move_obj.css({ left: 'inherit', top: 'inherit'});
							return false;
						}
					}
					var targ_dtime = targ_date + " " + $(this).attr('rel');
					var text = move_obj.find('a').text();
					var w_class = move_obj.find('a').attr('class');
					var color_no = w_class.replace(/.*color/,"").replace(/[^0-9]/g,"");

					var loc_url = calendarClass.getUrl(window.location.href) + '&md=move_time&seq='+seq+'&type='+tp+'&targ_dtime='+targ_dtime+'&src='+src+'&wcd_title='+text+'&color_no='+color_no;
					window.location.href = loc_url;

				} else if ($(this).hasClass('no_decided')) {
					// 未定エリア
					var targ_date = $(this).attr('rel');

					var loc_url = calendarClass.getUrl(window.location.href) + '&md=move_date&seq='+seq+'&type='+tp+'&targ_date='+targ_date;
					var dummy = "";
					window.location.href = loc_url;

				}
			} else {
				move_obj.css({ left: 'inherit', top: 'inherit'});
			}
			return false;
		}
	});
}

calendarClass.setPrintDate = function(action){
	if(action != "hide"){
		var today = new Date();
		var dtime = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+' '+today.getHours()+':'+today.getMinutes();
		$('#printDtime').text(dtime);
		$('#printDtime').show();
		$('.printDisp').show();
	} else {
		$('#printDtime').hide();
		$('.printDisp').hide();
	}

}

calendarClass.selDate = function(){
	var sel_date = $(this).attr('rel');
	var loc_url = calendarClass.getUrl(window.location.href).replace(/&sel_date=.*/g, '') + '&sel_date='+sel_date;

	window.sessionStorage.setItem('change_sel_date', true);
	window.location.href = loc_url;
	return false;
}

calendarClass.calendarClassClose = function(){
	$('.partDatView').fadeOut();
	$('.partDat').fadeIn();
	$('#maskFull').fadeOut();

	$('#detailWindow').fadeOut();
	$('#holidayWindow').fadeOut();
	$('#wdcTitleWindow').fadeOut();
	$('#wdcProcWindow').fadeOut();
	$('.ui-timepicker-container').hide();

	return false;
}

// 何に使う？
calendarClass.calendarClass = function(){
	if (calendarClass.drag_now){
		calendarClass.drag_now = false;
		return false;
	}

	$('#maskFull').fadeIn();
	$('.partDatView').hide();
	$('.partDat').show();

	if ($(this).hasClass('daily')){
	} else {
		var targ_date = $(this).parents('td');
		$(targ_date).find('.partDatView').fadeIn();
		$(targ_date).find('.partDat').fadeOut();
	}

	return false;
}

calendarClass.calendarSaveButton = function(){
	var ttl = $('input[name=wcd_title]').val();
	if (!ttl){
		alert('件名は入力必須項目です。');
	} else /*if (window.confirm('保存します。よろしいですか？'))*/ {
		$(this).parents('form').eq(0).submit();
	}
}

calendarClass.calendarRemoveButton = function(){
	if (window.confirm('削除します。よろしいですか？')){
		$('input[name=md]').val('remove_memo');
		$(this).parents('form').eq(0).submit();
	}
}

calendarClass.holidaySaveButton = function(){
	var ttl = $('input[name=mhd_title]').val();
	if (!ttl){
		alert('休日名は入力必須項目です。');
	} else /*if (window.confirm('保存します。よろしいですか？'))*/ {
		$(this).parents('form').eq(0).submit();
	}
}

calendarClass.holidayRemoveButton = function(){
	if (window.confirm('削除します。よろしいですか？')){
		$('input[name=md]').val('remove_holiday');
		$(this).parents('form').eq(0).submit();
	}
}

calendarClass.wdcTitleSaveButton = function(){
//	if (window.confirm('保存します。よろしいですか？')){
		$(this).parents('form').eq(0).submit();
//	}
}

calendarClass.wdcTitleRemoveButton = function(){
	if (window.confirm('表示を初期値に戻します。よろしいですか？')){
		$('input[name=wdc_title]').val('');
		$(this).parents('form').eq(0).submit();
	}
}

calendarClass.wdcProcSaveButton = function(){
	var proc = $('#wdcProcWindow input[name=proc]:checked').val();
	if (!proc){
		alert('工程を選択してください。');
	} else /*if (window.confirm('保存します。よろしいですか？'))*/ {
		$(this).parents('form').eq(0).submit();
	}
}

calendarClass.wdcProcRemoveButton = function(){
	if (window.confirm('削除します。よろしいですか？')){
		$('input[name=md]').val('remove_proc');
		$(this).parents('form').eq(0).submit();
	}
}


calendarClass.carPickupMaskInit = function(){
	$('#maskFull').css('height', '100%');

	var w_hh = $('body').height();
	var m_hh = $('#maskFull').height();
	if (w_hh > m_hh){
		$('#maskFull').css('height', w_hh+'px');
	} else {
		$('#maskFull').css('height', '100%');
	}
}

calendarClass.memoNewOpen = function(){
	$('.menu').hide();
	if (calendarClass.drag_now){
		calendarClass.drag_now = false;
		return false;
	}

	$('#maskFull').fadeIn();
	$('.partDatView').hide();
	$('.partDat').show();

	var targ_date = "";
	var targ_time = "";

	if ($(this).hasClass('hourly')) {
		targ_date = $('#sel_date').text().replaceAll("/","-");
		targ_time = $(this).attr('rel');
	} else if ($(this).hasClass('daily')) {
		targ_date = $(this).attr('rel');
	} else if ($(this).hasClass('cm_memo')) {
		targ_date = $(this).find('input[name=selDate]').val();
	} else if ($(this).hasClass('memoView')) {
		targ_date = $(this).closest("td").attr('rel');
	}
	$('input[name=wcd_title]').val('');
	$('textarea[name=wcd_message]').val('');
	$('input[name=wcd_type].formation').prop('checked', 'checked');

//		$('select[name=wcd_color]').val(0);
//		calendarClass.colorSelect();
	$('.button.calendarRemoveButton').parents('li').hide();
	$('input[name=targ_date]').val(targ_date);
	$('input[name=wcd_date]').val(targ_date);
	$('input[name=wcd_start_dt]').val(targ_time);
	$('select[name=wcd_wmmseq]').val(0);
	$('input[name=seq]').val('');
	$('input[name=md]').val('insert_memo');
	$('#detailWindow').fadeIn();
	return false;
}

calendarClass.memoPickupOpen = function(){
	$('.menu').hide();
	if (calendarClass.drag_now){
		calendarClass.drag_now = false;
		return false;
	}

	$('.button.calendarRemoveButton').parents('li').show();
	if($(this).attr('data-type') == "memo" || $(this).attr('data-type') == "staff"){
		$('input[name=wcd_type]').parents('tr').show();
		$('input[name=wcd_color]').parents('tr').show();
		$('textarea[name=wcd_message]').parents('tr').show();
		$('a.calendarRemoveButton').text('削除');
	} else {
		$('input[name=wcd_type]').parents('tr').hide();
		$('input[name=wcd_color]').parents('tr').hide();
		$('textarea[name=wcd_message]').parents('tr').hide();
		$('a.calendarRemoveButton').text('時間帯から削除');
	}
	$('#maskFull').fadeIn();
	$('#detailWindow').hide();

	var param = {};
	param.md = 'load_memo';
	param.seq = $(this).attr('rel');

	$.post('./', param, function(res){
		$('input[name=wcd_title]').val(res.wcd_title);
		$('textarea[name=wcd_message]').val(res.wcd_message);
//		$('input[name=wcd_type].'+res.wcd_type).prop('checked', 'checked');
		$('input[name=wcd_type]').val([res.wcd_type]);

		$('input[name=targ_date]').val(res.targ_date);
		$('input[name=seq]').val(res.wcd_seq);
//		$('select[name=wcd_color]').val(res.wcd_color);
		$('input[name=wcd_date]').val(res.targ_date);
		$('input[name=wcd_start_dt]').val(res.targ_dtime);
		$('select[name=wcd_wmmseq]').val(res.wcd_wmmseq);
		$('input[name=wcd_color]').val([res.wcd_color]);
//		calendarClass.colorSelect();

		$('input[name=md]').val('update_memo');
		$('#detailWindow').fadeIn();

		$('body, html').animate({ scrollTop: 0 }, 200);
		$('#detailWindow').fadeIn(200, calendarClass.carPickupMaskInit);

	}, 'json');
	return false;
}

calendarClass.holidayPickupOpen = function(date, isHoriday){
	$('.menu').hide();
	if (calendarClass.drag_now){
		calendarClass.drag_now = false;
		return false;
	}

	$('.button.holidayRemoveButton').parents('li').show();
	$('#maskFull').fadeIn();
	$('#holidayWindow').hide();

	var targ_date = $.type(date) == 'object'? $(this).closest("td").attr('rel'): date;

	if (isHoriday == 'false'){
		$('td.mhd_date').text(targ_date);
		$('input[name=mhd_title]').val('');
		$('.button.holidayRemoveButton').parents('li').hide();
		$('input[name=targ_date]').val(targ_date);
		$('input[name=seq]').val('');
		$('input[name=md]').val('insert_holiday');
		$('#holidayWindow').fadeIn();
		return false;
	}

	var param = {};
	param.md = 'load_holiday';
	param.date = targ_date;
//	param.date = $(this).closest("td").attr('rel');

	$.post('./', param, function(res){
		$('input[name=mhd_title]').val(res.mhd_title);
		$('td.mhd_date').text(res.targ_date);
		$('input[name=seq]').val(res.mhd_seq);
		$('input[name=md]').val('update_holiday');
		$('#holidayWindow').fadeIn();

		$('body, html').animate({ scrollTop: 0 }, 200);
		$('#holidayWindow').fadeIn(200, calendarClass.carPickupMaskInit);

	}, 'json');
	return false;
}

calendarClass.wdcTitlePickupOpen = function(){
	$('.menu').hide();
	if (calendarClass.drag_now){
		calendarClass.drag_now = false;
		return false;
	}

	$('.button.wdcTitleRemoveButton').parents('li').show();
	$('#maskFull').fadeIn();
	$('#wdcTitleWindow').hide();

	$('input[name=wdc_title]').val($('.repairMenu .cm_wdc_title input[name=title]').val());
	$('input[name=seq]').val($('.repairMenu .cm_wdc_title input[name=seq]').val());
	$('input[name=md]').val('update_wdc_title');
	$('#wdcTitleWindow').fadeIn();

	$('body, html').animate({ scrollTop: 0 }, 200);
	$('#wdcTitleWindow').fadeIn(200, calendarClass.carPickupMaskInit);
	return false;
}

calendarClass.wdcProcPickupOpen = function(e){
	$('.menu').hide();
	if (calendarClass.drag_now){
		calendarClass.drag_now = false;
		return false;
	}

	var isEdit = $(this).hasClass('procPickup');

	$('#maskFull').fadeIn();
	$('#wdcProcWindow').hide();

	var sel_wdc = $('#wdcProcWindow select[name=sel_wdc]');
	var sel_wmm = $('#wdcProcWindow select[name=sel_wmm]');
	var sel_wmm2 = $('#wdcProcWindow select[name=sel_wmm2]');
	var targ_date = null;
	if(isEdit){
		targ_date = $(this).parents('td').attr('rel');
		$('#wdcProcWindow .targ_date').text(targ_date);
		var param = {};
		param.md = 'load_direction';
		param.wdc_seq = $(this).attr('rel');
		param.proc_type = $(this).attr('data-type');
		param.date = targ_date;
		$('#wdcProcWindow .wdcProcRemoveButton').parents('li').show();
		$('#wdcProcWindow tr.title').show();
		sel_wdc.hide();
		$.post('./', param, function(res){
			$('#wdcProcWindow input[name=proc_date]').val(res.date);
			$('#wdcProcWindow .wdc_title span').text(res.directions[0]['sel_val']);
			$('#wdcProcWindow input[name=proc]').val([res.proc]);
			$('#wdcProcWindow input[name=proc]').prop("disabled",true);
			$('#wdcProcWindow input[name=proc][value='+res.proc+']').prop("disabled",false);
			$('#wdcProcWindow input[name=title]').val(res.title);
			$('#wdcProcWindow input[name=targ_date]').val(targ_date);
			$('#wdcProcWindow input[name=proc_days]').val(res.days);
			$('#wdcProcWindow input[name=wdc_seq]').val(param.wdc_seq);
			$('#wdcProcWindow input[name=wcd_title]').val(res.title);
			$('#wdcProcWindow input[name=md]').val('update_proc');
			var promise = calendarClass.makeMemberSel(sel_wmm, res.proc, res.sel_wmm);
			promise = calendarClass.makeMemberSel(sel_wmm2, res.proc, res.sel_wmm2);
		    promise.done(function() {
				$('body, html').animate({ scrollTop: 0 }, 200);
				$('#wdcProcWindow').fadeIn(200, calendarClass.carPickupMaskInit);
		    });
		}, 'json');
	} else {
		targ_date = $('.dailyMenu input[name=selDate]').val();
		$('#wdcProcWindow .wdcProcRemoveButton').parents('li').hide();
		$('#wdcProcWindow tr.title').hide();
		$('#wdcProcWindow .targ_date').text(targ_date);
		$('#wdcProcWindow .wdc_title span').text("");
		$('#wdcProcWindow input[name=proc_date]').val(targ_date);
		$('#wdcProcWindow input[name=proc_days]').val(1);
		var default_proc = 'event';
		$('#wdcProcWindow input[name=proc]').prop("disabled",false);
		$('#wdcProcWindow input[name=proc]').val([default_proc]);
		$('#wdcProcWindow input[name=targ_date]').val(targ_date);
		$('#wdcProcWindow input[name=md]').val('update_proc');
		var promise = calendarClass.makeDirectionSel(targ_date, default_proc);
		promise = calendarClass.makeMemberSel(sel_wmm, default_proc, 0);
		promise = calendarClass.makeMemberSel(sel_wmm2, default_proc, 0);
	    promise.done(function() {
			$('body, html').animate({ scrollTop: 0 }, 200);
			$('#wdcProcWindow').fadeIn(200, calendarClass.carPickupMaskInit);
	    });
	}

	return false;
}

calendarClass.carPickupOpen = function(){
	if (calendarClass.drag_now){
		calendarClass.drag_now = false;
		return false;
	}

	$('#maskFull').fadeIn();
	$('#detailWindow').hide();
	var param = {};

	var url_split = $(this).attr('href').split('?');
	var str_param = url_split[1];
	var str_param_list = str_param.split('&');
	for(i=0; i<str_param_list.length; i++){
		var part = str_param_list[i].split('=');
		param[part[0]] = part[1];
	}

	param.md = 'load_details';

	$.post('./', param, function(res){
		$.each($('#detailWindow td,#detailWindow td span,#detailWindow p'), function(){
			var cls = $(this).attr('class');
			if (cls && res[cls]){
				$(this).html(res[cls]);
			}
		});
		$('#detailWindow a.conditionLink').attr('href', res.conditionLink);
		$('#detailWindow a.detailLink').attr('href', res.detailLink);

		$('body, html').animate({ scrollTop: 0 }, 200);

		$('#detailWindow').fadeIn(200, calendarClass.carPickupMaskInit);

	}, 'json');
	return false;
}

calendarClass.makeDirectionSel = function(date, proc) {
	var defer = $.Deferred();
	var sel_wdc = $('#wdcProcWindow select[name=sel_wdc]');
	var param = {};
	param.md = 'load_direction';
	param.proc_type = proc;
	param.date = date;

	// member
	$.post('./', param, function(res){
		var optionList = res.directions;
		var keys = Object.keys(optionList);
		sel_wdc.children().remove();
		keys.forEach(function(key, i){
			/// option要素を動的に生成＆追加
			var content = this[key];
			var option = $('<option>') .text(content['sel_val']) .val(content['sel_num']);
			sel_wdc.append(option);
		}, optionList);
		sel_wdc.show();
	}, 'json');
	return defer.resolve();
}

calendarClass.makeMemberSel = function(obj, proc, val) {
	var defer = $.Deferred();
	var param = {};
	param.md = 'make_member_sel';
	param.proc = proc;

	// member
	$.post('./', param, function(res){
		var optionList = res.memberList;
		var select = obj;
		var keys = Object.keys(optionList);
		select.children().remove();
		keys.forEach(function(key, i){
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

calendarClass.getUrl = function(url){
	var focus_date = $('input[name=focus_date]').val();
	var view = $('input[name=view]').val();
	var part = url.match(/(types\[\]=.*).*$/g);
	var fcs_type = url.match(/(fcs_type=.*?)\&.*$/);
	fcs_type = fcs_type? "&"+fcs_type[1]:"";
	return './?view='+view+fcs_type+'&date='+focus_date + '&'+ part[0];
}

calendarClass.nowColor = false;
calendarClass.colorSelect = function(){
	if (calendarClass.nowColor){
		$('select[name=wcd_color]').removeClass(calendarClass.nowColor);
	}

	var col_num = $('select[name=wcd_color]').val();
	calendarClass.nowColor = 'color'+col_num;

	$('select[name=wcd_color]').addClass(calendarClass.nowColor);

	return false;
}

//一覧高さ調整
calendarClass.ajustTbodyHeight = function() {
	return;
	var w_height = $(window).height();
	var t_top = $('.calendarView').offset().top;
	$('.calendarView').height(w_height-t_top-10);
}

$(document).ready(calendarClass.init);
$(window).resize(calendarClass.ajustTbodyHeight);
