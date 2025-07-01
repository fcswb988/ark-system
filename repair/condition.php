<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");
require("../lib/repairClass.php");
require("../lib/directionClass.php");
require("../lib/contactClass.php");
require("../lib/substcarClass.php");
require("../vendor/autoload.php");

header('Cache-Control: no-cache');
$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace["page_slug"] = "repair";
$replace = $commonClass -> load_basic($replace);

$replace["page_title"] = "進捗・状況管理";
$replace["page_title_sub"] = "進捗・状況 登録・編集";

$replace["back_list_url"] = $_SESSION["back_list_url"];
$replace["tax_rate"] = $commonClass::TAX_RATE;

$repairClass = new repairClass();
if ($form["md"] == "file_upload"){
	$repairClass -> repair_photo_multi_upload();
	exit;
}

if ($form["md"] == "get_parts"){
	$res = $repairClass -> get_parts($form["wpl_number"]);
	echo json_encode([
			"status" => $res? true:false,
			"wpl_name" => $res? $res["wpl_name"]:null,
			"wpl_price" => $res? $res["wpl_price"]:null,
			"wpl_base_price" => $res? $res["wpl_base_price"]:null,
	]);
	exit;
}

if ($form["md"] == "ins_parts"){
    $res = $repairClass -> ins_parts($form);
    echo json_encode([
        "status" => $res,
        "seq" => $res,
    ]);
    exit;
}

if (preg_match("/_parts|_w_outsc_list|load_add/", $form["md"])){
    $func = $form["md"];
    $res = $repairClass -> $func($form);
    echo json_encode([
    	"status" => $res,
    	"seq" => $res,
    ]);
    exit;
}

if (preg_match("/_direction/", $form["md"])){
	$directionClass = new directionClass();
	$func = $form["md"];
	$ret = $directionClass -> $func($form);
	echo json_encode([
			"status" => $ret==false? false :true,
	]);
	exit;
}

$customersClass = new customersClass();
if (empty($form["wdc_seq"])){
	$form["wdc_seq"] = $customersClass -> search_direction();
}
$replace = $customersClass -> load_details($replace);

$allCustomers = customersClass::getInstance()->getAllCustomers();

$selectedCustomer = $form["wcm_seq"] ?? null;
$htmlCustomerOptions = '';
foreach ($allCustomers as $item) {
    $selected = $item['wcm_seq'] == $selectedCustomer ? 'selected' : '';
    $htmlCustomerOptions .= "<option value='{$item['wcm_seq']}' {$selected}>{$item['customer_name']}</option>";
}

$flexFunc = new flexFunc();

$replace['all_customer_options'] = $htmlCustomerOptions;
$replace = $repairClass -> load_detail_repair($replace);

$file_name = "./condition.tpl.html";

$form["seq"] = 12;
$replace["wcm_seq"] = $form["wcm_seq"];

if ($replace["wcm_seq"] == 0){
	$replace["custom_link"] = sprintf("/customers/join.php?wrp_seq=%d&wdc_seq=%d", $form["wrp_seq"], $form["wdc_seq"]);
}

$replace["wrp_seq"] = $form["wrp_seq"];
$replace["wdc_seq"] = $form["wdc_seq"];

