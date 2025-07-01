
var reairClass = {};

reairClass.sp_view = false;
reairClass.init = function(){
	if($('.forPc').css('display') == 'none'){
		reairClass.sp_view = true;
	}
//	$('.searchCustomer').hide();
	$('.searchSelect').show();

	if($('.selected_customer').length == 0){
		$('.searchResult').hide();
	}

	$('.customerIdSearchButton').on('click', function(){
		$('.searchCustomer').fadeIn();
		$('.searchSelect').hide();
		$(this).fadeOut();
	});

	$('.searchCustomerButton').on('click', searchCustomer);

	$('.selectCusomer').on('click', selectCusomer);

	$('#repair_submit').on('click', function() {
		var selected = $('input[name=sel_wcm_seq]').val();
		var wcm_company = $('input[name=txt_wcm_company]').val();
		var sei_wcm_name = $('input[name=sei_wcm_name]').val();
		if(selected =='' && wcm_company =='' && sei_wcm_name =='' ) {
			alert("顧客を選択するか、新規入力してください");
			return false;
		}
		$('#repair_form').submit();
	});

	$.each($('#condForm input, #condForm select'), function(){
		$(this).attr('form','repair_form');
	});

	if (reairClass.sp_view){
		$('.forPc').remove();
	} else {
		$('.forSp').remove();
	}

	$('[name=txt_wrp_regist_class], [name=txt_wrp_regist_hira]').on('change', function() {
		var classNo = $('[name=txt_wrp_regist_class]').val();
		var hira = $('[name=txt_wrp_regist_hira]').val();
		var obj = $('[name=wrp_inspection_period]');
		if(classNo.length && hira.length){
			var val_index = classNo[0] == '1' || classNo[0] == '4' || hira == 'わ' || hira == 'れ'? 0:1;
			obj[val_index].checked = true;
		}

	});
}

const searchCustomer = function(){
	$('.searchResult').hide();
	$('.notFound').hide();
	$('.searchResult tbody').children().remove();

	var param = $('.searchCustomer').serialize();
	$.post("/repair/join.php", param, function(res){
		$('.searchResult').fadeIn();
		if (res.list_index.length){
			var plus_query = '&wrp_seq='+$('input[name=wrp_seq]').val()+'&wdc_seq='+$('input[name=wdc_seq]').val();
			for(i=0; i<res.list_index.length; i++){
				var part = res.list_index[i];
				$('.searchResult tbody').append(
					$('<tr/>').append(
						$('<td/>').html(part.wcm_seq).addClass('aC wcm_seq forPc')
					).append(
						$('<td/>').html(part.wcm_cat_jp).addClass('aC')
					).append(
						$('<td/>').html(part.wcm_company+'<br>'+part.wcm_name).addClass('')
					).append(
						$('<td/>').html(part.wcm_address+'<br>'+part.wcm_building).addClass('forPc')
					).append(
						$('<td/>').append(
							$('<button/>').html('選択する').addClass('buttonMini buttonBlue selectCusomer')
						).addClass('aC selected')
					)
				)
			}
			$('.selectCusomer').on('click', selectCusomer);
		} else {
			$('.notFound').fadeIn();
		}
	}, 'json')
}

const selectCusomer = function(){
	var tr = $(this).closest('tr');
	$('input[name=sel_wcm_seq]').val(tr.find('.wcm_seq').text());
	tr.find('.selected').text("選択中");
	$('.searchResult tbody tr').remove();
	$('.searchResult tbody').append(tr);
//			$('<td/>').html("選択中")

}

$(document).ready(reairClass.init);
