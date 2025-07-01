<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");
require("../lib/repairClass.php");
require("../lib/invoiceClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "invoice";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "月次請求処理";
$replace["page_title_sub"] = "請求明細編集";

$replace["back_list_url"] = $_SESSION["back_list_url"];
$replace["tax_rate"] = $commonClass::TAX_RATE;

$invoiceClass = new invoiceClass();
if ($form["md"] == "copy_work"){
	$invoiceClass -> copy_work();
} else {
	if ($form["md"] == "ins_billing"){
		//	var_dump ($form);
		$res = $invoiceClass -> ins_billing($form);
		echo json_encode([
				"status" => true,
				"seq" => $res,
		]);
		exit;
	}

	if ($form["md"]){
		$func = $form["md"];
		$invoiceClass -> $func($form);
		echo json_encode([
				"status" => true,
				"replace" => $replace,
		]);
		exit;
	}
}

$replace["src"] = $form["src"];
$repairClass = new repairClass();
$replace = $repairClass -> load_detail_repair($replace);
$replace = $invoiceClass->load_billing($replace);

$customersClass = new customersClass();
$replace = $customersClass -> load_details($replace);

$file_name = "./detail.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
