var contactClass = {

	init : function(){
		$('[name=send]').on('click', function() {
			 if(contactClass.validate()){
				 $('#sendContact').attr("onsubmit","return true");
				 $('#sendContact').submit();
			 };
		});

		// 件名、進捗変更時
		$('[name=wct_subject],[name=wct_status]').on('change', function(){
			var wct_seq = $('[name=wct_seq]').val();
			var wct_subject = $('[name=wct_subject]').val();
			var wct_status = $('[name=wct_status]').val();

			var param = {md:'upd_contact', wct_seq:wct_seq ,column:{wct_subject:wct_subject, wct_status:wct_status}};
			$.post('/contact/detail.php', param, function(res) {
				res = JSON.parse(res);
				if (!res.status) {
					alert("更新失敗しました！！");
				}
			}, 'html');
			return false;
		});

		// wdc選択ポップアップ
		$('a.openWdcSelect').on('click', contactClass.wdcSelectOpen);
		$('.closeButton a').on('click', function(){
			$(this).parents('.popUpWindow').fadeOut();
			$('#maskFull').fadeOut();
		});
		$('#wdcSelectWindow a.wdcSelectButton').on('click', contactClass.wdcSelected);

		$('a.deleteButton').on('click', function(){
			if(!confirm("このメッセージを削除しますか？")) return false;

			var tr = $(this).closest('tr');
			var wcth_seq = tr.find('[name=wcth_seq]').val();
			var wct_seq = $('[name=wct_seq]').val();
			var param = {md:'upd_contact_history', wcth_seq:wcth_seq, wct_seq:wct_seq ,column:{wcth_delfg:1}};
			$.post('/contact/detail.php', param, function(res) {
				res = JSON.parse(res);
				if (res.status) {
					tr.remove();
				} else {
					alert("更新失敗しました！！");
				}
			}, 'html');
		});

		$('#incomplete').on('change', function(){
			var form = $('form').eq(0);
			$("<input>",{type:"hidden", name:"skc_incomplete", value:$(this).prop('checked'),}).appendTo(form);
			form.submit();
		});

		$(window).on('unload', function () {
			parent.location.reload();
		});

	},

	//送信ボタン（項目チェック）
	validate : function () {
		var title = $('[name=wct_subject]').val();
		var message = $('[name=wcth_message]').val();
		var to_user = $('#wcth_to_user').val();
		if(title != null && !(title.length && $.trim(title) != '')){
			alert('件名は必須です。');
			return false;
		}
		if(!(message.length && $.trim(message) != '')){
			alert('メッセージは必須です。');
			return false;
		}
		if(!to_user){
			alert('送信先を選択してください。');
			return false;
		}
		return true;
//		$('#sendContact').submit();
	},

	// wdc 選択ポップアップ
	wdcSelectOpen : function(){
		$('#maskFull').fadeIn();
		$('#wdcSelectWindow').hide();

		$('body, html').animate({ scrollTop: 0 }, 200);
		$('#wdcSelectWindow').fadeIn();

	},
	wdcSelected : function(){
		var wdc_seq = $('[name=sel_wdc]').val();
		$('[name=wdc_seq]').val(wdc_seq);
		if(wdc_seq){
			var txt = $('[name=sel_wdc] option:selected').text();
			$('.wdc_text').text(txt);
		} else {
			$('.wdc_text').text('');
		}

		$(this).parents('.popUpWindow').fadeOut();
		$('#maskFull').fadeOut();

	},

}

$(document).ready(contactClass.init);
