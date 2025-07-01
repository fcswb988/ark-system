<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$replace = array();

$form = allRequest();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace = $commonClass -> load_basic($replace);

if ($form["seq"] == 14 && empty($form["sub_seq"])){
	$form["sub_seq"] = $commonClass -> w_customers["wcm_seq"];
}

$file_name = "index.tpl.html";

$flexFunc = new flexFunc();

if ($form["md"] == "sort") $flexFunc -> sort_func();

$replace["list_view"] = $flexFunc -> load_index();

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
