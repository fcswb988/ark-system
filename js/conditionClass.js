var conditionClass = {

	init : function(){
		// bill明細出すとき
		if($('#tableWorkSubList').length){
			$('.copy_all_detail').on('click', function() {conditionClass.copyAllDetailWork()});
			$('.copy_detail').on('click', function() {conditionClass.copyDetailWork($(this))});
		}

		// condition画面 メモ
		$('[name=wdc_other]').on('change', function(){
			var $obj= $(this);
			var wdc_seq = $('[name=wdc_seq]').val();
			var value = $obj.val();

			var param = {md:'upd_directions', column:{wdc_seq: wdc_seq, wdc_other: encodeURI(value)}};
			$.post('/repair/condition.php', param, function(res) {
				res = JSON.parse(res);
				if (!res.status) {
					alert("更新失敗しました！！");
				}
			}, 'html');
			return false;
		});

		// condition画面 概算工賃
		$('[name=wdc_rough_amount]').on('change', function(){
			var $obj= $(this);
			var wdc_seq = $('[name=wdc_seq]').val();
			var value = $obj.val();

			var param = {md:'upd_directions', column:{wdc_seq: wdc_seq, wdc_rough_amount: value}};
			$.post('/repair/condition.php', param, function(res) {
				res = JSON.parse(res);
				if (!res.status) {
					alert("更新失敗しました！！");
				}
			}, 'html');
			conditionClass.setOutWorkEnable();
			return false;
		});

		// condition画面 代車変更時
		$('[name=sel_substcar]').on('change', function(){
			var msc_seq = $(this).val();
			var wdc_seq = $('[name=wdc_seq]').val();
			var title = $('[name=substcar_wdc_title]').val();
			var storing_date = $('[name=storing_date]').val();
			var delivered_date = $('[name=delivered_date]').val();
			if(delivered_date != '0000-00-00'){
				delivered_date += ' 23:00';
			}
			if(msc_seq){
				var param = {md:'insert', mscseq:msc_seq, wdcseq:wdc_seq, title:title, start_dt: storing_date, end_dt: delivered_date, color:26};
			} else {
				var param = {md:'update', wdcseq:wdc_seq, delfg: 1};
			}
			$.post('/subcar_use/index.php', param, function(res) {
				res = JSON.parse(res);
				if (!res.status) {
					alert("更新失敗しました！！");
				}
			}, 'html');

		});

		conditionClass.setOutWorkEnable();

	},

	//見積明細から作業行追加
	copyDetailWork : function (obj) {
		var tr = obj.closest('tr');
		var title = tr.find('.wbl_title').text();
		workListClass.addWorkRow(title, true);

	},

	//見積明細から全作業行追加
	copyAllDetailWork : function () {
		var upd_rows = [];
		$.each($('#tbodyWorkSubList tr .wbl_title'), function(index,val){
			workListClass.addWorkRow(val.innerText, true);
		});
	},

	//作業書ボタン 活性／非活性 制御
	setOutWorkEnable : function () {
		var pay_type = $('[name=wdc_pay_type]').val();
		var rough_amount = $('[name=wdc_rough_amount]').val();
		var obj_link = $('.out_work');
		if(rough_amount == 0){
			obj_link.attr('href','javascript:void(0)');
			obj_link.addClass('disabled');
		} else {
			obj_link.attr('href', $('#href_out_work').val());
			obj_link.removeClass('disabled');

		}

	},

}

$(document).ready(conditionClass.init);
