
var directionsClass = {};

directionsClass.init = function(){
	if ($('.addList').length){
		directionsClass.addListInit('partsList');
		directionsClass.addListInit('outscList');
		directionsClass.addListInit('workList');
		$('.partsListAdd').click(directionsClass.addListInsert);
		$('.outscListAdd').click(directionsClass.outscListInsert);
		$('.workListAdd').click(directionsClass.workListInsert);
		
		$('input[name=txt_wdc_form_cure],input[name=txt_wdc_color_ad],input[name=txt_wdc_painting],input[name=txt_wdc_assembling]').on('keypress', directionsClass.calcDays);
		
		directionsClass.calcDays();
		
		if ($('input[name=view]').val() == 'confirm'){
			$.each($('.workList tr'), function(){
				var num = $(this).attr('rel');
				var targ_td = $(this).find('td').eq(0);
				$(targ_td).css('text-align', 'left');
				
				var tadg_input = $(targ_td).find('input[type=text]');
				$(tadg_input).css('width', '88%').before(
					$('<input/>')
						.addClass('viewSelect')
						.attr({
							type: 'checkbox',
							name: 'view_check'+num
						})
						.on('click', directionsClass.clickViewCheck)
				);
				
				$(this).addClass('closeData');
			});
			
			$('.workViewCheck').on('click', function(){
				$.each($('.workList input[type=checkbox]'), function(){
					var chk_txt = $(this).parents('td').find('input[type=text]').val();
					if (chk_txt){
						$(this).prop('checked', 'checked');
						$(this).parents('tr').addClass('openData');
						$(this).parents('tr').removeClass('closeData');
					}
				});
				
				directionsClass.sendViewDatas();
				
				return false;
			});
			
			$('.workViewRemove').on('click', function(){
				$('.workList input[type=checkbox]').prop('checked', null);
				$('.workList input[type=checkbox]').parents('tr').removeClass('openData');
				$('.workList input[type=checkbox]').parents('tr').addClass('closeData');
				
				directionsClass.sendViewDatas();
				
				return false;
			});
			
			directionsClass.loadRepairView();
		} else if ($('input[name=view]').val() == 'finish'){
			if ($('.viewCheckList').length){
				$('.workList tr').addClass('closeData');
				
				$.each($('.viewCheckList input[type=hidden]'), function(){
					var num = $(this).attr('name').substr(10);
					$('.workList tr[rel='+num+']').addClass('openData');
					$('.workList tr[rel='+num+']').removeClass('closeData');
				});
			}
		}
	}
}

directionsClass.loadRepairView = function(){
	if ($('input[name=md]').val() == 'insert'){
		return false;
	}
	
	var param = {};
	param.md = 'load_repair_view';
	param.wrv_wdcseq = $('input[name=main_seq]').val();
	$.post('./repair.php', param, function(res){
		$.each($('.viewSelect'), function(){
			var num = $(this).parents('tr').attr('rel');
			if (res[num] && res[num] == 1){
				$(this).prop('checked', 'checked');
				$(this).parents('tr').removeClass('closeData');
				$(this).parents('tr').addClass('openData');
			}
		});
	}, 'json');
}

directionsClass.loadRepairViewOpen = function(num){
	if ($('input[name=md]').val() == 'insert'){
		return false;
	}
	
	var param = {};
	param.md = 'load_repair_view_ctrl';
	param['open'+num] = num;
	param.wrv_wdcseq = $('input[name=main_seq]').val();
	$.post('./repair.php', param, function(res){
		
	}, 'json');
}

directionsClass.loadRepairViewClose = function(num){
	if ($('input[name=md]').val() == 'insert'){
		return false;
	}
	
	var param = {};
	param.md = 'load_repair_view_ctrl';
	param['close'+num] = num;
	param.wrv_wdcseq = $('input[name=main_seq]').val();
	$.post('./repair.php', param, function(res){
		
	}, 'json');
}

directionsClass.sendViewDatas = function(){
	if ($('input[name=md]').val() == 'insert'){
		return false;
	}
	
	var param = {};
	param.md = 'load_repair_view_ctrl';
	param.wrv_wdcseq = $('input[name=main_seq]').val();
	
	$.each($('.viewSelect'), function(){
		var num = $(this).parents('tr').attr('rel');
		if ($(this).prop('checked')){
			param['open'+num] = num;
		} else {
			param['close'+num] = num;
		}
	});
	
	$.post('./repair.php', param, function(res){
		
	}, 'json');
}

directionsClass.clickViewCheck = function(){
	var vl = ($(this).prop('checked')) ? true: false;
	var num = $(this).parents('tr').attr('rel');
	if (vl){
		$(this).parents('tr').addClass('openData');
		$(this).parents('tr').removeClass('closeData');
		
		directionsClass.loadRepairViewOpen(num);
	} else {
		$(this).parents('tr').removeClass('openData');
		$(this).parents('tr').addClass('closeData');
		
		directionsClass.loadRepairViewClose(num);
	}
}

directionsClass.addListInsert = function(){
	$('.partsList tbody tr.hideList').eq(0).removeClass('hideList');
	if (!$('.partsList tbody tr.hideList').length){
		$('.partsListAdd').hide();
	}
	
	return false;
}

