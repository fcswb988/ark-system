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
$replace["page_slug"] = "repair";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "修理情報管理";
$replace["page_title_sub"] = "修理情報 登録・編集";

$replace["back_list_url"] = $_SESSION["back_list_url"];
$_SESSION["back_list_url"] = $_SERVER['REQUEST_URI'];

$repairClass = new repairClass();
$customersClass = new customersClass();

$replace = $customersClass -> load_details($replace);

$file_name = "./repair.tpl.html";

$extraExecClass = new extraExecClass();
$flexFunc = new flexFunc();

$form["seq"] = 8;
$replace["wcm_seq"] = $form["wcm_seq"];
$replace["wrp_seq"] = $form["wrp_seq"];

if ($form["md"] == "load_search_index"){
	$customersClass -> page_line = 20;
	$res = $customersClass -> load_search_index();
	echo json_encode($res);
	exit;
}

if ($form["view"] == "finish"){
	$form["wdc_wcmseq"] = $form["wcm_seq"];

	$replace = $flexFunc -> save_act($replace);
	if($form["md"] == "insert") $form["main_seq"] = intval($replace["main_seq"]);
	if(!$form["wcm_seq"]){
		if($form["sel_wcm_seq"]){
			$wcm_seq = $form["sel_wcm_seq"];
		} else {
			$form["seq"] = 5;
			$form["md"] = "insert";
			$flexFunc -> direct_save = true;
			$replace = $flexFunc -> save_act($replace);
			$wcm_seq = intval($replace["main_seq"]);
		}
		//車体に紐付け
		$param = array();
		$param["wrp_wcmseq"] = sql_int($wcm_seq);
		$where_sql = sprintf("wrp_seq = %d", $form["wrp_seq"]);
		simple_update($param, "w_repair", $where_sql);

		//修理情報に紐付け
		$param = array();
		$param["wdc_wcmseq"] = sql_int($wcm_seq);
		$where_sql = sprintf("wdc_seq = %d", $form["main_seq"]);
		simple_update($param, "w_directions", $where_sql);
		$form["wcm_seq"] = $wcm_seq;
	}
	if ($form["md"] == "insert"){
		foreach($form as $ky => $vl){
			if (preg_match("/^view_check([0-9]+)/", $ky, $m) && $vl == 1){
				$param = array();
				$param["wrv_wdcseq"] = sql_int($replace["main_seq"]);
				$param["wrv_cnt"] = sql_int($m[1]);
				$param["wrv_is_open"] = sql_int(1);
				$param["wrv_created"] = "now()";

				simple_insert($param, "w_repair_view");
			}
		}

		header("Location: /repair/condition.php?view=input&md=insert&wcm_seq=".$form["wcm_seq"]."&wrp_seq=".$form["wrp_seq"]."&wdc_seq=".$form["main_seq"]."\n");
	} else if($form["md"] == "delete") {
		header("Location: /customers/detail.php?wcm_seq=".$form["wcm_seq"]."\n");
	} else {
		if ($form["wrp_seq"]){
			header("Location: /repair/condition.php?wcm_seq=".$form["wcm_seq"]."&wrp_seq=".$form["wrp_seq"]."&wdc_seq=".$form["main_seq"]."\n");
		} else {
			header("Location: /customers/detail.php?wcm_seq=".$form["wcm_seq"]."\n");
		}
	}
	exit;
} else if ($form["view"] == "confirm"){
	if ($form["md"] == "delete"){
		$replace["detail_view"] = $flexFunc -> delete_confirm();
	} else {
		$flexFunc -> extra_rep["view_check_list"] = array();
		foreach($form as $ky => $vl){
			if (preg_match("/^view_check([0-9]+)/", $ky, $m) && $vl){
				$pnm = sprintf("view_check%d", $m[1]);
				$flexFunc -> extra_rep["view_check_list"][] = array("name" => $pnm, "value" => 1);
			}
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
} else {
	$form["sub_seq"] = $form["wrp_seq"];
	if ($form["md"] == "insert"){
		$replace = $repairClass -> load_info_datas($replace);
		$replace["detail_view"] = $flexFunc -> load_detail();
	} else if ($form["md"] == "update"){
		if(!$form["main_seq"]) $form["main_seq"]= $form["wdc_seq"];
		$replace["detail_view"] = $flexFunc -> load_edit();
		$replace["editing_users"] = $flexFunc -> editing_users;
	}
	if(!$form["wcm_seq"]) {
		// 顧客紐づけ
		$form["seq"] = 5;
		$replace["detail_view_cus"] = $flexFunc -> load_detail();
		$replace = $customersClass -> load_search_items_sub($replace);
	}
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["sub_seq"] = intval($form["sub_seq"]);
	$replace["now_mode"] = $form["md"];
	$replace["sel_wcm_seq"] = $form["sel_wcm_seq"];
	$replace["view_input"] = true;
}

$replace["is_delete_view"] = ($form["md"] == "delete") ? true: false;
$replace["is_update_view"] = ($form["md"] == "update") ? true: false;
$replace["is_insert_view"] = ($form["md"] == "insert") ? true: false;

if ($form["md"] == "insert"){
	$replace["mode_title"] = "修理情報の新規追加";
} else if ($form["md"] == "update"){
	$replace["mode_title"] = "修理情報編集";
} else if ($form["md"] <> "delete"){
	$repairClass -> $form["md"]();
} else {
	$replace["mode_title"] = "修理情報";
}

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;

class extraExecClass {
	function extra_exec($rep){
		global $repairClass;

		$rep["wdc_status"] = $repairClass -> make_status($rep["wdc_status"]);

		return $rep;
	}
}