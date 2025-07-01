
var qrClassSp = {};

qrClassSp.init = function(){
	$('body').append(
		$('<div/>').addClass('qrReader').append(
			$('<p/>').append(
				$('<a/>').attr({href: '#'}).html('QRカメラ読込').on('click', qrClassSp.qrEntryButton)
			)
		)
	);
}

qrClassSp.is_load_a = false;
qrClassSp.is_load_b = false;
var codesArray;

const fuelType = ['ガソリン','軽油','LPG','不明','電気']

const video = document.querySelector('#js-video')
var scanner

qrClassSp.qrEntryButton = function(){
	if ($('.qrReader').hasClass('fcs')){
		$('.qrReader').removeClass('fcs');
		$('#js-reader').removeClass('is-show')
		scanner.stop();
	} else {
		$('.qrReader').addClass('fcs');

		qrClassSp.is_load_a = false;
		qrClassSp.is_load_b = false;
		$('.qrBox').remove();
		$('.qrBoxD').remove();
		codesArray = new Array(5);
		initCamera();
	}

//	return false;
}

const checkImage = (content) => {
    if (content.length > 1) {
    	$('input[name=dummy]').val(content);
		checkCodes(content);
    }
    if(qrClassSp.is_load_a && qrClassSp.is_load_b) {
    	// 項目が全て埋まったら終了
		document.querySelector('#js-reader').classList.remove('is-show')
		$('.qrReader').removeClass('fcs');
		scanner.stop();
	}
}

const initCamera = () => {
	const videoTag = document.querySelector('#js-video')
    document.querySelector('#js-reader').classList.add('is-show')
    scanner = new Instascan.Scanner({ video: videoTag, mirror: false, refractoryPeriod: 400, scanPeriod: 1 });

    //QRコードを認識して情報を取得する
    scanner.addListener('scan', function (content, image) {
      checkImage(content);
    });

    //PCのカメラ情報を取得する
    Instascan.Camera.getCameras()
    .then(function (cameras) {
        //カメラデバイスを取得できているかどうか？
        if (cameras.length > 0) {
            //スキャンの開始
          scanner.start(cameras[0]);
        }
        else {
            alert('カメラが見つかりません！');
        }
    })
      .catch(function(err) {
        alert(err);
    });

}

