
var invoiceClass = {};

const PRINTED = ' ✓';

invoiceClass.init = function(){

	$('#sk_month').on('change', function(){
		var str_date_from = $('#sk_month').val();
		$('[name=sk_date_from]').val(str_date_from);
		var date = new Date(str_date_from);
		var date_to = new Date(date.getFullYear(), date.getMonth()+1, 0);
		$('[name=sk_date_to]').val(date_to.getFullYear()+'-'+(date_to.getMonth()+1)+'-'+date_to.getDate());

	});

	//一覧
	if($('#tableInvoice').length){

		$('.bill').on('click', outBill);

		$('.bill_sum').on('click', outBillSum);

		$('.estimate, .delivery').on('click', function(){
			var $obj= $(this);
			var stat = $obj.text().indexOf(PRINTED);

			if (stat == -1){
				$obj.text($obj.text() + PRINTED);
			}
		});

		$('.deposited').on('change', function(){
			var $obj= $(this);
			var tr = $obj.closest('tr');
			var seq = tr.attr('id');
//			var checked = $obj.prop("checked");
			var value = $obj.prop("value");

//			var dataInput = {md: 'upd_printed', wdc_seq: seq, column: 'wdc_deposited', stat: $obj.prop("checked")?"on":"off"};
			var param = {md:'upd_direction', column:{wdc_seq: seq, wdc_deposited: value}};
			$.post('/invoice/detail.php', param, function(res) {
				res = JSON.parse(res);
				if (res.status) {
//					$obj.prop('checked',checked);
				}
			}, 'html');
			return false;
		});
	}

	//明細
	if($('#tableBillList').length){
		$('.billing_date').on('change', function(){
			var $obj= $(this);
			var wdc_seq = $('#wdc_seq').val();
			var value = $obj.prop("value");

			var param = {md:'upd_direction', column:{wdc_seq: wdc_seq, wdc_billing_date: value}};
			$.post('/invoice/detail.php', param, function(res) {
				res = JSON.parse(res);
				if (res.status) {
//					$obj.prop('checked',checked);
				}
			}, 'html');
			return false;
		});

		$('#addRow').on('click', function() {addRow({}, false)});

		$('.add_inspection_24').on('click', function() {addInspection('invoice',0)});
		$('.add_inspection_12').on('click', function() {addInspection('invoice',1)});

		$('.copy_all_detail').on('click', function() {copyAllDetail()});
		$('.copy_detail').on('click', function() {copyDetail($(this))});

		$(document).on('click', '.canRow', function() {
			var tr = $(this).closest("tr");
			tr.remove();
		});

		$(document).on('click', '.saveRow', function() {
			saveRow($(this));
		});

		$(document).on('click', '.updateRow', function() {
			saveRow($(this));
		});

		$(document).on('click', '.copyRow', function() {
			copyRow($(this));
		});

		$(document).on('click', '.delRow', function() {
			delRow($(this));
		});

		$('#tbodyBillList').on('change', 'input, select', function() {
			saveRow($(this));
		});

		$('#tbodyBillList').sortable({
			stop: function(){
				sortRow(0);
			}
		});

		$('#inc_taxfg').on('click', function() {
			updIncTax($(this));
		});

		$('.billDeductible').on('click', outBillDeductible);

		$('#disp_parts').on('click', function() {
			if($('#tbodyPartsList').is(':visible')){
				$('#tbodyPartsList').hide();
				$(this).text("＋");
			} else {
				$('#tbodyPartsList').show();
				$(this).text("－");
			}
		});
		$('#tbodyPartsList').hide();

		$('#chkAdjTotal').on('click', function() {
			toggleAdjTotal($(this).prop("checked"));
		});
		$('#divAdj').hide();

		$(document).on('change', '#adjAfterAmount', function() {
			if(!$.isNumeric($(this).val())) return;
			calcAdjAmount($(this));
		});

		$(document).on('click', '.adjustTotal', function() {
			addRow({title: '調整値引き', w_price: $('#adjAmount').text()}, true);
			toggleAdjTotal(false);
			$('#chkAdjTotal').prop("checked", false);
		});

		calcTotal();
		$('#mainBox').height($('div.left').height());
	}

	// condition画面 にbill明細出すとき
	if($('#tableWorkSubList').length){
		$('.copy_all_detail').on('click', function() {copyAllDetailWork()});
		$('.copy_detail').on('click', function() {copyDetailWork($(this))});
	}

	// 作業詳細画面の車検・点検項目ボタン
	if($('.workListAdd').length){
		$('.add_inspection_24').on('click', function() {addInspection('work',0)});
		$('.add_inspection_12').on('click', function() {addInspection('work',1)});
	}

	$('#tableExpenses, #tableDeductible').on('change', 'input', function() {
		saveExpenses($(this));
	});

}

