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

$replace["wrp_seq"] = $form["wrp_seq"];
$replace["wdc_seq"] = $form["wdc_seq"];

$customersClass = new customersClass();
$replace = $customersClass -> load_details($replace);
$replace = $repairClass -> load_detail_repair($replace);

$replace["direct_input_view"] = true;

$flexFunc = new flexFunc();

$form["seq"] = 5;

if ($form["md"] == "load_search_index"){
	$customersClass -> page_line = 20;
	$res = $customersClass -> load_search_index();
	echo json_encode($res);
	exit;
}

if ($form["view"] == "direct_finish"){
	//車体に紐付け
	$param = array();
	$param["wrp_wcmseq"] = sql_int($form["wcm_seq"]);
	$where_sql = sprintf("wrp_seq = %d", $form["wrp_seq"]);
	simple_update($param, "w_repair", $where_sql);

	//修理情報に紐付け
	$param = array();
	$param["wdc_wcmseq"] = sql_int($form["wcm_seq"]);
	$where_sql = sprintf("wdc_seq = %d", $form["wdc_seq"]);
	simple_update($param, "w_directions", $where_sql);

	header("Location: /repair/condition.php?wcm_seq=".$form["wcm_seq"]."&wrp_seq=".$form["wrp_seq"]."&wdc_seq=".$form["wdc_seq"]."\n");
	exit;
} else if ($form["view"] == "direct_confirm"){
	$wcm_seq = intval($form["wcm_seq"]);

	if ($wcm_seq){
		$sql = "";
		$sql.= "select ";
		$sql.= "	count(*) ";
		$sql.= "from ";
		$sql.= "	w_customers ";
		$sql.= "where ";
		$sql.= "	wcm_delfg = 0 ";
		$sql.= "	and wcm_seq = ".sql_int($form["wcm_seq"])." ";
		$rs = mysql_query($sql);
		list($active) = mysql_fetch_array($rs, MYSQL_NUM);

		if ($active){
			$replace["direct_input_view"] = false;
			$replace["direct_confirm_view"] = true;
		} else {
			$replace["err_mes"] = "該当するお客様がありません。再度確認を行って下さい。";
		}
	} else {
		$replace["err_mes"] = "お客様IDを半角数字で入力して下さい。";
	}
} else if ($form["view"] == "finish"){
	$replace = $flexFunc -> save_act($replace);

	//車体に紐付け
	$param = array();
	$param["wrp_wcmseq"] = sql_int($replace["main_seq"]);
	$where_sql = sprintf("wrp_seq = %d", $form["wrp_seq"]);
	simple_update($param, "w_repair", $where_sql);

	//修理情報に紐付け
	$param = array();
	$param["wdc_wcmseq"] = sql_int($replace["main_seq"]);
	$where_sql = sprintf("wdc_seq = %d", $form["wdc_seq"]);
	simple_update($param, "w_directions", $where_sql);

	if ($form["md"] == "insert"){
		header("Location: /repair/condition.php?wcm_seq=".$replace["main_seq"]."&wrp_seq=".$form["wrp_seq"]."&wdc_seq=".$form["wdc_seq"]."\n");
	}
	exit;
} else if ($form["view"] == "confirm"){
	$replace["detail_view"] = $flexFunc -> load_confirm();
	$replace['submit_btn'] = ($flexFunc -> conf_err_count == 0) ? true: false;
	$replace['err_view'] = ($flexFunc -> conf_err_count == 0) ? false: true;
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["now_mode"] = $form["md"];
	$replace["view_confirm"] = true;

	$replace["direct_input_view"] = false;
} else {
	$replace = $customersClass -> load_search_items_sub($replace);
}

if (empty($replace["view_confirm"]) && empty($replace["direct_confirm_view"])){
	$replace["detail_view"] = $flexFunc -> load_detail();
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["sub_seq"] = intval($form["sub_seq"]);
	$replace["now_mode"] = "insert";
	$replace["view_input"] = true;
}

$file_name = "./join.tpl.html";

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;
