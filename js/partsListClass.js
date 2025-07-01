var partsListClass = {};

//const PRINTED = ' ✓';

partsListClass.init = function(){

	$('.partAdd').on('click', function() {partsListClass.addRow({}, false)});
	$('#partsSelectAll').on('click', function() {toggleChkAll($(this))});
	$('#partsDelSelect').on('click', function() {partsListClass.partsDelSelRow()});

	$tbodyParts = $('#tbodyPartsList');
	$tbodyParts.on('click', '.canRow', function() {
		var tr = $(this).closest("tr");
		tr.remove();
	});
	$('#tbodyPartsList').sortable({
		stop: function(){
			partsListClass.sortRow(0);
		}
	});

	$tbodyParts.on('click', '.updatePartsList', function() { partsListClass.saveRow($(this)); });
	$tbodyParts.on('click', '.copyPartsList', function() { partsListClass.copyRow($(this)); });
	$tbodyParts.on('click', '.delPartsList', function() { partsListClass.delRow($(this)); });

	$tbodyParts.on('change', 'input[name="txt_wpl_date"]', function() { partsListClass.saveRow($(this)); });
	$tbodyParts.on('change', 'input[name="txt_wpl_number"]', function() { partsListClass.getParts($(this)); });
	$tbodyParts.on('change', 'select[name="wpl_company_seq"]', function() { partsListClass.saveRow($(this)); });
	$tbodyParts.on('change', 'input[name="txt_wpl_name"]', function() { partsListClass.saveRow($(this)); });
	$tbodyParts.on('change', 'input[name="txt_wpl_days"]', function() { partsListClass.saveRow($(this)); });
	$tbodyParts.on('change', 'select[name="wpl_purchaser_type"]', function() { partsListClass.saveRow($(this)); });
	$tbodyParts.on('change', 'select[name="wpl_required_proc"]', function() { partsListClass.saveRow($(this)); });
	$tbodyParts.on('change', 'input[name="txt_wpl_amount"]', function() { partsListClass.saveRow($(this)); });
	$tbodyParts.on('change', 'input[name="txt_wpl_base_price"]', function() { partsListClass.saveRow($(this)); });
	$tbodyParts.on('change', 'input[name="txt_wpl_price"]', function() { partsListClass.saveRow($(this)); });

	partsListClass.calcTotalPartList();

}

//明細行追加
partsListClass.addRow = function (column, isSave) {
	var tbody = $('#tbodyPartsList');
	var rowCount = tbody.children().length + 1;

	var today = new Date();
	var defaultValue = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var indexCalendar = tbody.size() + 100000

	var tr = $('<tr class="openData"></tr>');
	tr.html(`
		<td><input class="sel_row" name="partsSelect" type="checkbox" >
			<input type="hidden" class="rowNo" name="rowNo" value="${rowCount}" >
		</td>
		<td class="td_purchaser_type">
		</td>
		<td class="td_company_seq">
		</td>
		<td>
			<div  style="display: flex; align-items:center">
			<input type="text" name="txt_wpl_date" value="${defaultValue}" class="datePicker">
			</div>
		</td>
		<td class="wpl-number">
			<input type="text" name="txt_wpl_number" value="" class="txtsize30 imeoff">
		</td>
		<td class="wpl-name">
			<input type="text" name="txt_wpl_name" value="" class=" txtsize70 imeon">
		</td>
		<td>
			<input type="text" name="txt_wpl_days" value="" class=" txtsize5 imeoff aR">
		</td>
		<td class="td_required_proc">
		</td>
		<td class="aR">
			<input type="text" name="txt_wpl_amount" value="" class=" txtsize5 imeoff aR">
		</td>
		<td class="aR">
			<input type="text" name="txt_wpl_base_price" value="" class=" txtsize10 imeoff aR">
		</td>
		<td class="aR">
			<input type="text" name="txt_wpl_price" value="" class=" txtsize10 imeoff aR">
		</td>
		<td class="sumBasePrice aR"></td>
		<td class="sumPrice aR"></td>
		<td class="saveArea">
			<button class="button buttonMini buttonBlue updatePartsList" >保存</button>　
			<button class="button buttonMini buttonGray ml10 canRow">キャンセル</button>
		</td>
	`);
	tr.find('[name=txt_wpl_date]').removeClass('hasDatepicker').datepicker({
		buttonImage: "/img/calendar.png",
		buttonImageOnly: true,
		showOn : "button",
		dateFormat: 'yy-mm-dd',
	});
	var selbox = $('#template_parts').find('[name=wpl_company_seq]');
	tr.find('.td_company_seq').append(selbox.clone());
	var selbox = $('#template_parts').find('[name=wpl_required_proc]');
	tr.find('.td_required_proc').append(selbox.clone());
	var selbox = $('#template_parts').find('[name=wpl_purchaser_type]');
	tr.find('.td_purchaser_type').append(selbox.clone());
	if(tbody.children().length){
		prevTr = tbody.children().last("tr");
		tr.find('[name=txt_wpl_date]').val(prevTr.find('[name=txt_wpl_date]').val());
		tr.find('[name=wpl_purchaser_type]').val(prevTr.find('[name=wpl_purchaser_type]').val());
		tr.find('[name=wpl_company_seq]').val(prevTr.find('[name=wpl_company_seq]').val());
	}
	tbody.append(tr);
	if(isSave){
		partsListClass.saveRow(tr.find('.updatePartsList'));
	}
	tr.find('[name=txt_wpl_number]').focus();
}

