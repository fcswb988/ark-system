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

$file_name = "confirm.tpl.html";

$flexFunc = new flexFunc();

$replace["detail_view"] = $flexFunc -> load_confirm();
$replace["editing_users"] = $flexFunc -> editing_users;
$replace['submit_btn'] = ($flexFunc -> conf_err_count == 0) ? true: false;
$replace['err_view'] = ($flexFunc -> conf_err_count == 0) ? false: true;
$replace["mfl_seq"] = intval($form["seq"]);
$replace["main_seq"] = intval($form["main_seq"]);
$replace["sub_seq"] = intval($form["sub_seq"]);
$replace["now_mode"] = $form["md"];

$replace["sys_view"] = ($form["view_sys"] == "iframe") ? false: true;
$replace["iframe_view"] = ($form["view_sys"] == "iframe") ? true: false;

$replace["add_submit_btn"] = ($replace['submit_btn'] && $replace["now_mode"] == "insert") ? true: false;

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
