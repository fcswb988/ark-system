<?php

require("./system2/basicFunc.php");

$GLOBALS["basicFunc"] = new basicFunc();

$form = allRequest();

$ww = intval($form["ww"]);
if ($ww){
	$_SESSION["win_ww"] = $ww;
}

echo "ok";
exit;
