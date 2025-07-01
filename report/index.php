<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/chartClass.php");
require("../lib/repairClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$replace = array();
$form = allRequest();

$constClass = new constClass();
$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "report";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "各種レポート";

$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];

$chartClass = new chartClass();
$GLOBALS["repairClass"] = new repairClass();

if ($form["md"] == "load_chart_list"){
	$fc_name = $form["md"];
	$res = $chartClass -> load_chart_list();
	echo json_encode([
		"status" => true,
		"ym" => $res["ym"],
		"person" => $res["person"],
		"company" => $res["company"],
		"rate" => $res["rate"],
	]);
	exit;
}

if ($form["md"] == "load_sales"){
    $fc_name = $form["md"];
    $res = $chartClass -> load_sales();
    echo json_encode([
        "status" => true,
        "ym" => $res["ym"],
    	"amount" => $res["amount"],
    	"delivered" => $res["delivered"],
        "storing" => $res["storing"],
    ]);
    exit;
}

if ($form["md"] == "load_sales_result"){
	$fc_name = $form["md"];
	$res = $chartClass -> load_sales_result();
	echo json_encode([
		"status" => true,
		"ym" => $res["ym"],
		"data" => $res["data"],
	]);
	exit;
}

if ($form["md"] == "load_customer_sales"){
	$fc_name = $form["md"];
	$res = $chartClass -> load_customer_sales();
	echo json_encode([
			"status" => true,
			"company" => $res["company"],
			"amount" => $res["amount"],
			"amount_p1" => $res["amount_p1"],
			"count" => $res["count"],
	]);
	exit;
}

if ($form["md"] == "load_substcar"){
	$fc_name = $form["md"];
	$res = $chartClass -> load_substcar();
	echo json_encode([
			"status" => true,
			"data" => $res,
	]);
	exit;
}

if ($form["md"] == "load_chart2_list"){
	$res = $chartClass -> load_chart2_list();
	echo json_encode([
		"status" => true,
		"data" => $res
	]);
	exit;
}

if ($form["md"] == "out_excel"){
	$chartClass -> out_customer_sales();
	exit;
}

$file_name = "./index.tpl.html";
$replace =  $chartClass -> load_init($replace);
$replace =  $chartClass -> list_customer_sales($replace);

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