// 一覧 請求書　クリック時
const outBill = function () {
	var $obj= $(this);
	var stat = $obj.text().indexOf(PRINTED);
	var tr = $obj.closest('tr');
	var seq = tr.attr('id');

	if (stat >= 0){
		if (window.confirm('請求書出力を取り消しますか？')){
			var dataInput = {md: 'upd_printed', wdc_seq: seq, column: 'wdc_bill_printed', stat:'off'};
			$.post('./', dataInput, function(res) {
				res = JSON.parse(res);
				if (res.status) {
					$obj.removeClass('buttonGray');
					$obj.addClass('buttonGreen');
					$obj.text($obj.text().replace(PRINTED,''));
					$hfef = '/repair/print.php?wdc_seq='+seq+'&md=bill';
					$obj.attr('href',$hfef);
				}
			}, 'html');
		}
		return false;
	} else {
		var dataInput = {md: 'dummy', wdc_seq: seq};
		$.post('/repair/print.php', dataInput, function(res) {
			$obj.removeClass('buttonGreen');
			$obj.addClass('buttonGray');
			$obj.text($obj.text() + PRINTED);
			$obj.attr('href','#');
		}, 'html');
	}
}

// 一覧 合計請求書　クリック時
const outBillSum = function () {
	var $obj= $(this);
	var stat = $obj.text().indexOf(PRINTED);

	if (stat >= 0){
		if (window.confirm('合計請求書出力を取り消しますか？')){
			var seq = $obj.attr('id');
			var from = $('input[name="sk_date_from"]').val();
			var to = $('input[name="sk_date_to"]').val();
			var dataInput = {md: 'upd_sum_printed', wcm_seq: seq, from: from, to: to, column: 'wdc_bill_sum_printed', stat:'off'};
			$.post('./', dataInput, function(res) {
				res = JSON.parse(res);
				if (res.status) {
					$obj.removeClass('buttonGray');
					$obj.addClass('buttonGreen');
					$obj.text($obj.text().replace(PRINTED,''));
					$hfef = '/repair/print.php?wcm_seq='+seq+'&date_from='+from+'&date_to='+to+'&md=bill_sum';
					$obj.attr('href',$hfef);
				}
			}, 'html');
		}
		return false;
	} else {
		var dataInput = {md: 'dummy', wdc_seq: seq};
		$.post('/repair/print.php', dataInput, function(res) {
			$obj.removeClass('buttonGreen');
			$obj.addClass('buttonGray');
			$obj.text($obj.text() + PRINTED);
			$obj.attr('href','#');
		}, 'html');
	}
}

