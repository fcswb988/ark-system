<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/substcarClass.php");
require("../lib/calendarClass.php");
require("../lib/topClass.php");


$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();

$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace = $commonClass -> load_basic($replace);
$substcarClass = new substcarClass();

if($form["md"] == "load"){
    $res= $substcarClass -> load_subcar_use();
    echo json_encode([
    		"status" => isset($res),
    		"cols" => $res,
    ]);
    exit;
}

if($form["md"] == "insert"){
	$ret = $substcarClass -> insert_subcar_use();
	echo json_encode([
		"status" => $ret["status"],
		"msg" => $ret["msg"],
	]);
	exit;
}

if($form["md"] == "update"){
	$ret = $substcarClass -> update_subcar_use();
	echo json_encode([
		"status" => $ret,
	]);
	exit;
}

$calendarClass = new calendarClass();
$topClass = new topClass();
$replace["link_list_view"] = "./?";
$replace["day_format"] = "n/j";
$replace = $topClass -> get_cal_list($replace);

$replace["sel_color_list"] = $substcarClass -> get_color_list();
$replace["caruse_list"] = $substcarClass -> load_caruse_list();

$replace["page_title"] = "代車管理";
$replace["page_title_sub"] = "代車管理";

$file_name = "./index.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