if ($form["view"] == "finish"){
	$form["wdc_wcmseq"] = $form["wcm_seq"];

	$replace = $flexFunc -> save_act($replace);
	foreach($form as $ky => $vl){
	    if (preg_match("/top\_photo([0-9]+)/", $ky, $m) && $vl == 1){
	        $form["top_photo"] = $m[1];
	    }
	}

	$sql = "";
	$sql.= "select ";
	$sql.= "	max(wcd_level) ";
	$sql.= "from ";
	$sql.= "	w_condition ";
	$sql.= "where ";
	$sql.= "	wcd_delfg = 0 ";
	$sql.= "	and wcd_wdcseq = ".sql_int($form["wdc_seq"])." ";
	$rs = mysql_query($sql);
	list($max_wcd_level) = mysql_fetch_array($rs, MYSQL_NUM);

	$param = array();
	$param["wdc_status"] = sql_int($max_wcd_level);
	if ($form["top_photo"]){
		$param["wdc_photo_base"] = sql_int($replace["main_seq"]? $replace["main_seq"]:$form["main_seq"]);
		$param["wdc_photo_num"] = sql_int($form["top_photo"]);
	}

	$where_sql = sprintf("wdc_seq = %d", $form["wdc_seq"]);

	simple_update($param, "w_directions", $where_sql);

	header("Location: /repair/condition.php?wcm_seq=".$form["wcm_seq"]."&wrp_seq=".$form["wrp_seq"]."&wdc_seq=".$form["wdc_seq"]."\n");
} else if ($form["view"] == "confirm"){
	foreach($form as $ky => $vl){
		if (preg_match("/top\_photo([0-9]+)/", $ky, $m) && $vl == 1){
			$ex_rep["top_photo"] = $m[1];
		}
	}
	$flexFunc -> extra_rep = $ex_rep;

	$replace["detail_view"] = $flexFunc -> load_confirm();
	$replace['submit_btn'] = ($flexFunc -> conf_err_count == 0) ? true: false;
	$replace['err_view'] = ($flexFunc -> conf_err_count == 0) ? false: true;
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["sub_seq"] = intval($form["wdc_seq"]);
	$replace["now_mode"] = $form["md"];
	$replace["view_confirm"] = true;
	$replace["editing_users"] = $flexFunc -> editing_users;
} else if ($form["view"] == "input"){
	$form["sub_seq"] = $form["wdc_seq"];
	if ($form["md"] == "insert"){
		$replace["detail_view"] = $flexFunc -> load_detail();
	} else if ($form["md"] == "update"){
		$extraExecClass = new extraExecClass();
		$replace["detail_view"] = $flexFunc -> load_edit();
		$replace["editing_users"] = $flexFunc -> editing_users;
	}
	$replace["mfl_seq"] = intval($form["seq"]);
	$replace["main_seq"] = intval($form["main_seq"]);
	$replace["sub_seq"] = intval($form["wdc_seq"]);
	$replace["now_mode"] = $form["md"];
	$replace["view_input"] = true;
} else {
	$replace["list_condition"] = $repairClass -> load_conditions();
	$replace["view_index"] = true;
}

$replace["is_delete_view"] = ($form["md"] == "delete") ? true: false;
$replace["is_update_view"] = ($form["md"] == "update") ? true: false;
$replace["is_insert_view"] = ($form["md"] == "insert") ? true: false;

$replace["edit_directions"] = sprintf("/repair/info.php?wcm_seq=%d&wrp_seq=%d&main_seq=%d", $form["wcm_seq"], $form["wrp_seq"], $form["wdc_seq"]);

if ($form["md"] == "insert"){
	$replace["mode_title"] = "進捗・状況の新規追加";
} else if ($form["md"] == "update"){
	$replace["mode_title"] = "進捗・状況の編集";
} else {
	$replace["mode_title"] = "進捗・状況";

	if ($form["wdc_seq"]){
		$replace["is_open_direct_edit"] = true;
		$form["main_seq"] = $form["wdc_seq"];
		$substcarClass = new substcarClass();
		$replace = $repairClass -> load_info_datas($replace);
		$contactClass = new contactClass();
		$replace = $contactClass -> load_index($replace);

	}
}

$replace["default"] = $repairClass -> make_wdc_title($form["wdc_seq"]);

print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
exit;

class extraExecClass {
	function extra_exec($rep){
		$sql = "";
		$sql.= "select ";
		$sql.= "	wdc_photo_base ";
		$sql.= "	,wdc_photo_num ";
		$sql.= "from ";
		$sql.= "	w_directions ";
		$sql.= "where ";
		$sql.= "	wdc_delfg = 0 ";
		$sql.= "	and wdc_seq = ".sql_int($rep["wcd_wdcseq"])." ";
		$rs = mysql_query($sql);
		list($wdc_photo_base, $wdc_photo_num) = mysql_fetch_array($rs, MYSQL_NUM);

		if ($rep["main_seq"] == $wdc_photo_base && $wdc_photo_num){
			$rep["top_photo"] = $wdc_photo_num;
		}

		return $rep;
	}
}