directionsClass.outscListInsert = function(){
	$('.outscList tbody tr.hideList').eq(0).removeClass('hideList');
	if (!$('.outscList tbody tr.hideList').length){
		$('.outscListAdd').hide();
	}
	
	return false;
}

directionsClass.workListInsert = function(){
	$('.workList tbody tr.hideList').eq(0).removeClass('hideList');
	if (!$('.workList tbody tr.hideList').length){
		$('.workListAdd').hide();
	}
	
	return false;
}

directionsClass.calcDays = function(){
	setTimeout(directionsClass.calcAct, 100);
}

directionsClass.calcAct = function(){
	//日数計算
	var all_days_sum = 0;
	var part_sum = 0;
	$.each($('.partsList .calcTarg'), function(){
		var num = Number($(this).val());
		part_sum += num;
	});
	$('.partsListSum').html(part_sum+' 日');
	all_days_sum += part_sum;
	
	var outsc_sum = 0;
	$.each($('.outscList .calcTarg'), function(){
		var num = Number($(this).val());
		outsc_sum += num;
	});
	$('.outscListSum').html(outsc_sum+' 日');
	all_days_sum += outsc_sum;
	
	all_days_sum += Number($('input[name=txt_wdc_form_cure]').val());
	all_days_sum += Number($('input[name=txt_wdc_color_ad]').val());
	all_days_sum += Number($('input[name=txt_wdc_painting]').val());
	all_days_sum += Number($('input[name=txt_wdc_assembling]').val());
	
	$('.allDaysSum').html(all_days_sum+' 日');
	
	if ($('input[name=md]').val() == "insert"){
		var now_date = new Date();
		var future_date = new Date(now_date.getTime() + (Number(all_days_sum) * 24 * 60 * 60 * 1000));
		
		$('input[name=yy_wdc_delivered_date]').val(future_date.getFullYear());
		$('select[name=mm_wdc_delivered_date]').val(future_date.getMonth() + 1);
		$('select[name=dd_wdc_delivered_date]').val(future_date.getDate());
	}
	
	//金額計算（部品発注）
	var partsPriceSum = 0;
	$.each($('.partsList tbody tr'), function(){
		partsPriceSum += Number($(this).find('.priceTarg').val());
	});
	$('.partsPriceSum').html(separate(partsPriceSum)+'円');
	
	//金額計算（作業内容）
	var workPriceSum = 0;
	$.each($('.workList tbody tr'), function(){
		var numTarg = Number($(this).find('.numTarg').val());
		var price1 = Number($(this).find('.priceTarg').eq(0).val());
		var price2 = Number($(this).find('.priceTarg').eq(1).val());
		var price3 = Number($(this).find('.priceTarg').eq(2).val());
		var workLineSum = (numTarg * price1) + (numTarg * price2) + (numTarg * price3);
		$(this).find('.workLineSum').html(separate(workLineSum)+'円');
		
		workPriceSum += workLineSum;
	});
	$('.workPriceSum').html(separate(workPriceSum)+'円');
	
	//金額計算（外注作業）
	var outscPriceSum = 0;
	$.each($('.outscList tbody tr'), function(){
		outscPriceSum += Number($(this).find('.priceTarg').val());
	});
	$('.outscPriceSum').html(separate(outscPriceSum)+'円');
}

directionsClass.addListInit = function(class_nm){
	var parts_max_num = 1;
	var parts_max_line = $('.'+class_nm+' tbody tr').length;
	
	var now_mode = ($('form').hasClass('confView')) ? 'confView': 'inputView';
	
	$.each($('.'+class_nm+' tbody td'), function(){
		if ($(this).find('input[type=text],input[type=hidden]').length){
			var parent_tr = $(this).parents('tr');
			
			var num = $(this).find('input[type=text],input[type=hidden]').attr('name');
			var vl = $(this).find('input[type=text],input[type=hidden]').val();
			
			if (num.match(/days/)){
				$('input[name='+num+']').addClass('calcTarg');
				$('input[name='+num+']').on('keypress', directionsClass.calcDays);
			} else if (num.match(/price/)){
				$('input[name='+num+']').addClass('priceTarg');
				$('input[name='+num+']').on('keypress', directionsClass.calcDays);
			} else if (num.match(/num/)){
				$('input[name='+num+']').addClass('numTarg');
				$('input[name='+num+']').on('keypress', directionsClass.calcDays);
			}
			
			num = Number(num.replace(/[^0-9]/g, ''));
			
			if (vl){
				if (parts_max_num < num) parts_max_num = num;
			}
			
			var now_rl = $(parent_tr).attr('rel');
			if (!now_rl){
				$(parent_tr).attr('rel', num);
			}
		}
	});
	
	parts_max_num++;
	
	if (parts_max_line > parts_max_num){
		for(i=1; i<=parts_max_line; i++){
			if (i > parts_max_num && now_mode == 'inputView'){
				$('.'+class_nm+' tbody tr[rel='+i+']').addClass('hideList');
			} else if (i >= parts_max_num && now_mode == 'confView'){
				$('.'+class_nm+' tbody tr[rel='+i+']').addClass('hideList');
			}
		}
	}
	
	if (parts_max_line <= parts_max_num){
		$('.'+class_nm+'Add').hide();
	}
}

$(document).ready(directionsClass.init);
