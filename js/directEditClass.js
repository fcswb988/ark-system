var directEditClass = {};
let $partsList = $('.partsList');

directEditClass.is_addWorking = false;

directEditClass.fancyboxReset = function(){
	$.fancybox.close();
	$("[data-fancybox]").fancybox({
		iframe: {
			css: {
				width: '90%',
				maxHeight: 'calc(100vh - 100px)'
			}
		},
		afterLoad: function() {
//			$('.workListAdd').on('click', function(){
//				alert("AAA");
//	        	return false;
//			});
//			directEditClass.is_addWorking = true;
//			directEditClass.openAction();
//			directEditClass.is_addWorking = false;
		},
		touch: false
	});

}

directEditClass.init = function(){
	directEditClass.fancyboxReset();

//	$('.workListAdd').on('click', function(){
//		return false;
//		if(directEditClass.is_addWorking ) return false;
//		$('.workListAdd').click(function () {
//        alert('連続クリックは禁止しています。');
//        	return false;
//			alert("AAA");
//    	});
//	});


//	if($('.claimfg')){
//		$('body').on('click', '.claimfg', directEditClass.updateClaim)
//		$('body').on('blur', '.claim', directEditClass.updateClaim)
//	}

	$partsList = $('.partsList');
	if (!$('.outscList').length){
		return false;
	}

	directEditClass.openParams = {};
/*
	$('.outscList tbody').sortable({
		stop: function(){
			var param = {};
			param.md = 'sortOutscList';
			param.sub_seq = $('input[name=wdc_seq]').val();

			var cnt = 0;
			$.each($('.outscList tbody tr'), function(){
				cnt++;
				param['cnt' + cnt] = $(this).attr('rel');
			});

			param.full_cnt = cnt;

			$.post('/flex/direct.php', param, function(res){
				directEditClass.buildOutscList(res.lists);
			}, 'json');
		}
	});

	$('.partsList tbody').sortable({
		stop: function(){
			directEditClass.sortPartsTable();
		}
	});

	$('.workList tbody').sortable({
		stop: function(){
			directEditClass.sortWorkTable();
		}
	});
*/

/*
	$('.partsListCheck').on('click', directEditClass.checkAllPartList);
	$('.partsListRemove').on('click', directEditClass.uncheckAllPartList);
	$partsList.on('click', '.partsViewSelect', directEditClass.partsViewSelect);
	$partsList.on('click', '.createPart', directEditClass.storeNewPart);
//	$partsList.on('click', '.updatePartsList', directEditClass.updatePart);
	$partsList.on('click', '.copyPartsList', directEditClass.copyParts)
	$partsList.on('change', 'input[name="txt_wpl_days"]', directEditClass.calcTotalPartList);
	$partsList.on('change', 'input[name="txt_wpl_amount"]', directEditClass.calcTotalPartList);
	$partsList.on('change', 'input[name="txt_wpl_base_price"]', directEditClass.billingEstimate);
	$partsList.on('change', 'input[name="txt_wpl_price"]', directEditClass.billingEstimate);

	$partsList.on('click', '.partsViewSelect', directEditClass.updatePart);
	$partsList.on('change', 'input[name="txt_wpl_date"]', directEditClass.updatePart);
	$partsList.on('change', 'input[name="txt_wpl_number"]', directEditClass.getParts);
//	$partsList.on('change', 'input[name="txt_wpl_number"]', directEditClass.updatePart);
	$partsList.on('change', 'select[name="wpl_company_seq"]', directEditClass.updatePart);
	$partsList.on('change', 'input[name="txt_wpl_name"]', directEditClass.updatePart);
	$partsList.on('change', 'input[name="txt_wpl_days"]', directEditClass.updatePart);
	$partsList.on('change', 'select[name="wpl_required_proc"]', directEditClass.updatePart);
	$partsList.on('change', 'input[name="txt_wpl_amount"]', directEditClass.updatePart);
	$partsList.on('change', 'input[name="txt_wpl_base_price"]', directEditClass.updatePart);
	$partsList.on('change', 'input[name="txt_wpl_price"]', directEditClass.updatePart);

	$('.worksViewCheck').on('click', function(){
		directEditClass.toggleCheckWorkList(true);
	});

	$('.worksViewRemove').on('click', function(){
		directEditClass.toggleCheckWorkList(false);
	});
*/

//	$("body").on('change', 'input[name="txt_wwl_p_price"]', directEditClass.billingEstimate)
//	$("body").on('change', 'input[name="txt_wwl_w_price"]', directEditClass.billingEstimate)
//	$("body").on('click', '.worksViewSelect', directEditClass.billingEstimate)
//	$('body').on('click', '.updateWorkList', directEditClass.updateWork)
//	$('body').on('click', '.copyWorkList', directEditClass.copyWork)
//	$('body').on('click', '.createWorkList', directEditClass.storeNewWork)

//	$('.worksViewSelect').on('click', directEditClass.worksViewSelect);

//	$("body").on('click', '.worksViewSelect', directEditClass.worksViewSelect)
//	$("body").on('click', '.worksViewSelect', directEditClass.updateWork)
//	$("body").on('change', 'input[name="txt_wwl_title"]', directEditClass.updateWork)
//	$("body").on('change', 'input[name="txt_wwl_amount"]', directEditClass.updateWork)
//	$("body").on('change', 'select[name="wwl_unit"]', directEditClass.updateWork)
//	$("body").on('change', 'input[name="txt_wwl_u_price"]', directEditClass.updateWork)
//	$("body").on('change', 'input[name="txt_wwl_p_price"]', directEditClass.updateWork)
//	$("body").on('change', 'input[name="txt_wwl_w_price"]', directEditClass.updateWork)

//	$('body').on('click', '.delTr', directEditClass.delTr)

//	$('body').on('click', '.claimfg', directEditClass.updateClaim)

//	directEditClass.worksListTotalWorkLineSumOnRow()

//	directEditClass.worksListCalTotalAttrs()

//	directEditClass.partsListHiddenContent();
//	directEditClass.billingEstimate();

	$('.repairPhotos').sortable({
		connectWith: '.repairPhotos',
		stop: function (event, ui) {
			var $sourceWrap = $(event.target);
			var $desWrap = $(ui.item.get('0')).closest('ul');
			var sourceImages = [];
			$sourceWrap.find('img').map(function () {
				sourceImages.push($(this).attr('src').replace('/system2/image_th/', ''));
			});
			var desImages = [];
			$desWrap.find('img').map(function () {
				desImages.push($(this).attr('src').replace('/system2/image_th/', ''));
			});
			var dataInput = {
				action: 'dragImageRepairCondition',
				sourceId: $sourceWrap.data('wcd_seq'),
				sourceImages: sourceImages,
				desId: $desWrap.data('wcd_seq'),
				desImages: desImages,
			};
			$.ajax({
				url: '/custom/repair/condition.php',
				type: 'post',
				data: dataInput,
				dataType: 'json',
				success: function (response) {
					if (!response.status) {
						alert('System error!');
					}
				},
				error: function () {
					alert('System error!');
				}
			});
		}
	});

}

