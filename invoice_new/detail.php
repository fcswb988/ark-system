<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");
require("../lib/repairClass.php");
require("../lib/invoiceClass_new.php");
require("../lib/otherBillClass.php");
require("../lib/substcarClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$constClass = new constClass();
$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "invoice_new";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "月次請求処理";
$replace["page_title_sub"] = "請求明細編集";

$replace["back_list_url"] = $_SESSION["back_list_url"];
$replace["tax_rate"] = $commonClass::TAX_RATE;

// 修理情報を編集する のあと history_back() が効かなくなるのを修正
$referer = preg_replace('/^http.*\/\/[^\\/]*/', '', $_SERVER['HTTP_REFERER']);
if($_SERVER['REQUEST_URI'] == $referer || preg_match('/md_=/', $_SERVER['REQUEST_URI'])|| preg_match('/md_=/', $referer)){
	$replace["back_url"] = $_SESSION["back_url_invoice"];
} else {
	$replace["back_url"] = $_SESSION["back_url_invoice"] = $_SERVER['HTTP_REFERER'];
}

$invoiceClass = new invoiceClass_new();
$otherBillClass = new otherBillClass();

if ($form["md"] == "ins_billing"){
	//	var_dump ($form);
	$res = $invoiceClass -> ins_billing($form);
	echo json_encode([
		"status" => true,
		"seq" => $res,
	]);
	exit;
}

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
	} else {
		$invoiceClass -> $func($form);
		echo json_encode([
		    "status" => true,
		    "replace" => $replace,
		]);
	}
	exit;
}

if ($form["md"] == "copy_work"){
    $invoiceClass -> copy_work();
}

$replace["src"] = $form["src"];
$repairClass = new repairClass();
$substcarClass = new substcarClass();
$replace = $repairClass -> load_detail_repair($replace);
$replace = $invoiceClass->load_billing($replace);
$replace = $otherBillClass->load_other_bill($replace);

if ($form["md_"] == "add_other_bill"){
	$replace = $otherBillClass -> add_other_bill($replace);
//    header("Location: /invoice_new/detail.php?wcm_seq=".$replace["wdc_wcmseq"]."&wdc_seq=" .$replace["wdc_seq"]."\n");
}
$customersClass = new customersClass();
$replace = $customersClass -> load_details($replace);

$file_name = "./detail.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
