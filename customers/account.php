<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");
require("../lib/repairClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "customers";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "顧客情報管理";
$replace["page_title_sub"] = "顧客情報 アカウントID発行・更新";

$replace["back_list_url"] = $_SESSION["back_list_url"];

$customersClass = new customersClass();
$repairClass = new repairClass();

$replace = $customersClass -> load_details($replace);

$file_name = "./account.tpl.html";

$flexFunc = new flexFunc();

$form["seq"] = 11;
$form["main_seq"] = $form["wcm_seq"];

if ($form["view"] == "finish"){
	$replace = $flexFunc -> save_act($replace);
	$replace["view_finish"] = true;
} else if ($form["view"] == "confirm"){
	$replace["detail_view"] = $flexFunc -> load_confirm();
	$replace['submit_btn'] = ($flexFunc -> conf_err_count == 0) ? true: false;
	$replace['err_view'] = ($flexFunc -> conf_err_count == 0) ? false: true;
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["sub_seq"] = intval($form["sub_seq"]);
	$replace["now_mode"] = $form["md"];
	$replace["view_confirm"] = true;
	$replace["editing_users"] = $flexFunc -> editing_users;
} else {
	$replace["detail_view"] = $flexFunc -> load_edit();
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["sub_seq"] = intval($form["sub_seq"]);
	$replace["now_mode"] = "update";
	$replace["view_input"] = true;
	$replace["editing_users"] = $flexFunc -> editing_users;
}

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
