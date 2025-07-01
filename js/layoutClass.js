
var layoutClass = {};

layoutClass.init = function(){

	$('.ui-draggable').draggable({
		containment: '.droppable',
		helper: 'clone',
		connectToSortable: "div.ui-droppable",
		distance:5,
		start: function(e, ui){
//			$(this).hide();
		},
		stop: function(e, ui){
//			layoutClass.stopFunc($(this),e,ui);
		},
	});

	$('div.ui-droppable').draggable({
		containment: '.droppable .repairTable',
		helper: 'clone',
		connectToSortable: "div.ui-droppable",
		distance:5,
		start: function(e, ui){
			$(this).addClass('temp');
//			$(this).hide();
		},
		stop: function(e, ui){
			$(this).removeClass('temp');
//			$(this).show();
		},
	});

	$('div.ui-droppable').droppable({
		accept: $('.ui-draggable'),
		addClasses: true,
		tolerance: 'intersect',
		hoverClass: 'on',
		drop: function(e, ui){
			layoutClass.stopFunc($(this),e,ui);
		},
	});

	$('div.repairTable').droppable({
		accept: $('.ui-droppable'),
		addClasses: true,
		tolerance: 'intersect',
//		hoverClass: 'on',
		drop: function(e, ui){
			layoutClass.stopDelFunc($(this),e,ui);
		},
	});

	$('input[name=rain]').on('change', function(){
		document.forms.basic_form.submit();
	});

	$('input[name=sk_serch]').on('change', function(){
		document.forms.basic_form.submit();
	});

	var click_timer = new Array();
	var click_num = 0;
	$('.layout_car').on('click', function(){
		if(layoutClass.drag_now) return;
		var that = this;
	    var timer = setTimeout(function() {
			var seq = $(that).attr('seq');

			if(seq){
				var bgc = $(that).attr('class').match(/bgc(\d+)/)
				var urdl = $(that).attr('class').match(/urdl(\d+)/)
				var text = $(that).find('p').html();
				text = text.replace(/<br>/g, '');
				$('input[name=seq]').val(seq);
				$('textarea[name=text]').val(text);
				if(bgc){
					$('select[name=color]').val(bgc[1]);
				}
				if(urdl){
					$('input[name=urdl]').val([urdl[1]]);
				} else {
					$('input[name=urdl]').val(['0']);
				}
			} else {
				$('.button.removeButton').parents('li').hide();
				$('textarea[name=text]').val('');
				$('select[name=color]').val(1);
			}
			$('#maskFull').fadeIn();
			$('input[name=place_id]').val($(that).attr('id'));
			layoutClass.colorSelect();
			$('input[name=md]').val('upsert_layout');
			$('#popWindow').fadeIn();
	    }, 250);
	    click_timer[click_num] = timer
    	click_num++;

	});

	$('.layout_car').on('dblclick', function(e){
	    click_timer.forEach (function(timer){
	        clearTimeout(timer);
	    });

		var seq = $(this).attr('seq');
		if(seq){
			var hv = $(this).attr('class').match(/layout_car (.)/);
			var urdl = $(this).attr('class').match(/urdl(\d+)/);
			hv = [hv[1]];
			urdl = urdl? [urdl[1]] : 0;
			var ar = (hv == "v")? [1,3,0,1] : [2,4,0,2];
			var pos = $.inArray(Number(urdl), ar);
			var dataInput = {md: 'update_layout', wly_seq: seq, wly_urdl: ar[pos+1]};
			$.post('./', dataInput, function(res) {
				if (res.status) {
					var t_scroll_pos = $('.repairTbody').scrollTop();
					window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);
					location.reload();
				}
			}, 'json');

			jQuery.noop();

		}
	});

	$('select[name=color]').on('change', layoutClass.colorSelect);

	$('.copy_prev').on('click', function(){
		var dataInput = {md:'copy_prev', prevdate:layoutClass.prevdate, trgdate:layoutClass.trgdate};
		$.post('./', dataInput, function(res) {
			if (res.status) {
				$('#popWindow').fadeOut();
				location.reload();
			}
		}, 'json');
	});

	$('.closeButton a').on('click', function(){
		$('#maskFull').fadeOut();
		$('#popWindow').fadeOut();
	});

	$('.saveButton').on('click', function(){
		seq = $('input[name=seq]').val();
		place_id = $('input[name=place_id]').val();
		color = $('select[name=color]').val();
		text = $('textarea[name=text]').val();
		urdl = $('input[name=urdl]:checked').val();

		var dataInput = {md:'upsert_layout', wly_date:layoutClass.trgdate , wly_place_id:place_id, wly_text:text, wly_color: color, wly_urdl: urdl, wly_delfg: 0};
		$.post('./', dataInput, function(res) {
			if (res.status) {
				$('#popWindow').fadeOut();
				var t_scroll_pos = $('.repairTbody').scrollTop();
				window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);
				location.reload();
			}
		}, 'json');
	});

	$('.removeButton').on('click', function(){
		if (window.confirm('削除します。よろしいですか？')) {
			seq = $('input[name=seq]').val();

			var dataInput = {md: 'update_layout', wly_seq: seq, wly_delfg: 1};
			$.post('./', dataInput, function(res) {
				if (res.status) {
					$('#popWindow').fadeOut();
					var t_scroll_pos = $('.repairTbody').scrollTop();
					window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);
					location.reload();
				}
			}, 'json');
		}
	});

	$('.editOpen').on('mouseenter', function(e){
		$('.fukidashi').css({'left':e.pageX+10,'top':e.pageY-20});
	});

	// 隠したい要素
	var hideSelector = "#header,#breadcrumb,.noprint";

	// 表示切替
	$('.toggleZoom').on('click', function() {
		var isDisp = $(hideSelector).is(":visible");
		if(isDisp){
		    // 要素を非表示
		    $(hideSelector).hide();
		    $('body').css({'zoom':'1.3'});

		} else {
		    // 要素を非表示
		    $(hideSelector).show();
		    $('body').css({'zoom':''});
		}
	});

	// 印刷前のイベント
	window.onbeforeprint = function() {
	    // 要素を非表示
	    $(hideSelector).hide();
	    $('.layout_car p').css({'color':'black'});
	    $('body').css({'zoom':'1.0'});
	}

	// 印刷後のイベント
	window.onafterprint = function() {
	    // 要素を表示
	    $(hideSelector).show();
	    $('.layout_car p').css({'color':''});
	    $('body').css({'zoom':''});
	}

}

