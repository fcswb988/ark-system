<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
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
$replace["page_title_sub"] = "修理情報一覧";

$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];

$repairClass = new repairClass();
if ($form["md"] == "removeRepair"){
	$repairClass -> setRemoveRepair();
} else if ($form["md"] == "search"){
	$replace = $repairClass -> load_search_index($replace);
}

$replace = $repairClass -> load_search_items($replace);

$file_name = "./index.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
