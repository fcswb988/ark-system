<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$replace = array();

$form = allRequest();

$commonClass = new commonClass();
$commonClass -> login_check();

$flexFunc = new flexFunc();

if ($form["md"] == "worksViewCheck"){
	$param = array();
	$param["wwl_is_open"] = "1";

	$where_sql = sprintf("wwl_wdcseq = %d", $form["sub_seq"]);

	simple_update($param, "w_work_list", $where_sql);

	$res = array();
	$res["datas"] = array();
	$res["lists"] = $flexFunc -> load_part_list(21, $form["sub_seq"]);
	$res = work_list_asm($res);

	echo json_encode($res);
} else if ($form["md"] == "worksViewRemove"){
	$param = array();
	$param["wwl_is_open"] = "0";

	$where_sql = sprintf("wwl_wdcseq = %d", $form["sub_seq"]);

	simple_update($param, "w_work_list", $where_sql);

	$res = array();
	$res["datas"] = array();
	$res["lists"] = $flexFunc -> load_part_list(21, $form["sub_seq"]);
	$res = work_list_asm($res);

	echo json_encode($res);
} else if ($form["md"] == "worksViewSelect") {
    $param = array();
    $param["wwl_is_open"] = ($form["wwl_is_open"] == "true") ? 1 : 0;

    $where_sql = sprintf("wwl_seq = %d and wwl_wdcseq = %d", $form["wwl_seq"], $form["sub_seq"]);

    simple_update($param, "w_work_list", $where_sql);

    $res = array();
    $res["datas"] = array();
    $res["lists"] = $flexFunc->load_part_list(21, $form["sub_seq"]);

    $res = work_list_asm($res);

    echo json_encode($res);
} else if ($form["md"] == "partsListCheck"){
    $param = array();
    $param["wpl_is_open"] = "1";

    $where_sql = sprintf("wpl_wdcseq = %d", $form["sub_seq"]);

    simple_update($param, "w_parts_list", $where_sql);

    $res = array();
    $res["datas"] = array();
    $res["lists"] = $flexFunc -> load_part_list(19, $form["sub_seq"]);

    $res = work_list_asm($res);

    echo json_encode($res);
} else if ($form["md"] == "partsListRemove"){
    $param = array();
    $param["wpl_is_open"] = "0";

    $where_sql = sprintf("wpl_wdcseq = %d", $form["sub_seq"]);

    simple_update($param, "w_parts_list", $where_sql);

    $res = array();
    $res["datas"] = array();
    $res["lists"] = $flexFunc -> load_part_list(19, $form["sub_seq"]);

    $res = work_list_asm($res);

    echo json_encode($res);
} else if ($form["md"] == "partsViewSelect"){
	$param = array();
	$param["wpl_is_open"] = ($form["wpl_is_open"] == "true") ? 1: 0;

	$where_sql = sprintf("wpl_seq = %d and wpl_wdcseq = %d", $form["wpl_seq"], $form["sub_seq"]);

	simple_update($param, "w_parts_list", $where_sql);

	$res = array();
	$res["datas"] = array();
	$res["lists"] = $flexFunc -> load_part_list(19, $form["sub_seq"]);

	$res = work_list_asm($res);

	echo json_encode($res);
} else if ($form["md"] == "sortOutscList"){
	$full_cnt = intval($form["full_cnt"]);
	for($i=1; $i<=$full_cnt; $i++){
		$wol_seq = intval($form["cnt{$i}"]);
		$wol_sort = $i * 10;

		$param = array();
		$param["wol_sort"] = $wol_sort;

		$where_sql = sprintf("wol_seq = %d", $wol_seq);

		simple_update($param, "w_outsc_list", $where_sql);
	}

	$res = array();
	$res["datas"] = array();
	$res["lists"] = $flexFunc -> load_part_list(20, $form["sub_seq"]);
	$res = outsc_list_asm($res);

	echo json_encode($res);
} else if ($form["md"] == "sortWorkList"){
	$full_cnt = intval($form["full_cnt"]);
	for($i=1; $i<=$full_cnt; $i++){
		$wwl_seq = intval($form["cnt{$i}"]);
		$wwl_sort = $i * 10;

		$param = array();
		$param["wwl_sort"] = $wwl_sort;

		$where_sql = sprintf("wwl_seq = %d", $wwl_seq);

		simple_update($param, "w_work_list", $where_sql);
	}

	$res = array();
	$res["datas"] = array();
	$res["lists"] = $flexFunc -> load_part_list(21, $form["sub_seq"]);
	$res = work_list_asm($res);

	echo json_encode($res);
} else if ($form["md"] == "sortPartsList"){
	$full_cnt = intval($form["full_cnt"]);
	for($i=1; $i<=$full_cnt; $i++){
		$wpl_seq = intval($form["cnt{$i}"]);
		$wpl_sort = $i * 10;

		$param = array();
		$param["wpl_sort"] = $wpl_sort;

		$where_sql = sprintf("wpl_seq = %d", $wpl_seq);

		simple_update($param, "w_parts_list", $where_sql);
	}

	$res = array();
	$res["datas"] = array();
	$res["lists"] = $flexFunc -> load_part_list(19, $form["sub_seq"]);
	$res = parts_list_asm($res);

	echo json_encode($res);
} else if ($form["md"] == "load_datas"){
	$res = array();
	$res["datas"] = $flexFunc -> load_part_datas($form["seq"], $form["main_seq"], $form["sub_seq"]);
	$res["lists"] = $flexFunc -> load_part_list($form["seq"], $form["sub_seq"]);

	if ($res["datas"]["mfl_table"] == "w_directions"){
		foreach($res["datas"] as $ky => $vl){
			switch($ky){
				case "wdc_form_cure":
				case "wdc_color_ad":
				case "wdc_painting":
				case "wdc_assembling":
					$res["datas"][$ky] = ($vl) ? $vl."日": false;
					break;
				case "wdc_price":
					$res["datas"][$ky] = ($vl) ? number_format($vl)."円": false;
					break;
				case "wdc_other":
					$res["datas"][$ky] = ($vl) ? preg_replace("/\n/", "<br>", $vl): false;
					break;
			}
		}

		$res["datas"]["sum_days"] = ($res["datas"]["wdc_form_cure"] + $res["datas"]["wdc_color_ad"] + $res["datas"]["wdc_painting"] + $res["datas"]["wdc_assembling"])."日";
		$res["datas"]["wdc_imp_reason"] = ($res["datas"]["wdc_imp_reason"]) ? sprintf("／理由：%s", $res["datas"]["wdc_imp_reason"]): false;
		$res["datas"]["wdc_cording_file"] = ($res["datas"]["wdc_cording_file"]) ? sprintf("／<a href=\"%s\" target=\"_blank\">ダウンロード</a>", $res["datas"]["wdc_cording_file"]): "";

		$res["datas"]["wdc_cording"] = ($res["datas"]["wdc_cording"]) ? "あり": "なし";
	} else if ($res["datas"]["mfl_table"] == "w_parts_list"){
		$res = parts_list_asm($res);
	} else if ($res["datas"]["mfl_table"] == "w_work_list"){
		$res = work_list_asm($res);
	} else if ($res["datas"]["mfl_table"] == "w_outsc_list"){
		$res = outsc_list_asm($res);
	}

	echo json_encode($res);
} else if ($form["md"] == "claimUpdate"){
    $param = array();
    $param["wdc_claimfg"] = $form["wdc_claimfg"];
    $param["wdc_claim"] = "'".$form["wdc_claim"]."'";
    $param["wdc_modified"] =  "now()";

    $where_sql = sprintf("wdc_seq = %d", $form["wdc_seq"]);

    simple_update($param, "w_directions", $where_sql);

}