layoutClass.stopFunc = function(drop,e,ui){

	var obj = ui.draggable;
	if (obj.context.nodeName == 'DIV'){
		var seq = obj.attr('seq');
		var id = drop.attr('id');
		var old_seq = drop.attr('seq');
		var bgc = obj.attr('class').match(/bgc(\d+)/)
		var text = obj.find('p').text();
		if(old_seq){
			var dataInput = {md:'update_layout', wly_seq:old_seq, wly_delfg:1};
			$.post('./', dataInput);
		}
		var dataInput = {md:'update_layout', wly_seq:seq, wly_place_id:id, wly_text:text, wly_color:bgc, wly_delfg:0};
//		var dataInput = {md:'upsert_layout', wly_date:layoutClass.trgdate , wly_place_id:id, wly_text:text, wly_color:bgc[1], wly_delfg:0};
	} else {
		var id = drop.attr('id');
		var tr = obj.closest('tr');
		var wdc_seq = tr.attr('seq');
		var dataInput = {md:'upsert_layout', wly_date:layoutClass.trgdate , wly_place_id:id, wly_wdcseq:wdc_seq, wly_text:null, wly_color:0, wly_urdl:0, wly_delfg:0};
	}
	$.post('./', dataInput, function(res) {
		if (res.status) {
			var t_scroll_pos = $('.repairTbody').scrollTop();
			window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);
			location.reload();
		}
	}, 'json');

}

layoutClass.stopDelFunc = function(drop,e,ui){
	var obj = ui.draggable;
	var seq = obj.attr('seq');
	var dataInput = {md: 'update_layout', wly_seq: seq, wly_delfg: 1};
	$.post('./', dataInput, function(res) {
		if (res.status) {
			location.reload();
		}
	}, 'json');
}

layoutClass.initFunc = function() {
	layoutClass.trgdate = $('#trgdate').val();
	layoutClass.prevdate = $('#prevdate').val();

}

$(document).ready(layoutClass.init);

$(document).ready(function(){
	layoutClass.initFunc();
	if(window.sessionStorage.getItem(['t_scroll_pos']) && $('.repairTbody')){
		window.onload = function (){
			$('.repairTbody').scrollTop(window.sessionStorage.getItem(['t_scroll_pos']));
			window.sessionStorage.removeItem(['t_scroll_pos']);
		}
	}
});

layoutClass.nowColor = false;
layoutClass.colorSelect = function(){
	if (layoutClass.nowColor){
		$('select[name=color]').removeClass(layoutClass.nowColor);
	}

	var col_num = $('select[name=color]').val();
	layoutClass.nowColor = 'bgc'+col_num;

	$('select[name=color]').addClass(layoutClass.nowColor);

	return true;
}

