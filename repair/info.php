<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
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

$replace["page_title"] = "顧客情報管理";
$replace["page_title_sub"] = "修理情報 登録・編集";

$replace["back_list_url"] = $_SESSION["back_list_url"];

$repairClass = new repairClass();

if ($form["md"] == "insert"){
	//$repairClass -> insert_info_datas();
	$replace = $repairClass -> load_info_datas($replace);
} else {
	$replace = $repairClass -> load_info_datas($replace);
}

$file_name = "./info.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
