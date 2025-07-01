
var commonClass = {};

commonClass.isMenuOpen = false;

commonClass.init = function(){
    $('.parentSubmit').click(commonClass.parentSubmit);
    $('.formClear').click(commonClass.formClear);

    $('.spMenuIcon a').click(commonClass.spMenuOpen);

    var param = {};
    param.ww = $(window).width();
    $.post('/set_win_size.php', param);

    if ($('input[name=wcd_level]').length){
        $('input[name=wcd_level]').click(commonClass.levelInputClick);
        commonClass.levelInputFcs = 0;
        $.each($('input[name=wcd_level]'), function(){
            var num = $(this).val();
            $(this).parents('label').addClass('levelLabel');
            $(this).parents('label').addClass('levelLabel'+num);
            if ($(this).prop('checked')){
                $(this).parents('label').addClass('levelLabelFcs');
                commonClass.levelInputFcs = num;
            }
        });

        commonClass.levelInputReInit();
    }

    $('a[href^="#"]').click(function(){
        var speed = 400;
        var href= $(this).attr("href");
        if (href == '#') return false;
        var target = $(href == "#" || href == "" ? 'html' : href);
        if (target.length){
            var position = target.offset().top;
            $('body,html').animate({scrollTop:position}, speed, 'swing');
        } else if (href.match(/level/i)){
            var num = href.match(/([0-9]+)/);
            if (num && num[0]){
                var x = Number(num[0]);
                while (x < 10){
                    x += 1;
                    if ($('#level'+x).length){
                        var position = $('#level'+x).offset().top;
                        $('body,html').animate({scrollTop:position}, speed, 'swing');
                        break;
                    }
                }
            }
        }
        return false;
    });

    $('.directSave').on('click', commonClass.directSaveMode);

    $('.addButtonNext').on('click', function(){
        $(this).parents('form').find('input[name=add_next]').val('1');
        $(this).parents('form').eq(0).submit();
    });

    $('.loadMoreDatas').on('click', commonClass.loadMoreDatas);
    $('.loadMoreDatasVL').on('click', commonClass.loadMoreDatasVL);

    $('.duplicateConfirm').on('click', function(){
        var link_url = $(this).attr('rel');
        if (window.confirm("データを複製します。\nよろしいですか？")){
            window.location.href = link_url;
        }

        return false;
    });

    if ($('.editBox .removeRepair').length){
        commonClass.setRemoveRepairInit();
    }

    if ($('#nameBaloonBox').length){
        commonClass.setNameBaloonBoxInit();
    }

    $(document).on('keydown keyup', '.positive-number', function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });

    $('.partAdd, .workListAdd').on('click', function () {
        $(".fancybox-container").css("display", "none")
    });

    $('.openMap').on('click', function(){
        var addr = $("#"+$(this).attr('rel')).val();
        var link_url = $(this).attr('href') + addr;
        $(this).attr('href', link_url)
    //    $(this).attr('target' , '_blank');
        return true;
    });

	if($(".datePicker").length){
		$(".datePicker").datepicker({
			buttonImage: "/img/calendar.png",
			buttonImageOnly: true,
			showOn : "button",
			dateFormat: "yy-mm-dd",
			firstDay: 1,
			showButtonPanel: true,
			changeMonth: true,
		});
	}

}

commonClass.setNameBaloonBoxInit = function(){
    $.each($('a[data-name]'), function(){
        $(this).hover(function(){
            var nm = $(this).attr('data-name');
            var details = $(this).attr('data-details')? $(this).attr('data-details'):null;
            var color = $(this).attr('data-color');

            for(var col=1; col<=24; col++){
                $('#nameBaloonBox').removeClass('color'+col);
            }
            if (nm){
                var ww = $(this).width();
                var off = $(this).offset();

                var half_ww = Math.round(ww / 2);
                var left_pos = (off.left + half_ww);

                console.log(color);

                $('#nameBaloonBox').css({
                    left: left_pos+'px',
                    top: (off.top - 10)+'px'
                });
                if (color){
                    $('#nameBaloonBox').addClass('color'+color);
                }
                $('#nameBaloonBox dt').html(nm);
                $('#nameBaloonBox dd').html(details);

                $('#nameBaloonBox').show();

                var win_ww = $(window).width();
                var obj_ww = $('#nameBaloonBox').width();
                obj_ww = Math.round(obj_ww / 2) + 12;

                var max_left = (win_ww - obj_ww);
                var min_left = obj_ww;

                if (min_left > left_pos){
                    $('#nameBaloonBox').css({
                        left: min_left+'px'
                    });
                } else if (max_left < left_pos){
                    $('#nameBaloonBox').css({
                        left: (win_ww - obj_ww)+'px'
                    });
                }
            }
        }, function(){
            $('#nameBaloonBox').hide();
        });
    });
}