/*directEditClass.updateClaim = function () {
	textarea = $('textarea[name=wdc_claim]');
	isChecked = $('input[name=wdc_claimfg]').is(':checked');

	textarea.css('display', isChecked ? 'initial' : 'none');
	var params = {
		md: 'claimUpdate',
		wdc_seq: $('input[name=wdc_seq]').val(),
		wdc_claimfg: isChecked ? 1 : 0,
		wdc_claim: textarea.val(),

	};
	$.post('/flex/direct.php', params);

}
*//*
directEditClass.copyWork = function () {
	var tr = $(this).closest("tr")
	var tbody = $('.tbodyWorkListAdd')

	var new_tr = tr.clone();
	new_tr.find("form")[0][name="md"].value ='insert';
	new_tr.find("form")[0][name="main_seq"].value = 0;
	var unit = tr.find('#input_wwl_unit').val();
	new_tr.find('#input_wwl_unit').val(unit);
	tr.after(new_tr);
	directEditClass.storeNewWork(new_tr);
}
*/

/*directEditClass.copyParts = function () {
	var tr = $(this).closest("tr")
	var tbody = $('.tbodyPartsListAdd')

	var new_tr = tr.clone();
	new_tr.find("form")[0][name="md"].value ='insert';
	new_tr.find("form")[0][name="main_seq"].value = 0;
	new_tr.find('.wpl-company-seq').val(tr.find('.wpl-company-seq').val());
	new_tr.find('.wpl_required_proc').val(tr.find('.wpl_required_proc').val());
	tr.after(new_tr);
	directEditClass.storeNewPart(new_tr);
}
*/
/*directEditClass.updateWork = function () {
	var $tr = $(this).closest('tr')
	var $form = $tr.find('form')


	$tr.find('td').each(function () {
		var inputs = $(this).find('input').not('[type=hidden]')
		inputs.each(function() {
			if ($(this).attr('type') === 'checkbox') {
				$form.append($('<input/>').attr({
					type: 'hidden',
					name: $(this).attr('name'),
					value: $(this).is(':checked') ? '1' : '0'
				}))
			} else {
				$form.append($('<input/>').attr({
					type: 'hidden',
					name: $(this).attr('name'),
					value: $(this).val()
				}))
			}
		})

		var select = $(this).find('select').not('[type=hidden]')
		if (select.size()) {
			$form.append($('<input/>').attr({
				type: 'hidden',
				name: select.attr('name'),
				value: select.val()
			}))
		}
	})

	// 部品代計算 ＆ 割引計算(9: %(技術料), 10 %(部品), 11: ％)
	if($(this).attr("name") == "txt_wwl_amount" | $(this).attr("name") == "txt_wwl_u_price" | $(this).attr("name") == "wwl_unit") {
		$amount = Number( $tr.find('[name=txt_wwl_amount]').val().replace(/,/, '') );
		$u_price = Number( $tr.find('[name=txt_wwl_u_price]').val().replace(/,/, '') );
		$unit = $tr.find('[name=wwl_unit]').val();
		if(($unit == "9" | $unit == "10" | $unit == "11") && $amount && $(this).attr("name") != "txt_wwl_u_price"){
			//割引計算
			$trs = $('.workList tbody tr');
			var $total_p = 0;
			var $total_w = 0;
			$my_index = $trs.index($tr);
			$trs.each(function () {
				if ($(this).find('.worksViewSelect').is(":checked") && $trs.index($(this)) < $my_index) {
					if($unit == "9" |  $unit == "11") {
						$val = parseInt($(this).find('[name=txt_wwl_w_price]').val().replace(/,/, '')||0);
						$total_w += $val;
					}
					if($unit == "10" |  $unit == "11") {
						$val = parseInt($(this).find('[name=txt_wwl_p_price]').val().replace(/,/, '')||0);
						$total_p += $val;
					}
				}
			});
			if($unit == "9" |  $unit == "11") {
				$tr.find('[name=txt_wwl_w_price]').val(($total_w * $amount * -1 / 100).format());
			}
			if($unit == "10" |  $unit == "11") {
				$tr.find('[name=txt_wwl_p_price]').val(($total_p * $amount * -1 / 100).format());
			}
			if($unit == "9") {
				$tr.find('[name=txt_wwl_title]').val("技術料特別割引");
			} else if($unit == "10") {
				$tr.find('[name=txt_wwl_title]').val("部品代特別割引");
			} else if($unit == "11") {
				$tr.find('[name=txt_wwl_title]').val("特別割引");
			}
		} else {
			//部品代計算
			if($amount && $u_price && $(this).attr("name") != "wwl_unit"){
				$tr.find('[name=txt_wwl_p_price]').val(($amount * $u_price).format());
			}
		}
	}

	if($form.find('[name=md]')[0].value == 'insert'){
		directEditClass.storeNewWork($tr);
	} else {
		$form.append('<input name="custom_ajax_for_update_work_list" value="1">');
		var dataInput = directEditClass.getFormDataWorkList($form)
		$.post('/flex/final.php', dataInput, function(res) {
			res = JSON.parse(res);
			if (res.status) {

				directEditClass.billingEstimate()

				let x = $tr.find('.updateWorkList');
				x.toggleClass('lit');
				setTimeout(function () {x.toggleClass('lit')}, 500);

				var x = $("#snackbar")
				x.addClass("show")
				x.text("更新に成功しました。")
				setTimeout(function(){ x.removeClass("show") }, 500)

			}
		}, 'html');
	}
}
*/
/**
 * Handle process check/uncheck all part list
 * @param {boolean} isChecked
 */
