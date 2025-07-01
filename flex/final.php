<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/calendarClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$replace = array();

$form = allRequest();

$commonClass = new commonClass();
$commonClass -> login_check();
$replace = $commonClass -> load_basic($replace);

#$file_name = my_pass."flex/final_fmt.html";
$file_name = SYS2_ROOT . "flex/final_fmt.html";

$flexFunc = new flexFunc();

$replace = $flexFunc -> save_act($replace);

$calendarClass = new calendarClass();
if ($form["seq"] == 17 && intval($form["sub_seq"])){
	$wdc_seq = intval($replace["main_seq"]);
	if (empty($wdc_seq)){
		$wdc_seq = intval($form["main_seq"]);
	}

	$sql = "";
	$sql.= "select ";
	$sql.= "	wrp_wcmseq ";
	$sql.= "from ";
	$sql.= "	w_repair ";
	$sql.= "where ";
	$sql.= "	wrp_seq = ".intval($form["sub_seq"])." ";
	$rs = mysql_query($sql);

	list($wrp_wcmseq) = mysql_fetch_array($rs, MYSQL_NUM);

	$start_date = min($form["txt_wdc_form_cure_date"],$form["txt_wdc_color_ad_date"],$form["txt_wdc_painting_date"],$form["txt_wdc_assembling_date"]);
	//祝日・公休日データ取り込み
	$m_holiday = array();
	$sql = "";
	$sql.= "select * ";
	$sql.= "from ";
	$sql.= "	m_holiday ";
	$sql.= "where ";
	$sql.= "	mhd_delfg = 0 ";
	$sql.= "	and mhd_date >= ".sql_esc($start_date)." ";
	$rs = mysql_query($sql);

	while($temp = mysql_fetch_array($rs, MYSQL_ASSOC)){
	    $m_holiday[$temp["mhd_date"]] = $temp["mhd_title"];
	}


	$param = [];

	//日数から日付を算出

	if ($form["txt_wdc_form_cure_date"]){
	    $wdc_form_cure_date_fn = $calendarClass -> get_fn_day($form["txt_wdc_form_cure_date"], $form["txt_wdc_form_cure"], $m_holiday);
	} else {
		$param["wdc_form_cure_date"] = "null";
	}
	$param["wdc_form_cure_date_fn"] = (!empty($wdc_form_cure_date_fn)) ? sql_esc($wdc_form_cure_date_fn): "null";

	if ($form["txt_wdc_color_ad_date"]){
	    $wdc_color_ad_date_fn = $calendarClass -> get_fn_day($form["txt_wdc_color_ad_date"], $form["txt_wdc_color_ad"], $m_holiday);
	} else {
		$param["wdc_color_ad_date"] = "null";
	}
	$param["wdc_color_ad_date_fn"] = (!empty($wdc_color_ad_date_fn)) ? sql_esc($wdc_color_ad_date_fn): "null";

	if ($form["txt_wdc_painting_date"]){
	    $wdc_painting_date_fn = $calendarClass -> get_fn_day($form["txt_wdc_painting_date"], $form["txt_wdc_painting"], $m_holiday);
	} else {
		$param["wdc_painting_date"] = "null";
	}
	$param["wdc_painting_date_fn"] = (!empty($wdc_painting_date_fn)) ? sql_esc($wdc_painting_date_fn): "null";

	if ($form["txt_wdc_assembling_date"]){
	    $wdc_assembling_date_fn = $calendarClass -> get_fn_day($form["txt_wdc_assembling_date"], $form["txt_wdc_assembling"], $m_holiday);
	} else {
		$param["wdc_assembling_date"] = "null";
	}
	$param["wdc_assembling_date_fn"] = (!empty($wdc_assembling_date_fn)) ? sql_esc($wdc_assembling_date_fn): "null";

	$param["wdc_wcmseq"] = $wrp_wcmseq;

	$where_sql = sprintf("wdc_seq = %d", $wdc_seq);

	simple_update($param, "w_directions", $where_sql);

	// 代車予約があれば変更
	$sql = "";
	$sql.= "select * ";
	$sql.= "from w_subcar_use ";
	$sql.= "where ";
	$sql.= "	wsu_wdcseq = ".intval($wdc_seq)." and wsu_delfg = 0 ";
	$rs = mysql_query($sql);
	$rec = mysql_fetch_array($rs, MYSQL_ASSOC);
	if($rec){
		if($form["txt_wdc_storing_date"] != date('Y-m-d', strtotime($rec["wsu_start_dt"]))
			|| $form["txt_wdc_delivered_date"] != date('Y-m-d', strtotime($rec["wsu_end_dt"]))){

			require("../lib/substcarClass.php");
			$substcarClass = new substcarClass();
			$param = ['wdcseq'=>$wdc_seq, 'start_dt'=>$form["txt_wdc_storing_date"], 'end_dt'=>$form["txt_wdc_delivered_date"]];
			$substcarClass ->update_subcar_use($param);
		}
	}
}