commonClass.setRemoveRepairInit = function(){
    $('.editBox .removeRepair').on('click', function(){
        commonClass.removeRepairButton = $(this);
        var data_name = ($(this).attr('data-name')) ? $(this).attr('data-name'): '（未登録）';
        var data_regist = ($(this).attr('data-regist')) ? $(this).attr('data-regist'): '（未登録）';

        $('.confirmWindow .carName').html(data_name);
        $('.confirmWindow .registDate').html(data_regist);

        $('.confirmWindow,#maskFull').fadeIn();
    });

    $('.confirmWindow .removeActionButton').on('click', function(){
        var params = $(commonClass.removeRepairButton).attr('rel');
        var param = 'md=removeRepair&'+params;
        console.log(param);
        $.post('./', param, function(res){
            if (res.success){
                //項目削除
                $(commonClass.removeRepairButton).parents('table').remove();
            } else if (res.error){
                alert(res.error);
            }
        }, 'json');

        $('.confirmWindow,#maskFull').fadeOut();
    });

    $('.confirmWindow .removeCancelButton').on('click', function(){
        $('.confirmWindow,#maskFull').fadeOut();
    });

    $('#maskFull').on('click', function(){
        $('.confirmWindow,#maskFull').fadeOut();
    });
}

commonClass.loadMoreDatas = function(){
    console.log('click');
    $(this).off('click');
    $(this).blur();

    var param = $(this).attr('rel');

    $.post("./", param, commonClass.loadMoreDatasAsm, 'json');

    return false;
}

commonClass.loadMoreDatasVL = function(){
    console.log('click');
    $(this).off('click');
    $(this).blur();

    var param = $(this).attr('rel');

    $.post("./", param, commonClass.loadMoreDatasVLAsm, 'json');

    return false;
}


commonClass.loadMoreDatasAsm = function(res){
    if (res.repair_list){
        for(i=0; i<res.repair_list.length; i++){
            var part = res.repair_list[i];
            var insideBox = $('<div/>').addClass('insideBox');

            //写真
            var photoTag = $('<p/>').addClass('photo');
            $(photoTag).append(
                $('<a/>').attr('href', part.link_url).append(
                    $('<img/>').attr('src', part.photo_url)
                )
            );

            if (part.comp_date){
                var alertView = $('<span/>').addClass('alertView').html('納車予定日です');
                $(photoTag).append(alertView);
            }

            $(insideBox).append(photoTag);

            //タイトル
            var user_name = (part.wcm_company) ? part.wcm_company+'<br>'+part.wcm_name: part.wcm_name;
            $(insideBox).append(
                $('<p/>').addClass('title').html(user_name)
            );

            //詳細情報
            var detail_html = $('<dl/>');
            $(detail_html).append(
                $('<dt/>').html('車種')
            ).append(
                $('<dd/>').html(part.wmk_name+'&nbsp;'+part.wrp_body_type+'&nbsp;')
            );

            $(detail_html).append(
                $('<dt/>').html('登録番号')
            ).append(
                $('<dd/>').html(part.wrp_regist_area+' '+part.wrp_regist_class+' '+part.wrp_regist_hira+' '+part.wrp_regist_number+'&nbsp;')
            );

            $(detail_html).append(
                $('<dt/>').html('納車予定日')
            ).append(
                $('<dd/>').html(part.wdc_delivered_date+'&nbsp;')
            );

            $(detail_html).append(
                    $('<dt/>').html('種別')
                ).append(
                    $('<dd/>').html(part.wdc_type+'&nbsp;')
                );

/*            $(detail_html).append(
                    $('<dt/>').html('状態')
                ).append(
                    $('<dd/>').html(part.wdc_status+'&nbsp;')
                );

            $(detail_html).append(
                $('<dt/>').html('重要度')
            ).append(
                $('<dd/>').append(
                    $('<img/>').attr({
                        src: '/img/icon_imp'+part.wdc_important+'.png',
                        width: '55%'
                    })
                )
            );
*/
            $(insideBox).append(detail_html);

            //リンクボタン
            var link_html = $('<p/>').addClass('aC').append(
                $('<a/>').attr('href', part.link_url).addClass('button buttonCircleArrow').html('詳細を見る')
            );

            $(insideBox).append(link_html);

            $('.repairIndexBox').append(insideBox);
        }
    }

    if (res.button_param){
        $('.loadMoreDatas').attr('rel', res.button_param);
        $('.loadMoreDatas').on('click', commonClass.loadMoreDatas);
    } else {
        $('.loadMoreDatas').hide();
    }

    console.log(res);
}

