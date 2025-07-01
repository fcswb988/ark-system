<?php

require("../system2/basicFunc.php");
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
$replace["page_slug"] = "customers";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "顧客情報管理";
$replace["page_title_sub"] = "顧客情報検索";

$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];

$file_name = "./index.tpl.html";

$customersClass = new customersClass();
$repairClass = new repairClass();
if ($form["md"] == "search" && $commonClass -> w_member["wmm_is_admin"] == 1){
    $replace = $customersClass -> load_search_index($replace);
}

if ($form["md"] == "rep_search" && $commonClass -> w_member["wmm_is_admin"] == 1){
	$replace = $customersClass -> load_car_list($replace);
}

$replace = $customersClass -> load_search_items($replace);


print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