//行保存
partsListClass.saveRow = function (obj) {
	var tr = obj.closest('tr');
	var saveRow = tr.find('.updatePartsList');
	saveRow.click(function () {
//        alert('連続クリックは禁止しています。');
        return false;
    });
	var wdc_seq = $('[name=wdc_seq]').val();
	var seq = tr.find('[name=wpl_seq]').val();
	var date = tr.find('[name=txt_wpl_date]').val();
	var number = tr.find('[name=txt_wpl_number]').val();
	var name = tr.find('[name=txt_wpl_name]').val();
	var days = tr.find('[name=txt_wpl_days]').val() * 1;
	var company_seq = tr.find('[name=wpl_company_seq]').val() * 1;
	var required_proc = tr.find('[name=wpl_required_proc]').val() * 1;
	var purchaser_type = tr.find('[name=wpl_purchaser_type]').val() * 1;
	var amount = toNum(tr.find('[name=txt_wpl_amount]').val());
	var base_price = toNum(tr.find('[name=txt_wpl_base_price]').val());
	var price = toNum(tr.find('[name=txt_wpl_price]').val());
	var sort = toNum(tr.find('.rowNo').val()) * 10;
	var md = seq? 'upd_parts': 'ins_parts';
	var param = {md: md, column:{wpl_wdcseq: wdc_seq, wpl_seq: seq, wpl_date: date, wpl_company_seq:company_seq
		, wpl_number: number, wpl_name: name, wpl_days: days, wpl_purchaser_type: purchaser_type, wpl_required_proc: required_proc, wpl_amount: amount, wpl_base_price: base_price, wpl_price: price, wpl_sort: sort, wpl_is_open: 1},};
	$.post('./condition.php', param, function(res){
		if (res.status) {
			if(tr.find('.saveArea').size()){
				tr.find('.saveArea').remove();
				tr.append(`
					<td>
						<a class="button buttonMini updatePartsList" href="javascript:;">保存</a>　
						<input type="hidden" name="wpl_seq" value="${res.seq}">
						<a class="button buttonMini copyPartsList" href="javascript:;">複製</a>
						<a class="button buttonMini ml10 delPartsList" href="javascript:;">削除</a></td>
				`)
			}
			if(!seq){
				tr.find('[name=wpl_seq]').val(res.seq);
				partsListClass.sortRow(tr.index()+1);
			}
			partsListClass.calcTotalPartList(tr);
		} else {
			alert(seq? '更新失敗！！': '追加失敗！！');
		}
	}, 'json');

}

