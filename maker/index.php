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
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "車体メーカー管理";
$replace["page_title_sub"] = "車体メーカー管理";

$flexFunc = new flexFunc();

$form["seq"] = 16;

if ($form["md"] == "sort") $flexFunc -> sort_func();

if ($form["view"] == "finish"){
	$replace = $flexFunc -> save_act($replace);
	$replace["view_finish"] = true;
} else if ($form["view"] == "confirm"){
	$replace["detail_view"] = $flexFunc -> load_confirm();
	$replace['submit_btn'] = ($flexFunc -> conf_err_count == 0) ? true: false;
	$replace['err_view'] = ($flexFunc -> conf_err_count == 0) ? false: true;
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["now_mode"] = $form["md"];
	$replace["view_confirm"] = true;
	$replace["editing_users"] = $flexFunc -> editing_users;
} else if ($form["view"] == "edit"){
	$replace["detail_view"] = $flexFunc -> load_edit();
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["now_mode"] = "update";
	$replace["view_input"] = true;
	$replace["editing_users"] = $flexFunc -> editing_users;
} else if ($form["view"] == "remove"){
	$replace["detail_view"] = $flexFunc -> delete_confirm();
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["now_mode"] = "delete";
	$replace["submit_btn"] = true;
	$replace["view_confirm"] = true;
	$replace["editing_users"] = $flexFunc -> editing_users;
} else if ($form["view"] == "new"){
	$replace["detail_view"] = $flexFunc -> load_detail();
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = "0";
	$replace["now_mode"] = "insert";
	$replace["view_input"] = true;
	$replace["editing_users"] = $flexFunc -> editing_users;
}

if ($form["view"] == "finish" || empty($form["view"])){
	$replace["view_list"] = true;
	$replace["list_view"] = $flexFunc -> load_index();
}

$file_name = "./index.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
