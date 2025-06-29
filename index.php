<?php

require("./system2/basicFunc.php");
require("./lib/commonClass.php");
require("./lib/loginClass.php");
require("./lib/topClass.php");
require("./lib/supportClass.php");
require("./lib/contactClass.php");
require("./lib/repairClass.php");
require("./lib/calendarClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$constClass = new constClass();
$commonClass = new commonClass();

$replace = array();
$replace["page_title"] = "顧客情報管理";

$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];

$form = allRequest();

$loginClass = new loginClass();
$GLOBALS["repairClass"] = new repairClass();

$topClass = new topClass();

if ($form["md"] == "move_date"){
    $calendarClass = new calendarClass();
    $calendarClass -> move_date();
    echo json_encode([
        "status" => true,
    ]);
    $form["md"] = "";
    exit;
}

if ($form["md"] == "del_repair"){
	$seq = $form["seq"];
	$topClass -> del_repair($seq);
}

if ($form["md"] == "out_delivery_sche"){
	$calendarClass = new calendarClass();
	$topClass -> out_delivery_sche();
}

if ($_SESSION["mem_seq"] && $_SESSION["mem_account"] && $_SESSION["mem_musseq"]){
	$commonClass -> login_check();
	$replace["page_slug"] = "home";
	$replace = $commonClass -> load_basic($replace);

	$replace = $topClass -> load_numbers($replace);
//	$replace["staff_list"] = $topClass -> load_staff_list();
	$replace["sum_list"] = $topClass -> load_sum_list();

	$replace["unlinked_list"] = $topClass -> load_unlinked_list();

	$calendarClass = new calendarClass();
	$replace = $topClass -> get_cal_list($replace);

	$replace["repair_list"] = $topClass -> load_repair_list($sdate,$edate);
	$replace = $topClass -> load_more_page($replace);

	$contactClass = new contactClass();
	$replace = $contactClass -> load_index($replace);

	$file_name = "./index.tpl.html";
} else if ($_SESSION["wcm_seq"] && $_SESSION["wcm_account"]){
	$commonClass -> login_check();
	$replace["page_slug"] = "home";
	$replace = $commonClass -> load_basic($replace);

	$supportClass = new supportClass();
	$replace["repair_list"] = $supportClass -> load_repair_list();

	$replace["wcm_company"] = $commonClass -> w_customers["wcm_company"];
	$replace["wcm_name"] = $commonClass -> w_customers["wcm_name"];

	$file_name = "./customer.tpl.html";
} else if ($form["md"] == "login_check"){
	$replace = $loginClass -> login_type($replace);
	$replace = $loginClass -> login_check($replace);

	$file_name = "./login.tpl.html";
} else {
	$replace = $loginClass -> login_type($replace);
	$file_name = "./login.tpl.html";
}

$replace = $commonClass -> load_basic($replace);

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