const checkCodes = (rawValue) => {
	if(rawValue.match(/^K\/(?:\d\d)/) || rawValue.match(/^K\d\d/)){
		if ($('.qrBox').length == 0) {
			$('#js-result').append(
				// ☒　☒　☒　□　□　☒'
				$('<div/>').addClass('qrBoxD'),'　',$('<div/>').addClass('qrBoxD'),'　',$('<div/>').addClass('qrBoxD'),'　',$('<div/>').addClass('qrBoxD')
				,'　',$('<div/>').addClass('qrBox'),'　',$('<div/>').addClass('qrBox'),'　',$('<div/>').addClass('qrBoxD')
			);
		}
		if(rawValue.match(/^K\/(?:22|31)\//)){
			checkCodesK(rawValue)
		}
	} else {
		if ($('.qrBox').length == 0) {
			// □□□　□□'
			$('#js-result').append(
				$('<div/>').addClass('qrBox'),$('<div/>').addClass('qrBox'),$('<div/>').addClass('qrBox'),'　',$('<div/>').addClass('qrBox'),$('<div/>').addClass('qrBox')
			);
		}
		checkCodesF(rawValue)
	}
}

//普通車用
const checkCodesF = (rawValue) => {
	part = rawValue.split('/')
	if(part.length>0){
		if(part[0] == '2') {
			if(part.length >= 6){
				codesArray[2] = rawValue	//３個セットの左
				$('.qrBox')[0].style.background = '#64992C';
			} else {
				codesArray[0] = rawValue	//２個セットの左
				$('.qrBox')[3].style.background = '#64992C';
			}
		} else {
			if(rawValue != '1//////'  && !rawValue.match(/^M\d{16}/) ){
				if(part[part.length-1].match(/^0\d$/)){
					codesArray[4] = rawValue	//３個セットの右
					$('.qrBox')[2].style.background = '#64992C';
				} else if(part.length <= 5){
					codesArray[1] = rawValue	//２個セットの右
					$('.qrBox')[4].style.background = '#64992C';
				} else {
					codesArray[3] = rawValue	//３個セットの中央
					$('.qrBox')[1].style.background = '#64992C';
				}
			}
		}
	}

    outval1 = codesArray[0] + codesArray[1]
    outval2 = codesArray[2] + codesArray[3] + codesArray[4]
//	alert('AA:'+rawValue)

	if(codesArray[0].length>0 && codesArray[1].length>0){
	    v_len = outval1.split('/');
	    if(v_len.length == 6){
	    	var v_len1 = v_len[1];
			var detectedEncoding = Encoding.detect(v_len1);
			if(detectedEncoding == 'SJIS'){
				var v_len1 = Encoding.convert(v_len1, "UNICODE", detectedEncoding);
			}
	        han = v_len1.replace(/　/g,'').replace(/[Ａ-Ｚａ-ｚ０-９]/g,function(s){
	          return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
	        });
            var bar = han.match(/^([\u4E00-\u9FFFぁ-ん]+)([A-Za-z0-9]+)([ぁ-んー　])([A-Za-z0-9]+)$/)

	        //document.querySelector('#regist_number').innerText = bar[1]+'.'+bar[2]+'.'+bar[3]+'.'+bar[4]
	        document.querySelector('#input_wrp_regist_area').value = bar[1]
	        document.querySelector('#input_wrp_regist_class').value = bar[2]
	        document.querySelector('#input_wrp_regist_hira').value = bar[3]
	        document.querySelector('#input_wrp_regist_number').value = bar[4]
	        document.querySelector('#input_wrp_chassis_number').value = v_len[3]
	        document.querySelector('#input_wrp_format_mover').value = v_len[4]	//原動機の形式
	        qrClassSp.is_load_b = true
	    } else {
			$('.qrBox')[3].style.background = '';
			$('.qrBox')[4].style.background = '';
	    }
	}
	if(codesArray[2].length>0 && codesArray[3].length>0 && codesArray[4].length>0){
	    v_len = outval2.split('/');
	    if(v_len.length == 19){
	        document.querySelector('#input_wrp_format_number').value = v_len[2].substr(0, 5)
	        document.querySelector('#input_wrp_type_number').value = v_len[2].substr(5, 4)
	        yy = Number(v_len[3].substr(0, 2));
			mm = Number(v_len[3].substr(2, 2));
			dd = Number(v_len[3].substr(4, 2));
			yy += (yy > 50)? 1900 : 2000;
	        document.querySelector('#input_wrp_regist_lim_date').value = yy + '-' + mm + '-' + dd
			yy = Number(v_len[4].substr(0, 2));
			mm = Number(v_len[4].substr(2, 2));
			yy += (yy > 50)? 1900 : 2000;
	        document.querySelector('input[name=yy_wrp_first_date]').value = yy
	        document.querySelector('input[name=mm_wrp_first_date]').value = mm
	        document.querySelector('#input_wrp_format_body').value = v_len[5]
	        document.querySelector('#input_wrp_weight_ff').value = isNaN(v_len[6]) ? '': Number(v_len[6])*10
	        document.querySelector('#input_wrp_weight_fr').value = isNaN(v_len[7]) ? '': Number(v_len[7])*10
	        document.querySelector('#input_wrp_weight_rf').value = isNaN(v_len[8]) ? '': Number(v_len[8])*10
	        document.querySelector('#input_wrp_weight_rr').value = isNaN(v_len[9]) ? '': Number(v_len[9])*10
	        document.querySelector('#input_wrp_fuel_type').value = fuelType[Number(v_len[18])-1]
	        qrClassSp.is_load_a = true
	    } else {
			$('.qrBox')[0].style.background = '';
			$('.qrBox')[1].style.background = '';
			$('.qrBox')[2].style.background = '';
	    }
	}
}

//軽自動車用
const checkCodesK = (rawValue) => {
	v_len = rawValue.split('/')
	if(v_len[1] == '31') {		//４個目
		document.querySelector('#input_wrp_format_number').value = v_len[3].substr(0, 5)
		document.querySelector('#input_wrp_type_number').value = v_len[3].substr(5, 4)
        yy = Number(v_len[4].substr(0, 2));
		mm = Number(v_len[4].substr(2, 2));
		dd = Number(v_len[4].substr(4, 2));
		yy += (yy > 50)? 1900 : 2000;
		document.querySelector('#input_wrp_regist_lim_date').value = yy + '-' + mm + '-' + dd
		yy = Number(v_len[5].substr(0, 2));
		mm = Number(v_len[5].substr(2, 2));
		yy += (yy > 50)? 1900 : 2000;
        document.querySelector('input[name=yy_wrp_first_date]').value = yy
        document.querySelector('input[name=mm_wrp_first_date]').value = mm
		document.querySelector('#input_wrp_format_body').value = v_len[6]
        document.querySelector('#input_wrp_weight_ff').value = isNaN(v_len[7]) ? '': Number(v_len[7])*10
		document.querySelector('#input_wrp_weight_fr').value = isNaN(v_len[8]) ? '': Number(v_len[8])*10
		document.querySelector('#input_wrp_weight_rf').value = isNaN(v_len[9]) ? '': Number(v_len[9])*10
		document.querySelector('#input_wrp_weight_rr').value = isNaN(v_len[10]) ? '': Number(v_len[10])*10
		qrClassSp.is_load_a = true
		$('.qrBox')[0].style.background = '#64992C';
	} else {					//５個目
		var detectedEncoding = Encoding.detect(v_len[2]);
		if(detectedEncoding == 'SJIS'){
			var v_len2 = Encoding.convert(v_len[2], "UNICODE", detectedEncoding);
		}
		han = v_len2.replace(/　/g,'').replace(/[Ａ-Ｚａ-ｚ０-９]/g,function(s){
		  return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
		});
		var bar = han.match(/^([\u4E00-\u9FFFぁ-ん]+)([A-Za-z0-9]+)([ぁ-んー　])([A-Za-z0-9]+)$/)

		document.querySelector('#input_wrp_regist_area').value = bar[1]
		document.querySelector('#input_wrp_regist_class').value = bar[2]
		document.querySelector('#input_wrp_regist_hira').value = bar[3]
		document.querySelector('#input_wrp_regist_number').value = bar[4]
		document.querySelector('#input_wrp_chassis_number').value = v_len[4]
        document.querySelector('#input_wrp_format_mover').value = v_len[5]	//原動機の形式
		document.querySelector('#input_wrp_fuel_type').value = fuelType[Number(v_len[6])-1]
		qrClassSp.is_load_b = true
		$('.qrBox')[1].style.background = '#64992C';
	}
}

$(document).ready(qrClassSp.init);