/*directEditClass.toggleCheckWorkList = function (isChecked) {
	$('.workList tbody tr').map(function () {
		let $el = $(this);
		$el.find('.worksViewSelect').prop("checked",isChecked);
		$el[isChecked ? 'addClass' : 'removeClass']("openData");
	});

	var params = {
		md: isChecked ? 'worksViewCheck' : 'worksViewRemove',
		sub_seq: $('input[name=wdc_seq]').val()
	};
	$.post('/flex/direct.php', params, function (res) {
		if (res.lists) {
//			directEditClass.buildWorkList(res.lists);
			directEditClass.billingEstimate()
		}
	}, 'json');
}
*/
//作業行追加
/*directEditClass.workListAdd = function (element, defaultTitle = "", last = true) {

//	$.fancybox.on('afterLoad', function(){
//		return false;
//	});

	var form = $('.mainForm', element.contents())

	var tr = $('<tr/>').attr({
		class: "ui-sortable-handle"
	})

	var workContentAppend = ""

	form.find('td').each(function(i, td) {
		if (i === 1) {
			workContentAppend = $(this).html()
		}

		if ( i === 0) {
			tr.append(
				$('<td/>').attr({
					class: "work-content"
				}).html($(this).html())
			);
		} else if ( i === 5 ) {
			tr.append(
				$('<td/>').attr({
					class: "part-generation aR hidden"
				}).html($(this).html())
			);
		} else if ( i === 6 ) {
			tr.append(
				$('<td/>').attr({
					class: "technical-fee aR hidden"
				}).html($(this).html())
			);
		} else if ( i > 1 ) {
			tr.append(
				$('<td/>').attr({
					class: "aR hidden"
				}).html($(this).html())
			);
		}

	});

	tr.find("input").addClass("aR");
	tr.find('.work-content').append(workContentAppend)
	tr.find("#input_wwl_w_price").css("width", "70%");

	tr.append(
		$('<td/>').attr({
			class: "workLineSum aR hidden"
		}).html("")
	);

	tr.append(
		$('<td/>').attr({
			class: "saveArea",
			colspan: 3
		}).html(
			$('<button/>').attr({
				class: "button buttonMini buttonBlue createWorkList"
			}).html("保存")
		)
		.append(
			$('<button/>').attr({
				class: "button buttonMini buttonGray ml10 delTr"
			}).html("キャンセル")
		)
	)

	tr.find(".work-content").html(`
		<div style="display: flex;align-items: center">
			<input type="checkbox" name="wwl_is_open" value="1" class="worksViewSelect" style="margin-right: 11px;" checked="checked">
			<input type="text" name="txt_wwl_title" value="" id="input_wwl_title" class=" txtsize70 imeon">
		</div>
	`)

	if (defaultTitle) {
		tr.find("td.work-content").find('input[name="txt_wwl_title"]').val(defaultTitle)
	}


	var aC = $('<p/>').attr({
		class: "aC hidden",
	})

	var newForm = $('<form/>').attr({
		action: "/flex/final.php",
		method: "post",
		enctype: "multipart/form-data",
		class: "hidden",
	})

	var formChildrensClone = form.find('.aC').children().clone()
	formChildrensClone.each(function(i, inputHidden) {
		if (!$(this).hasClass('button')) {
			newForm.append($(this))
		}
	});

	aC.append(newForm)
	tr.find("td.saveArea").append(aC)
	tr.addClass("openData")

	if(!tr.find('.work-content')) return false;

	if (defaultTitle) {
		$(".tbodyWorkListAdd").prepend(tr)
	} else {
		$(".tbodyWorkListAdd").append(tr)
	}

	if (last) {
		$(".fancybox-container").each(function (i, fc) {
			if ($(this).hasClass('fancybox-is-open')) {
				$(this).remove()
			}
		})
		document.documentElement.classList.remove('fancybox-enabled')
	}
	directEditClass.is_addWorking = false;
	tr.find('[name=txt_wwl_title]').focus();
}
*/
// 作業Insert
/*directEditClass.storeNewWork = function (prow) {
	if(!prow.type){
		var tr = prow;
	} else {
		var tr = $(this).closest('tr');
	}

	var obj = tr.find('.createWorkList');
	obj.click(function () {
//        alert('連続クリックは禁止しています。');
        return false;
    });

	var form = tr.find("form")

	tr.find("td").each(function () {
		var inputs = $(this).find("input").not("[type=hidden]")
		inputs.each(function() {
			if ($(this).attr('type') === "checkbox") {
				form.append($("<input/>").attr({
					type: 'hidden',
					name: $(this).attr("name"),
					value: $(this).is(":checked") ? "1" : "0"
				}))
			} else {
				form.append($("<input/>").attr({
					type: 'hidden',
					name: $(this).attr("name"),
					value: $(this).val()
				}))
			}
		})

	})

	var select = tr.find("select")
	form.append($("<input/>").attr({
		type: "hidden",
		value: select.val(),
		name: select.attr("name")
	}))

	form.append('<input name="custom_ajax_for_work_list" value="1">');
	var dataInput = directEditClass.getFormDataWorkList(form)
	$.post('/flex/final.php', dataInput, function(res) {
		res = JSON.parse(res);
		if (res.status) {
			tr.attr('rel', res.main_seq);
			// directEditClass.buildWorkList(res.list);
			var subTotal = parseFloat(dataInput.txt_wwl_p_price || 0) + parseFloat(dataInput.txt_wwl_w_price || 0)

			tr.addClass("ui-sortable-handle")

			if (dataInput.wwl_is_open === "1") {
				tr.addClass("openData")
			}

			if(tr.find('.saveArea').size()){
				tr.find('.saveArea').remove();
				tr.find('p', '.aC').remove();
				tr.append(`
					<td width="7%">
						<a class="button buttonMini updateWorkList" href="javascript:;">保存</a>
						<div class="aC" style="display: none">
							<form action="./confirm.php" method="post" enctype="multipart/form-data" class="mainForm">
								<input type="hidden" name="seq" value="${dataInput.seq}">
								<input type="hidden" name="md" value="update">
								<input type="hidden" name="main_seq" value="${res.main_seq}">
								<input type="hidden" name="sub_seq" value="${dataInput.sub_seq}">
								<input type="hidden" name="view_sys" value="iframe">
							</form>
						</div>
					</td>
					<td width="7%"><a class="button buttonMini copyWorkList" href="javascript:;">複製</a></td>
					<td width="7%"><a class="button buttonMini" data-fancybox="" data-type="iframe" href="javascript:;" data-src="/flex/delete.php?seq=${dataInput.seq}&amp;main_seq=${res.main_seq}&amp;sub_seq=${dataInput.sub_seq}&amp;view_sys=iframe">削除</a></td>
				`)
			}


			if (dataInput.wwl_is_open === "1") {
				tr.find(".worksViewSelect").prop("checked", true)
			}

			directEditClass.billingEstimate();
			directEditClass.sortWorkTable();

			form.find('[name=md]')[0].value = 'update'
			form.find('[name=main_seq]')[0].value = res.main_seq

			let x = tr.find('.updateWorkList');
			x.toggleClass('lit');
			setTimeout(function () {x.toggleClass('lit')}, 800);

			var x = $("#snackbar")
			x.addClass("show")
			x.text("作成に成功しました。")
			setTimeout(function(){ x.removeClass("show") }, 800)

		}
	}, 'html');

}
*/
/*directEditClass.sortWorkTable = function () {
	var param = {};
	param.md = 'sortWorkList';
	param.sub_seq = $('input[name=wdc_seq]').val();

	var cnt = 0;
	$.each($('.workList tbody tr'), function(){
		cnt++;
		param['cnt' + cnt] = $(this).attr('rel');
	});

	param.full_cnt = cnt;

	$.post('/flex/direct.php', param, function(res){
	//	directEditClass.buildWorkList(res.lists);
	}, 'json');
}
*/
/*directEditClass.sortPartsTable = function () {
		var param = {};
	param.md = 'sortPartsList';
	param.sub_seq = $('input[name=wdc_seq]').val();

	var cnt = 0;
	$.each($('.partsList tbody tr'), function(){
		cnt++;
		param['cnt' + cnt] = $(this).attr('rel');
	});

	param.full_cnt = cnt;

	$.post('/flex/direct.php', param, function(res){
//			directEditClass.buildPartsList(res.lists);
	}, 'json');
}
*/

