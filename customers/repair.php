<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");
require("../lib/repairClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "customers";
$replace["next_page"] = "./repair.php";
$replace["is_active_customer"] = true;
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "顧客情報管理";
$replace["page_title_sub"] = "車体情報 登録・編集";

$replace["back_list_url"] = $_SESSION["back_list_url"];

$repairClass = new repairClass();

$customersClass = new customersClass();

if ($form["md"] == "setDuplicateDatas"){
	$customersClass -> setDuplicateDatas();
}

$replace = $customersClass -> load_details($replace);

$file_name = "./repair.tpl.html";

$flexFunc = new flexFunc();

$form["seq"] = 6;

if ($form["view"] == "finish"){
	$flexFunc -> direct_save = true;
	$replace = $flexFunc -> save_act($replace);

	if ($form["md"] == "insert"){
		header("Location: /repair/repair.php?md=insert&wcm_seq=".$form["wcm_seq"]."&wrp_seq=".$replace["main_seq"]."\n");
	} else if ($form["md"] == "update" && !$form["wcm_seq"]){
		$sql= "select wdc_seq from w_directions where wdc_wrpseq = " . $form["main_seq"] ." and wdc_delfg = 0";
		$rs = mysql_query($sql);
		list($wdc_seq) = mysql_fetch_array($rs);
		if($wdc_seq){
			header("Location: /repair/repair.php?md=update&wcm_seq=".$form["wcm_seq"]."&wrp_seq=".$form["main_seq"]."&wdc_seq=".$wdc_seq."\n");
		} else {
			header("Location: /repair/repair.php?md=insert&wcm_seq=".$form["wcm_seq"]."&wrp_seq=".$form["main_seq"]."\n");
		}
	} else {
		if($form["back_seq"]){
			header("Location: /repair/condition.php?wcm_seq=".$form["wcm_seq"]."&wrp_seq=".$form["main_seq"]."&wdc_seq=".$form["back_seq"]."\n");
		} else {
			if($_SESSION["back_list_url"]){
				header("Location: " .$_SESSION["back_list_url"] ."\n");
			} else {
				header("Location: ./detail.php?wcm_seq=".$form["wcm_seq"]."\n");
			}
		}
	}
	exit;
} else if ($form["view"] == "confirm"){
	$form["sub_seq"] = $form["wcm_seq"];

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
	$replace["back_seq"] = intval($form["back_seq"]);
	$replace["now_mode"] = $form["md"];
	$replace["view_confirm"] = true;
	$replace["editing_users"] = $flexFunc -> editing_users;
} else if ($form["view"] == "input"){
	$form["sub_seq"] = $form["wcm_seq"];

	if ($form["md"] == "insert"){
		$replace["detail_view"] = $flexFunc -> load_detail();
	} else if ($form["md"] == "update"){
		$replace["detail_view"] = $flexFunc -> load_edit();
		$replace["editing_users"] = $flexFunc -> editing_users;
	}
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["sub_seq"] = intval($form["sub_seq"]);
	$replace["back_seq"] = intval($form["back_seq"]);
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
