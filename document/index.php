<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/repairClass.php");
require("../lib/documentClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "customers";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "書類管理";
$replace["page_title_sub"] = "書類管理";

$file_name = "./index.tpl.html";

$documentClass = new documentClass();
if ($form["md"] == "duplicate_documents"){
	$documentClass -> duplicate_documents();
}
$replace = $documentClass -> load_index_view($replace);
$replace = $documentClass -> load_documents($replace);



$replace["back_list_url"] = $_SESSION["back_list_url"];

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