//詳細 免責請求書　クリック時
const outBillDeductible = function () {
	var $obj= $(this);
	var stat = $obj.text().indexOf(PRINTED);
	var wdc_seq = $('#wdc_seq').val();

	if (stat >= 0){
		if (window.confirm('免責請求書出力を取り消しますか？')){
			var md = 'upd_direction';
			var param = {md: md, column:{wdc_seq: wdc_seq, wdc_deductible_rcfg: 0}};
			$.post('/invoice/detail.php', param, function(res){
				if (res.status) {
					$obj.removeClass('buttonGray');
					$obj.addClass('buttonGreen');
					$obj.text($obj.text().replace(PRINTED,''));
					$hfef = '/repair/print.php?wdc_seq='+wdc_seq+'&md=billDeductible';
					$obj.attr('href',$hfef);
				}
			}, 'json');
		}
		return false;
	} else {
		var dataInput = {md: 'dummy', wdc_seq: wdc_seq};
		$.post('/repair/print.php', dataInput, function(res) {
			$obj.removeClass('buttonGreen');
			$obj.addClass('buttonGray');
			$obj.text($obj.text() + PRINTED);
			$obj.attr('href','#');
		}, 'html');

		var md = 'upd_direction';
		var param = {md: md, column:{wdc_seq: wdc_seq, wdc_deductible_rcfg: 1}};
		$.post('/invoice/detail.php', param, function(res){
		}, 'json');
	}
}

//車検・点検明細行追加
const addInspection = function (mode, type) {
	var arr = [["車検受け整備一式及び２４ヶ月定期点検", "　前後ブレーキ点検・清掃・調整", "　動力伝達装置点検",
		"　ステアリング装置　点検・調整", "　サスペンション　点検", "　エンジン及び電気系統　点検・調整", "　下回り　各部点検",
		"　洗浄（エンジン・下回り）スチーム洗車", "保安確認検査（光軸調整・排気ガス測定）"],
		["法定１２ヶ月点検", "　エンジンルーム内点検", "　室内点検", "　足回り点検", "　下回り点検", "　外回り点検", "　日常点検", "保安確認総合検査料"]
	];
	var self = $(this)

	$.each(arr[type], function( index, value ) {
		if(mode == 'invoice'){
			addRow({title: value}, true);
		} else {
			addWorkRow(value, true);
		}
	});

}

//作業から明細行追加
const copyDetail = function (obj) {
	var tr = obj.closest('tr');
	var title = tr.find('.wwl_title').text();
	addRow({title: title}, true);

}

//作業から全明細行追加
const copyAllDetail = function () {
	var upd_rows = [];
	$.each($('#tbodyWorkList tr .wwl_title'), function(index,val){
		addRow({title: val.getInnerHTML()}, true);
	});
}

//明細行追加
const addRow = function (column, isSave) {
	var tbody = $('#tbodyBillList');
	var rowCount = tbody.children().length + 1;
//	for (key in column){
//    	eval("var " + key + "= '" + column[key] + "';");
//	}
	var title = column.title? column.title : '';
	var w_price = column.w_price? column.w_price : '';

	var tr = $('<tr class="openData"></tr>');
	tr.html(`
		<td class="rowNo aR">${rowCount}</td>
		<td class="aL">
			<input type="text" name="txt_wbl_title" value="${title}" class="txtsize70 imeon">
		</td>
		<td class="aR">
			<input type="text" name="txt_wbl_amount" value="" class="txtsize10 imeon aR">
		</td>
		<td class="unit">
		</td>
		<td class="unit-price aR">
			<input type="text" name="txt_wbl_u_price" value="" class=" txtsize15 imeoff aR">
		</td>
		<td class="part-generation aR">
			<input type="text" name="txt_wbl_p_price" value="" class=" txtsize15 imeoff aR">
		</td>
		<td class="technical-fee aR">
			<input type="text" name="txt_wbl_w_price" value="${w_price}" class=" txtsize15 imeoff aR">
		</td>
		<td class="workLineSum aR"></td>
		<td class="nontax-expence aR">
			<input type="text" name="txt_wbl_non_tax" value="" class=" txtsize15 imeoff aR">
		</td>
		<td class="saveArea">
			<button class="button buttonMini buttonBlue saveRow" >保存</button>
			<button class="button buttonMini buttonGray ml10 canRow">キャンセル</button>
		</td>
	`);
//	tr.find('.rowNo').text(rowCount);
	var selbox = $('#template').find('[name=sel_wbl_unit]');
	tr.find('.unit').append(selbox.clone());
	tbody.append(tr);
	if(isSave){
		saveRow(tr.find('.saveRow'));
	}
	$('#mainBox').css({'height': 'fit-content'});
	$('#mainBox').height($('div.left').height());
}