function work_list_asm($res){
	$sum_days = 0;
	$p_price = 0;
	$w_price = 0;
	$sum_price = 0;

	foreach($res["lists"] as &$part){
		$part["sum_price"] = $part["wwl_p_price"] + $part["wwl_w_price"];

		$sum_price += $part["sum_price"];

		$p_price += $part["wwl_p_price"];
		$w_price += $part["wwl_w_price"];

		$part["wwl_u_price"] = ($part["wwl_u_price"]) ? number_format($part["wwl_u_price"])."円": "";
		$part["wwl_p_price"] = ($part["wwl_p_price"]) ? number_format($part["wwl_p_price"])."円": "";
		$part["wwl_w_price"] = ($part["wwl_w_price"]) ? number_format($part["wwl_w_price"])."円": "";

		$part["sum_price"] = ($part["sum_price"]) ? number_format($part["sum_price"])."円": "";
	}

	$res["datas"]["sum_p_price"] = ($p_price) ? $p_price."円": "";
	$res["datas"]["sum_w_price"] = ($w_price) ? $w_price."円": "";
	$res["datas"]["sum_price"] = ($sum_price) ? $sum_price."円": "";

	return $res;
}

function parts_list_asm($res){
	$sum_days = 0;
	$sum_price = 0;
	foreach($res["lists"] as &$part){
		$sum_days += $part["wpl_days"];
		$sum_price += $part["wpl_price"];
		$part["wpl_days"] = ($part["wpl_days"]) ? $part["wpl_days"]."日": "";
		$part["wpl_price"] = ($part["wpl_price"]) ? $part["wpl_price_num"]."円": "";
	}

	$res["datas"]["sum_days"] = ($sum_days) ? $sum_days."日": "";
	$res["datas"]["sum_price"] = ($sum_price) ? $sum_price."円": "";

	return $res;
}

function outsc_list_asm($res){
	$sum_days = 0;
	$sum_price = 0;
	foreach($res["lists"] as &$part){
		$sum_days += $part["wol_days"];
		$sum_price += $part["wol_price"];
		$part["wol_days"] = ($part["wol_days"]) ? $part["wol_days"]."日": "";
		$part["wol_price"] = ($part["wol_price"]) ? $part["wol_price_num"]."円": "";
	}

	$res["datas"]["sum_days"] = ($sum_days) ? $sum_days."日": "";
	$res["datas"]["sum_price"] = ($sum_price) ? $sum_price."円": "";

	return $res;
}

exit;
