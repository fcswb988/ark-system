var fileupClass = {};

fileupClass.init = function(){
//	if ($('input[name=view]').val() == "finish"){
	if (false){
		$('.topCheck').parents('label').hide();

		var top_photo = $('input[name=top_photo]').val();
		if (top_photo){
			$('.photo_num'+top_photo+' .aC').addClass('fcs');
			$('.photo_num'+top_photo+' .aC label').show();
		}
	} else {
		if($("#dragArea").css('display') != 'none'){
			fileupClass.obj = $("#dragArea");
		} else {
			fileupClass.obj = $("#photoUpArea");
		}

		fileupClass.obj.on('dragenter', function (e){
		    e.stopPropagation();
		    e.preventDefault();
		    $(this).css('background-color', '#64992C');
		});

		fileupClass.obj.on('dragover', function (e){
		     e.stopPropagation();
		     e.preventDefault();
		});

		fileupClass.obj.on('drop', function (e){
			$('#dragStatus').fadeIn();
		    $(this).css('background-color', '#fff');
			e.preventDefault();
			var files = e.originalEvent.dataTransfer.files;

			fileupClass.handleFileUpload(files,fileupClass.obj);
		});

		$('#btnFileSelect').on('click', function (e){
			$('#fileselect').click();
			return false;
		});

		$('#btnDirSelect').on('click', function (e){
			$('#dirselect').click();
			return false;
		});

		$('#fileselect, #dirselect').on('change', function (e){
			var files = e.target.files;
			fileupClass.handleFileUpload(files,fileupClass.obj);

		});

		$(document).on('dragenter', function (e){
			e.stopPropagation();
			e.preventDefault();
		});

		$(document).on('dragover', function (e){
			e.stopPropagation();
			e.preventDefault();
			fileupClass.obj.css('background-color', '#FFF');
		});

		$(document).on('drop', function (e){
			e.stopPropagation();
			e.preventDefault();
		});

		fileupClass.sort_list_src = Array();
		$.each($('form .photoList li'), function(){
			var src = $(this).find('iframe').attr('src');
			fileupClass.sort_list_src.push(src);
		});

		$('form .photoList').sortable({
			update: function(e, ui) {
				var cnt = 1;
				$.each($('form .photoList li'), function(){
					var id_name = (cnt == 1) ? 'file_wcd_photo': 'file_wcd_photo'+cnt;
					var dat_name = (cnt == 1) ? 'txt_wcd_photo': 'txt_wcd_photo'+cnt;
					var top_name = 'top_photo'+cnt;

					$(this).find('.directImage').attr('id', id_name);
					$(this).find('.delImageBtn').attr('alt', id_name);
					$(this).find('.prevPath').attr('name', id_name);
					$(this).find('.datPath').attr('name', dat_name);
					$(this).find('.topCheck').attr('name', top_name);

					var open_name = (cnt == 1) ? 'wcd_is_open': 'wcd_is_open'+cnt;
					$(this).find('.openfgCheck').attr('name', dat_name);

					///system2/flex/upload.php?tfl_name=wcd_photo8&amp;tfl_seq=212
					$(this).find('iframe').attr('src', fileupClass.sort_list_src[(cnt - 1)]);

					cnt++;
				});
			}
		});

		$('.topCheck').on('click', function(){
			if ($(this).prop('checked')){
				$('.topCheck').prop('checked', null);
				$(this).prop('checked', 'checked');
			} else {
				$('.topCheck').prop('checked', null);
			}
		});

		var vl = $('input[name=top_photo]').val();

		if (vl){
			$('input[name=top_photo'+vl+']').prop('checked', 'checked');
		}

		$('input[name=upPhoto]').on('change', function (event){
			// ファイルリストを取得
			var files = event.target.files;
			fileupClass.handleFileUpload(files,fileupClass.obj);
/*
			// ファイルの数を取得
			var fileCount = files.length;
			// HTML文字列の生成
			var fileListBody = "選択されたファイルの数 = " + fileCount + "<br/><br/>¥r¥n";
			// 選択されたファイルの数だけ処理する
			for ( var i = 0; i < fileCount; i++ ) {
			    // ファイルを取得
			    var file = files[ i ];
			    // ファイルの情報を文字列に格納
			    fileListBody += "[ " + ( i + 1 ) + "ファイル目 ]<br/>¥r¥n";
			    fileListBody += "name             = " + file.name + "<br/>¥r¥n";
			    fileListBody += "type             = " + file.type + "<br/>¥r¥n";
			    fileListBody += "size             = " + file.size + "<br/>¥r¥n";
			    fileListBody += "lastModifiedDate = " + file.lastModifiedDate + "<br/>¥r¥n";
			    fileListBody += "lastModified     = " + file.lastModified + "<br/>¥r¥n";
			    fileListBody += "<br/>¥r¥n";
			}
		    var zzz = fileListBody;
*/
		});
	}
}

