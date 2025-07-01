var saving;

var othBillClass = {

init : function(){

	$('.addOthBill').on('click', function() {
		var w_scroll_pos = $(window).scrollTop();
		var w_height = $(window).height();
		var d_height = $(document).height();
		window.sessionStorage.setItem('w_scroll_pos', d_height - w_height + 100);
//	othBillClass.addOthBill({}, false)
	});

	// その他請求
	$('#oth_customer_submit').on('click', function() {
		var selected = $('input[name=sel_wcm_seq]').val();
		var wcm_company = $('[name=wcm_company]').val();
		var sei_wcm_name = $('input[name=sei_wcm_name]').val();
		if(selected =='' && wcm_company =='' && sei_wcm_name =='' ) {
			alert("顧客を選択するか、新規入力してください");
			return false;
		}
		$('#oth_customer_form').submit();
	});

	// その他見積書・請求書OUT
	$('.otherBill').on('click', '.outOthBill, .outOthEst', function() {othBillClass.outBill($(this))});

	//明細
	if($('.otherBill').length){
		$('.otherBill').on('click', '.addRow', function() {othBillClass.addRow($(this), {}, false)});
		$('.otherBill').on('click', '.inc_taxfg', function() {othBillClass.updIncTax($(this))});
		$('.otherBill').on('change', '[name=wob_wmmseq],[name=wob_bill_date]', function() {othBillClass.updOthBill($(this))});

		$('.otherBill').on('click', '.selRowAll', function() {othBillClass.toggleChkAll($(this))});
		$('.otherBill').on('click', '.delSelRow', function() {othBillClass.delSelRow($(this))});
		$('.otherBill').on('change', '[name=sel_substcar]', function() {
			var obj = $(this);
			var wob_mscseq = $(this).val();
			var wdc_seq = $('#wdc_seq').val();
			var div = obj.closest('div .otherBill');
			var wob_seq = div.find ('[name=wob_seq]').val();
			var wob_bill_type = div.find ('[name=wob_bill_type]').val();
			var param = {md: 'cre_oth_bill', wob_column:{wob_seq: wob_seq, wob_wdcseq: wdc_seq, wob_bill_type: wob_bill_type, wob_mscseq: wob_mscseq}};
			if(wob_bill_type == "9") {
				var wob_bill_date = div.find ('[name=wob_bill_date]').val();
				if(!wob_bill_date.length ){
			        alert('請求日を入力してください');
			        obj.val(null);
			        return;
				}
				var wcm_seq = $('#wcm_seq').val();
				var wob_wmmseq = div.find ('[name=wob_wmmseq]').val();
				param.wob_column.wob_wcmseq = wcm_seq;
				param.wob_column.wob_bill_date = wob_bill_date;
				param.wob_column.wob_wmmseq = wob_wmmseq;
			}
			$.post('./detail.php', param, function(res){
				if (res.status) {
					var url = location.href
					var type = location.href.match(/^.*md_=.*type=(\d+)/);
					if (type) {
						url = url.replace(/&md_=.*/g, '');
					}
					if(url.indexOf("wob_seq") < 0){
						url += "&wob_seq=" + res.wob_seq;
					}
					location.href = url;
				}
//				location.reload();
			}, 'json');
				var w_scroll_pos = $(window).scrollTop();
				window.sessionStorage.setItem('w_scroll_pos', w_scroll_pos);
		});

		$('.otherBill').on('click', '.addSubCar', function() {
			$('.substcar').show();
			var obj = $(this);
		});

		$('.tableOthBillList').on('click', '.canRow', function() {
			var tr = $(this).closest("tr");
			tr.remove();
		});

		$('.tableOthBillList').on('click', '.saveRow', function() {
			othBillClass.saveRow($(this));
		});

		$('.tableOthBillList').on('click', '.updateRow', function() {
			othBillClass.saveRow($(this));
		});

		$('.tableOthBillList').on('click', '.copyRow', function() {
			othBillClass.copyRow($(this));
		});

		$('.tableOthBillList').on('click', '.delRow', function() {
			othBillClass.delRow($(this));
		});

		$('.tableOthBillList').on('change', 'input:text, select', function() {
			othBillClass.saveRow($(this));
		});

		$('.tbodyOthBillList').sortable({
			stop: function(){
				othBillClass.sortRow($(this),0);
			}
		});

		$('.wob_payer').on('change', function() {othBillClass.togglePayer($(this))});

		$('[name=wob_payer]').on('change', function() {othBillClass.changePayer($(this))});

		$('.otherBill').on('change', '[name=sel_insurance]', function() {
			othBillClass.changePayer();
		});

		$('.otherBill').on('click', '[name=substcar]', function() {
			if($(this).prop("checked")){
				$('.substcar').show();
			} else {
				$('.substcar').hide();
			};
		});

		// その他 見積／請求画面　wob_bill_type=9 代車予約作成時
		$('.regist_substcar').on('click', function(){
			var wob_seq = $('[name=wob_seq]').val();
			var msc_seq = $('[name=sel_substcar]').val();
			if(!msc_seq){
		        alert('代車を選択してください');
		        return;
			}
			var start_date = $('[name=start_date]').val();
			var end_date = $('[name=end_date]').val();
			if(!start_date || !end_date){
		        alert('使用期間を入力してください');
		        return;
			}
			var msc_seq = $('[name=sel_substcar]').val();
			var title = $('#customer_name').text() + " 代車のみ請求";
			var storing_date = $('[name=storing_date]').val();
			var delivered_date = $('[name=delivered_date]').val();
			end_date += ' 23:00';
			if(msc_seq){
				var param = {md:'insert', mscseq:msc_seq, wdcseq:0, wobseq:wob_seq, title:title, start_dt: start_date, end_dt: end_date, color:26};
			} else {
				var param = {md:'update', wobseq:wob_seq, delfg: 1};
			}
			$.post('/subcar_use/index.php', param, function(res) {
				res = JSON.parse(res);
				if (res.status) {
					alert("代車登録しました ");
				} else {
					alert("代車登録失敗！！ " + res.msg);
				}
			}, 'html');

		});

		$.each($('.otherBill'), function(){
			othBillClass.calcTotal($(this));
		});


	}
	var type = location.href.match(/^.*md_=.*type=(\d+)/);
	if (type) {
		var msc_seq = $('[name=sel_substcar]').val();
		if (type[1] != 1 || msc_seq > 0) {
			var url = location.href
			url = url.replace(/&md_=.*/g, '');
			location.href = url;
		}
		return;
		var lastTbody = $('.tbodyOthBillList:last');
		var lastDiv = $('.otherBill:last');
		lastDiv.find('[name=wob_bill_type]').val(type[1]);
		othBillClass.addFixedForm(lastTbody, type[1]);
		const timerId = setInterval(function(){
			if(!saving){
//				var url = location.href
//				var url = url.replace(/&md_=.*/g, '');
				location.href = url;
//				location.reload();
				clearInterval(timerId)

			}
		},100);

	}
},

//内税切替
updIncTax : function (obj) {
	var wob_inc_taxfg = obj.prop("checked")?1:0;
	var div = obj.closest('div .otherBill');
	var wob_seq = div.find ('[name=wob_seq]').val();
	var param = {md: 'upsert_oth_billing', wob_seq: wob_seq, wob_inc_taxfg: wob_inc_taxfg};
	$.post('./detail.php', param, function(res) {
		if (res.status) {
			othBillClass.calcTotal(div);
		}
	}, 'json');
},

//請求先切り替え(detail)
togglePayer : function (obj) {
	var val = obj.val();
	var div = obj.closest('div .otherBill');
	var obj_bill_to = div.find ('.oth_bill_to');
	var wob_seq = div.find ('[name=wob_seq]').val();
	var wcm_seq = $('#wcm_seq').val();
	var wob_wcmseq = 0;
	if(val == 2){	// 個人が選択のとき
		wob_wcmseq = wcm_seq;
		obj_bill_to.text($('#customer_name').text());
	} else {
		obj_bill_to.text($('#claims_payer').text());
	}
	var param = {md: 'upsert_oth_billing', wob_seq: wob_seq, wob_wcmseq: wob_wcmseq};
	$.post('./detail.php', param, function(res) {
		if (res.status) {
			othBillClass.calcTotal(div);
		}
	}, 'json');
},

//請求先切り替え(detail_oth)
changePayer : function (obj) {
	var div = $('div .otherBill');
	var obj_bill_to = div.find ('.oth_bill_to');
	var wob_seq = div.find ('[name=wob_seq]').val();
	var obj_payer = div.find ('[name=wob_payer]');
	var wcm_seq = $('#wcm_seq').val();
	var wis_seq = div.find ('[name=sel_insurance]').val();
	var wob_wcmseq = 0;
	var wob_wisseq = 0;
	if(obj_payer[1].checked){	// 個人が選択のとき
		$('.insurance').hide();
		wob_wcmseq = wcm_seq;
		obj_bill_to.text($('#customer_name').text());
	} else {
		$('.insurance').show();
		wob_wisseq = wis_seq;
		obj_bill_to.text('');
	}

	if(!wob_seq) return;

	var param = {md: 'upsert_oth_billing', wob_seq: wob_seq, wob_wcmseq: wcm_seq, wob_wisseq: wob_wisseq};
	$.post('./detail_oth.php', param, function(res) {
		if (res.status) {
			othBillClass.calcTotal(div);
		}
	}, 'json');
},

// 請求日・担当更新
updOthBill : function (obj) {
	var div = obj.closest('div .otherBill');
	var wob_seq = div.find ('[name=wob_seq]').val();
	if(!wob_seq) return false;
	var wob_bill_type = div.find ('[name=wob_bill_type]').val();
	var wob_bill_date = div.find ('[name=wob_bill_date]').val();
	if(wob_bill_type == "9" && !wob_bill_date.length ){
        alert('請求日を入力してください');
        return false;
	}
	var wob_wmmseq = div.find ('[name=wob_wmmseq]').val();
	var param = {md: 'upsert_oth_billing', wob_seq: wob_seq, wob_bill_date: wob_bill_date, wob_wmmseq: wob_wmmseq};
	$.post('./detail.php', param, function(res) {
		if (!res.status) {
			alert("更新失敗！！");
		}
	}, 'json');
},

//請求書・見積書　クリック時
outBill : function (obj) {
//	var obj= $(this);
	var stat = obj.text().indexOf(PRINTED);
	var parent = obj.closest('tr');
	if(parent.length == 0){	// 一覧か？詳細か
		parent = obj.closest('div.otherBill');
	}
	var wob_seq = parent.find ('[name=wob_seq]').val();
	var column  = obj.hasClass('outOthEst')? 'wob_estimate_printed':'wob_bill_printed';
	var getprm  = obj.hasClass('outOthEst')? 'est':'bill';

	if (stat >= 0){
		if (window.confirm('出力を取り消しますか？')){
			var param = {md: 'upsert_oth_billing', wob_seq: wob_seq, [column]: null};
			$.post('./detail.php', param, function(res) {
				res = JSON.parse(res);
				if (res.status) {
					obj.removeClass('buttonGray');
					obj.addClass('buttonGreen');
					obj.text(obj.text().replace(PRINTED,''));
					hfef = '/invoice_new/detail.php?md=out_oth_bill&'+getprm+'=1&keep=true&wob_seq='+wob_seq+'';
					obj.attr('href',hfef);
				}
			}, 'html');
		}
		return false;
	} else {
		var done = false;
		var today = new Date();
		var dtime = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
		var param = {md: 'upsert_oth_billing', wob_seq: wob_seq, [column]: dtime};
		$.post('./detail.php', param, function(res) {
			if (res.status) {
				done = true;
			}
		}, 'json');
		let timerId = setTimeout( () => {
			if(done){
				obj.removeClass('buttonGreen');
				obj.addClass('buttonGray');
				obj.text(obj.text() + PRINTED);
				obj.attr('href','javascript:;');
				clearTimeout(timerId)
			}
		},1000);
	}
},

//定形行追加
addFixedForm : function (obj, type) {
	var arr = [[""]
		,["???"]
		,["レッカー費用（）", "基本料金", "空車回送料金 Km @200", "運搬料金 Km @500", "作業料金"]
	];
	var self = $(this)

	$.each(arr[type], function(index, value ) {
		const timerId = setInterval(function(){
			if(!saving){
				saving = true;
				othBillClass.addRow(obj, {title: value}, true);
				clearInterval(timerId)
			}
		},100);
	});

},

//明細行追加
addRow : function (obj, column, isSave) {
	var div = obj.closest('div.otherBill');
	var wob_bill_type = div.find ('[name=wob_bill_type]').val();
	var wob_bill_date = div.find ('[name=wob_bill_date]').val();
	if(wob_bill_type == "9" && !wob_bill_date.length ){
        alert('請求日を入力してください');
        return;
	}
	var tbody = obj.closest('.otherBill').find('.tbodyOthBillList');
	var rowCount = tbody.children('tr').length + 1;
//	for (key in column){
//    	eval("var " + key + "= '" + column[key] + "';");
//	}
	var title = column.title? column.title : '';
	var w_price = column.w_price? column.w_price : '';

	var tr = $('<tr></tr>');
	tr.html(`
		<td class="rowNo aR">${rowCount}</td>
		<td><input class="selRow" name="othBillSelect" type="checkbox" ></td>
		<td class="aL">
			<input type="text" name="txt_wobd_title" value="${title}" class="txtsize70 imeon">
		</td>
		<td class="aR">
			<input type="text" name="txt_wobd_quantity" value="" class="txtsize5 imeon aR">
		</td>
		<td class="unit">
		</td>
		<td class="unit-price aR">
			<input type="text" name="txt_wobd_u_price" value="" class=" txtsize10 imeoff aR">
		</td>
		<td class="amount aR">
			<input type="text" name="txt_wobd_amount" value="${w_price}" class=" txtsize15 imeoff aR">
		</td>
		<td class="nontax-expence aR">
			<input type="text" name="txt_wobd_non_tax" value="" class=" txtsize15 imeoff aR">
		</td>
		<td class="saveArea">
			<button class="buttonMini buttonBlue saveRow" >保存</button>
			<button class="buttonMini buttonGray ml10 canRow">キャンセル</button>
		</td>
	`);
	var selbox = $('#unit_template').find('[name=sel_wobd_unit]');
	tr.find('.unit').append(selbox.clone());
	tbody.append(tr);
	if(isSave){
		othBillClass.saveRow(tr.find('.saveRow'));
	}
//	$('#mainBox').css({'height': 'fit-content'});
//	$('#mainBox').height($('div.left').height());
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
	var table = obj.closest('table');
	$.each(table.find('tbody tr'), function(){
		var tr = $(this);
		if(tr.find('.selRow').prop("checked")) {
			var seq = tr.find('[name=wobd_seq]').val();
			params.push({md: 'upd_oth_bill_detail', column:{wobd_seq: seq, wobd_delfg: 1}});
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
			othBillClass.calcTotal(table.closest('div .otherBill'));
			clearTimeout(timerId)
		}
	},100);

return false;
},
// 行計算
calcRow : function (obj) {
	var tr = obj.closest("tr");
	var objName = obj.attr("name");
	if(objName && (objName.match(/quantity/) || objName.match(/u_price/))) {
		var u_price = toNum(tr.find('[name=txt_wobd_u_price]').val());
		var quantity = toNum(tr.find('[name=txt_wobd_quantity]').val());
		//金額計算
		tr.find('[name=txt_wobd_amount]').val((u_price * quantity).format());

	}
},

//行保存
saveRow : function (obj) {
	othBillClass.calcRow(obj);
	var tr = obj.closest('tr');
	var div = obj.closest('div.otherBill');
	var tbody = obj.closest('.tbodyOthBillList');
	var saveRow = tr.find('.saveRow');
	saveRow.click(function () {
//        alert('連続クリックは禁止しています。');
        return false;
    });
	var wdc_seq = $('#wdc_seq').val();
	var wcm_seq = $('#wcm_seq').val();
	var wob_seq = div.find ('[name=wob_seq]').val();
	var wob_bill_type = div.find ('[name=wob_bill_type]').val();
	var wob_bill_date = div.find ('[name=wob_bill_date]').val();
	if(wob_bill_type == "9" && !wob_bill_date.length ){
        alert('請求日を入力してください');
        return;
	}
	var wob_wmmseq = div.find ('[name=wob_wmmseq]').val();
	var seq = tr.find('[name=wobd_seq]').val();
	var title = tr.find('[name=txt_wobd_title]').val();
	var unit = tr.find('[name=sel_wobd_unit]').val() * 1;
	var u_price = toNum(tr.find('[name=txt_wobd_u_price]').val());
	var quantity = toNum(tr.find('[name=txt_wobd_quantity]').val());
	var amount = toNum(tr.find('[name=txt_wobd_amount]').val());
	var nontax = toNum(tr.find('[name=txt_wobd_non_tax]').val());
	var sort = toNum(tr.find('.rowNo').text()) * 10;
	var md = seq? 'upd_oth_bill_detail': 'ins_oth_bill_detail';
	var param = {md: md, obl_column:{wob_seq: wob_seq, wob_wdcseq: wdc_seq, wob_wcmseq: wcm_seq, wob_bill_type: wob_bill_type, wob_bill_date: wob_bill_date, wob_wmmseq: wob_wmmseq}
	, column:{wobd_seq: seq, wobd_wobseq: wob_seq, wobd_title: title, wobd_unit: unit, wobd_u_price: u_price, wobd_quantity: quantity, wobd_amount: amount, wobd_non_tax: nontax, wobd_sort: sort},};
	$.post('./detail.php', param, function(res){
		if (res.status) {
			if(tr.find('.saveArea').size()){
				tr.find('.saveArea').remove();
				tr.append(`
					<td>
						<input type="hidden" name="wobd_seq" value="${res.seq}">
						<a class="buttonMini updateRow" href="javascript:;" style="display:none">保存</a>
						<a class="buttonMini copyRow" href="javascript:;">複製</a>
						<a class="buttonMini ml10 delRow" href="javascript:;">削除</a></td>
				`)
			}
			if(res.seq) tr.find('[name=wobd_seq]').val(res.seq);
			if(res.wob_seq) div.find ('[name=wob_seq]').val(res.wob_seq);
			othBillClass.calcTotal(div);
			if(!seq){
				othBillClass.sortRow(tbody, tr.index());
			}
			$('#copy_row').hide();
			if(!wob_seq){
				var url = location.href
				url = url + "&wob_seq=" + res.wob_seq;
				location.href = url;
			}
		}
		saving = false;
	}, 'json');
},

// 行複製
copyRow : function (obj) {
	var tr = obj.closest("tr");
	var tbody = obj.closest('.tbodyOthBillList');

	var new_tr = tr.clone();
	new_tr.find('[name=wobd_seq]').val(null);
	var unit = tr.find('[name=sel_wobd_unit]').val();
	new_tr.find('[name=sel_wobd_unit]').val(unit);
	new_tr.find('.rowNo').text(toNum(tr.find('.rowNo').text())+1);
	tr.after(new_tr);
	othBillClass.saveRow(new_tr.find('.updateRow'));
//	$('#mainBox').css({'height': 'fit-content'});
//	$('#mainBox').height($('div.left').height());
},

// 行削除
delRow : function (obj) {
	if(!confirm('行を削除します。よろしいですか？')) return;
	var tr = obj.closest("tr");
	var tbody = obj.closest('.tbodyOthBillList');
	var seq = tr.find('[name=wobd_seq]').val();
	var sortStart = tr.index();
	tr.remove();
	var param = {md: 'upd_oth_bill_detail', column:{wobd_seq: seq, wobd_delfg: 1}};
	$.post('./detail.php', param, function(res){
		if (res.status) {
//			sortRow(sortStart);
			othBillClass.calcTotal(tbody.closest('div .otherBill'));
		}
	}, 'json');
},

// 行ソート
sortRow : function (obj, start) {
	var upd_rows = [];
	$.each(obj.children('tr'), function(index,val){
		if(index >= start){
			$(this).find('.rowNo').text(index + 1);
			upd_rows.push([toNum($(this).find('[name=wobd_seq]').val()), toNum($(this).find('.rowNo').text())*10]);
		}
	});
	if(upd_rows.length == 0) return;

	var param = {md:'sort_oth_bill_detail', upd_rows: JSON.stringify(upd_rows)};

	$.post('./detail.php', param, function(res){
		if (res.status) {
			;
		}
	}, 'json');

},

// 合計計算
calcTotal : function(obj) {
	var taxFg = !obj.find('.inc_taxfg').prop("checked");
	var tax_rate = taxFg? $('#tax_rate').val()/100 : 0;
	var tbody = obj.find('.tbodyOthBillList');
	var div = obj;
	var sum_amount = 0;
	var sum_nontax = 0;

	if(tbody.length){
//		tax_rate = $('#inc_taxfg').prop("checked")? 0: tax_rate;
		$.each(tbody.children('tr'), function(index,val){
			sum_amount += toNum($(this).find('[name=txt_wobd_amount]').val());
			sum_nontax += toNum($(this).find('[name=txt_wobd_non_tax]').val());
		});
	}
	var sum_tax = Math.floor(sum_amount * tax_rate);
	div.find('.total-amount').text(sum_amount.format() + "");
	div.find('.total-nontax').text(sum_nontax.format() + "");
	div.find('.total-sum').text("総合計　" + (sum_amount+sum_nontax+sum_tax).format() + "　　（税：" + sum_tax.format() + "）");
}

/*

// 明細画面小計計算
const calcSubTotal = function(tr) {
	var p_price = toNum(tr.find('[name=txt_wobd_p_price]').val());
	var w_price = toNum(tr.find('[name=txt_wobd_w_price]').val());
	tr.find('.workLineSum').text(p_price+w_price != 0? (p_price+w_price).format() : "");
	calcTotal();
}

*/

}


$(document).ready(othBillClass.init);



