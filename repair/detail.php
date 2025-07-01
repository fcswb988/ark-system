<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");

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
$replace["page_title_sub"] = "車体情報 登録・編集";

$replace["back_list_url"] = $_SESSION["back_list_url"];

$file_name = "./detail.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
