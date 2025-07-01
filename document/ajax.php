<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/repairClass.php");
require("../lib/documentClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();

$documentClass = new documentClass();
if ($form["md"]){
	@$documentClass -> $form["md"]();
} else {
	echo "{resut: 'ERR'}";
}

exit;
