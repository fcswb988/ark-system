window.onload = () => {
	const videoWidth  = 600;
	const videoHeight =  400;
	const offset      = (videoWidth - videoHeight)/2;

//	const video  = document.getElementById('video');
	const video  = $("#video")[0];
	video.width  = videoWidth;
	video.height = videoWidth;

	const canvas  = $('#canvas')[0];
	canvas.width  = videoWidth;
	canvas.height = videoHeight;
	const ctx     = canvas.getContext("2d")

	$("#camera").hide();

	navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			width:	videoWidth,
			height:	videoWidth,
			// height: videoHeight,
	      		facingMode: "environment"
		}
	}).then( (stream) => {
		video.srcObject = stream;
		video.play();
		video.onloadedmetadata = (e) => {
			video.play();
			console.log(e);
		}
		setInterval(function(){
			// ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
			ctx.drawImage(video,
				0, offset, videoWidth, videoHeight,
				0,      0, videoWidth, videoHeight
			);
		}, 100);
	}).catch(function(e) {
		alert(e);
	});

	$('#takePhoto').on('click', function(){
		$("#camera").show();
	});

	$('#end').on('click', function(){
		$("#camera").hide();
	});


    document.querySelector("#take").addEventListener("click", () => {

 //       const ctx = c.getContext("2d");
        const c = canvas;
        const v = video;
    	var base_num = $('input[name=main_seq]').val();
    	const uploadURL = './condition.php?md=file_upload&base_num='+base_num+'&num='+'1';
        v.pause();
        setTimeout( () => {
            v.play();
        }, 1000);

		ctx.drawImage(video,
				0, offset, videoWidth, videoHeight,
				0,      0, videoWidth, videoHeight
		);
        c.toBlob(function(blob) {
            var img = document.createElement("img");
            url = URL.createObjectURL(blob);
            img.onload = function() {
                URL.revokeObjectURL(url);
            }

            const fd = new FormData();
//            fd.append("upfile", blob)
//            fd.append("tfl_seq", "204")
//            fd.append("tfl_name", "wcd_photo")
            fd.append("file", blob)
            fd.append("md", "file_upload")
            fd.append("base_num", base_num)
            fd.append("num", "1")

            const param = {
                method: "POST",
                body: fd

            }
    		fetch(uploadURL, param)
//            fetch("/testPhotoUp/test.php", param)
    		.then(function (data) {
    			return data.json(); // 読み込むデータをJSONに設定
    		})
    		.then(function (json) {
				var file_path = json.file_path;
				var file_path_full = json.file_path_full;
				if (!file_path_full){
					alert('写真のアップロードに失敗しました。');
					return false;
				} else {
					$.each($('.photoList .directImage'), function(){
						if (!$(this).find('input').length){
							var c_name = $(this).attr('id').substr(5);
							$(this)
								.append($('<img/>').attr('src', file_path_full))
								.append($('<input/>').attr({type: 'hidden', value: file_path, name: 'txt_'+c_name}))
								.append($('<input/>').attr({type: 'hidden', value: file_path_full, name: 'file_'+c_name}))
								.append($('<input/>').attr({type: 'button', value: '削除', alt: 'file_'+c_name}).addClass('delImageBtn').click(imageFunc.directImageAct));
							$(this).parents('li').find('.imageLoadFrame').hide();
							return false;
						}
					});
				}
    		})
/*
            .then((response)=>{
                if (response) {
                    console.log(response)
                }
            })
            .then((data)=>{
                console.log(data)
            })
            .then(result => {
                if (result) {
                    console.log(result)
                }
            })
*/
            .catch((error)=>{
                console.log('Error:', error)
            });
        }, "image/png", 0.95);
/*
		var param = {body: fd, md: "upload",tfl_seq: "204", tfl_name: "wcd_photo"};
//		$.post('../system2/flex/upload.php', param, function(res){
   		$.post('https://localhost/testPhotoUp/test.php', param, function(res){
			if (res.status) {
				alert(res);
			}

		});
*/
    });
}