/**
 * Calculate billing estimate = total part list + total work list
 */
/*directEditClass.billingEstimate = function () {
	var rate = ($('#tax_rate').val()/100);

//	directEditClass.calcTotalPartList();
	directEditClass.calSubtotalInTable()
	var totalPartList = parseInt($('.partsList .partsBasePriceSum').text().replace(/,/g, '')) || 0;
	var totalWorkList = parseInt($('.workList tfoot .total-all-works-list var').text().replace(/,/g, '')) || 0;
	var totalTax = Math.floor(totalWorkList * rate);

	var weight_tax = parseInt($("input[name='wdc_weight_tax']").val()) || 0;
	var liability_insurance = parseInt($("input[name='wdc_liability_insurance']").val()) || 0;
	var stamp_tax = parseInt($("input[name='wdc_stamp_tax']").val()) || 0;
	var inspection_fee = parseInt($("input[name='wdc_inspection_fee']").val()) || 0;
	var expense_total = weight_tax + liability_insurance + stamp_tax + Math.floor(inspection_fee * rate);

	var $w_text='<table class="noborder" style="width:50%">';
	if(expense_total > 0){
		$w_text += '<tr><th class="noborder aL" style="width:20%; height:20px">諸 費 用 計（税込）' + '</th><th class="noborder aR" style="height:20px">' + expense_total.format() + '円' + '</th><tr>'
		$w_text += '<tr><th class="noborder aL" style="width:20%; height:20px">整 備 費 計（税込）' + '</th><th class="noborder aR" style="height:20px">' + totalAll.format() + '円' + '</th><tr>'
	}
	$w_text += '<tr><th class="noborder aL" style="width:20%; height:20px">総 合 計（税込）' + '</th><th class="noborder aR" style="height:20px">' + (totalAll+expense_total).format() + '円' + '</th><tr>'
	$w_text += '</table>';

	$(".workList tfoot .total-tax var").text(totalTax.format());
	calcTotal();

}
*/
/*directEditClass.unitSelected = function(val){
	var res = ""

	switch(val) {
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
		case "10":
		case "11":
			res = "selected='selected'";
			break;
		default:
			res = ""
	}

	return res
}
*/
/**
 * Event change checkbox part item
 */
//directEditClass.partsViewSelect = function () {
//	let $el = $(this);
//	$parent = $el.closest('tr');
//	$parent[$el.is(':checked') ? 'addClass' : 'removeClass']("openData");
//	directEditClass.partsListHiddenContent($parent);
//	directEditClass.billingEstimate();
//}

/**
 * Event check all part list
 */
//directEditClass.checkAllPartList = function () {
//	return directEditClass.toggleCheckPartList(true);
//}

/**
 * Event uncheck all part list
 */
//directEditClass.uncheckAllPartList = function () {
//	return directEditClass.toggleCheckPartList(false);
//}

/**
 * Handle process check/uncheck all part list
 * @param {boolean} isChecked
 */
/*
 * directEditClass.toggleCheckPartList = function (isChecked) {
	$('.partsList tbody tr').map(function () {
		let $el = $(this);
		$el.find('.partsViewSelect').prop("checked",isChecked);
		$el[isChecked ? 'addClass' : 'removeClass']("openData");
	});

	var params = {
		md: isChecked ? 'partsListCheck' : 'partsListRemove',
		sub_seq: $('input[name=wdc_seq]').val()
	};
	$.post('/flex/direct.php', params, function (res) {
		if (res.lists) {
//			directEditClass.buildPartsList(res.lists);
			directEditClass.partsListHiddenContent();
			directEditClass.billingEstimate();
		}
	}, 'json');
}
*/

/**
 * Check allow edit parts item
 * @return {boolean}
 */
directEditClass.isReadonly = () => !$partsList.find('input#input_wpl_name').length;

/**
 * Hidden col number and name when don't tick checkbox
 * @param {object|null} $domTr
 */
/*directEditClass.partsListHiddenContent = function ($domTr = null) {
	return;
	($domTr || $('.partsList tbody tr')).each(function () {
		let $el = $(this);
		let isChecked = $el.find('.partsViewSelect').is(':checked');
		if (directEditClass.isReadonly()) {
			$el.find('.wpl-name').css('opacity', isChecked ? '1' : '0');
			$el.find('.wpl-number').css('opacity', isChecked ? '1' : '0');
		} else {
			$el.find('.wpl-name input').css('display', isChecked ? 'initial' : 'none');
			$el.find('.wpl-number input').css('display', isChecked ? 'initial' : 'none');
		}
	});
}
*/
/**
 * Get data input form part item and custom data
 * @param {object} $form
 * @return object
 */
directEditClass.getFormData = ($form) => {
	let dataInput = {};
	let colsNumeric = ['txt_wpl_days', 'txt_wpl_amount', 'txt_wpl_base_price', 'txt_wpl_price'];
	$form.serializeArray().forEach(item => {
		dataInput[item.name] = item.value;
	});
	colsNumeric.forEach(field => {
		dataInput[field] && (dataInput[field] = directEditClass.convertNumber(String(dataInput[field])));
	});
	return dataInput;
}