if ($form['custom_ajax_for_part']) {
    $sql = "update w_parts_list set wpl_is_open = " . sql_int($form['wpl_is_open']) . ", wpl_company_seq = " . sql_int($form['wpl_company_seq'])
        . " where wpl_seq = " . sql_int($replace['main_seq']);
    mysql_query($sql);

    echo json_encode([
        "status" => true,
        "main_seq" => $replace['main_seq'],
        "replace" => $replace,
        "list" => (new flexFunc())->load_part_list(19, $form["sub_seq"]),
//        "companies" => $temp["companies"]
    ]);
    exit;
}

if ($form['custom_ajax_for_work_list']) {
    echo json_encode([
        "status" => true,
        "main_seq" => $replace['main_seq'],
        "replace" => $replace,
        "list" => (new flexFunc())->load_part_list(21, $form["sub_seq"])
    ]);
    exit;
}

if ($form['custom_ajax_for_update_work_list']) {
    echo json_encode([
        "status" => true,
        "main_seq" => $replace['main_seq'],
        "replace" => $replace,
        "list" => (new flexFunc())->load_part_list(21, $form["sub_seq"])
    ]);
    exit;
}

if ($form['custom_ajax_for_update_parts_list']) {
    $sql = "update w_parts_list set wpl_is_open = " . sql_int($form['wpl_is_open']) . ", wpl_company_seq = " . sql_int($form['wpl_company_seq'])
        . " where wpl_seq = " . sql_int($form['main_seq']);
    mysql_query($sql);

    echo json_encode([
        "status" => true,
        "main_seq" => $replace['main_seq'],
        "replace" => $replace,
        "list" => (new flexFunc())->load_part_list(19, $form["sub_seq"])
    ]);
    exit;
}

if ($form["view_sys"] == "iframe" && $form["add_next"] == 1){
	$start_url = sprintf("/flex/detail.php?seq=%d&md=new&sub_seq=%d&view_sys=iframe", $form["seq"], $form["sub_seq"]);
	header("Location: {$start_url}\n");
	exit;
} else if ($form["view_sys"] == "iframe"){
?>
<script type="text/javascript">
parent.commonClass.childCloseAction();
parent.commonClass.refresh();
console.log('refresh');
</script>
<?php
} else {
	$replace["back_url"] = "./?seq=".intval($form["seq"]);
	if ($form["sub_seq"]) $replace["back_url"] .= "&sub_seq=".$form["sub_seq"];

	if ($form["md"] == "insert" && $form["seq"] == 5 && $replace["main_seq"]){
		$_SESSION["back_url"] = sprintf("/customers/detail.php?wcm_seq=%d", $replace["main_seq"]);
	} else if ($form["seq"] == 9){
		$_SESSION["back_url"] = "/flex/?seq=9";
	}

	if ($_SESSION["back_url"]){
		$replace["mfl_thanks"] = false;
		$replace["back_url"] = $_SESSION["back_url"];
		$_SESSION["back_url"] = false;
	}
	if (empty($replace["mfl_thanks"])){
		header("Location: ".$replace["back_url"]."\n");
	} else {
		print $GLOBALS["basicFunc"] -> make_html_output($replace, $file_name);
	}
}
exit;

function setCalcDateDays($date_str, $use_days){
	if (empty($date_str)){
		return false;
	}

	$use_days = ($use_days && intval($use_days)) ? intval($use_days): 0;
	if ($use_days == 1){
		$use_days = 0;
	} else {
		$use_days--;
	}

	if ($use_days <= 0){
		return $date_str;
	}

	$tstmp = strtotime($date_str." 00:00:00") + ($use_days * 86400);

	return date('Y-m-d', $tstmp);
}
