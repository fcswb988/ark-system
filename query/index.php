<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/queryClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$replace = array();
$form = allRequest();

$constClass = new constClass();
$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "import";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "フリーSQLでデータ抽出";

$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];

$queryClass = new queryClass();

if($form["md"] == "execute"){
	$replace = $queryClass ->execute_sql($replace);

}
$replace["sql_list"] = $queryClass ->load_query_list();

$file_name = "./index.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
