<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/contactClass.php");
require("../lib/repairClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$flexFunc = new flexFunc();
$commonClass -> login_check();
$replace["page_slug"] = "contact";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "社内連絡";
$replace["page_title_sub"] = "社内連絡";

//$replace["back_list_url"] = $_SESSION["back_list_url"];

$repairClass = new repairClass();
$contactClass = new contactClass();
if ($form["md"] == "save"){

	$ret = $contactClass -> save_contact();
	if (!$ret){
		?>
		<script type="text/javascript">
		alert("送信に失敗しました！！");
		</script>
		<?php
	}

	if ($form["view_sys"] == "iframe"){
		?>
		<script type="text/javascript">
		parent.commonClass.childCloseAction();
		parent.commonClass.refresh();
		console.log('refresh');
		</script>
		<?php
	}
//	header("Location: ".$_SESSION["back_list_url"]."\n");
	exit;
}
if ($form["md"] == "upd_contact"){
	$res = $contactClass -> upd_contact($form);
	echo json_encode([
			"status" => $res,
	]);
	exit;
}

if ($form["md"] == "upd_contact_history"){
	$res = $contactClass -> upd_contact_history($form);
	echo json_encode([
			"status" => $res,
	]);
	exit;
}

$replace = $contactClass -> load_detail($replace);

$file_name = "./detail.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