//見積明細から作業行追加
const copyDetailWork = function (obj) {
	var tr = obj.closest('tr');
	var title = tr.find('.wbl_title').text();
	addWorkRow(title, true);

}

//見積明細から全作業行追加
const copyAllDetailWork = function () {
	var upd_rows = [];
	$.each($('#tbodyWorkSubList tr .wbl_title'), function(index,val){
		addWorkRow(val.getInnerHTML(), true);
	});
}

//作業内容追加
const addWorkRow = function (title, isSave) {
	var tbody = $('table .tbodyWorkListAdd');
	var wdc_seq = $('input[name=wdc_seq]').val();
	var tr = $('<tr class="openData"></tr>');
	tr.html(`
		<td class="work-content aR">
		<div style="display: flex;align-items: center">
			<input type="checkbox" name="wwl_is_open" value="1" class="worksViewSelect" style="margin-right: 11px;" checked="checked">
			<input type="text" name="txt_wwl_title" value="${title}" id="input_wwl_title" class=" txtsize70 imeon">
		</div>
		</td>
		<td class="saveArea" colspan="3"><button class="button buttonMini buttonBlue createWorkList">保存</button><button class="button buttonMini buttonGray ml10 delTr">キャンセル</button>
			<form action="/flex/final.php" method="post" enctype="multipart/form-data" class="hidden">
				<input type="hidden" name="seq" value="21"><input type="hidden" name="md" value="insert">
				<input type="hidden" name="main_seq" value="0"><input type="hidden" name="sub_seq" value="${wdc_seq}">
				<input type="hidden" name="view_sys" value="iframe">
			</form>
		</td>
	`);
	var selbox = $('#template').find('[name=wwl_unit]');
	tr.find('.unit').append(selbox.clone());
	tbody.append(tr);
	if(isSave){
		directEditClass.storeNewWork(tr);
	}
}


//行保存
const saveRow = function (obj) {
	calcRow(obj);
	var tr = obj.closest('tr');
	var saveRow = tr.find('.saveRow');
	saveRow.click(function () {
//        alert('連続クリックは禁止しています。');
        return false;
    });
	var wdc_seq = $('#wdc_seq').val();
	var src = $('#src').val();
	var seq = tr.find('[name=seq]').val();
	var title = tr.find('[name=txt_wbl_title]').val();
	var amount = toNum(tr.find('[name=txt_wbl_amount]').val());
	var unit = tr.find('[name=sel_wbl_unit]').val() * 1;
	var u_price = toNum(tr.find('[name=txt_wbl_u_price]').val());
	var p_price = toNum(tr.find('[name=txt_wbl_p_price]').val());
	var w_price = toNum(tr.find('[name=txt_wbl_w_price]').val());
	var w_nontax = toNum(tr.find('[name=txt_wbl_non_tax]').val());
	var sort = toNum(tr.find('.rowNo').text()) * 10;
	var md = seq? 'upd_billing': 'ins_billing';
	var param = {md: md, src: src, column:{wbl_wdcseq: wdc_seq, wbl_seq: seq, wbl_title: title, wbl_amount: amount, wbl_unit: unit, wbl_u_price: u_price, wbl_p_price: p_price, wbl_w_price: w_price, wbl_non_tax: w_nontax, wbl_sort: sort, wbl_is_open: 1},};
	$.post('./detail.php', param, function(res){
		if (res.status) {
			if(tr.find('.saveArea').size()){
				tr.find('.saveArea').remove();
				tr.append(`
					<td>
						<a class="button buttonMini updateRow" href="javascript:;" style="display:none">保存</a>
						<input type="hidden" name="seq" value="${res.seq}">
						<a class="button buttonMini copyRow" href="javascript:;">複製</a>
						<a class="button buttonMini ml10 delRow" href="javascript:;">削除</a></td>
				`)
			}
			calcSubTotal(tr);
			if(!seq){
				sortRow(tr.index()+1);
			}
			$('#copy_row').hide();
		}

	}, 'json');

}

