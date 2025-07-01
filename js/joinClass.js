
var joinClass = {};

joinClass.sp_view = false;
joinClass.init = function(){
	$('.searchCustomer').hide();
	$('.searchSelect').show();
	
	$('.searchResult').hide();
	
	$('.customerIdSearchButton').on('click', function(){
		$('.searchCustomer').fadeIn();
		$('.searchSelect').hide();
		$(this).fadeOut();
	});
	
	$('.searchCustomerButton').on('click', joinClass.searchCustomer);
}

joinClass.searchCustomer = function(){
	$('.searchResult').hide();
	
	var param = $('.searchCustomer').serialize();
	$.post("./join.php", param, function(res){
		if (res.list_index.length){
			var plus_query = '&wrp_seq='+$('input[name=wrp_seq]').val()+'&wdc_seq='+$('input[name=wdc_seq]').val();
			
			if (joinClass.sp_view){
				$('.searchResult dl').remove();
				
				for(i=0; i<res.list_index.length; i++){
					var part = res.list_index[i];
					$('.searchResult').append(
						$('<dl/>').addClass('spInput').append(
							$('<dt/>').html('お客様ID')
						).append(
							$('<dd/>').html(part.wcm_seq)
						).append(
							$('<dt/>').html('カテゴリー')
						).append(
							$('<dd/>').html(part.wcm_cat_jp)
						).append(
							$('<dt/>').html('クライアント・お名前')
						).append(
							$('<dd/>').html(part.wcm_company+'<br>'+part.wcm_name)
						).append(
							$('<dt/>').html('住所')
						).append(
							$('<dd/>').html(part.wcm_address+'<br>'+part.wcm_building)
						)
					).append(
						$('<p/>').append(
							$('<a/>').attr({
								href: './join.php?md=direct_seq_update&view=direct_confirm&wcm_seq='+part.wcm_seq+plus_query
							}).html('連携する').addClass('button buttonBlue w100')
						).addClass('aC')
					)
				}
			} else {
				$('.searchResult tbody tr').remove();
				
				for(i=0; i<res.list_index.length; i++){
					var part = res.list_index[i];
					$('.searchResult tbody').append(
						$('<tr/>').append(
							$('<td/>').html(part.wcm_seq).addClass('aC')
						).append(
							$('<td/>').html(part.wcm_cat_jp).addClass('aC')
						).append(
							$('<td/>').html(part.wcm_company+'<br>'+part.wcm_name).addClass('aC')
						).append(
							$('<td/>').html(part.wcm_address+'<br>'+part.wcm_building)
						).append(
							$('<td/>').append(
								$('<a/>').attr({
									href: './join.php?md=direct_seq_update&view=direct_confirm&wcm_seq='+part.wcm_seq+plus_query
								}).html('連携する').addClass('buttonMini buttonBlue')
							).addClass('aC')
						)
					)
				}
			}
			
			$('.searchResult').fadeIn();
		}
	}, 'json')
}

$(document).ready(joinClass.init);