//部品行追加
/*directEditClass.partAdd = function (element) {
	var form = $('.mainForm', element.contents())
	if(form.find('td').length==0) return;

	var tr = $('<tr/>').attr({
		class: "ui-sortable-handle"
	})
	form.find('td').each(function(i, td) {
		if ( i === 0) {
			var defaultValue = $(this).find("input").val()
			var indexCalendar = $('.partsList tbody tr').size() + 100000
			tr.append(`
				<td class="aL checkbox">
					<div style="display: flex;align-items: center;">
						<input class="partsViewSelect" name="wpl_is_open" value="" type="checkbox" checked="checked">
						<input type="text" name="txt_wpl_date" value="${defaultValue}" id="input_wpl_date_${indexCalendar}"
								style="margin-left: 12px"
								onclick="calFunc.openAct('input_wpl_date_${indexCalendar}');"
								onfocus="calFunc.openAct('input_wpl_date_${indexCalendar}');">
					</div>
				</td>
			`);
			tr.addClass("openData")
		} else {
			tr.append(
				$('<td/>').attr({
				}).html($(this).html())
			);
		}
	});
	tr.find('[name=wpl_company_seq]').addClass("wpl-company-seq");
	tr.find('[name=txt_wpl_date]').addClass("datePicker")
	.datepicker({
		buttonImage: "/img/calendar.png",
		buttonImageOnly: true,
		showOn : "button",
		dateFormat: 'yy-mm-dd',
	});

	tr.append(
		$('<td/>').addClass("sumBasePrice aR")
	)
	tr.append(
		$('<td/>').addClass("sumPrice aR")
	)

	tr.append(
		$('<td/>').attr({
			class: "saveArea",
			colspan: 3
		}).html(
			$('<button/>').attr({
				class: "button buttonMini buttonBlue createPart"
			}).html("保存")
		)
		.append(
			$('<button/>').attr({
				class: "button buttonMini buttonGray ml10 delTr"
			}).html("キャンセル")
		)
	)
	var aC = $('<p/>').attr({
		class: "aC",
		display: "none"
	})

	var newForm = $('<form/>').attr({
		action: "/flex/final.php",
		method: "post",
		enctype: "multipart/form-data",
		class: "hidden",
	})

	form.find('.aC').children().each(function(i, inputHidden) {
		if (!$(this).hasClass('button')) {
			newForm.append($(this))
		}
	});

	aC.append(newForm)
	tr.append(aC)

	$(".partsList .ui-sortable").append(tr)

	$(".fancybox-container").each(function (i, fc) {
		if ($(this).hasClass('fancybox-is-open')) {
			$(this).remove()
		}
	})
	document.documentElement.classList.remove('fancybox-enabled')
}
*/

// 部品Insert
/*directEditClass.storeNewPart = function (prow) {
	if(!prow.type){
		var $row = prow;
	} else {
		var $row = $(this).closest('tr');
	}
	var obj = $row.find('.createPart');
	obj.click(function () {
//        alert('連続クリックは禁止しています。');
        return false;
    });

	let $form = $row.find('form');
	$row.removeClass('hidden')

	$row.find('td').each(function () {
		$(this).find('input, select').map(function () {
			let value = this.type === 'checkbox' ? ($(this).is(':checked') ? '1' : '0') : (this.value || '');
			$form.append(`<input name="${this.name}" value="${value}">`);
		});
	});
	$form.append('<input name="custom_ajax_for_part" value="1">');

	var dataInput = directEditClass.getFormData($form);
	$.post('/flex/final.php', dataInput, function(res) {
		if (res.status) {
			$row.attr('rel', res.main_seq);

			if($row.find('.saveArea').size()){
				$row.find('.saveArea').remove();
				$row.find('p', '.aC').remove();
				$row.append(`
					<td>
						<a class="button buttonMini updatePartsList" href="javascript:;">保存</a>
						<div class="aC" style="display: none">
							<form action="./confirm.php" method="post" enctype="multipart/form-data" class="mainForm">
								<input type="hidden" name="seq" value="${dataInput.seq}">
								<input type="hidden" name="md" value="update">
								<input type="hidden" name="main_seq" value="${res.main_seq}">
								<input type="hidden" name="sub_seq" value="${dataInput.sub_seq}">
								<input type="hidden" name="view_sys" value="iframe">
							</form>
						</div>
					</td>
					<td><a class="button buttonMini copyPartsList" href="javascript:;">複製</a></td>
					<td><a class="button buttonMini" data-fancybox="" data-type="iframe" href="javascript:;"
						data-src="/flex/delete.php?seq=${dataInput.seq}&amp;main_seq=${res.main_seq}&amp;sub_seq=${dataInput.sub_seq}&amp;view_sys=iframe">削除</a></td>
				`)
			}

			directEditClass.billingEstimate();
			directEditClass.sortPartsTable();

			$form.find('[name=md]')[0].value = 'update'
			$form.find('[name=main_seq]')[0].value = res.main_seq

			let x = $row.find('.updatePartsList');
			x.toggleClass('lit');
			setTimeout(function () {x.toggleClass('lit')}, 800);

			let x = $("#snackbar");
			x.addClass("show");
			x.text("作成に成功しました。");
			setTimeout(function () {x.removeClass("show")}, 800);

		}
	}, 'json');
}
*/

/*
directEditClass.getParts = function(){
	var obj = $(this);
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
		directEditClass.updatePart(obj);
	});
}
*/

/**
 * Handle update data of a part
 */
/*
directEditClass.updatePart = function (obj) {
	if(obj.type) obj = $(this);	//他に良い判定ない？？
	var $row = obj.closest('tr');
	var $form = $row.find('form');

	$row.find('td').each(function () {
		$(this).find('input, select').not('[type=hidden]').map(function () {
			let value = this.type === 'checkbox' ? ($(this).is(':checked') ? '1' : '0') : (this.value || '');
			$form.append(`<input name="${this.name}" value="${value}">`);
		});
	});
	$form.append('<input name="custom_ajax_for_update_parts_list" value="1">');

	if($form[0][name="md"].value == 'insert'){
		directEditClass.storeNewPart($row);
	} else {
		var dataInput = directEditClass.getFormData($form);
		$.post('/flex/final.php', dataInput, function (res) {
			if (res.status) {
				directEditClass.billingEstimate();
				let x = $row.find('.updatePartsList');
				x.toggleClass('lit');
				setTimeout(function () {x.toggleClass('lit')}, 800);
			}
		}, 'json');
	}
}
*/

/**
 * Calculate total rows part list
 */
