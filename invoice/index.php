<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/invoiceClass.php");
require("../lib/repairClass.php");
require("../lib/customersClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "invoice";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "請求管理";
$replace["page_title_sub"] = "請求対象検索";

$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];

$customersClass = new customersClass();
$repairClass = new repairClass();
$invoiceClass = new invoiceClass();

if ($form["md"] == "upd_printed"){
	$invoiceClass -> upd_printed($form);
	echo json_encode([
			"status" => true,
			"replace" => $replace,
	]);
	exit;
}

if ($form["md"] == "upd_sum_printed"){
	$invoiceClass -> upd_sum_printed($form);
	echo json_encode([
			"status" => true,
			"replace" => $replace,
	]);
	exit;
}

if ($form["md"] == "search"){
	$replace = $invoiceClass -> load_search_index($replace);
}

if ($form["md"] == "out_aggregate_csv"){
	$invoiceClass -> out_aggregate_csv();
	exit;
}

if ($form["md"] == "out_aggregate_excel"){
	$invoiceClass -> out_aggregate_excel();
	exit;
}

$replace = $invoiceClass -> load_search_items($replace);
if (!$form["md"]){
	$replace["sk_billing"] = "on";
}


$file_name = "./index.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
