<?php

require("./system2/basicFunc.php");
require("./lib/commonClass.php");
require("./lib/loginClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$commonClass = new commonClass();

$form = allRequest();

$loginClass = new loginClass();

unset($_SESSION["mem_seq"]);
setcookie('mem_seq', "", (time() - 10), "/");

unset($_SESSION["mem_account"]);
setcookie('mem_account', "", (time() - 10), "/");

unset($_SESSION["mem_musseq"]);
setcookie('mem_musseq', "", (time() - 10), "/");

unset($_SESSION["wcm_seq"]);
setcookie('wcm_seq', "", (time() - 10), "/");

unset($_SESSION["wcm_account"]);
setcookie('wcm_account', "", (time() - 10), "/");

unset($_SESSION["musseq"]);
setcookie('musseq', "", (time() - 10), "/");

header("Location: ./\n");
