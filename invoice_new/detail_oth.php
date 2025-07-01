<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");
require("../lib/repairClass.php");
require("../lib/invoiceClass_new.php");
require("../lib/otherBillClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$constClass = new constClass();
$commonClass = new commonClass();
$commonClass -> login_check();
$flexFunc = new flexFunc();

$replace["page_slug"] = "invoice_new";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "月次請求処理";
$replace["page_title_sub"] = "その他請求明細編集";

$replace["back_list_url"] = $_SESSION["back_list_url"];
$replace["tax_rate"] = $commonClass::TAX_RATE;

$invoiceClass = new invoiceClass_new();
$otherBillClass = new otherBillClass();

if ($form["md"] == "out_oth_bill"){
    $invoiceClass -> out_oth_bill();
    exit;
}
if ($form["md"] == "ins_oth_bill_detail"){
	$ret = $otherBillClass -> ins_oth_bill_detail($form);
	echo json_encode([
			"status" => $ret==false? false :true,
			"seq" => $ret["wobd_seq"],
			"wob_seq" => $ret["wob_seq"],
	]);
	exit;
}

if ($form["md"]){
	$func = $form["md"];
	if(preg_match("/oth_bill/", $form["md"])){
		$ret = $otherBillClass -> $func($form);
		echo json_encode([
			"status" => $ret==false? false :true,
			"wob_seq" => $ret["wob_seq"],
		]);
	}
	exit;
}

if ($form["view"] == "oth_customer"){
	if (!$form["sel_wcm_seq"] && !$form["wcm_seq"]){
		$form["seq"] = 5;
		$form["md"] = "insert";
		$flexFunc -> direct_save = true;
		$replace = $flexFunc -> save_act($replace);
		$form["wcm_seq"] = intval($replace["main_seq"]);
	} else {
		$form["wcm_seq"] = $form["sel_wcm_seq"];
	}
	header("Location: ./detail_oth.php?wcm_seq=".$form["wcm_seq"]."\n");
	exit;
}

if ($form["md_"] == "add_other_bill"){
    $replace = $otherBillClass -> add_other_bill($replace);
//    header("Location: /invoice_new/detail.php?wcm_seq=".$replace["wdc_wcmseq"]."&wdc_seq=" .$replace["wdc_seq"]."\n");
}
$customersClass = new customersClass();
$repairClass = new repairClass();
if(!$form["wob_seq"] && !$form["wcm_seq"]) {
	// 顧客紐づけ
	$form["seq"] = 5;
	$replace["detail_view_cus"] = $flexFunc -> load_detail();
	$replace = $customersClass -> load_search_items_sub($replace);
} else {
	$replace["wob_seq"] = $form["wob_seq"];
	$replace = $customersClass -> load_details($replace);
	$replace = $otherBillClass->load_other_bill($replace);
	$replace["list_document"] = $otherBillClass-> load_document($form["wob_seq"]);
}

$file_name = "./detail_oth.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