// 行複製
const copyRow = function (obj) {
	var tr = obj.closest("tr");
	var tbody = $('#tbodyBillList');

	var new_tr = tr.clone();
	new_tr.find('[name=seq]').val(null);
//	var unit = tr.find('[name=sel_wbl_unit]').val();
//	new_tr.find('[name=sel_wbl_unit]').val(unit);
	new_tr.find('.rowNo').text(toNum(tr.find('.rowNo').text())+1);
	tr.after(new_tr);
	saveRow(new_tr.find('.updateRow'));
	$('#mainBox').css({'height': 'fit-content'});
	$('#mainBox').height($('div.left').height());
}

// 行削除
const delRow = function (obj) {
	if(!confirm('行を削除します。よろしいですか？')) return;
	var tr = obj.closest("tr");
	var seq = tr.find('[name=seq]').val();
	var sortStart = tr.index();
	tr.remove();
	var param = {md: 'upd_billing', column:{wbl_seq: seq, wbl_delfg: 1}};
	$.post('./detail.php', param, function(res){
		if (res.status) {
			sortRow(sortStart);
			calcTotal();
		}
	}, 'json');
	$('#mainBox').css({'height': 'fit-content'});
	$('#mainBox').height($('div.left').height());
}

// 行ソート
const sortRow = function (start) {
	var upd_rows = [];
	$.each($('#tbodyBillList tr'), function(index,val){
		if(index >= start){
			$(this).find('.rowNo').text(index + 1);
			upd_rows.push([toNum($(this).find('[name=seq]').val()), toNum($(this).find('.rowNo').text())*10]);
		}
	});
	if(upd_rows.length == 0) return;

	var param = {md:'upd_sort', upd_rows: JSON.stringify(upd_rows)};

	$.post('./detail.php', param, function(res){
		if (res.status) {
			;
		}
	}, 'json');

}

//内税切替
const updIncTax = function (obj) {
	var wdc_inc_taxfg = obj.prop("checked");
	var wdc_seq = $('#wdc_seq').val();
	var md = 'upd_direction';
	var param = {md: md, column:{wdc_seq: wdc_seq, wdc_inc_taxfg: wdc_inc_taxfg}};
	$.post('/invoice/detail.php', param, function(res){
		if (res.status) {
			calcTotal();
		}

	}, 'json');
}

//諸費用・免責保存
const saveExpenses = function (obj) {
	var wdc_seq = $('input[name="wdc_seq"]').val();
	var wdc_weight_tax = toNum($('#tableExpenses').find('[name=txt_wdc_weight_tax]').val())
	var wdc_liability_insurance = toNum($('#tableExpenses').find('[name=txt_wdc_liability_insurance]').val())
	var wdc_stamp_tax = toNum($('#tableExpenses').find('[name=txt_wdc_stamp_tax]').val())
	var wdc_inspection_fee = toNum($('#tableExpenses').find('[name=txt_wdc_inspection_fee]').val())
	var wdc_deductible = toNum($('#tableDeductible').find('[name=txt_wdc_deductible]').val())
	var md = 'upd_direction';
	var param = {md: md, column:{wdc_seq: wdc_seq, wdc_weight_tax: wdc_weight_tax, wdc_liability_insurance: wdc_liability_insurance, wdc_stamp_tax: wdc_stamp_tax, wdc_inspection_fee: wdc_inspection_fee, wdc_deductible: wdc_deductible}};
	$.post('/invoice/detail.php', param, function(res){
		if (res.status) {
			calcTotal();
		}

	}, 'json');
}

