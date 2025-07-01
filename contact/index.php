<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/contactClass.php");
require("../lib/mailFunc.php");


$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "contact";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "社内連絡";
$replace["page_title_sub"] = "社内連絡";

//$replace["back_list_url"] = $_SESSION["back_list_url"];

$contactClass = new contactClass();

$file_name = "./index.tpl.html";

$contactClass = new contactClass();

$flexFunc = new flexFunc();

$form["seq"] = 13;
$form["sub_seq"] = $commonClass -> w_member["wmm_seq"];

if ($form["view"] == "finish"){

	$replace = $flexFunc -> save_act($replace);

	$main_seq = ($form["md"] == "insert") ? intval($replace["main_seq"]): intval($form["main_seq"]);

	$param = array();
	$param["wct_from_user"] = sql_int($commonClass -> w_member["wmm_seq"]);
	$param["wct_is_readed"] = sql_int(1);

	$where_sql = sprintf("wct_seq = %d", $main_seq);

	//simple_update($param, "w_contact", $where_sql);
	//$contactClass -> copy_users($main_seq);

	header("Location: /contact/\n");
	exit;
} else if ($form["view"] == "input"){
	if ($form["md"] == "insert"){
		$file_name = "./detail.tpl.html";
	//	$replace["detail_view"] = $flexFunc -> load_detail();
		$replace = $contactClass -> load_detail($replace);
	} else if ($form["md"] == "update"){
		$replace["detail_view"] = $flexFunc -> load_edit();
	}
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["sub_seq"] = intval($form["sub_seq"]);
	$replace["now_mode"] = $form["md"];
	$replace["view_input"] = true;
} else if ($form["view"] == "contact_list"){
	$replace = $contactClass -> load_index($replace);
	$replace["contact_list"] = true;

	$replace["view_index"] = true;
} else if ($form["view"] == "message_list"){
	$replace = $contactClass -> load_customer_index($replace);
	$replace["message_list"] = true;

	$replace["view_index"] = true;
} else {
	$replace = $contactClass -> load_index($replace);
	$replace["contact_list"] = true;

	$replace = $contactClass -> load_customer_index($replace);

	$replace["view_index"] = true;
}
if($form["view_sys"] != "iframe") {
	$replace["sys_view"] = true;
}

if ($form["md"] == "insert"){
	$replace["mode_title"] = "新規連絡";
} else if ($form["md"] == "update"){
	$replace["mode_title"] = "連絡編集";
}

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