fileupClass.handleFileUpload = function(files,obj){
	for (var i = 0; i < files.length; i++){
		var fd = new FormData();
		fd.append('file', files[i]);

		var status = new createStatusbar(obj); //Using this we can set progress.
		status.setFileNameSize(files[i].name,files[i].size);
		fileupClass.sendFileToServer(fd, status, i);
	}
}

fileupClass.sendFileToServer = function(formData, status, num){
	var base_num = $('input[name=main_seq]').val();
	var uploadURL = './condition.php?md=file_upload&base_num='+base_num+'&num='+num;

	var jqXHR=$.ajax({
		xhr: function(){
			var xhrobj = $.ajaxSettings.xhr();
			if (xhrobj.upload) {
				xhrobj.upload.addEventListener('progress', function(event) {
					var percent = 0;
					var position = event.loaded || event.position;
					var total = event.total;
					if (event.lengthComputable) {
						percent = Math.ceil(position / total * 100);
					}
					//Set progress
					status.setProgress(percent);
				}, false);
			}
			return xhrobj;
		},
		url: uploadURL,
		type: "POST",
		contentType:false,
		processData: false,
		cache: false,
		data: formData,
		success: function(data){
			status.setProgress(100);
			fileupClass.listAsm(data);
		},
		dataType: 'json'
	});
	status.setAbort(jqXHR);
}

fileupClass.listAsm = function(res){
	if (!res.file_path_full){
		alert('写真のアップロードに失敗しました。');
		return false;
	} else {
		$.each($('.photoList .directImage'), function(){
			if (!$(this).find('input').length){
				var c_name = $(this).attr('id').substr(5);
				$(this)
					.append($('<img/>').attr('src', res.file_path_full))
					.append($('<input/>').attr({type: 'hidden', value: res.file_path, name: 'txt_'+c_name}))
					.append($('<input/>').attr({type: 'hidden', value: res.file_path_full, name: 'file_'+c_name}))
					.append($('<input/>').attr({type: 'button', value: '削除', alt: 'file_'+c_name}).addClass('delImageBtn').click(imageFunc.directImageAct));
				$(this).parents('li').find('.imageLoadFrame').hide();
				return false;
			}
		});
	}
}

function createStatusbar(obj){
     this.statusbar = $("<div class='statusbar'></div>");
     this.filename = $("<div class='filename'></div>").appendTo(this.statusbar);
     this.size = $("<div class='filesize'></div>").appendTo(this.statusbar);
     this.progressBar = $("<div class='progressBar'><div></div></div>").appendTo(this.statusbar);
     this.abort = $("<div class='abort'>Abort</div>").appendTo(this.statusbar);
     $('#dragStatus').append(this.statusbar);

    this.setFileNameSize = function(name,size){
        var sizeStr="";
        var sizeKB = size/1024;
        if(parseInt(sizeKB) > 1024)
        {
            var sizeMB = sizeKB/1024;
            sizeStr = sizeMB.toFixed(2)+" MB";
        }
        else
        {
            sizeStr = sizeKB.toFixed(2)+" KB";
        }

        this.filename.html(name);
        this.size.html(sizeStr);
    }
    this.setProgress = function(progress){
        var progressBarWidth = progress*this.progressBar.width()/ 100;
        this.progressBar.find('div').animate({ width: progressBarWidth }, 10).html(progress + "% ");

        if(parseInt(progress) >= 100){
            this.statusbar.fadeOut(500, function(){
            	$(this).remove();
            	if ($('#dragStatus .statusbar').length == 0){
            		$('#dragStatus').fadeOut();
            	}
            });
        }
    }
    this.setAbort = function(jqxhr){
        var sb = this.statusbar;
        this.abort.click(function()
        {
            jqxhr.abort();
            sb.hide();
        });
    }
}

$(document).ready(fileupClass.init);
