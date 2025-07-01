<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/contactClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "contact";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "社内連絡";
$replace["page_title_sub"] = "社内連絡";

//$replace["back_list_url"] = $_SESSION["back_list_url"];

$contactClass = new contactClass();

$contactClass = new contactClass();
$replace = $contactClass -> load_detail_mes($replace);

$file_name = "./detail_mes.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
