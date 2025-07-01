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
$replace["page_slug"] = "repair";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "修理情報管理";
$replace["page_title_sub"] = "修理情報 登録・編集";

$replace["back_list_url"] = $_SESSION["back_list_url"];

$repairClass = new repairClass();
$customersClass = new customersClass();

$replace = $customersClass -> load_details($replace);

$file_name = "./repair_sub.tpl.html";

$extraExecClass = new extraExecClass();
$flexFunc = new flexFunc();

$replace["wcm_seq"] = $form["wcm_seq"];
$replace["wrp_seq"] = $form["wrp_seq"];

$form["sub_seq"] = $form["wrp_seq"];

//上部ここから
$form["seq"] = 17;
$replace["detail_upside"] = array("0" => array());

if ($form["md"] == "insert"){
	$replace["detail_upside"][0]["detail_view"] = $flexFunc -> load_detail();
} else if ($form["md"] == "update"){
	$replace["detail_upside"][0]["detail_view"] = $flexFunc -> load_edit();
	$replace["detail_upside"][0]["editing_users"] = $flexFunc -> editing_users;
}
$replace["detail_upside"][0]["mfl_seq"] = intval($form["seq"]);
$replace["detail_upside"][0]["main_seq"] = intval($form["main_seq"]);
$replace["detail_upside"][0]["sub_seq"] = intval($form["sub_seq"]);
$replace["detail_upside"][0]["now_mode"] = $form["md"];
//上部ここまで


//下部ここから
$form["seq"] = 18;
$replace["detail_btmside"] = array("0" => array());

if ($form["md"] == "insert"){
	$replace["detail_btmside"][0]["detail_view"] = $flexFunc -> load_detail();
} else if ($form["md"] == "update"){
	$replace["detail_btmside"][0]["detail_view"] = $flexFunc -> load_edit();
	$replace["detail_btmside"][0]["editing_users"] = $flexFunc -> editing_users;
}
$replace["detail_btmside"][0]["mfl_seq"] = intval($form["seq"]);
$replace["detail_btmside"][0]["main_seq"] = intval($form["main_seq"]);
$replace["detail_btmside"][0]["sub_seq"] = intval($form["sub_seq"]);
$replace["detail_btmside"][0]["now_mode"] = $form["md"];
//下部ここから

if ($form["md"] == "insert"){
	$replace["mode_title"] = "修理情報の新規追加";
} else if ($form["md"] == "update"){
	$replace["mode_title"] = "修理情報編集";
} else if ($form["md"] <> "delete"){
	$repairClass -> $form["md"]();
} else {
	$replace["mode_title"] = "修理情報";
}

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;

class extraExecClass {
	function extra_exec($rep){
		global $repairClass;
		
		$rep["wdc_status"] = $repairClass -> make_status($rep["wdc_status"]);
		
		return $rep;
	}
}