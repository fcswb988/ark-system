
var insuAgreeClass = {};

const PRINTED = ' ✓';

insuAgreeClass.init = function(){

	$('#sk_month').on('change', function(){
		var str_date_from = $('#sk_month').val();
		$('[name=sk_date_from]').val(str_date_from);
		var date = new Date(str_date_from);
		var date_to = new Date(date.getFullYear(), date.getMonth()+1, 0);
		$('[name=sk_date_to]').val(date_to.getFullYear()+'-'+(date_to.getMonth()+1)+'-'+date_to.getDate());

	});

	//一覧
	$('.agree_fg').on('click', function(){
		var $obj= $(this);
		var tr = $obj.closest('tr');
		var seq = tr.attr('id');
		var checked = $obj.prop("checked");
		var column = $obj.attr('name');

		var dataInput = {md: 'upd_agree_fg', wdc_seq: seq, column:{[column]: checked }};
		$.post('./insu_agree.php', dataInput, function(res) {
			res = JSON.parse(res);
			if (!res.status) {
				alert("更新失敗！！");
				return false;
			}
		}, 'html');
	});
}


$(document).ready(function()
{
	if(window.sessionStorage.getItem(['back'])){
		window.history.back();
		window.sessionStorage.removeItem(['back']);
	}
});

$(document).ready(insuAgreeClass.init);



