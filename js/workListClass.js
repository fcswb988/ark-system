
var workListClass = {

	init : function(){
		$('#work').on('click', '.addRow', function() {workListClass.addWorkRow("", false)});
		$('#work').on('click', '.open_pop_work', function() {workListClass.addWorkOpen()});
		$("#work").on('change', 'input[name="txt_wwl_title"]', function() {workListClass.saveRow($(this))});
		$('#work').on('click', '.updateRow', function() {workListClass.saveRow($(this))});
		$('#work').on('click', '.copyRow', function() {workListClass.copyRow($(this))});
		$('#work').on('click', '.delRow', function() {workListClass.delRow($(this))});

		$('#work').on('click', '.worksViewCheck', function(){directEditClass.toggleCheckWorkList(true);});
		$('#work').on('click', '.worksViewRemove', function(){directEditClass.toggleCheckWorkList(false);});
		$('#work').on('click', '.worksViewSelect', function(){workListClass.worksViewSelect($(this));});

		$('.workList tbody').sortable({
			stop: function(){
			workListClass.sortWorkTable();
			}
		});

		$('#addWorkWindow').on('click', '.close', workListClass.popWorkClose);
		$('#addWorkWindow').on('click', '.mwc_title', function(){workListClass.workClassSelect($(this))});
		$('#addWorkWindow').on('click', '.select', workListClass.workSelect);

	},

	//作業内容追加
	addWorkRow : function (title, isSave) {
		var tbody = $('table .tbodyWorkListAdd');
		var wdc_seq = $('input[name=wdc_seq]').val();
		var tr = $('<tr class="openData"></tr>');
		tr.html(`
			<td class="work-content aR">
			<div style="display: flex;align-items: center">
				<input type="checkbox" name="wwl_is_open" value="1" class="worksViewSelect" style="margin-right: 11px;" checked="checked">
				<input type="text" name="txt_wwl_title" value="${title}" id="input_wwl_title" class=" txtsize70 imeon">
			</div>
			</td>
			<td class="saveArea" colspan="3"><button class="button buttonMini buttonBlue saveRow">保存</button><button class="button buttonMini buttonGray ml10 delTr">キャンセル</button>
				<form action="/flex/final.php" method="post" enctype="multipart/form-data" class="hidden">
					<input type="hidden" name="seq" value="21"><input type="hidden" name="md" value="insert">
					<input type="hidden" name="main_seq" value="0"><input type="hidden" name="sub_seq" value="${wdc_seq}">
					<input type="hidden" name="view_sys" value="iframe">
				</form>
			</td>
		`);
		var selbox = $('#template').find('[name=wwl_unit]');
		tr.find('.unit').append(selbox.clone());
		tbody.append(tr);
		if(isSave){
//			directEditClass.storeNewWork(tr);
			workListClass.saveRow(tr.find('.saveRow'))
		}
	},

	//行保存
	saveRow : function (obj) {
		var tr = obj.closest('tr');
		var tbody = obj.closest('tbody');
		var saveRow = tr.find('.saveRow');
		saveRow.click(function () {
	//        alert('連続クリックは禁止しています。');
	        return false;
	    });
		var wdc_seq = $('[name=wdc_seq]').val();
		var seq = tr.find('[name=wwl_seq]').val();
		var is_open = tr.find('[name=wwl_is_open]').prop('checked')? 1:0;
		var title = tr.find('[name=txt_wwl_title]').val();
		var md = seq? 'update': 'insert';
//		var param = {md: md, column:{wol_seq: seq, wol_wdcseq: wdc_seq, wol_title: title, wol_wcpseq: wcpseq, wol_outsc: outsc, wol_price: price, wol_sort: sort},};
		var dataInput = {main_seq:seq, md:md, seq:"21", sub_seq:wdc_seq, txt_wwl_title:title, wwl_is_open: is_open
			,custom_ajax_for_update_work_list:"1", txt_wwl_amount:"", txt_wwl_p_price:"", txt_wwl_u_price:"", txt_wwl_w_price:"", view_sys:"iframe"}
//		$.post('./condition.php', param, function(res){
		$.post('/flex/final.php', dataInput, function(res) {
//			res = JSON.parse(res);
			if (res.status) {
				if(tr.find('.saveArea').size()){
					tr.find('.saveArea').remove();
					tr.append(`
						<td><input type="hidden" name="wwl_seq" value="${res.main_seq}">
							<a class="button buttonMini updateRow" href="javascript:;" >保存</a></td>
						<td><a class="button buttonMini copyRow" href="javascript:;">複製</a></td>
						<td><a class="button buttonMini delRow" href="javascript:;">削除</a></td>
					`)
				}
				if(!seq){
					tr.find('[name=wwl_seq]').val(res.main_seq)
					outScClass.sortRow(tbody, tr.index());
				}
			} else {
				alert(seq? '更新失敗！！': '追加失敗！！');
			}
			workListClass.sortWorkTable();
		}, 'json');
	},
	// 行削除
	delRow : function (obj) {
		if(!confirm('行を削除します。よろしいですか？')) return;
		var tr = obj.closest("tr");
		var tbody = obj.closest('tbody');
		var seq = tr.find('[name=wwl_seq]').val();
		var sortStart = tr.index();
		tr.remove();
		var dataInput = {md:"delete", main_seq:seq, seq:"21"}
		$.post('/flex/final.php', dataInput, function(res){
			if (res.status) {
	//			sortRow(sortStart);
			}
		}, 'json');
	},

	// 行選択（チェック）
	worksViewSelect : function(obj){
//		var param = {};
//		param.md = 'worksViewSelect';
//		param.wwl_seq = $(this).val();
//		param.wwl_is_open = $(this).prop('checked');
//		param.sub_seq = $('input[name=wdc_seq]').val();

		if (obj.prop('checked')) {
			obj.closest("tr").addClass("openData")
		} else {
			obj.closest("tr").removeClass("openData")
		}

		workListClass.saveRow(obj);
		// $.post('/flex/direct.php', param, function(res){
		// 	directEditClass.buildWorkList(res.lists);
		// }, 'json');
	},

	// 行ソート
	sortWorkTable : function () {
		var param = {};
		param.md = 'sortWorkList';
		param.sub_seq = $('input[name=wdc_seq]').val();

		var cnt = 0;
		$.each($('.workList tbody tr'), function(){
			cnt++;
			param['cnt' + cnt] = $(this).find('[name=wwl_seq]').val();
		});

		param.full_cnt = cnt;

		$.post('/flex/direct.php', param, function(res){
		//	;
		}, 'json');
	},

	// 行複製
	copyRow : function (obj) {
		var tr = obj.closest("tr");
		var tbody = obj.closest('tbody');

		var new_tr = tr.clone();
		new_tr.find('[name=wwl_seq]').val(null);
		tr.after(new_tr);
		workListClass.saveRow(new_tr.find('.copyRow'));
	},


	popWorkClose : function(){
		$('#maskFull').fadeOut();

		$('#addWorkWindow').fadeOut();
		return false;
	},

	addWorkOpen : function(){
		$('#maskFull').fadeIn();
		$('#addWorkWindow').hide();

		var param = {};
		param.md = 'load_add_work';

		$.post('/repair/condition.php', param, function(res){
			var tbody = $('#tbodyWorkClass');
			tbody.empty();
			$.each(res, function( index, value ) {
				var seq = value.mwc_seq
				var title = value.mwc_title
				var tr = $('<tr class="mwc_title"></tr>');
				tr.html(`
					<td>
					<input type="hidden" name="mwc_seq" value="${seq}"> ${title}
					</td>
				`);
				tbody.append(tr);
			});
			$('#addWorkWindow').fadeIn();

			$('body, html').animate({ scrollTop: 0 }, 200);
			$('#addWorkWindow').fadeIn(200);
		}, 'json');
	},

	workClassSelect : function(obj){
		$('#tbodyWorkClass td').css("background-color","white");
		obj.children('td').css("background-color","#92efec");
		var param = {};
		param.md = 'load_add_work_item';
		param.mwc_seq = obj.find('[name=mwc_seq]').val();
		$.post('/repair/condition.php', param, function(res){
			var tbody = $('#tbodyWorkItem');
			tbody.empty();
			$.each(res, function( index, value ) {
				var seq = value.mwi_seq;
				var title = value.mwi_title;
				var checked = value.mwi_init_on > 0? 'checked="checked"':'';
				var tr = $('<tr></tr>');
				tr.html(`
					<td class="mwi_title">
					<input class="selRow" type="checkbox" ${checked}>
					<input type="hidden" name="mwi_seq" value="${seq}"> ${title}
					</td>
				`);
				tbody.append(tr);
			});
		}, 'json');
	},

	workSelect : function(){
		var tbody = $('#tbodyWorkItem');
		$.each(tbody.children('tr'), function(){
			if($(this).find('.selRow').prop('checked')){
				workListClass.addWorkRow($(this).find('.mwi_title')[0].innerText, true);
			}
		});
//		workListClass.popWorkClose();
	},


}

$(document).ready(workListClass.init);
