<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/repairClass.php");
require("../lib/calendarClass.php");
require("../lib/layoutClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "car_layout";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "車両作業場所配置";

$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];
$layoutClass = new layoutClass();

if ($form["md"]){
	$fc_name = $form["md"];
	$layoutClass -> $fc_name();
	echo json_encode([
	    "status" => true,
	]);
	exit;
}
if($form["md"] == "regist"){
    $layoutClass -> upsert_layout();
    echo json_encode([
        "status" => true,
    ]);
    exit;
}


$GLOBALS["repairClass"] = new repairClass();
$GLOBALS["calendarClass"] = new calendarClass();
$replace = $layoutClass -> load_direction_list($replace);
$replace = $layoutClass -> load_layout($replace);
$replace["sel_color_list"] = $layoutClass -> get_color_list();

$file_name = "./index.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