commonClass.loadMoreDatasVLAsm = function(res){
    if (res.repair_list){
    	var tr = $('.repairTbody').children('tr').last();
        for(i=0; i<res.repair_list.length; i++){
            var part = res.repair_list[i];
            var alertView = "";
            if (part.comp_date){
            	alertView = '<span class="newMark">納車予定日です</span><br>';
            }
        	var new_tr = tr.clone();
        	var customer = part.wcm_company? part.wcm_company + '<br>' + part.wcm_name : part.wcm_name
        	new_tr.html(`
       			<td class="photo aC">
       			<a href="${part.link_url}">
       			<img class="thumb" src="${part.photo_url}" alt=""></a></td>
       			<td class="aC">${customer}</td>
       			<td class="aC">${part.wmk_name}&nbsp;${part.wrp_body_type}&nbsp;</td>
       			<td class="aC">${part.wdc_type}</td>
       			<td class="aC">${alertView}${part.wdc_delivered_date}</td>
       			<!-- <td class="aC"><a href="${part.link_url}" class="button">詳細</a></td> -->

        	`);

        	for(j=0; j<part.cal_list.length; j++){
                var cal = part.cal_list[j];
                new_tr.append(
    				$('<td/>').attr({
    					class: cal.type_class
    				}).html(cal.title)
    			);
            }

        	tr.after(new_tr);
        	tr = new_tr;
        }
    }

    if (res.button_param){
        $('.loadMoreDatasVL').attr('rel', res.button_param);
        $('.loadMoreDatasVL').on('click', commonClass.loadMoreDatas);
    } else {
        $('.loadMoreDatasVL').hide();
    }

    console.log(res);
}

commonClass.directSaveMode = function(){
    if (window.confirm('保存します。よろしいですか？')){
        var param = new FormData($(this).parents('form').get(0));

        $.ajax({
            url: '/system2/flex/direct_save.php',
            type: 'post',
            data: param,
            processData: false,
            contentType: false
        }).done(function(res){
            alert('登録が完了しました。');
        });
    }
    return false;
}

commonClass.levelInputFcs = 0;
commonClass.levelInputClick = function(){
    commonClass.levelInputFcs = $(this).val();
    $('.levelLabel').removeClass('levelLabelFcs');
    $('.levelLabel').removeClass('levelLabelNo');
    $(this).parents('label').addClass('levelLabelFcs');
    commonClass.levelInputReInit();
}

commonClass.levelInputReInit = function(){
    for(i=1; i<=10; i++){
        if (i > commonClass.levelInputFcs){
            $('.levelLabel'+i).addClass('levelLabelNo');
        }
    }
}

commonClass.spMenuOpenFg = false;
commonClass.spMenuOpen = function(){
    if (commonClass.spMenuOpenFg){
        $('#header .gNavi').fadeOut();
        commonClass.spMenuOpenFg = false;
    } else {
        $('#header .gNavi').fadeIn();
        commonClass.spMenuOpenFg = true;
    }
}

commonClass.formClear = function(){
    $(this).parents('form').find('input[type=text],select').val('');
    $(this).parents('form').find('input[type=radio]').prop('checked', null);
    return false;
}

commonClass.parentSubmit = function(){
	var id = $(this).attr('id');
	var md = $(this).parents('form').find('input[name=md]');
	var md_val = md.val();
	if(id) {
		md.val(id);
	}
    $(this).parents('form').eq(0).submit();
	md.val(md_val);
    return false;
}

commonClass.childCloseAction = function(){
	$.fancybox.close();

	if (typeof directEditClass === 'undefined') return false;

	if (directEditClass.openParams){
		var param = directEditClass.openParams;
		param.md = 'load_datas';

		$.post('/flex/direct.php', param, function(res){
			if (res.datas.mfl_table){
				if (res.datas.mfl_table == 'w_directions'){
					$.each($('.directionsTable td,.directionsTable .rep'), function(){
						var rel = $(this).attr('rel');
						if (rel){
							$(this).html(res.datas[rel]);
						}
					});
				} else if (res.datas.mfl_table == 'w_parts_list'){
					directEditClass.buildPartsList(res.lists);

					$('.partsList th[rel=sum_days],.partsSumDays').html(res.datas.sum_days);
					$('.partsList th[rel=sum_price]').html(res.datas.sum_price);
				} else if (res.datas.mfl_table == 'w_work_list'){
					directEditClass.buildWorkList(res.lists);

					$('.workList th[rel=sum_p_price]').html(res.datas.sum_p_price);
					$('.workList th[rel=sum_w_price]').html(res.datas.sum_w_price);
					$('.workList th[rel=sum_price]').html(res.datas.sum_price);
				} else if (res.datas.mfl_table == 'w_outsc_list'){
					directEditClass.outscPartsList(res.lists);

					$('.outscList th[rel=sum_days],.outscSumDays').html(res.datas.sum_days);
					$('.outscList th[rel=sum_price]').html(res.datas.sum_price);
				}

				$.fancybox.close();
			}
		}, 'json');
	}
}

commonClass.refresh = function(){
	location.reload();
}


$(document).ready(commonClass.init);

function separate(num){
    num = String(num);
    var len = num.length;
    if(len > 3){
        return separate(num.substring(0,len-3))+','+num.substring(len-3);
    } else {
        return num;
    }
}

/**
 * Add commas for number
 *
 * @return {string}
 */
Number.prototype.format = function () {
    let parts = this.toString().split('.');
    parts[0] = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return parts.join('.');
};
String.prototype.format = function () {
    let str = this.replace(/[^\d\.\+\-]+/g, '');
    if (!str) {
        return this;
    }
    return (parseFloat(str) || 0).format();
};

