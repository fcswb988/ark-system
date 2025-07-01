
var outScClass = {
saving : false,

init : function(){

	//明細
	if($('#outSc').length){
		$('#outSc').on('click', '.addRow', function() {outScClass.addRow($(this), false)});

		$('#outSc').on('click', '.selRowAll', function() {outScClass.toggleChkAll($(this))});
		$('#outSc').on('click', '.delSelRow', function() {outScClass.delSelRow($(this))});

		$('.outscList').on('click', '.canRow', function() {
			var tr = $(this).closest("tr");
			tr.remove();
		});

		$('.outscList').on('click', '.saveRow', function() {
			outScClass.saveRow($(this));
		});

		$('.outscList').on('click', '.updateRow', function() {
			outScClass.saveRow($(this));
		});

		$('.outscList').on('click', '.copyRow', function() {
			outScClass.copyRow($(this));
		});

		$('.outscList').on('click', '.delRow', function() {
			outScClass.delRow($(this));
		});

		$('.outscList').on('change', 'input:text, select', function() {
			outScClass.saveRow($(this));
		});

		$('#outSc tbody').sortable({
			stop: function(){
				outScClass.sortRow($(this),0);
			}
		});

		outScClass.calcTotal($('#outSc'));
	}
},

/*
// その他請求ヘッダ 更新
updOthBilling : function (obj, colmun) {
	var tr = obj.closest('tr');
	var wcm_seq = tr.find('.wcm_seq').val();
	var month = tr.find('.bill_month').val();
	var value = obj.val();
	var parm = {md: 'upd_bill_month', column:{wbm_wcmseq: wcm_seq, wbm_month:month, [colmun]: value}};
	$.post('./', parm, function(res) {
		calcBillTotal(tr);
	}, 'html');
},
*/

//明細行追加
addRow : function (obj, isSave) {
	var tbody = obj.closest('#outSc').find('tbody');
	var rowCount = tbody.children('tr').length + 1;

	var tr = $('<tr></tr>');
	tr.html(`
		<td>
			<input class="selRow" type="checkbox" >
			<input type="hidden" class="rowNo" name="rowNo" value="${rowCount}" >
		</td>
		<td class="aL">
			<input type="text" name="wol_title" class="imeon" style="width:95%">
		</td>
		<td class="company aL">
			　その他 <input type="text" name="wol_outsc" style="width:40%">
		</td>
		<td class="aR">
			<input type="text" name="wol_days" class=" txtsize5 imeoff aR">
		</td>
		<td class="aR">
			<input type="text" name="wol_price" value="" class=" txtsize10 imeoff aR">
		</td>
		<td class="saveArea">
			<input type="hidden" name="wol_seq" >
			<button class="button buttonMini buttonBlue saveRow" >保存</button>
			<button class="button buttonMini buttonGray ml10 canRow">キャンセル</button>
		</td>
	`);
	var selbox = $('#company_template').find('[name=sel_wol_wcpseq]');
	tr.find('.company').prepend(selbox.clone());
	tbody.append(tr);
	if(isSave){
		outScClass.saveRow(tr.find('.saveRow'));
	}
	tr.find('[name=wol_title]').focus();
},
//チェックボックス一括設定
toggleChkAll : function(obj){
	var table = obj.closest('table');
	var trs = table.find('tbody tr');
	var checked = obj.prop("checked");
	$.each(trs, function(){
		var chk = $(this).find('.selRow').prop("checked", checked);
	});
},
//選択行削除
delSelRow : function (obj) {
	var sortStart = 0;
	var params=[];
	var delTrs=[];
	var table = obj.closest('div').find('table');
	$.each(table.find('tbody tr'), function(){
		var tr = $(this);
		if(tr.find('.selRow').prop("checked")) {
			var seq = tr.find('[name=wol_seq]').val();
			params.push({md: 'upd_w_outsc_list', column:{wol_seq: seq, wol_delfg: 1}});
			delTrs.push(tr);
			sortStart = sortStart == 0? tr.index() : sortStart;
//			tr.remove();
		}
	});
	if(delTrs.length){
		if(!confirm('選択行を削除します。よろしいですか？')) return;
	} else {
		alert('行が選択されていません。');
		return;
	}
	var done = false;
	$.each(params, function(index,param) {
		$.post('./condition.php', param, function(res){
			if (res.status) {
				delTrs[index].remove();
				if(index == params.length-1){
					done = true;
				}
			}
		}, 'json');
	});
	const timerId = setTimeout( () => {
		if(done){
			outScClass.calcTotal(table.closest('div #outSc'));
			clearTimeout(timerId)
		}
	},100);

return false;
},

//行保存
saveRow : function (obj) {
	var tr = obj.closest('tr');
	var div = obj.closest('div #outSc');
	var tbody = obj.closest('tbody');
	var saveRow = tr.find('.saveRow');
	saveRow.click(function () {
//        alert('連続クリックは禁止しています。');
        return false;
    });
	var wdc_seq = $('[name=wdc_seq]').val();
	var seq = tr.find('[name=wol_seq]').val();
	var title = tr.find('[name=wol_title]').val();
	var wcpseq = tr.find('[name=sel_wol_wcpseq]').val() * 1;
	var outsc = tr.find('[name=wol_outsc]').val();
	var price = toNum(tr.find('[name=wol_price]').val());
	var sort = toNum(tr.find('.rowNo').val()) * 10;
	var md = seq? 'upd_w_outsc_list': 'ins_w_outsc_list';
	var param = {md: md, column:{wol_seq: seq, wol_wdcseq: wdc_seq, wol_title: title, wol_wcpseq: wcpseq, wol_outsc: outsc, wol_price: price, wol_sort: sort},};
	$.post('./condition.php', param, function(res){
		if (res.status) {
			if(tr.find('.saveArea').size()){
				tr.find('.saveArea').remove();
				tr.append(`
					<td>
						<input type="hidden" name="wol_seq" value="${res.seq}">
						<a class="button buttonMini updateRow" href="javascript:;" style="display:none">保存</a>
						<a class="button buttonMini copyRow" href="javascript:;">複製</a>
						<a class="button buttonMini delRow" href="javascript:;">削除</a></td>
				`)
			}
			outScClass.calcTotal(div);
			if(!seq){
				outScClass.sortRow(tbody, tr.index());
			}
		} else {
			alert(seq? '更新失敗！！': '追加失敗！！');
		}
		outScClass.saving = false;
	}, 'json');
},

// 行複製
copyRow : function (obj) {
	var tr = obj.closest("tr");
	var tbody = obj.closest('tbody');

	var new_tr = tr.clone();
	new_tr.find('[name=wol_seq]').val(null);
	var unit = tr.find('[name=sel_wol_wcpseq]').val();
	new_tr.find('[name=sel_wol_wcpseq]').val(unit);
	new_tr.find('.rowNo').text(toNum(tr.find('.rowNo').text())+1);
	tr.after(new_tr);
	outScClass.saveRow(new_tr.find('.updateRow'));
},

// 行削除
delRow : function (obj) {
	if(!confirm('行を削除します。よろしいですか？')) return;
	var tr = obj.closest("tr");
	var tbody = obj.closest('tbody');
	var seq = tr.find('[name=wol_seq]').val();
	var sortStart = tr.index();
	tr.remove();
	var param = {md: 'upd_w_outsc_list', column:{wol_seq: seq, wol_delfg: 1}};
	$.post('./condition.php', param, function(res){
		if (res.status) {
//			sortRow(sortStart);
			outScClass.calcTotal(tbody.closest('div #outSc'));
		}
	}, 'json');
},

// 行ソート
sortRow : function (obj, start) {
	var upd_rows = [];
	$.each(obj.children('tr'), function(index,val){
		if(index >= start){
			$(this).find('.rowNo').text(index + 1);
			upd_rows.push([toNum($(this).find('[name=wol_seq]').val()), toNum($(this).find('.rowNo').text())*10]);
		}
	});
	if(upd_rows.length == 0) return;

	var param = {md:'sort_w_outsc_list', upd_rows: JSON.stringify(upd_rows)};

	$.post('./condition.php', param, function(res){
		if (res.status) {
			;
		}
	}, 'json');

},

// 合計計算
calcTotal : function(obj) {
	var tbody = obj.find('tbody');
	var div = obj;
	var sum_price = 0;
	var sum_days = 0;

	if(tbody.length){
		$.each(tbody.children('tr'), function(index,val){
			sum_days += toNum($(this).find('[name=wol_days]').val());
			sum_price += toNum($(this).find('[name=wol_price]').val());
		});
	}
	div.find('.outscListSum').text(sum_days + "");
	div.find('.outscPriceSum').text(sum_price.format() + "");
},

}

$(document).ready(outScClass.init);

