
var invoiceClass = {};

const PRINTED = ' ✓';

invoiceClass.init = function(){

	$(".accordion-title").on("click", function () {
		// クリックした次の要素を開閉
		$(this).next().slideToggle(300);
		// タイトルにopenクラスを付け外しして矢印の向きを変更
		$(this).toggleClass("open", 200);
		setTimeout(function() {
			if($('.scrollTbody').length){
				ajustTbodyHeight();
			}
		}, 300);
	});

	$('#sk_month').on('change', function(){
		var str_date_from = $('#sk_month').val();
		$('[name=sk_date_from]').val(str_date_from);
		$('#date_from').val(str_date_from);
		var date = new Date(str_date_from);
		var date_to = new Date(date.getFullYear(), date.getMonth()+1, 0);
		$('[name=sk_date_to]').val(date_to.getFullYear()+'-'+(date_to.getMonth()+1)+'-'+date_to.getDate());
		$('#date_to').val(date_to.getFullYear()+'-'+(date_to.getMonth()+1)+'-'+date_to.getDate());

	});

	$('[name=sk_accrued]').on('change', function(){
		var checked = $(this).prop('checked');
		$('#date_from').prop( 'disabled', checked );
		$('#date_to').prop( 'disabled', checked );
		$('#making').prop( 'disabled', checked );
		$('#estimate').prop( 'disabled', checked );
		$('#billing').prop( 'disabled', checked );
		if(checked){
			$('[name=sk_waiting]').prop ('checked', false);
		}
	});

	$('[name=sk_waiting]').on('change', function(){
		var checked = $(this).prop('checked');
		$('#date_from').prop( 'disabled', checked );
		$('#date_to').prop( 'disabled', checked );
		$('#making').prop( 'disabled', checked );
		$('#estimate').prop( 'disabled', checked );
		$('#billing').prop( 'disabled', checked );
		if(checked){
			$('[name=sk_accrued]').prop ('checked', false);
		}
	});

	$('input[name=material_costs]').on('change', function(){
		updMonthlyBalance($(this), 'wmb_material_costs');
	});

	$('input[name=utility_costs]').on('change', function(){
		updMonthlyBalance($(this), 'wmb_utility_costs');
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

		$('[name=wdc_deposit_amount]').on('change', function(){
			var $obj= $(this);
			var tr = $obj.closest('tr');
			var seq = tr.attr('id');
			var value = $obj.prop("value");

			var param = {md:'upd_direction', column:{wdc_seq: seq, wdc_deposit_amount: toNum(value)}};
			$.post('./detail.php', param, function(res) {
				res = JSON.parse(res);
				if (res.status) {
//					$obj.prop('checked',checked);
				}
			}, 'html');
			return false;
		});

		$('[name=wdc_deposited]').on('change', function(){
			var $obj= $(this);
			var tr = $obj.closest('tr');
			var seq = tr.attr('id');
			var value = compleDate($obj.prop("value"));

			var param = {md:'upd_direction', column:{wdc_seq: seq, wdc_deposited: value}};
			$.post('./detail.php', param, function(res) {
				res = JSON.parse(res);
				if (res.status) {
					$obj.prop('value',value);
				}
			}, 'html');
			return false;
		});

		$('[name=wdc_refundedfg]').on('change', function(){
			var $obj= $(this);
			var tr = $obj.closest('tr');
			var seq = tr.attr('id');
			var value = $obj.prop("checked");
			var column = $obj.prop("name");

			var param = {md:'upd_direction', column:{wdc_seq: seq, [column]: value}};
			$.post('./detail.php', param, function(res) {
				res = JSON.parse(res);
			}, 'html');
			return false;
		});

		$('[name=wbm_deposit_amount]').on('change', function(){
			updBillMonth($(this),'wbm_deposit_amount');
		});

		$('[name=wbm_deposited]').on('change', function(){
			$(this).prop('value',compleDate($(this).val()));
			updBillMonth($(this),'wbm_deposited');
		});

		$('.adjust_amount').on('change', function(){
			updBillMonth($(this),'wbm_adjust_amount');
		});

		// 個別の入金チェックボックス
		$('.isDeposited').on('change', function(){
			updDeposited($(this),true);
		});

		// その他請求（代車・ﾚｯｶｰ）の入金日
		$('.wob_deposited').on('change', function(){
			updDepositedOth($(this));
		});

		$('.saveWbmDeposit, .saveWdcDeposit').on('click', function(){
			var $obj= $(this);
			var tr = $obj.closest('tr');
			var amount = toNum(tr.find('.bill_total').text());
			var today = new Date();
			var date = today.getFullYear()-2000+'/'+(today.getMonth()+1)+'/'+today.getDate();
			tr.find('.deposit_amount').val(amount.format());
			tr.find('.deposited').val(date);
			var clss = $obj.attr("class");
			if(clss.indexOf('Wbm') > -1 ) {
				var wcm_seq = tr.find('.wcm_seq').val();
				var month = tr.find('.bill_month').val();
				var parm = {md: 'upd_bill_month', column:{wbm_wcmseq: wcm_seq, wbm_month:month, wbm_deposit_amount: amount, wbm_deposited: date}};
				// 結果的に後のupdDepositedでwbm_deposit_amountは更新されれが、callされないこともあるのでOK
				$.post('./', parm, function(res) {
					$obj.css("display","none");
					var rowCell = tr.find('td[rowspan]');
					var rowValue = rowCell.attr('rowspan');
					var trs = [tr[0]];
					var obj_trs = rowCell.closest('tr').nextAll(':lt(' + (rowValue - 1) + ')');
					$.merge(trs, obj_trs);
					$.each(trs, function(index, value) {
						var obj_bill = $(value).find('.bill');
						if(~obj_bill.prop("href").indexOf('javascript')){	// 請求書出力済のみ
							var obj_chk = $(value).find('.isDeposited');
							if(!obj_chk.prop('checked')){
								obj_chk.prop('checked','checked');
								updDeposited(obj_chk, false);
							}
						}
					});
				}, 'html');
			} else {
				var seq = tr.attr('id');
				var param = {md:'upd_direction', column:{wdc_seq: seq, wdc_deposit_amount: amount, wdc_deposited: date}};
				$.post('./detail.php', param, function(res) {
					res = JSON.parse(res);
					if (res.status) {
						$obj.css("display","none");
					}
				}, 'html');
			}
		});

		$('.link_direction, .edit_wbl').on('click', function(){
			var w_scroll_pos = $(window).scrollTop();
			var t_scroll_pos = $('.scrollTbody').scrollTop();
			window.sessionStorage.setItem('w_scroll_pos', w_scroll_pos);
			window.sessionStorage.setItem('t_scroll_pos', t_scroll_pos);
		});

		ajustTbodyHeight();

	}

	//明細
	if($('#tableBillList').length){
		$('.billing_date').on('change', function(){
			var $obj= $(this);
			var wdc_seq = $('#wdc_seq').val();
			var value = $obj.prop("value");

			var param = {md:'upd_direction', column:{wdc_seq: wdc_seq, wdc_billing_date: value}};
			$.post('./detail.php', param, function(res) {
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

		$('#tableBillList').on('click', '.selRowAll', function() {toggleChkAll($(this))});
		$('#tableBillList').on('click', '.delSelRow', function() {delSelRow($(this))});

		$('.copy_all_detail').on('click', function() {copyAllDetail()});
		$('.copy_detail').on('click', function() {copyDetail($(this))});

		$('.copy_all_detail_parts').on('click', function() {copyAllDetailParts()});
		$('.copy_detail_parts').on('click', function() {copyDetailParts($(this))});

		$('#tbodyBillList').on('click', '.canRow', function() {
			var tr = $(this).closest("tr");
			tr.remove();
		});

		$('#tbodyBillList').on('click', '.saveRow', function() {
			saveRow($(this));
		});

		$('#tbodyBillList').on('click', '.updateRow', function() {
			saveRow($(this));
		});

		$('#tbodyBillList').on('click', '.copyRow', function() {
			copyRow($(this));
		});

		$('#tbodyBillList').on('click', '.delRow', function() {
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

		$('.disp_hide').on('click', function() {
			var tbody = $(this).closest('table').find('tbody');
			if(tbody.is(':visible')){
				tbody.hide();
				$(this).text("＋");
			} else {
				tbody.show();
				$(this).text("－");
			}
		});

		$('#tbodyPartsList').hide();

		$('#tbodyOutscList').hide();

		$('#chkAdjTotal').on('click', function() {
			toggleAdjTotal($(this).prop("checked"));
		});
		$('#divAdj').hide();

		$('#tableBillList').on('change', '#adjAfterAmount', function() {
			if(!$.isNumeric($(this).val())) return;
			calcAdjAmount($(this));
		});

		$('#tableBillList').on('click', '.adjustTotal', function() {
			addRow({title: '調整値引き', w_price: $('#adjAmount').text()}, true);
			toggleAdjTotal(false);
			$('#chkAdjTotal').prop("checked", false);
		});

		calcTotal();
		$('#mainBox').height($('div.left').height());
	}

	// 作業詳細画面の車検・点検項目ボタン
	if($('#work').length){
		$('.add_inspection_24').on('click', function() {addInspection('work',0)});
		$('.add_inspection_12').on('click', function() {addInspection('work',1)});
	}

	$('#tableExpenses, #tableDeductible').on('change', 'input', function() {
		saveExpenses($(this));
	});

}

// monthly_balance 更新
const updMonthlyBalance = function (obj, colmun) {
	var month = $('#sk_month').val();
	var value = obj.val();
	var parm = {md: 'upd_monthly_balance', column:{wmb_month: month, [colmun]: value}};
	$.post('./', parm, function(res) {
		if (res.status) {
			calcProfit();
		} else {
			alert('月次収支更新失敗！！');
		}
	}, 'json');
}

//一覧 集計の原価合計、粗利再計算
const calcProfit = function(obj) {
	var obj_total_cost = $('td.total_cost');
	var obj_profit = $('td.profit');
	var obj_profit_rate = $('td.profit_rate');

	var old_val = toNum($('input[name=material_costs_bk]').val());
	var new_val = toNum($('input[name=material_costs]').val());
	var subtract = new_val - old_val;	// 材料費の差分

	// 原価合計
	var total_cost_val = toNum(obj_total_cost.text());
	var total_cost_val = total_cost_val + subtract;
	obj_total_cost.text(total_cost_val.format());
	// 粗利
	var profit_val = toNum(obj_profit.text());
	var profit_val = profit_val - subtract;
	obj_profit.text(profit_val.format());
	// 粗利率
	if(profit_val + total_cost_val > 0){
		obj_profit_rate.text(Math.round(profit_val * 100 / (profit_val + total_cost_val)).format() + '%');
	}
}

// bill_month 更新
const updBillMonth = function (obj, colmun) {
	var tr = obj.closest('tr');
	var wcm_seq = tr.find('.wcm_seq').val();
	var month = tr.find('.bill_month').val();
	var value = obj.val();
	var parm = {md: 'upd_bill_month', column:{wbm_wcmseq: wcm_seq, wbm_month:month, [colmun]: value}};
	$.post('./', parm, function(res) {
		calcBillTotal(tr);
	}, 'html');
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
					$hfef = '/repair/print_new.php?wdc_seq='+seq+'&md=bill&keep=true';
					$obj.attr('href',$hfef);
				}
			}, 'html');
		}
		return false;
	} else {
		var dataInput = {md: 'dummy', wdc_seq: seq};
		$.post('/repair/print_new.php', dataInput, function(res) {
			$obj.removeClass('buttonGreen');
			$obj.addClass('buttonGray');
			$obj.text($obj.text() + PRINTED);
			$obj.attr('href','javascript:;');
		}, 'html');
	}
}

// 一覧 合計請求書　クリック時
const outBillSum = function () {
	var $obj= $(this);
	var stat = $obj.text().indexOf(PRINTED);
	var tr = $obj.closest('tr');
	var obj_bill_amount = tr.find('.bill_amount');
	var seq = $obj.attr('id');
	var from = $('input[name="sk_date_from"]').val();
	var to = $('input[name="sk_date_to"]').val();
	var month = tr.find('.bill_month').val();

	if (stat >= 0){
		if (window.confirm('合計請求書出力を取り消しますか？')){
			var dataInput = {md: 'upd_sum_printed', wcm_seq: seq, month: month, stat:'off'};
			$.post('./', dataInput, function(res) {
				res = JSON.parse(res);
				if (res.status) {
					$obj.removeClass('buttonGray');
					$obj.addClass('buttonGreen');
					$obj.text($obj.text().replace(PRINTED,''));
					$hfef = '/repair/print_new.php?wcm_seq='+seq+'&md=bill_sum'+'&date_from='+from+'&date_to='+to+'&month='+month;
					$obj.attr('href',$hfef);
					obj_bill_amount.text(0);
					calcBillTotal(tr);
				}
			}, 'html');
		}
		return false;
	} else {
		if($obj.text().indexOf("合計") < 0 ) return true;
		var dataInput = {md: 'get_bill_month', wcm_seq: seq, month: month, column:['wbm_bill_sum_printed','wbm_bill_amount']};
		let timerId = setTimeout( () => {
			$.post('./', dataInput, function(res) {
			if(res.datas['wbm_bill_sum_printed']){
				$obj.removeClass('buttonGreen');
				$obj.addClass('buttonGray');
				$obj.text($obj.text() + PRINTED);
				$obj.attr('href','javascript:;');
				obj_bill_amount.text(res.datas['wbm_bill_amount'].format());
				calcBillTotal(tr);
				clearTimeout(timerId);
			}
			}, 'json');
		},200);
	}
}

// 一覧wdc_deposited 更新
const updDeposited = function (obj, isUpdWbm) {
	var tr = obj.closest('tr');
	var seq = tr.attr('id');
	var checked = obj.prop("checked");
	var deposited = tr.find('.deposited');
	var tr1 = tr;
	if(deposited.length == 0){
		$.each(tr.prevAll(), function(index, value) {
			var rawspan = $(value).find('td[rowspan]');
			if(rawspan.length > 0){
				deposited = $(value).find('.deposited');
				tr1 = $(value);
				return false;
			}
		})
	}

	var value = checked? deposited.val() : '';
	if(checked && value.length==0){
		var today = new Date();
		value = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	}

	var param = {md:'upd_direction', column:{wdc_seq: seq, wdc_deposited: value}};
	$.post('./detail.php', param, function(res) {
		res = JSON.parse(res);
		if (res.status) {
//			$obj.prop('checked',checked);
		}
	}, 'html');
	if(deposited.val().length && isUpdWbm){
		updWbmDeposited(tr1);
	}
}

// 一覧wbm_deposited 更新
const updWbmDeposited = function (tr1) {
	var rowCell = tr1.find('td[rowspan]');
	var rowValue = rowCell.attr('rowspan');
	var trs = [tr1[0]];
	var obj_trs = rowCell.closest('tr').nextAll(':lt(' + (rowValue - 1) + ')');
	$.merge(trs, obj_trs);
	var total = 0;
	$.each(trs, function(index, value) {
		if($(value).find('.isDeposited').prop('checked')){
			total += toNum($(value).find('.wdc_amount').text());
		}
	});
	var wcm_seq = tr1.find('.wcm_seq').val();
	var month = tr1.find('.bill_month').val();
	var adjust_amount = toNum(tr1.find('[name=wbm_adjust_amount]').val());
	var deposit_amount = total - adjust_amount;
	var parm = {md: 'upd_bill_month', column:{wbm_wcmseq: wcm_seq, wbm_month:month, wbm_deposit_amount: deposit_amount}};
	$.post('./', parm, function(res) {
		tr1.find('.deposit_amount').val(deposit_amount.format());
	}, 'html');

}

//一覧 wob_deposited 更新
const updDepositedOth = function (obj) {
	var parent = obj.parent();
	var wob_seq = parent.find('.wob_seq').val();
	var value = obj.val();

/*
	var value = null;
	if(checked){
		var today = new Date();
		value = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	}
*/
	var param = {md: 'upsert_oth_billing', wob_seq: wob_seq, wob_deposited: value};
	$.post('./detail.php', param, function(res) {
		if (!res.status) {
			alert("ERROR!! wob_deposited 更新失敗");
		}
	}, 'json');

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
			$.post('./detail.php', param, function(res){
				if (res.status) {
					$obj.removeClass('buttonGray');
					$obj.addClass('buttonGreen');
					$obj.text($obj.text().replace(PRINTED,''));
					$hfef = '/repair/print_new.php?wdc_seq='+wdc_seq+'&md=billDeductible&keep=true';
					$obj.attr('href',$hfef);
				}
			}, 'json');
		}
		return false;
	} else {
		var dataInput = {md: 'dummy', wdc_seq: wdc_seq};
		$.post('/repair/print_new.php', dataInput, function(res) {
			$obj.removeClass('buttonGreen');
			$obj.addClass('buttonGray');
			$obj.text($obj.text() + PRINTED);
			$obj.attr('href','#');
		}, 'html');

		var md = 'upd_direction';
		var param = {md: md, column:{wdc_seq: wdc_seq, wdc_deductible_rcfg: 1}};
		$.post('./detail.php', param, function(res){
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
			workListClass.addWorkRow(value, false);
		}
	});

}