// 部品代計算 ＆ 割引計算(9: %(技術料), 10 %(部品), 11: ％(両方), 12:%(ＨＰ), 13:%(代車無)
const calcRow = function (obj) {
	var $tr = obj.closest("tr");
	var objName = obj.attr("name");
	if(objName == "txt_wbl_amount" | objName == "txt_wbl_u_price" | objName == "sel_wbl_unit") {
		var amount = toNum($tr.find('[name=txt_wbl_amount]').val());
		var u_price = toNum($tr.find('[name=txt_wbl_u_price]').val());
		var unit = $tr.find('[name=sel_wbl_unit]').val();
		if((['9','10','11','12','13'].includes(unit)) && amount && objName != "txt_wbl_u_price"){
			//割引計算
			$trs = $('#tbodyBillList tr');
			var total_p = 0;
			var total_w = 0;
			var my_index = $trs.index($tr);
			$trs.each(function () {
				var thisUnit = $(this).find('[name=sel_wbl_unit]').val();
				if ($trs.index($(this)) < my_index && !['9','11','12','13','10','11'].includes(thisUnit)) {
					if(['9','11','12','13'].includes(unit)) {
						total_w += toNum($(this).find('[name=txt_wbl_w_price]').val());
					}
					if(['10','11'].includes(unit)) {
						total_p += toNum($(this).find('[name=txt_wbl_p_price]').val());
					}
				}
			});
			if(['9','11','12','13'].includes(unit)) {
				$tr.find('[name=txt_wbl_w_price]').val((total_w * amount * -1 / 100).format());
				$tr.find('[name=txt_wbl_p_price]').val('');
			}
			if(['10','11'].includes(unit)) {
				$tr.find('[name=txt_wbl_p_price]').val((total_p * amount * -1 / 100).format());
				if(unit != "11") $tr.find('[name=txt_wbl_w_price]').val('');
			}
			if(unit == "9") {
				$tr.find('[name=txt_wbl_title]').val("技術料特別割引");
			} else if(unit == "10") {
				$tr.find('[name=txt_wbl_title]').val("部品代特別割引");
			} else if(unit == "11") {
				$tr.find('[name=txt_wbl_title]').val("特別割引");
			} else if(unit == "12") {
				$tr.find('[name=txt_wbl_title]').val("ホームページ割引");
			} else if(unit == "13") {
				$tr.find('[name=txt_wbl_title]').val("代車なし割引");
			}
		} else {
			//部品代計算
			if(amount && u_price && objName != "sel_wbl_unit"){
				$tr.find('[name=txt_wbl_p_price]').val((amount * u_price).format());
			}
		}
	}
}

// 調整値引き 表示
const toggleAdjTotal = function(show) {
	var div = $('#divAdj');
	if(show){
		$('#divAdj .orgAmmount').text($('#tableSum .total-all').text());
		$('#divAdj .adjustTotal').prop('disabled', true)
		$('#divAdj').show();

	} else {
		$('#adjAfterAmount').val('');
		$('#adjAmount').text('');
		$('#chkAdjTotal').prop("checked", false);
		$('#divAdj').hide();
	}
}

// 調整値引額計算
const calcAdjAmount = function(obj) {
	var tax_rate = $('#tax_rate').val()/100;
		tax_rate = $('#inc_taxfg').prop("checked")? 0: tax_rate;
	var objAdjAmount = $('#divAdj #adjAmount');
	var orgAmount = toNum($('#divAdj .orgAmmount').text());
	if(obj.val() > orgAmount) {
		alert("調整前金額を超えています！！");
		return;
	}
	var totalWork = toNum($('#tableBillList .total-all-works var').text());
	var totalExpenses = toNum($('#tableSum .total-expenses').text());
	var totalNonTax = toNum($('#tableSum .total-nontax').text());
	var adj = Math.round((obj.val() - orgAmount) *10 / (1+tax_rate)) / 10;
//	var adj = Math.ceil((obj.val() - orgAmount) / (1+tax_rate));
	adj = Math.ceil(adj);
	if(obj.val() != Math.round((totalWork + adj)) + Math.floor((totalWork + adj) * tax_rate) + totalExpenses + totalNonTax){
		adj -= 1;	// なるべく整数
		if(obj.val() != Math.round((totalWork + adj)) + Math.floor((totalWork + adj) * tax_rate) + totalExpenses + totalNonTax){
			// やむなく小数
			adj = Math.round((adj + 0.4) * 10) / 10;
			var cnt=0;
			while(!(obj.val() == Math.round((totalWork + adj)) + Math.round((totalWork + adj) * tax_rate) + totalExpenses + totalNonTax) && cnt++ <= 4){
				adj = Math.round((adj - 0.1) * 10) / 10;
			}
			if(cnt >= 4){
				alert("調整額の計算に失敗しました。");
				return;
			}
		}
	}
	objAdjAmount.text(adj.format());
	$('#divAdj .adjustTotal').prop('disabled', false);
}

