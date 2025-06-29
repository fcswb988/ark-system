<?php

require("./syst
em2/basicFunc.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$check_ary = array();

$sql = "";
$sql.= "select ";
$sql.= "	* ";
$sql.= "from ";
$sql.= "	w_repair_view ";
$sql.= "where ";
$sql.= "	wrv_delfg = 0 ";
$sql.= "	and wrv_is_open = 1 ";
$rs = mysql_query($sql);

while($temp = mysql_fetch_array($rs, MYSQL_ASSOC)){
	$nm = sprintf("%d_%d", $temp["wrv_wdcseq"], $temp["wrv_cnt"]);
	$check_ary[$nm] = 1;
}

$rs = mysql_query("TRUNCATE w_parts_list");
$rs = mysql_query("TRUNCATE w_outsc_list");
$rs = mysql_query("TRUNCATE w_work_list");

$sql = "";
$sql.= "select ";
$sql.= "	* ";
$sql.= "from ";
$sql.= "	w_directions ";
$sql.= "where ";
$sql.= "	wdc_delfg = 0 ";
$rs = mysql_query($sql);

while($temp = mysql_fetch_array($rs, MYSQL_ASSOC)){
	for($i=1; $i<=20; $i++){
		if ($temp["wdc_parts_num{$i}"] || $temp["wdc_parts_name{$i}"] || $temp["wdc_parts_days{$i}"]){
			$param = array();
			$param["wpl_wdcseq"] = sql_int($temp["wdc_seq"]);
			$param["wpl_number"] = sql_esc($temp["wdc_parts_num{$i}"]);
			$param["wpl_name"] = sql_esc($temp["wdc_parts_name{$i}"]);
			$param["wpl_days"] = sql_int($temp["wdc_parts_days{$i}"]);
			$param["wpl_price"] = sql_int($temp["wdc_parts_price{$i}"]);
			$param["wpl_sort"] = sql_int($i * 10);
			$param["wpl_created"] = "now()";
			
			simple_insert($param, "w_parts_list");
		}
	}
	
	for($i=1; $i<=10; $i++){
		if ($temp["wdc_outsc_dtl{$i}"] || $temp["wdc_outsc_days{$i}"] || $temp["wdc_outsc_price{$i}"]){
			$param = array();
			$param["wol_wdcseq"] = sql_int($temp["wdc_seq"]);
			$param["wol_title"] = sql_esc($temp["wdc_outsc_dtl{$i}"]);
			$param["wol_days"] = sql_int($temp["wdc_outsc_days{$i}"]);
			$param["wol_price"] = sql_int($temp["wdc_outsc_price{$i}"]);
			$param["wol_sort"] = sql_int($i * 10);
			$param["wol_created"] = "now()";
			
			simple_insert($param, "w_outsc_list");
		}
	}
	
	for($i=1; $i<=70; $i++){
		if ($temp["wdc_work_title{$i}"] || $temp["wdc_work_num{$i}"] || $temp["wdc_work_unit{$i}"] || $temp["wdc_work_u_price{$i}"] || $temp["wdc_work_p_price{$i}"] || $temp["wdc_work_t_price{$i}"]){
			$param = array();
			$param["wwl_wdcseq"] = sql_int($temp["wdc_seq"]);
			$param["wwl_title"] = sql_esc($temp["wdc_work_title{$i}"]);
			$param["wwl_amount"] = sql_int($temp["wdc_work_num{$i}"]);
			$param["wwl_unit"] = sql_int($temp["wdc_work_unit{$i}"]);
			$param["wwl_u_price"] = sql_int($temp["wdc_work_u_price{$i}"]);
			$param["wwl_p_price"] = sql_int($temp["wdc_work_p_price{$i}"]);
			$param["wwl_w_price"] = sql_int($temp["wdc_work_t_price{$i}"]);
			$param["wwl_sort"] = sql_int($i * 10);
			$param["wwl_created"] = "now()";
			
			$nm = sprintf("%d_%d", $temp["wdc_seq"], $i);
			if ($check_ary[$nm]){
			$param["wwl_is_open"] = sql_int(1);
			}
			
			simple_insert($param, "w_work_list");
		}
	}
}


