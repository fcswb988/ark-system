<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/importClass.php");
require("../lib/repairClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$replace = array();
$form = allRequest();

$constClass = new constClass();
$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "import";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "データ取込み";

$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];

$importClass = new importClass();
$GLOBALS["repairClass"] = new repairClass();

$error = "";

if($_POST["submit"]){
	if($_FILES['data']['name']){
		$replace = $importClass -> load_excel($replace, 1);
	} else {
		$error = "<script type='text/javascript'>alert('ファイルを選択してください！');</script>";
	}
}

$replace = $importClass -> load_init($replace);
$replace = $importClass -> load_direction_list($replace);

$file_name = "./index.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
if ($error) {
	echo $error;
}
exit;
