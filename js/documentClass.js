
var documentClass = {};

documentClass.init = function(){
	$('.docSubmission').on('click', documentClass.docSubmission);
	$('.docPayment').on('click', documentClass.docPayment);
}

documentClass.docSubmission = function(){
	if (documentClass.submission_lock){
		return false;
	}
	
	documentClass.submission_lock = true;
	documentClass.submission_obj = $(this);
	
	var param = {};
	param.wdc_seq = $(this).parents('tr').attr('rel');
	param.is_active = ($(this).hasClass('buttonRed')) ? true: false;
	param.md = 'submissionSubmit';
	param.param_url = $(location).attr('search');
	
	$.post("../document/ajax.php", param, function(res){
		if (res.result == 'OK'){
			if (res.is_active){
				$(documentClass.submission_obj).addClass('buttonRed');
				$(documentClass.submission_obj).html('提出済');
			} else {
				$(documentClass.submission_obj).removeClass('buttonRed');
				$(documentClass.submission_obj).html('未提出');
			}
		}
		
		documentClass.submission_lock = false;
	}, 'json');
	
	return false;
}

documentClass.docPayment = function(){
	if (documentClass.payment_lock){
		return false;
	}
	
	documentClass.payment_lock = true;
	documentClass.payment_obj = $(this);
	
	var param = {};
	param.wdc_seq = $(this).parents('tr').attr('rel');
	param.is_active = ($(this).hasClass('buttonRed')) ? true: false;
	param.md = 'paymentSubmit';
	param.param_url = $(location).attr('search');
	
	$.post("../document/ajax.php", param, function(res){
		if (res.result == 'OK'){
			if (res.is_active){
				$(documentClass.payment_obj).addClass('buttonRed');
				$(documentClass.payment_obj).html('入金済');
			} else {
				$(documentClass.payment_obj).removeClass('buttonRed');
				$(documentClass.payment_obj).html('未入金');
			}
		}
		
		documentClass.payment_lock = false;
	}, 'json');
	
	return false;
}

$(document).ready(documentClass.init);
