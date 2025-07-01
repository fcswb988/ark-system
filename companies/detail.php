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

$_SESSION["back_url"] = $_SERVER['HTTP_REFERER'];

$file_name = "detail.tpl.html";

$flexFunc = new flexFunc();

$replace["detail_view"] = $flexFunc -> load_detail();
$replace["mfl_seq"] = intval($form["seq"]);
$replace["sub_seq"] = intval($form["sub_seq"]);
$replace["main_seq"] = "0";
$replace["now_mode"] = "insert";

$replace["sys_view"] = ($form["view_sys"] == "iframe") ? false: true;
$replace["iframe_view"] = ($form["view_sys"] == "iframe") ? true: false;

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;

?>