// 小計計算
const calcSubTotal = function(tr) {
	var p_price = toNum(tr.find('[name=txt_wbl_p_price]').val());
	var w_price = toNum(tr.find('[name=txt_wbl_w_price]').val());
	tr.find('.workLineSum').text(p_price+w_price != 0? (p_price+w_price).format() : "");
	calcTotal();
}

// 合計計算
const calcTotal = function() {
	var tax_rate = $('#tax_rate').val()/100;
	var sum_p_price = 0;
	var sum_w_price = 0;
	var sum_nontax = 0;
	var sum_s_price = 0;
	var total_maintenance = 0;

	if($('#tbodyBillList').length){
		tax_rate = $('#inc_taxfg').prop("checked")? 0: tax_rate;
		$.each($('#tbodyBillList tr'), function(index,val){
			sum_p_price += toNum($(this).find('[name=txt_wbl_p_price]').val());
			sum_w_price += toNum($(this).find('[name=txt_wbl_w_price]').val());
			sum_nontax += toNum($(this).find('[name=txt_wbl_non_tax]').val());
			sum_s_price += toNum($(this).find('.workLineSum').text());
		});
		$('#tableBillList .total-parts-fee').text(sum_p_price.format());
		$('#tableBillList .total-technical-fee').text(Math.floor(sum_w_price).format());
		$('#tableBillList .total-all-works var').text(Math.floor(sum_s_price).format());
		$('#tableBillList .total-nontax').text(Math.floor(sum_nontax).format());
		var sum_s_tax = Number.isInteger(sum_s_price)? Math.floor(sum_s_price * tax_rate) : Math.round(sum_s_price * tax_rate)
		if(tax_rate){
			$('#tableBillList .total-tax var').text(sum_s_tax.format());
		} else {
			$('#tableBillList .total-tax var').text("内税");
		}
	}
//	sum_s_price = toNum($(".total-all-works var").text());
//	total_maintenance = Math.floor(sum_s_price * (1 + tax_rate));
	total_maintenance = Math.floor(sum_s_price) + sum_s_tax;
	//諸費用
	var weight_tax = toNum($('#tableExpenses').find('[name=txt_wdc_weight_tax]').val());
	var liability_insurance = toNum($('#tableExpenses').find('[name=txt_wdc_liability_insurance]').val());
	var stamp_tax = toNum($('#tableExpenses').find('[name=txt_wdc_stamp_tax]').val());
	var inspection_fee = toNum($('#tableExpenses').find('[name=txt_wdc_inspection_fee]').val());
	var tax_inspection = Math.floor(inspection_fee * tax_rate);
	var total_expenses = weight_tax + liability_insurance + stamp_tax + inspection_fee + tax_inspection;
	$('#tableExpenses .tax-inspection').text(tax_inspection.format() + "")

	$('#tableSum .total-maintenance').text(total_maintenance.format() + "")
	$('#tableSum .total-expenses').text(total_expenses.format() + "")
	$('#tableSum .total-nontax').text(sum_nontax.format() + "")
	$('#tableSum .total-all').text((total_maintenance + total_expenses + sum_nontax).format() + "")
}

// カンマ取り数値化（共通）
const toNum = function(val) {
	if(val === undefined) return (val);
	return Number(val.replace(/,/g, '')) || 0;
}

$(document).ready(function()
{
	if(window.sessionStorage.getItem(['back'])){
		window.history.back();
		window.sessionStorage.removeItem(['back']);
	}
});

$(document).ready(invoiceClass.init);



