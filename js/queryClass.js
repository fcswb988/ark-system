var queryClass = {

	init : function(){
		$('form').submit(function(e){

			var obj_txt = $('[name=txt_sql]')
			var sql = obj_txt.val();
			// AES暗号化アルゴリズムを使用してテキストを暗号化

			var key =  CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");
			var iv =  CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210");
			var encrypted = CryptoJS.AES.encrypt(sql, key, {iv:iv});
			encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
			$('[name=enc_sql]').val(encrypted);
			obj_txt.prop('disabled', true);
		});

		$('.sel_sql').click(function(e){
			var obj_sql = $(this).parent().children('.txt_sql');
			var obj_txt = $('[name=txt_sql]');
			obj_txt.val(obj_sql.text());

		});

	},

}

$(document).ready(queryClass.init);
