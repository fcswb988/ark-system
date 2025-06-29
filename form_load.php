<?php

require("./system2/basicFunc.php");
require("./lib/commonClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$replace = array();

$form = allRequest();

if ($_SESSION["sub_form"] && $form["url"] == $_SESSION["sub_form"]["ref"]){
	echo json_encode($_SESSION["sub_form"]);
}
exit;