//チェックボックス一括設定
toggleChkAll = function(obj){
	var table = obj.closest('table');
	var trs = table.find('tbody tr');
	var checked = obj.prop("checked");
	$.each(trs, function(){
		var chk = $(this).find('.selRow').prop("checked", checked);
	});
}
//選択行削除
delSelRow = function (obj) {
	var sortStart = 0;
	var params=[];
	var delTrs=[];
	var table = obj.closest('table');
	$.each(table.find('tbody tr'), function(){
		var tr = $(this);
		if(tr.find('.selRow').prop("checked")) {
			var seq = tr.find('[name=seq]').val();
			params.push({md: 'upd_billing', column:{wbl_seq: seq, wbl_delfg: 1}});
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
		$.post('./detail.php', param, function(res){
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
			sortRow(0);
			calcTotal();
			clearTimeout(timerId)
		}
	},100);

return false;
}

//作業リストから明細行追加
const copyDetail = function (obj) {
	var tr = obj.closest('tr');
	var title = tr.find('.wwl_title').text();
	addRow({title: title}, true);
}
//作業リストから全明細行追加
const copyAllDetail = function () {
	var upd_rows = [];
	$.each($('#tbodyWorkList tr .wwl_title'), function(index,val){
		addRow({title: val.innerText}, true);
	});
}

//部品リストから明細行追加
const copyDetailParts = function (obj) {
	var tr = obj.closest('tr');
	var title = tr.find('.wpl_title').text();
	var quantity = tr.find('.quantity').val();
	var u_price = tr.find('.unit_price').val();
	var p_price = tr.find('.amount').text();
	addRow({title: title, quantity: quantity, u_price: u_price, p_price: p_price}, true);
}
//部品リストから全明細行追加
const copyAllDetailParts = function () {
	var upd_rows = [];
	$.each($('#tbodyPartsList tr .wpl_title'), function(){
		copyDetailParts($(this));
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
	var p_price = column.p_price? column.p_price : '';
	var u_price = column.u_price? column.u_price : '';
	var quantity = column.quantity? column.quantity : '';

	var tr = $('<tr class="openData"></tr>');
	tr.html(`
		<td class="rowNo aR">${rowCount}</td>
		<td><input class="selRow" name="othBillSelect" type="checkbox" ></td>
		<td class="aL">
			<input type="text" name="txt_wbl_title" value="${title}" class="txtsize70 imeon">
		</td>
		<td class="aR">
			<input type="text" name="txt_wbl_amount" value="${quantity}" class="txtsize5 imeon aR">
		</td>
		<td class="unit">
		</td>
		<td class="unit-price aR">
			<input type="text" name="txt_wbl_u_price" value="${u_price}" class=" txtsize15 imeoff aR">
		</td>
		<td class="part-generation aR">
			<input type="text" name="txt_wbl_p_price" value="${p_price}" class=" txtsize15 imeoff aR">
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
	tr.find('[name=txt_wbl_title]').focus();
}


//tbody 幅揃え
const ajustTbody = function () {
//	return;
	var hesders = $('table#tableInvoice thead th');
	var bodys = $('table#tableInvoice tbody tr:nth-child(1) td');
	for (i=0; i < hesders.length-1; i++) {
		width = hesders.eq(i).outerWidth();
//		bodys.eq(i).width(width);
		bodys.eq(i).css({'max-width':width})
	      //処理の実装
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
//			tr.find('[name=seq]').val(res.seq);
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
	$.post('./detail.php', param, function(res){
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
	var wdc_refund = toNum($('#tableDeductible').find('[name=txt_wdc_refund]').val())
	var md = 'upd_direction';
	var param = {md: md, column:{wdc_seq: wdc_seq, wdc_weight_tax: wdc_weight_tax, wdc_liability_insurance: wdc_liability_insurance
				, wdc_stamp_tax: wdc_stamp_tax, wdc_inspection_fee: wdc_inspection_fee, wdc_deductible: wdc_deductible, wdc_refund: wdc_refund}};
	$.post('./detail.php', param, function(res){
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
				$tr.find('[name=txt_wbl_w_price]').val(Math.round(total_w * amount * -1 / 100).format());
				$tr.find('[name=txt_wbl_p_price]').val('');
			}
			if(['10','11'].includes(unit)) {
				$tr.find('[name=txt_wbl_p_price]').val(Math.round(total_p * amount * -1 / 100).format());
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

// 一覧画面今回請求計算
const calcBillTotal = function(tr) {
	var accrued = toNum(tr.find('.accrued_amount').text());
	var bill_amount = toNum(tr.find('.bill_amount').text());
	var adjust_amount = toNum(tr.find('.adjust_amount').val());
	var bill_total = accrued + bill_amount - adjust_amount;
	tr.find('.bill_total').text(bill_total.format());
	var deposited = tr.find('.deposited').val();
	if(deposited == ''){
		tr.find('.saveWbmDeposit').css('display','contents');
	}

}

// 明細画面小計計算
const calcSubTotal = function(tr) {
	var p_price = toNum(tr.find('[name=txt_wbl_p_price]').val());
	var w_price = toNum(tr.find('[name=txt_wbl_w_price]').val());
	tr.find('.workLineSum').text(p_price+w_price != 0? (p_price+w_price).format() : "");
	calcTotal();
}

// 明細画面合計計算
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

	// 粗利計算
	var gross_profit = toNum($('#tableBillList .total-all-works var').text()) - toNum($('#purchaseTotal').text()) - toNum($('#outsc_total').val());
	$('#gross_profit').text(gross_profit.format() + "");
}

// 一覧高さ調整
const ajustTbodyHeight = function() {
	var w_height = $(window).height();
	var t_top = $('.scrollTbody').offset().top;
	var div_oth_height = $('div.otherBill').height();
	$('.scrollTbody').height(w_height-t_top-div_oth_height-10);
}

//カンマ取り数値化（共通）
const toNum = function(val) {
	if(val === undefined) return (val);
	return Number(val.replace(/,/g, '')) || 0;
}

//日付（月日→年月日）
const compleDate = function(val) {
	var part = val.match(/^([0-9]{1,2})[\/\-\.]([0-9]{1,2})$/);
	if(!part || part.length != 3) return (val);
	var month = part[1];
	var now = new Date();
	var now_yy = now.getFullYear();
	var now_mm = now.getMonth() + 1;
	if(now_mm <= 1 && Number(month) >= 11){
		now_yy--;
	}
	return now_yy + '-' + part[1] + '-' + part[2];
}

$(document).ready(function()
{
	if(window.sessionStorage.getItem(['back'])){
		window.history.back();
		window.sessionStorage.removeItem(['back']);
	}
	if(window.sessionStorage.getItem(['w_scroll_pos'])){
		window.onload = function (){
			$(window).scrollTop(window.sessionStorage.getItem(['w_scroll_pos']));
			if(window.sessionStorage.getItem(['t_scroll_pos']) && $('.scrollTbody').length){
				$('.scrollTbody').scrollTop(window.sessionStorage.getItem(['t_scroll_pos']));
			}
			window.sessionStorage.removeItem(['w_scroll_pos']);
		}
	}
});

$(document).ready(invoiceClass.init);
$(window).resize(ajustTbodyHeight);