/*
directEditClass.calcTotalPartList = function () {
	let $rowTotal = $('.partsList tfoot tr');
	let companySum = {};
	let totalDays = 0, totalAmount = 0, totalBasePrice = 0, totalPrice = 0;
	$('.partsList tbody tr').map(function () {
		let $this = $(this);
		let $inputAmount = $this.find('#input_wpl_amount');
		let $inputPrice = $this.find('#input_wpl_price');
		let $inputBasePrice = $this.find('#input_wpl_base_price');
		if ($this.find('.partsViewSelect').is(':checked') && $this.attr('rel')) {
			if (!directEditClass.isReadonly()) {
				let $inputDay = $this.find('#input_wpl_days');
//				let $inputAmount = $this.find('#input_wpl_amount');
				totalDays += directEditClass.convertNumber($inputDay.val());
				totalAmount += directEditClass.convertNumber($inputAmount.val());
				totalBasePrice += directEditClass.convertNumber($inputBasePrice.val())* $inputAmount.val();
				totalPrice += directEditClass.convertNumber($inputPrice.val()) * $inputAmount.val();
				$this.find('.sumBasePrice').text((directEditClass.convertNumber($inputBasePrice.val())* $inputAmount.val()).format());
				$this.find('.sumPrice').text((directEditClass.convertNumber($inputPrice.val())* $inputAmount.val()).format());
				$inputDay.val(($inputDay.val() || '').format());
//				$inputAmount.val(($inputAmount.val() || '').format());
				$inputBasePrice.val(($inputBasePrice.val() || '').format());
				$inputPrice.val(($inputPrice.val() || '').format());
			} else {
				totalDays += directEditClass.convertNumber($this.find('.sumBasePrice').text());
				totalAmount += directEditClass.convertNumber($this.find('.sumPrice').text());
				totalBasePrice += directEditClass.convertNumber($this.find('.wpl-base-price').text());
				totalPrice += directEditClass.convertNumber($this.find('.wpl-price').text());
			}
		}
		com_name = $this.find('.wpl-company-seq option:selected').text();
		if (com_name in companySum) {
			companySum[com_name] += directEditClass.convertNumber($inputBasePrice.val()) * directEditClass.convertNumber($inputAmount.val());
		} else {
			companySum[com_name] = directEditClass.convertNumber($inputBasePrice.val()) * directEditClass.convertNumber($inputAmount.val());
		}
	});
	//$rowTotal.find('.partsListSum').text(totalDays.format());
	$rowTotal.find('.partsAmountSum').text(totalAmount.format());
	$rowTotal.find('.partsBasePriceSum').text(totalBasePrice.format());
	$rowTotal.find('.partsPriceSum').text(totalPrice.format());
	var $w_text='<table class="noborder" style="width:40%;">';
	$.each(companySum, function(name, value) {
		if(value>0){
			$w_text += '<tr><th class="noborder aL" style="width:30%; height:20px">' + name
			 + '</th><th class="noborder aR" style="height:20px">' + value.format() + ' 円' + '</th><tr>'
		}
	});
	$w_text += '</table>';
	$rowTotal.find('.companySum').html($w_text);
}
*/

/**
 * Convert value string to numeric
 * @param {string} variable
 * @return {number}
 */
directEditClass.convertNumber = function (variable) {
	variable = (variable + '');
	return parseFloat(variable.replace(/[^\d\.\+\-]+/g, '')) || 0;
}

/*
directEditClass.worksViewSelect = function(){
	var param = {};
	param.md = 'worksViewSelect';
	param.wwl_seq = $(this).val();
	param.wwl_is_open = $(this).prop('checked');
	param.sub_seq = $('input[name=wdc_seq]').val();

	if (param.wwl_is_open === true) {
		$(this).closest("tr").addClass("openData")
	} else {
		$(this).closest("tr").removeClass("openData")
	}

	// $.post('/flex/direct.php', param, function(res){
	// 	directEditClass.buildWorkList(res.lists);
	// }, 'json');
}


directEditClass.openAction = function(){
	var src_vl = $('.fancybox-iframe').attr('src');

	var tmp_vl = src_vl.split('?');

	var tmp_pg = tmp_vl[0].match(/([a-z]+)\..+$/);
	var pg_name = tmp_pg[1];

	var tmp_params = tmp_vl[1].split('&');

	var param = {};
	param.mode = pg_name;

	for(i=0; i<tmp_params.length; i++){
		var tmp = tmp_params[i].split('=');
		param[tmp[0]] = tmp[1];
	}

	directEditClass.openParams = param;

	var fancyboxIframes = $('.fancybox-iframe')

	if (fancyboxIframes.length > 0) {
		fancyboxIframes.each(function(i, fancyboxIframe) {
			var srcFancyboxIframe = fancyboxIframe.src

			if (srcFancyboxIframe.indexOf("flex/detail.php?seq=19") >= 0) {
				directEditClass.partAdd($(this))
			} else if (srcFancyboxIframe.indexOf("flex/detail.php?seq=21") >= 0) {
				if (param["add_multi"] === "vehicle_inspection_items") {
					var arr = ["車検受け整備一式及び２４ヶ月定期点検", "　前後ブレーキ点検・清掃・調整", "　動力伝達装置点検",
						"　ステアリング装置　点検・調整", "　サスペンション　点検", "　エンジン及び電気系統　点検・調整", "　下回り　各部点検",
						"　洗浄（エンジン・下回り）スチーム洗車", "保安確認検査（光軸調整・排気ガス測定）"]
					var self = $(this)

					$.each(arr.reverse(), function( index, value ) {
						directEditClass.workListAdd(self, value, index + 1 === arr.length)
					});
				} else if (param["add_multi"] === "12_months_inspection_items") {
					var self = $(this)
					var arr = ["法定１２ヶ月点検", "　エンジンルーム内点検", "　室内点検", "　足回り点検", "　下回り点検", "　外回り点検", "　日常点検", "保安確認総合検査料"]
					$.each(arr, function( index, value ) {
						directEditClass.workListAdd(self, value, index + 1 === arr.length)
					});
				} else {
					try {
						directEditClass.workListAdd($(this), "", true);
					} catch(e) {
						alert('ERROR!');
					}
				}
			} else if (srcFancyboxIframe.indexOf("flex/detail.php?seq=17") >= 0 | srcFancyboxIframe.indexOf("flex/edit.php?seq=17") >= 0) {
				// 修理詳細
				var val1 = $(this).contents().find('input[name=txt_wdc_weight_tax]').val();
				var val2 = $(this).contents().find('input[name=txt_wdc_liability_insurance]').val();
				var val3 = $(this).contents().find('input[name=txt_wdc_stamp_tax]').val();
				var val4 = $(this).contents().find('input[name=txt_wdc_inspection_fee]').val();
				$obj = $(this).contents().find('input[name=is_bill]');
				var checked = (val1 | val2 | val3 | val4);
				$obj.prop('checked',checked);

				$obj.on('click', function(){
					var obj= $(this);
					var checked = $obj.prop("checked");
					var table = $obj.closest('table');
					var obj1 = table.find('input[name=txt_wdc_weight_tax]');
					var obj2 = table.find('input[name=txt_wdc_liability_insurance]');
					var obj3 = table.find('input[name=txt_wdc_stamp_tax]');
					var obj4 = table.find('input[name=txt_wdc_inspection_fee]');

					if(checked){
						obj1.val(table.find('#wrp_weight_tax').val());
						obj2.val(table.find('#wrp_liability_insurance').val());
						obj3.val(table.find('#wrp_stamp_tax').val());
						obj4.val(table.find('#wrp_inspection_fee').val());
					} else {
						obj1.val(''); obj2.val(''); obj3.val(''); obj4.val('');
					}
				});

			}
		})
	}
}
*/

