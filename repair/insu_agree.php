<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/insuAgreeClass.php");
require("../lib/repairClass.php");
require("../lib/customersClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
//$replace["page_slug"] = "top";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "損保協定一覧";
//$replace["page_title_sub"] = "請求対象検索";

$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];

$insuAgreeClass = new insuAgreeClass();

if ($form["md"] == "upd_agree_fg"){
	$status = $insuAgreeClass -> upd_agree_fg($form);
    echo json_encode([
    	"status" => $status,
    ]);
    exit;
}

if ($form["md"] == "search"){
	$replace = $insuAgreeClass -> load_search_index($replace);
}

if ($form["md"] == "out_excel"){
	$insuAgreeClass -> out_insu_agreement_list();
	exit;
}

$replace = $insuAgreeClass -> load_search_items($replace);

$file_name = "./insu_agree_tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