// 行複製
partsListClass.copyRow = function (obj) {
	var tr = obj.closest("tr");
	var tbody = $('#tbodyPartsList');

	var new_tr = tr.clone();
	new_tr.find('[name=wpl_seq]').val(null);
	new_tr.find('.rowNo').text(toNum(tr.find('.rowNo').text())+1);
	new_tr.find('[name=wpl_company_seq]').val(tr.find('[name=wpl_company_seq]').val());
	new_tr.find('[name=wpl_purchaser_type]').val(tr.find('[name=wpl_purchaser_type]').val());
	new_tr.find('[name=wpl_required_proc]').val(tr.find('[name=wpl_required_proc]').val());
	tr.after(new_tr);
	partsListClass.saveRow(new_tr.find('.updatePartsList'));
}

// 行削除
partsListClass.delRow = function (obj) {
	if(!confirm('行を削除します。よろしいですか？')) return;
	var tr = obj.closest("tr");
	var seq = tr.find('[name=wpl_seq]').val();
	var sortStart = tr.index();
	tr.remove();
	var param = {md: 'upd_parts', column:{wpl_seq: seq, wpl_delfg: 1}};
	$.post('./condition.php', param, function(res){
		if (res.status) {
			partsListClass.sortRow(sortStart);
			partsListClass.calcTotalPartList();
		}
	}, 'json');
}

// 行ソート
partsListClass.sortRow = function (start) {
	var upd_rows = [];
	$.each($('#tbodyPartsList tr'), function(index,val){
		if(index >= start){
			$(this).find('.rowNo').text(index + 1);
			upd_rows.push([toNum($(this).find('[name=wpl_seq]').val()), toNum($(this).find('.rowNo').text())*10]);
		}
	});
	if(upd_rows.length == 0) return;

	var param = {md:'upd_parts_sort', upd_rows: JSON.stringify(upd_rows)};

	$.post('./condition.php', param, function(res){
		if (res.status) {
			;
		}
	}, 'json');

}

// 品番から既存品番より品名当取得＆保存
partsListClass.getParts = function(obj){
	var tr = obj.closest('tr');
	var wpl_number = obj.val();
	var dataInput = {md: 'get_parts', wpl_number: wpl_number};
	$.post('./condition.php', dataInput, null, "json")
	.done(function(res) {
		if (res.status) {
			tr.find('[name=txt_wpl_name]').val(res.wpl_name);
			tr.find('[name=txt_wpl_price]').val(res.wpl_price);
			tr.find('[name=txt_wpl_base_price]').val(res.wpl_base_price);
		}
		partsListClass.saveRow(obj);
	});
}

// 合計計算
partsListClass.calcTotalPartList = function () {
	let $rowTotal = $('.partsList tfoot tr');
	var companySum = {1:{},2:{}};
	var purchaser_types ={1:"自社",2:"他社"}
	let totalDays = 0, totalAmount = 0, totalBasePrice = 0, totalPrice = 0;
	$('#tbodyPartsList tr').map(function () {
		let $this = $(this);
		let $inputAmount = $this.find('[name=txt_wpl_amount]');
		let $inputPrice = $this.find('[name=txt_wpl_price]');
		let $inputBasePrice = $this.find('[name=txt_wpl_base_price]');
		let $inputDay = $this.find('[name=txt_wpl_days]');
		totalDays += toNum($inputDay.val());
		totalAmount += toNum($inputAmount.val());
		totalBasePrice += toNum($inputBasePrice.val())* $inputAmount.val();
		totalPrice += toNum($inputPrice.val()) * $inputAmount.val();
		$this.find('.sumBasePrice').text((toNum($inputBasePrice.val())* $inputAmount.val()).format());
		$this.find('.sumPrice').text((toNum($inputPrice.val())* $inputAmount.val()).format());
		$inputDay.val(($inputDay.val() || '').format());
		$inputBasePrice.val(($inputBasePrice.val() || '').format());
		$inputPrice.val(($inputPrice.val() || '').format());

		com_name = $this.find('[name=wpl_company_seq] option:selected').text();
		purchaser = $this.find('[name=wpl_purchaser_type] option:selected').val();
//		$.each([1,2], function(index,value){
			if (com_name in companySum[purchaser]) {
				companySum[purchaser][com_name] += toNum($inputBasePrice.val()) * toNum($inputAmount.val());
			} else {
				companySum[purchaser][com_name] = toNum($inputBasePrice.val()) * toNum($inputAmount.val());
			}
//		});
	});
	//$rowTotal.find('.partsListSum').text(totalDays.format());
	$rowTotal.find('.partsAmountSum').text(totalAmount.format());
	$rowTotal.find('.partsBasePriceSum').text(totalBasePrice.format());
	$rowTotal.find('.partsPriceSum').text(totalPrice.format());
	var $w_text='';
	$.each([1,2], function(index,value){
		if(!$.isEmptyObject(companySum[value])){
			var purchaser_sum = 0;
			$w_text += '<div>'+purchaser_types[value]+'</div><table class="noborder" style="width:45%;display: table-cell;background-color: transparent;margin-left:10px;">';
			$.each(companySum[value], function(name, value) {
				if(value>0){
					$w_text += '<tr><td class="noborder aL" style="width:70%;">' + name
					 + '</td><td class="noborder aR">' + value.format() + ' 円' + '</td></tr>';
					purchaser_sum += value;
				}
			});
			$w_text += '<tr><th class="noborder aR">計' + name
			 + '</th><th class="noborder aR">' + purchaser_sum.format() + ' 円' + '</th></tr>'
			$w_text += '</table>';
		}
	});
	$rowTotal.find('.companySum').html($w_text);
}

