
var qrClass = {};

qrClass.init = function(){
	$('body').append(
		$('<div/>').addClass('qrReader').append(
			$('<p/>').append(
				$('<a/>').attr({href: '#'}).html('QR読込').on('click', qrClass.qrEntryButton)
			)
		).append(
			$('<input/>').attr({type: 'text', name: 'loadQrData'}).on('keydown', qrClass.qrReadAct)
//		).append(
//			$('<input/>').attr({type: 'file', id: 'file', name: 'files'}).on('change', qrClass.qrReadFile)
		)
	);

}

const fuelType = ['ガソリン','軽油','LPG','不明','電気']

var qrstr = '';
qrClass.is_load_a = false;
qrClass.is_load_b = false;
var codesArray;

qrClass.qrEntryButton = function(){
	if ($('.qrReader').hasClass('fcs')){
		$('.qrReader').removeClass('fcs');
		$('.qrReader input').off('blur');
		$('#js-reader').removeClass('is-show')
	} else {
		$('.qrReader').addClass('fcs');
		$('.qrReader input').on('blur', function(){
			setTimeout(function(){
				$('.qrReader input').focus();
			}, 10);
		});
		$('.qrReader input').css('display','block');
		$('.qrReader input').val('');
		$('.qrReader input').focus();
		$('.qrBox').remove();
		$('.qrBoxD').remove();
    	$('#js-reader').addClass('is-show')

		qrClass.is_load_a = false;
		qrClass.is_load_b = false;
		codesArray = new Array(5);
	}

	return false;
}

qrClass.qrReadAct = function(e){
	if (e.which == 13){
		var rawValue = $(this).val();
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

		$(this).val('');
		qrstr = '';

		if (qrClass.is_load_a && qrClass.is_load_b){
			$('.qrReader').removeClass('fcs');
			$('.qrReader input').off('blur');
			$('#js-reader').removeClass('is-show')
			$('.qrReader input').css('display','none');
			var wrp_format_body = $('#input_wrp_format_body').val();
			var dataInput = {md: 'get_carname', format_body: wrp_format_body};
			$.post('./repair_new.php', dataInput, function(res) {
				if (res.status) {
					$('#input_wrp_wmkseq').val(res.wmkseq);
					$('#input_wrp_body_type').val(res.body_type);

				}
			}, 'json');

		}
	} else {
		qrstr += e.key +'';
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
				codesArray[0] = qrClass.convCode(qrstr)	//２個セットの左
				$('.qrBox')[3].style.background = '#64992C';
			}
		} else {
			if(rawValue != '1//////'  && !rawValue.match(/^M\d{16}/) ){
				if(part[part.length-1].match(/^0\d$/)){
					codesArray[4] = rawValue	//３個セットの右
					$('.qrBox')[2].style.background = '#64992C';
				} else if(part.length <= 5){
					codesArray[1] = qrClass.convCode(qrstr)	//２個セットの右
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

	if(codesArray[0] && codesArray[1]){
	    v_len = outval1.split('/');
	    if(v_len.length == 6){
	    	var v_len1 = v_len[1];
//			var detectedEncoding = Encoding.detect(v_len1);
//			if(detectedEncoding == 'SJIS'){
//				var v_len1 = Encoding.convert(v_len1, "UNICODE", detectedEncoding);
//			}
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
	        qrClass.is_load_b = true
	    } else {
			$('.qrBox')[3].style.background = '';
			$('.qrBox')[4].style.background = '';
	    }
	}
	if(codesArray[2] && codesArray[3] && codesArray[4]){
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
	        qrClass.is_load_a = true
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
		qrClass.is_load_a = true
		$('.qrBox')[0].style.background = '#64992C';
	} else {					//５個目
		var v_len2 = qrClass.convCode(qrstr.split('/')[2]);
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
		qrClass.is_load_b = true
		$('.qrBox')[1].style.background = '#64992C';
	}
}

qrClass.convCode = function(pstr){
	var codes = [];
	var str = pstr.replace(/Shift/g, '');
    for (let i = 0; i < str.length; i++) {
    	s_code = str.substr(i).match(/^(Alt\d+)/);
    	if(s_code) {
    		var n = Number(s_code[1].substr(3));
    		codes.push(n >> 8);	// 上位ビット
    		codes.push(n & parseInt("00FF", 16));	// 下位ビット
    		i += s_code[1].length-1;
    	} else {
    		codes.push(str.charCodeAt(i));
    	}
    }
	var str = str.replace(/Alt/g, '');
	var detectedEncoding = Encoding.detect(codes);
    var unicodeString = Encoding.convert(codes, {to: 'unicode', from: detectedEncoding, type: 'string'});
	return unicodeString;

}


$(document).ready(qrClass.init);

/*
qrClass.swapNumber = function(txt){
	var rep_str = 'OPQRSTUVWX';
	var rep_ary = {};
	for(i=0; i<rep_str.length; i++){
		var h = rep_str.substr(i, 1);
		rep_ary[h] = i;

	}

	var res = '';
	for(i=0; i<txt.length; i++){
		var tmp = txt.substr(i, 1);
		if (tmp == '"') continue;
		res += String(rep_ary[tmp]);
	}
	return res;
}

qrClass.qrReadFile = function(event){
	file = event.target.files[0];
	var reader = new FileReader();
    reader.onload = function(e) {
      var codes = new Uint8Array(e.target.result);
      var detectedEncoding = Encoding.detect(codes);
      try {
        var rawResult = String.fromCharCode.apply(null, codes);

        var unicodeString = Encoding.convert(codes, {
          to: 'unicode',
          from: detectedEncoding,
          type: 'string'
        });

		$("[name=loadQrData]").val(unicodeString);
      } catch (e) {
        // Uncaught RangeError: Maximum call stack size exceeded
        alert('ファイルサイズが大きすぎます');
      }
    };
    reader.readAsArrayBuffer(file);
}
*/


