
var submitClass = {};

submitClass.init = function(){
	var param = {};
	param.url = document.location.href;
	
	$.post("/form_load.php", param, function(res){
		submitClass.res = res;
		
		$.each($('form.mainForm input[type=text],form.mainForm input[type=hidden],form.mainForm select,form.mainForm textarea'), function(){
			var nm = $(this).attr('name');
			if (submitClass.res[nm]){
				$(this).val(submitClass.res[nm]);
			}
		});
		
		$.each($('form.mainForm input[type=radio],form.mainForm input[type=checkbox]'), function(){
			var nm = $(this).attr('name');
			var vl = $(this).val();
			if (submitClass.res[nm] && submitClass.res[nm] == vl){
				$(this).prop('checked', 'checked');
			}
		});
		
		$.each($('form.mainForm .directImage'), function(){
			var nm = $(this).attr('id');
			var sub_nm = nm.replace(/^file/g , "txt");
			
			if (submitClass.res[nm]){
				$(this).next().hide();
				$(this).append(
					$('<img/>')
						.attr('src', submitClass.res[nm])
						.addClass('imgprev')
				);
				$(this).append(
					$('<input/>')
						.attr({
							'type': 'hidden',
							'name': nm
						})
						.val(submitClass.res[nm])
				);
				
				var sub_vl = submitClass.res[nm].replace(/(\/system2\/|image[_th]*\/)/g , "");
				$(this).append(
					$('<input/>')
						.attr({
							'type': 'hidden',
							'name': sub_nm
						})
						.val(sub_vl)
				);
				
				$(this).append(
					$('<input/>')
						.attr({
							'type': 'button',
							'alt': nm,
							'value': '削除'
						})
						.addClass('delImageBtn')
						.click(editFunc.directImageAct)
				);
			}
		});
	}, 'json');
}

$(document).ready(submitClass.init);
