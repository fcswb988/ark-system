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

$flexFunc = new flexFunc();

$replace = $flexFunc -> save_act($replace);

$replace["back_url"] = "./?seq=".intval($form["seq"]);
if ($form["sub_seq"]) $replace["back_url"] .= "&sub_seq=".$form["sub_seq"];

if ($_SESSION["back_url"]){
    $replace["mfl_thanks"] = false;
    $replace["back_url"] = $_SESSION["back_url"];
    $_SESSION["back_url"] = false;
}
header("Location: ".$replace["back_url"]."\n");
exit;
