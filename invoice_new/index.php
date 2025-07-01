<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/invoiceClass_new.php");
require("../lib/repairClass.php");
require("../lib/customersClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$constClass = new constClass();
$commonClass -> login_check();
$replace["page_slug"] = "invoice_new";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "請求管理";
$replace["page_title_sub"] = "請求対象検索";

$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];

$customersClass = new customersClass();
$repairClass = new repairClass();
$invoiceClass = new invoiceClass_new();

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

if ($form["md"] == "upd_bill_month"){
	$invoiceClass -> upd_bill_month($form);
	echo json_encode([
			"status" => true,
			"replace" => $replace,
	]);
	exit;
}

if ($form["md"] == "upd_monthly_balance"){
	$ret = $invoiceClass -> upsert_monthly_balance($form);
	echo json_encode([
			"status" => $ret,
			"replace" => $replace,
	]);
	exit;
}

if ($form["md"] == "get_bill_month"){
	$datas = $invoiceClass -> get_bill_month($form);
	echo json_encode([
			"status" => true,
			"datas" => $datas,
	]);
	exit;
}

if ($form["md"] == "search"){
	$replace = $invoiceClass -> load_search_index($replace);
	if($_SESSION["balance"]
		&& $_SESSION["form"]["sk_date_from"] == $form["sk_date_from"]
		&& $_SESSION["form"]["sk_date_to"] == $form["sk_date_to"]){
		$replace['summary'][0] = $_SESSION["balance"];
	} else {
		$replace = $invoiceClass -> out_aggregate_excel($replace);
		$_SESSION["balance"] = $replace['summary'][0];
	}
}

if ($form["md"] == "out_aggregate_csv"){
	$invoiceClass -> out_aggregate_csv();
	exit;
}

if ($form["md"] == "out_billing_csv"){
	$invoiceClass -> out_billing_csv();
	exit;
}

if ($form["md"] == "out_aggregate_excel"){
	$invoiceClass -> out_aggregate_excel();
	exit;
}

$replace = $invoiceClass -> load_search_items($replace);
if (!$form["md"]){
	$replace["sk_billing"] = "on";
	unset($_SESSION["balance"]);
}
$_SESSION["form"] = $form;

$file_name = "./index.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