/*
directEditClass.buildWorkList = function(list_data){
	$('.workList tbody tr').remove();

	for(i=0; i<list_data.length; i++){
		var part = list_data[i];

		var tr_tag = $('<tr/>')
		.attr('rel', part.wwl_seq);

		if (part.wwl_is_open == 1){
			tr_tag.addClass('openData');
		}
		var is_checked = (part.wwl_is_open == 1) ? 'checked': null;

		tr_tag.append(
			$('<td/>').html(' '+part.wwl_title).addClass('aL').prepend(
				$('<input/>')
				.attr('type', 'checkbox')
				.attr('value', part.wwl_seq)
				.prop('checked', is_checked)
				.addClass("worksViewSelect")
				.on('click', directEditClass.worksViewSelect)
			)
		).append(
			$('<td/>').html(part.wwl_amount)
		).append(
			$('<td/>').html(part.wwl_unit)
		).append(
			$('<td/>').html(part.wwl_u_price).addClass("unit-price")
		).append(
			$('<td/>').html(part.wwl_p_price).addClass("part-generation")
		).append(
			$('<td/>').html(part.wwl_w_price).addClass("technical-fee")
		).append(
			$('<td/>').html(part.sum_price).addClass("workLineSum")
		).append(
			$('<td/>').append(
				$('<a/>')
				.html('編集')
				.addClass('button buttonMini updateWorkList')
				.attr('data-fancybox', '')
				.attr('data-type', 'iframe')
				.attr('href', 'javascript:;')
				.attr('data-src', '/flex/'+part.edit_url+'&view_sys=iframe')
			)
		).append(
			$('<td/>').append(
				$('<a/>')
				.html('複製')
				.addClass('button buttonMini')
				.attr('data-fancybox', '')
				.attr('data-type', 'iframe')
				.attr('href', 'javascript:;')
				.attr('data-src', '/flex/'+part.duplicate_url+'&view_sys=iframe')
			)
		).append(
			$('<td/>').append(
				$('<a/>')
				.html('削除')
				.addClass('button buttonMini')
				.attr('data-fancybox', '')
				.attr('data-type', 'iframe')
				.attr('href', 'javascript:;')
				.attr('data-src', '/flex/'+part.delete_url+'&view_sys=iframe')
			)
		);

		var workLineSum = 0

		workLineSum += parseFloat(tr_tag.find(".part-generation").text().replace(/,/g, '') || 0)
		workLineSum += parseFloat(tr_tag.find(".technical-fee").text().replace(/,/g, '') || 0)


		tr_tag.find(".workLineSum").text(workLineSum.format() )

		$('.workList tbody').append(tr_tag);

		$.fancybox.close();
	}
}

directEditClass.buildPartsList = function(list_data){
	$('.partsList tbody tr').remove();

	for(i=0; i<list_data.length; i++){
		var part = list_data[i];

		if (part.wpl_base_price == 0){
			part.wpl_base_price = '';
		} else {
			part.wpl_base_price += '';
		}

		if (part.wpl_amount == 0){
			part.wpl_amount = '';
		}
		var is_checked = (part.wpl_is_open == 1) ? 'checked': null;

		var tr_tag = $('<tr/>');

		if (part.wpl_is_open == 1){
			tr_tag.addClass('openData');
		}

		var partWplNumber = part.wpl_number
		var partWplName = part.wpl_name

		if (!(part.wpl_is_open == 1)){
			partWplName = ""
			partWplNumber = ""
		}

		tr_tag.attr('rel', part.wpl_seq)
		.append(
			$('<td/>').html('　'+part.wpl_date).addClass('aL checkbox').prepend(
				$('<input/>')
				.attr('type', 'checkbox')
				.attr('value', part.wpl_seq)
				.prop('checked', is_checked)
				.on('click', directEditClass.partsViewSelect).addClass('aL partsViewSelect')
			)
		).append(
			$('<td/>').html(partWplNumber).addClass("wpl-number")
		).append(
			$('<td/>').html(part.wpl_company_seq).addClass("wpl-company-seq")
		).append(
			$('<td/>').html(partWplName).addClass('aL wpl-name')
		).append(
			$('<td/>').html(part.wpl_days ? part.wpl_days.format() : '')
		).append(
			$('<td/>').html((part.wpl_amount || '').format())
		).append(
			$('<td/>').html((part.wpl_base_price ? part.wpl_base_price.format() : '')).addClass('wpl-base-price')
		).append(
			$('<td/>').html(part.wpl_price ? part.wpl_price.format() :　'').addClass('wpl-price')
		).append(
			$('<td/>').append(
				$('<a/>')
				.html('編集')
				.addClass('button buttonMini')
				.attr('data-fancybox', '')
				.attr('data-type', 'iframe')
				.attr('href', 'javascript:;')
				.attr('data-src', '/flex/'+part.edit_url+'&view_sys=iframe')
			)
		).append(
			$('<td/>').append(
				$('<a/>')
				.html('複製')
				.addClass('button buttonMini')
				.attr('data-fancybox', '')
				.attr('data-type', 'iframe')
				.attr('href', 'javascript:;')
				.attr('data-src', '/flex/'+part.duplicate_url+'&view_sys=iframe')
			)
		).append(
			$('<td/>').append(
				$('<a/>')
				.html('削除')
				.addClass('button buttonMini')
				.attr('data-fancybox', '')
				.attr('data-type', 'iframe')
				.attr('href', 'javascript:;')
				.attr('data-src', '/flex/'+part.delete_url+'&view_sys=iframe')
			)
		);

		$('.partsList tbody').append(tr_tag);

		$.fancybox.close();
	}

//	directEditClass.partsListHiddenContent();
	directEditClass.billingEstimate();
}

directEditClass.outscPartsList = function(list_data){
	$('.outscList tbody tr').remove();

	for(i=0; i<list_data.length; i++){
		var part = list_data[i];

		var tr_tag = $('<tr/>')
		.attr('rel', part.wol_seq)
		.append(
			$('<td/>').html(part.wol_title).addClass('aL')
		).append(
			$('<td/>').html(part.wol_days)
		).append(
			$('<td/>').html(part.wol_price)
		).append(
			$('<td/>').append(
				$('<a/>')
				.html('編集')
				.addClass('button buttonMini')
				.attr('data-fancybox', '')
				.attr('data-type', 'iframe')
				.attr('href', 'javascript:;')
				.attr('data-src', '/flex/'+part.edit_url+'&view_sys=iframe')
			)
		).append(
			$('<td/>').append(
				$('<a/>')
				.html('複製')
				.addClass('button buttonMini')
				.attr('data-fancybox', '')
				.attr('data-type', 'iframe')
				.attr('href', 'javascript:;')
				.attr('data-src', '/flex/'+part.duplicate_url+'&view_sys=iframe')
			)
		).append(
			$('<td/>').append(
				$('<a/>')
				.html('削除')
				.addClass('button buttonMini')
				.attr('data-fancybox', '')
				.attr('data-type', 'iframe')
				.attr('href', 'javascript:;')
				.attr('data-src', '/flex/'+part.delete_url+'&view_sys=iframe')
			)
		);

		$('.outscList tbody').append(tr_tag);

		$.fancybox.close();
	}
}

directEditClass.worksListTotalWorkLineSumOnRow = function () {
	$(".workList tbody.tbodyWorkListAdd tr").each(function () {
		var pPrice =  parseFloat($(this).find('input[name=txt_wwl_p_price]').val().replace(/,/g, '') || 0)
		var wPrice =  parseFloat($(this).find('input[name=txt_wwl_w_price]').val().replace(/,/g, '') || 0)

		var totalPrice = pPrice + wPrice

		$(this).find(".workLineSum").text(totalPrice.format());
	})
}

directEditClass.worksListCalTotalAttrs = function () {
	if ($(".total-parts-fee").length > 0) {
		$(".total-parts-fee").html(directEditClass.worksListCalTotal("part-generation"))
	}

	if ($(".total-technical-fee").length > 0) {
		$(".total-technical-fee").html(directEditClass.worksListCalTotal("technical-fee"))
	}

//	if ($(".total-all-works-list").length > 0) {
//		$(".total-all-works-list").html(directEditClass.worksListCalTotal("workLineSum"))
//	}
}

directEditClass.worksListCalTotal = function(attr){
	var total = 0
	$('.workList tbody tr').each(function () {
		// if ($(this).find('.worksViewSelect').is(":checked")) {
			var inputElement = $(this).find(`.${attr}`).find("input")

			if (inputElement.length > 0) {
				total += parseFloat(inputElement.val().replace(/,/g, '') || 0);
			} else {
				total += parseFloat($(this).find(`.${attr}`).text().replace(/,/g, '') || 0)
			}

		// }
	});

	return total.format();
}
*/

