<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");
require("../lib/calendarClass.php");
require("../lib/repairClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$constClass = new constClass();
$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "calendar";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "カレンダー";
$replace["page_title_sub"] = "2016年8月";

$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];

$calendarClass = new calendarClass();
$GLOBALS["repairClass"] = new repairClass();

if ($form["md"]){
	$fc_name = $form["md"];
	$calendarClass -> $fc_name();
	$location = preg_replace('/&md=.*/', '', $_SERVER['REQUEST_URI']);
	header("Location: " .$location."\n");
	exit;
}

$replace = $calendarClass -> load_month($replace);

$file_name = "./index.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