// 選択行削除
partsListClass.partsDelSelRow = function (obj) {
	var sortStart = 0;
	var params=[];
	var trs=[];
	$.each($('#tbodyPartsList tr'), function(){
		var tr = $(this);
		if(tr.find('.sel_row').prop("checked")) {
			var seq = tr.find('[name=wpl_seq]').val();
			params.push({md: 'upd_parts', column:{wpl_seq: seq, wpl_delfg: 1}});
			trs.push(tr);
			sortStart = sortStart == 0? tr.index() : sortStart;
			tr.remove();
		}
	});
	if(trs.length){
		if(!confirm('選択行を削除します。よろしいですか？')) return;
	} else {
		alert('行が選択されていません。');
		return;
	}
//	var promise = $.when(
	var done = false;
	$.each(params, function(index,param) {
//		var defer = $.Deferred();
		$.post('./condition.php', param, function(res){
			if (res.status) {
				trs[index].remove();
				if(index == params.length-1){
					done = true;
				}
//				defer.resolve();
			}
		}, 'json');
	});
//	return defer.resolve();
//	)
//	promise.done(function() {
	const timerId = setInterval(function(){
		if(done){
			partsListClass.sortRow(sortStart);
			partsListClass.calcTotalPartList();
			clearInterval(timerId)
		}
	},100);
//	});

return false;

}
const partsDelSelRowSub = function (obj) {
	var defer = $.Deferred();
	var sortStart = 0;
	$.each($('#tbodyPartsList tr'), function(){
		var tr = $(this);
		if(tr.find('.sel_row').prop("checked")) {
			var seq = tr.find('[name=wpl_seq]').val();
			var param = {md: 'upd_parts', column:{wpl_seq: seq, wpl_delfg: 1}};
			$.post('./condition.php', param, function(res){
				if (res.status) {
					sortStart = sortStart == 0? tr.index() : sortStart;
					tr.remove();
				}
			}, 'json');
		}
	});
	return defer.resolve();
}


// チェックボックス一括設定
const toggleChkAll = function(obj){
	var table = obj.closest('table');
	var trs = table.find('tbody tr');
	var checked = obj.prop("checked");
	$.each(trs, function(){
		var chk = $(this).find('.sel_row').prop("checked", checked);
	});
}

$(document).ready(function()
{
	if(window.sessionStorage.getItem(['back'])){
		window.history.back();
		window.sessionStorage.removeItem(['back']);
	}
	if(window.sessionStorage.getItem(['t_scroll_pos']) && $('.scrollTbody').length){
		window.onload = function (){
			$(window).scrollTop(window.sessionStorage.getItem(['w_scroll_pos']));
			$('.scrollTbody').scrollTop(window.sessionStorage.getItem(['t_scroll_pos']));
			window.sessionStorage.removeItem(['t_scroll_pos']);
		}
	}
});

$(document).ready(partsListClass.init);
