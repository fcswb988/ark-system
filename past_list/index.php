<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/supportClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "home";
$replace = $commonClass -> load_basic($replace);

$supportClass = new supportClass();
$replace["repair_list"] = $supportClass -> load_repair_list("past");

$replace["wcm_company"] = $commonClass -> w_customers["wcm_company"];
$replace["wcm_name"] = $commonClass -> w_customers["wcm_name"];

$file_name = "./index.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
