
var importClass = {

	init : function(){

		$('body').on('change', 'select[name="sel_company"]', function() {
			importClass.disp_init();
//			var selected = $(this).children("option:selected");
//			var display = selected.text().includes(TYTMP)? 'block':'none'
		});

		$('form').submit(function(e){

			var click_name = e.originalEvent? e.originalEvent.submitter.name: null;

			if(click_name == 'submit'){
				if($('#wdc_list').is(":visible")){
					var checked = $('input[name="sel_wdc"]:checked').val();
					if(!checked){
						alert('修理案件を選択してください！');
						return false;
					}
				}
				if($('#wpl_date').is(":visible")){
					var date = $('input[name="wpl_date"]').val();
					if(!date){
						alert('発注日を入力してください！');
						return false;
					}
				}
				var file = $('input[name="data"]').val();
				if(!file){
					alert('ファイルを選択してください！');
					return false;
				}
			}
		});

		importClass.disp_init();
	},

	disp_init : function(){
		const TYTMP = 'トヨタモビリティ';
		var selected = $('select[name=sel_company]').children("option:selected");
		var display = selected.text().includes(TYTMP)? 'visible':'hidden'
		$('#wdc_list').css({"visibility":display});
		$('#wpl_date').css({"visibility":display});
	}
}

$(document).ready(importClass.init);