// WorkList
/*directEditClass.getPartGenerationInRow = function(tr_tag){
	let wwlPPrice = tr_tag.find(".part-generation").find("input")

	if (wwlPPrice.length > 0) {
		return parseFloat(wwlPPrice.val().replace(/,/g, '') || 0);
	} else {
		return parseFloat(tr_tag.find(".part-generation").text().replace(/,/g, '') || 0)
	}
}
*/
/*directEditClass.getTechnicalFeeInRow = function(tr_tag){
	let wwlWPrice = tr_tag.find(".technical-fee").find("input")
	if (wwlWPrice.length > 0) {
		return parseFloat(wwlWPrice.val().replace(/,/g, '') || 0);
	} else {
		return parseFloat(tr_tag.find(".technical-fee").text().replace(/,/g, '') || 0)
	}
}
*/
/*directEditClass.calPartGenerationInTable = function(){
	let total = 0

	$('.workList tbody tr').each(function () {
		if($(this).find(".updateWorkList").length < 1 || !$(this).find(".worksViewSelect").is(':checked')) {
			directEditClass.calSubtotalInRow($(this))
			return true
		}

		total += directEditClass.getPartGenerationInRow($(this))

		directEditClass.calSubtotalInRow($(this))
	})

	$(".total-parts-fee").text(total.format())

	return total
}
*/
/*directEditClass.calTechnicalFeeInTable = function(){
	let total = 0

	$('.workList tbody tr').each(function () {
		if($(this).find(".updateWorkList").length < 1 || !$(this).find(".worksViewSelect").is(':checked')) {
			directEditClass.calSubtotalInRow($(this))
			return true
		}

		total += directEditClass.getTechnicalFeeInRow($(this))

		directEditClass.calSubtotalInRow($(this))
	})

	$(".total-technical-fee").text(total.format())

	return total
}
*/
/*directEditClass.calSubtotalInRow = function(tr_tag){
	let total = 0
	total += directEditClass.getPartGenerationInRow(tr_tag)
	total += directEditClass.getTechnicalFeeInRow(tr_tag)

	tr_tag.find(".workLineSum").text(total.format())

	return total
}
*/
/*directEditClass.calSubtotalInTable = function(){
	let total = 0

	total += directEditClass.calPartGenerationInTable() + directEditClass.calTechnicalFeeInTable()

	$(".total-all-works-list var").text(total.format())

	return total
}
*/
/*directEditClass.getFormDataWorkList = ($form) => {
	let dataInput = {};
	let colsNumeric = ['txt_wwl_p_price', 'txt_wwl_u_price', 'txt_wwl_w_price'];
	$form.serializeArray().forEach(item => {
		dataInput[item.name] = item.value;
	});
	colsNumeric.forEach(field => {
		dataInput[field] && (dataInput[field] = directEditClass.convertNumber(String(dataInput[field])));
	});
	return dataInput;
}
*/
/*directEditClass.delTr = function () {
	var $tr = $(this).closest('tr');
	$tr.remove();
}
*/

$(document).ready(directEditClass.init);
