<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/infoClass.php");


$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "info";
$replace = $commonClass -> load_basic($replace);

$infoClass = new infoClass();
$infoClass -> w_customers = $commonClass -> w_customers;

$replace = $infoClass -> load_index($replace);

$replace["page_title"] = "お知らせ";
$replace["page_title_sub"] = "お知らせ";

$file_name = "./index.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
