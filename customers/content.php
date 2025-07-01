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
$replace["page_title_sub"] = "最新状況";

$replace["back_list_url"] = $_SESSION["back_list_url"];

$repairClass = new repairClass();
$customersClass = new customersClass();
$replace = $repairClass -> load_detail_repair($replace);

$replace["list_condition"] = $repairClass -> load_conditions();

$file_name = "./content.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;

