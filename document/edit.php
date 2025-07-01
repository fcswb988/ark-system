<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();

$replace["page_title"] = "書類管理";
$replace["page_title_sub"] = "書類管理";

$file_name = "./edit.tpl.html";

$flexFunc = new flexFunc();

$form["seq"] = 22;

if ($form["view_mode"] == "final"){
	$form["sub_seq"] = $form["wdc_wdcseq"];
	$form["wdc_wdcseq"] = $form["wdc_wdcseq"];
	$replace = $flexFunc -> save_act($replace);
	$replace["final_view"] = true;
} else if ($form["view_mode"] == "confirm"){
	$replace["detail_view"] = $flexFunc -> load_confirm();
	$replace['submit_btn'] = ($flexFunc -> conf_err_count == 0) ? true: false;
	$replace['err_view'] = ($flexFunc -> conf_err_count == 0) ? false: true;
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["now_mode"] = $form["md"];
	$replace["edit_view"] = true;
	$replace["view_mode"] = "final";
	$replace["submit_btn_txt"] = "保存する";
} else if ($form["view_mode"] == "delete"){
	$replace["detail_view"] = $flexFunc -> delete_confirm();
	$replace['submit_btn'] = true;
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["now_mode"] = $form["view_mode"];
	$replace["edit_view"] = true;
	$replace["delete_view"] = true;
	$replace["view_mode"] = "final";
	$replace["submit_btn_txt"] = "削除する";
} else {
	$replace["detail_view"] = $flexFunc -> load_edit();
	$replace['submit_btn'] = true;
	$replace["main_seq"] = intval($form["main_seq"]);
	if (empty($form["view_mode"])){
		$form["view_mode"] = "insert";
	}
	$replace["now_mode"] = $form["view_mode"];
	$replace["edit_view"] = true;
	$replace["view_mode"] = "confirm";
	$replace["submit_btn_txt"] = "確認画面へ";
}

$replace["wdc_type"] = $form["wdc_type"];
$replace["wdc_wdcseq"] = $form["wdc_wdcseq"];

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;

