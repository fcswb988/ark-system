<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "newcar";
$replace["next_page"] = "./repair_new.php";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "顧客情報管理";
$replace["page_title_sub"] = "車体情報 登録・編集";

$replace["back_list_url"] = $_SESSION["back_list_url"];

$customersClass = new customersClass();
$replace = $customersClass -> load_details($replace);

$file_name = "./repair.tpl.html";

if ($form["md"] == "get_carname"){
	$res = $customersClass -> get_carname($form["format_body"]);
	echo json_encode([
			"status" => $res? true:false,
			"wmkseq" => $res? $res["wrp_wmkseq"]:null,
			"body_type" => $res? $res["wrp_body_type"]:null,
	]);
	exit;
}

$flexFunc = new flexFunc();

$form["seq"] = 6;

if ($form["view"] == "finish"){
	$form["sub_seq"] = 0;
	$form["wcm_seq"] = 0;
	$flexFunc -> direct_save = true;
	$replace = $flexFunc -> save_act($replace);

	if ($form["md"] == "insert"){
		header("Location: /repair/repair.php?md=insert&wcm_seq=".$form["wcm_seq"]."&wrp_seq=".$replace["main_seq"]."\n");
	} else {
		header("Location: ./detail.php?wcm_seq=".$form["wcm_seq"]."\n");
	}
	exit;
} else if ($form["view"] == "confirm"){
	if ($form["md"] == "delete"){
		$replace["detail_view"] = $flexFunc -> delete_confirm();
	} else {
		if($form["txt_wrp_body_type"]){
			$form["txt_wrp_body_type"] = mb_convert_kana($form["txt_wrp_body_type"],"ask");	//車名は半角変換
		}
		$replace["detail_view"] = $flexFunc -> load_confirm();
	}
	$replace['submit_btn'] = ($flexFunc -> conf_err_count == 0) ? true: false;
	$replace['err_view'] = ($flexFunc -> conf_err_count == 0) ? false: true;
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["sub_seq"] = intval($form["sub_seq"]);
	$replace["now_mode"] = $form["md"];
	$replace["view_confirm"] = true;
	$replace["editing_users"] = $flexFunc -> editing_users;
} else if ($form["view"] == "input"){
	if ($form["md"] == "insert"){
		$replace["detail_view"] = $flexFunc -> load_detail();
	}
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["sub_seq"] = intval($form["sub_seq"]);
	$replace["now_mode"] = $form["md"];
	$replace["view_input"] = true;
	if ($_SESSION["win_ww"] && $_SESSION["win_ww"] <= 800){
		$replace["view_input_sp"] = true;
	}
} else {
	$replace["view_index"] = true;
}

$replace["is_delete_view"] = ($form["md"] == "delete") ? true: false;
$replace["is_update_view"] = ($form["md"] == "update") ? true: false;
$replace["is_insert_view"] = ($form["md"] == "insert") ? true: false;

if ($form["md"] == "insert"){
	$replace["mode_title"] = "車体情報の新規追加";
} else if ($form["md"] == "update"){
	$replace["mode_title"] = "登録情報編集";
} else {
	$replace["mode_title"] = "登録情報";
}

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
