<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");
require("../lib/repairClass.php");
require("../lib/wbsClass.php");
require("../lib/invoiceClass_new.php");
//require("../lib/PHPExcel.php");
//require("../lib/PHPExcel/IOFactory.php");

require_once('../vendor/autoload.php');

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
$constClass = new constClass();
//$commonClass -> login_check();
//$replace = $commonClass -> load_basic($replace);

$repairClass = new repairClass();
$wbsClass = new wbsClass();
$invoiceClass = new invoiceClass_new();

$customersClass = new customersClass();
if (empty($form["wdc_seq"])){
	$form["wdc_seq"] = $customersClass -> search_direction();
}
$replace = $repairClass -> load_detail_repair($replace);
if(!$form["wcm_seq"]){
	$form["wcm_seq"] = $replace["wdc_wcmseq"];
}
$replace = $customersClass -> load_details($replace);

$replace["wcm_seq"] = $form["wcm_seq"];
$replace["wrp_seq"] = $form["wrp_seq"];
$replace["wdc_seq"] = $form["wdc_seq"];

$printClass = new printClass();
$printClass -> objPHPExcel = new PHPExcel();

if ($form["md"] == "bill" || $form["md"] == "estimate" || $form["md"] == "delivery"){
    $printClass -> set_bill();
} else if ($form["md"] == "billDeductible"){
    $printClass -> set_bill(true);
} else if ($form["md"] == "bill_sum"){
    $printClass -> set_bill_sum();
} else if ($form["md"] == "work"){
	$printClass -> set_work();
} else if ($form["md"] == "daily_work"){
	$printClass -> set_daily_work();
} else if ($form["md"] == "parts"){
	$printClass -> set_parts();
} else {
	exit;
}

if ($form["md"] != "bill_sum") {
	$printClass -> upd_printed();
}
$fname = $form["fname"]? $form["fname"]:$form["md"];
$objWriter = PHPExcel_IOFactory::createWriter($printClass -> objPHPExcel, "Excel2007");
if($form["keep"]){
	$rootPath = $_SERVER['DOCUMENT_ROOT'];
	//ディレクトリの準備
	$file_dir = date("Ymd");
	$now = new DateTime();
	$fname = $fname. $now->format('YmdHis'). "." . substr(explode(".", (microtime(true) . ""))[1], 0, 3);
	if ((!file_exists(image_dir.$file_dir))&&(!is_dir(image_dir.$file_dir))){
		mkdir(image_dir.$file_dir);
		chmod(image_dir.$file_dir, 0777);
	}
	$objWriter -> save($rootPath."/system2/image/".$file_dir."/".$fname.".xlsx");
	// w_document 追加
	$param = array();
	$param["wdc_type"] = sql_esc($form["md"]=='bill'? 'claim':$form["md"]);
	$param["wdc_wdcseq"] = sql_int($form["wdc_seq"]);
	$param["wdc_title"] = sql_esc($fname);
	$param["wdc_file"] = sql_esc($file_dir."/".$fname.".xlsx");
	$param["wdc_create_wmmseq"] = $_SESSION["mem_seq"];
	$param["wdc_created"] = "now()";

	simple_insert($param, "w_document");
}

header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
header("Content-Disposition: attachment;filename=".$fname.".xlsx");
header("Cache-Control: max-age=0");

//$objWriter = PHPExcel_IOFactory::createWriter($printClass -> objPHPExcel, "Excel2007");
$objWriter -> save("php://output");
exit;

class printClass {
	const WDC_TYPE_NOWORK = 5;	// 作業なし
	var $objPHPExcel = false;

	function set_parts(){
		global $replace, $form;

		$this -> objPHPExcel = PHPExcel_IOFactory::load("../excel_tpl/format_parts.xlsx");

		$sheet = $this -> objPHPExcel -> getSheetByName("ASK");

		//パーツリスト読み込み
		$w_parts_list = array();

		$sql = "";
		$sql.= "select ";
		$sql.= "	* ";
		$sql.= "from ";
		$sql.= "	w_parts_list ";
		$sql.= "where ";
		$sql.= "	wpl_wdcseq = ".sql_int($form["wdc_seq"])." ";
		$sql.= "	and wpl_is_open = 1 ";
		$sql.= "	and wpl_delfg = 0 ";
		$sql.= "order by ";
		$sql.= "	wpl_sort ";
		$rs = mysql_query($sql);

		while($temp = mysql_fetch_array($rs, MYSQL_ASSOC)){
			$w_parts_list[] = $temp;
		}

		$parts_list = array();
		for($i=1; $i<=10; $i++){
			/*
			if ($replace["wdc_parts_name{$i}"]){
				$cnt = count($parts_list);
				$parts_list[] = array(
					"cnt" => $cnt,
					"wdc_parts_num" => $replace["wdc_parts_num{$i}"],
					"wdc_parts_name" => $replace["wdc_parts_name{$i}"],
				);
			}
			*/
			$num = $i - 1;
			if ($w_parts_list[$num] && $w_parts_list[$num]["wpl_name"]){
				$cnt = count($parts_list);
				$parts_list[] = array(
					"cnt" => $cnt,
					"wdc_parts_num" => $w_parts_list[$num]["wpl_number"],
					"wdc_parts_name" => $w_parts_list[$num]["wpl_name"],
				);
			}
		}

		foreach($parts_list as $part){
			$pos_num = $part["cnt"] + 23;
			$sheet -> setCellValue("B{$pos_num}", $part["wdc_parts_num"]." ".$part["wdc_parts_name"]);
		}
	}

	function set_work(){
		global $replace, $form;

		$this -> objPHPExcel = PHPExcel_IOFactory::load("../excel_tpl/format_work.xlsx");
		$sheet = $this -> objPHPExcel -> getSheet(0);

		$sheet -> setCellValue("C7", $replace["wmk_name"]." ".$replace["wrp_body_type"]);
		$sheet -> setCellValue("C10", $replace["wcm_company"]." ".$replace["wcm_name"]." 様");
		$sheet -> setCellValue("C12", $replace["wrp_chassis_number"]);
		$sheet -> setCellValue("C14", $replace["wrp_regist_area"].$replace["wrp_regist_class"].$replace["wrp_regist_hira"].$replace["wrp_regist_number"]);
		$sheet -> setCellValue("C16", $replace["wrp_color_jp"]);
		$delivered_date = $replace["wdc_delivered_date"]!="0000-00-00"? date('n月j日', strtotime($replace["wdc_delivered_date"])) : "";
		$sheet -> setCellValue("C20", $delivered_date);

		$sheet -> setCellValue("C18", $replace["wrp_first_date"]=="0000-00-00"? "" : PHPExcel_Shared_Date::PHPToExcel(new DateTime($replace["wrp_first_date"])));
		$sheet -> setCellValue("F18", $replace["wrp_first_date"]=="0000-00-00"? "" : date('Y年n月', strtotime($replace["wrp_first_date"])));

		if ($replace["wdc_form_cure"]){
			$sheet -> setCellValue("L53", $replace["wdc_form_cure"]);
		}
		if ($replace["wdc_color_ad"]){
			$sheet -> setCellValue("L62", $replace["wdc_color_ad"]);
		}
		if ($replace["wdc_painting"]){
			$sheet -> setCellValue("M62", $replace["wdc_painting"]);
		}
		if ($replace["wdc_assembling"]){
			$sheet -> setCellValue("J57", $replace["wdc_assembling"]);
		}

		$w_pos_num = 25;	// 作業内容先頭行
		$sql = "";
		$sql.= "select * ";
		$sql.= "from w_work_list ";
		$sql.= "where ";
		$sql.= "	wwl_wdcseq = ".sql_int($form["wdc_seq"])." ";
		$sql.= "	and wwl_is_open = 1 ";
		$sql.= "	and wwl_delfg = 0 ";
		$sql.= "order by ";
		$sql.= "	wwl_sort ";
		$rs = mysql_query($sql);

		while($temp = mysql_fetch_array($rs, MYSQL_ASSOC)){
			if ($temp["wwl_title"]){
				$sheet -> setCellValue("B{$w_pos_num}", $temp["wwl_title"]);	//作業内容
			}
			$w_pos_num +=2;
		}

		//営業担当
		$sql = "select * ";
		$sql.= "from w_member ";
		$sql.= "where ";
		$sql.= "	wmm_seq = ".sql_int($replace["wdc_wmmseq"])." ";
		$sql.= "	and wmm_delfg = 0 ";
		$rs = mysql_query($sql);
		$w_member = mysql_fetch_array($rs, MYSQL_ASSOC);
		if($w_member){
			$w_first_name = explode(' ',$w_member["wmm_name"])[0];
			$sheet -> setCellValue("K6", $w_first_name);
		}

		list($yy, $mm, $dd) = preg_split("/\-/", $replace["wdc_entry_date"]);

		$sheet -> setCellValue("C5", $yy);
		$sheet -> setCellValue("E5", $mm);
		$sheet -> setCellValue("G5", $dd);

		list($yy, $mm, $dd) = preg_split("/\-/", $replace["wdc_delivered_date"]);

		$sheet -> setCellValue("C6", $yy);
		$sheet -> setCellValue("E6", $mm);
		$sheet -> setCellValue("G6", $dd);
	}


	function set_daily_work(){
		global $replace, $wbsClass, $commonClass, $form;
		$ROW_START = 12;
		$sheets = ["鈑金"=>["1","4"] , "塗装"=>["2","3"]];

		$this -> objPHPExcel = PHPExcel_IOFactory::load("../excel_tpl/format_work_schedule.xlsx");

		$date = $form["date"];

		foreach($sheets as $key=>$vals){
			$sheet = $this -> objPHPExcel -> getSheetByName($key);

			$w_jobs = array();
			foreach($vals as $val){
				$w_jobs[]= "  wmm_jobs like '%" . $val . "%' ";
			}

			//スケジュール読み込み
			$sql = "";
			$sql.= "select ";
			$sql.= " w_member.*, w_wbs.* , w_repair.*, w_maker.wmk_name ";
			$sql.= "from ";
			$sql.= " w_member ";
			$sql.= " left join w_wbs on wbs_wmmseq = wmm_seq and wbs_delfg = 0 ";
			$sql.= "  and DATE_FORMAT(wbs_start_dt,'%Y-%m-%d') = DATE_FORMAT(".sql_esc($date).",'%Y-%m-%d') ";
			$sql.= " left join w_directions on wbs_wdcseq = wdc_seq and wbs_delfg = 0 ";
			$sql.= " left join w_repair on wdc_wrpseq = wrp_seq and wrp_delfg = 0 ";
			$sql.= " left join w_maker on wrp_wmkseq = wmk_seq ";
			$sql.= " left join w_customers on wdc_wcmseq = wcm_seq and wcm_delfg = 0 ";
			$sql.= "where ";
			$sql.= " wmm_delfg = 0 ";
			$sql.= "  and (" . join(" or ", $w_jobs) . ") ";
			$sql.= "order by ";
			$sql.= " wmm_sort ";

			$rs = mysql_query($sql);

			$colIdx = 1; $rowIdx = $ROW_START;
			$w_name = "";
			while($temp = mysql_fetch_array($rs, MYSQL_ASSOC)){
				if($temp["wmm_name"] != $w_name){
					$colIdx++;
					$sheet -> setCellValueByColumnAndRow($colIdx, $ROW_START, $temp["wmm_name"]);
					$w_name = $temp["wmm_name"];
				}
				$rowIdx = $ROW_START + $this -> getTimeSlot($temp["wbs_start_dt"]);
				$sheet -> setCellValueByColumnAndRow($colIdx, $rowIdx, $temp["wmk_name"] . " " . $temp["wrp_body_type"]);
			}
			$sheet -> setCellValue("E3", date('Y年m月d日', strtotime($date)) . "（" . $commonClass::WEEK_JP[date('w',strtotime($date))] ."）");
		}
	}

	function getTimeSlot($dtime){
		global $wbsClass;
		$hhmm = date('H:i',strtotime($dtime));
		$slotNo = 1;
		for($i=1; $i <= count($wbsClass->timeSlots); $i++){
			if($hhmm >= $wbsClass->timeSlots[$i]){
				$slotNo = $i;
			}
		}
		return($slotNo);

	}

	function result_yes_no($dat){
		if ($dat == 1) return "あり";
		else if ($dat == 2) return "なし";
		return "";
	}

	function result_ok_ng($dat){
		if ($dat == 1) return "OK";
		else if ($dat == 2) return "NG";
		return "";
	}

	const SINGLE_ROWS = 25;
	const MULTI_1ST_ROWS = 32;
	const MIDDLE_PAGE_ROWS = 48;
	const LAST_PAGE_ROWS = 38;

	function set_bill($isDeductible = false){
	    global $replace, $repairClass, $form, $constClass;

		$this -> objPHPExcel = PHPExcel_IOFactory::load("../excel_tpl/format_invoice_new.xlsx");

		//修理情報読み込み
		$sql = "";
		$sql.= "select w_directions.*, wmm_name ";
		$sql.= "from w_directions ";
		$sql.= "left join w_member on wdc_wmmseq = wmm_seq ";
		$sql.= "where ";
		$sql.= "	wdc_seq = ".intval($form["wdc_seq"])." ";
		$rs = mysql_query($sql);

		$w_directions = mysql_fetch_array($rs, MYSQL_ASSOC);

		$order_list = array();

        $nonTax = 0;    // 非課税金額
		if(!$isDeductible) {
		    //作業リスト読み込み
    		if($form["src"] != "work"){
    			$sql = "";
    			$sql.= "select ";
    			$sql.= "	* ";
    			$sql.= "from ";
    			$sql.= "	w_billing_list ";
    			$sql.= "where ";
    			$sql.= "	wbl_wdcseq = ".sql_int($form["wdc_seq"])." ";
    			$sql.= "	and wbl_delfg = 0 ";
    			$sql.= "order by ";
    			$sql.= "	wbl_sort ";
    			$rs = mysql_query($sql);

    			while($temp = mysql_fetch_array($rs, MYSQL_ASSOC)){
    				$cnt = count($order_list);
    				$order_list[] = array(
    					"cnt" => $cnt,
    					"wdc_work_title" => $temp["wbl_title"],
    				    "wdc_work_num" => $temp["wbl_amount"],
    				    "wdc_work_unit" => $constClass :: UNIT_TYPE[$temp["wbl_unit"]],
    				    "wdc_work_u_price" => $temp["wbl_u_price"],
    				    "wdc_work_p_price" => $temp["wbl_p_price"],
    				    "wdc_work_t_price" => $temp["wbl_w_price"],
    					"line_sum" => ($temp["wbl_p_price"] + $temp["wbl_w_price"]),
    				);
    				$nonTax += $temp["wbl_non_tax"];
    			}
    		} else {
    	/* 2022/06 請求書改修 w_work_list → w_billing_list */
    			$sql = "";
    			$sql.= "select ";
    			$sql.= "	* ";
    			$sql.= "from ";
    			$sql.= "	w_work_list ";
    			$sql.= "where ";
    			$sql.= "	wwl_wdcseq = ".sql_int($form["wdc_seq"])." ";
    			$sql.= "	and wwl_is_open = 1 ";
    			$sql.= "	and wwl_delfg = 0 ";
    			$sql.= "order by ";
    			$sql.= "	wwl_sort ";
    			$rs = mysql_query($sql);

    			while($temp = mysql_fetch_array($rs, MYSQL_ASSOC)){
    				$cnt = count($order_list);
    				$order_list[] = array(
    					"cnt" => $cnt,
    					"wdc_work_title" => $temp["wwl_title"],
    				    "wdc_work_num" => $temp["wwl_amount"],
    				    "wdc_work_unit" => $constClass :: UNIT_TYPE[$temp["wwl_unit"]],
    				    "wdc_work_u_price" => $temp["wwl_u_price"],
    				    "wdc_work_p_price" => $temp["wwl_p_price"],
    				    "wdc_work_t_price" => $temp["wwl_w_price"],
    					"line_sum" => ($temp["wwl_p_price"] + $temp["wwl_w_price"]),
    				);
    			}
    		}

		} else {
		    $order_list[] = array(
		        "cnt" => 1,
		        "wdc_work_title" => "免責金額",
		        "wdc_work_num" => null,
		        "wdc_work_unit" => $constClass :: UNIT_TYPE["0"],
	    		"wdc_work_u_price" => null,
	    		"wdc_work_p_price" => null,
	    		"wdc_work_t_price" => $w_directions["wdc_deductible"],
		        "line_sum" => $w_directions["wdc_deductible"],
		    );
		}
		$last_cnt = count($order_list);
		$page_cnt = 1;
		if($last_cnt > self::SINGLE_ROWS){
			$page_cnt = ceil(max($last_cnt - self::MULTI_1ST_ROWS - self::LAST_PAGE_ROWS, 0) / self::MIDDLE_PAGE_ROWS) + 2;
		}
		$today = date('Y/m/d');

		if ($page_cnt == 1){
			$this -> objPHPExcel -> removeSheetByIndex(3);
			$this -> objPHPExcel -> removeSheetByIndex(2);
			$this -> objPHPExcel -> removeSheetByIndex(1);
			$sheet = $this -> objPHPExcel -> getSheetByName("bill_single");
		} else if($page_cnt == 2) {
			$this -> objPHPExcel -> removeSheetByIndex(3);
			$this -> objPHPExcel -> removeSheetByIndex(2);
			$this -> objPHPExcel -> removeSheetByIndex(0);
			$sheet = $this -> objPHPExcel -> getSheetByName("bill_double1");
		} else {
			$this -> objPHPExcel -> removeSheetByIndex(3);
			$this -> objPHPExcel -> removeSheetByIndex(1);
			$this -> objPHPExcel -> removeSheetByIndex(0);
			$sheet = $this -> objPHPExcel -> getSheetByName("bill_multi");
			// 3ページまでしか対応していない
			if ($page_cnt < 3) {
			//	$sheet->removeRow(60,57);
			}
		}

		$count = 0;
		$w_page = 1;
		$page_total = 0;
		if (count($order_list)){
			foreach($order_list as $part){
				$count++;
				$page = ceil(max($count - self::MULTI_1ST_ROWS, 0) / self::MIDDLE_PAGE_ROWS) + 1;
				if($w_page != $page) {
					$w_pos_num = $w_pos_num + 3;
					$sheet -> setCellValue("L{$w_pos_num}", "頁合計 " . $w_page . "/" . $page_cnt);
					$sheet -> setCellValue("O{$w_pos_num}", $page_total);
					$page_total = 0;
					$w_page = $page;
				}
				$w_pos_num = ($count <= self::MULTI_1ST_ROWS)? $count+21 : $count+31+ 9*($page-2);

				$sheet -> setCellValue("B{$w_pos_num}", $count);
				$sheet -> setCellValue("C{$w_pos_num}", $part["wdc_work_title"]);
				if ($part["wdc_work_num"]){
				    $sheet -> setCellValue("I{$w_pos_num}", $this -> zeroToNull($part["wdc_work_num"]));
				}
				if ($part["wdc_work_unit"]){
					$sheet -> setCellValue("J{$w_pos_num}", $part["wdc_work_unit"]);
				}
				if ($part["wdc_work_u_price"]){
				    $sheet -> setCellValue("K{$w_pos_num}", $this -> zeroToNull($part["wdc_work_u_price"]));
				}
				if ($part["wdc_work_p_price"]){
				    $sheet -> setCellValue("M{$w_pos_num}", $this -> zeroToNull($part["wdc_work_p_price"]));
				}
				if ($part["wdc_work_t_price"]){
				    $sheet -> setCellValue("O{$w_pos_num}", $this -> zeroToNull($part["wdc_work_t_price"]));
				}
				$page_total += $part["wdc_work_p_price"] + $part["wdc_work_t_price"];
			}
			// 最終ページに明細がないとき
			if($w_page < $page_cnt) {
				$w_pos_num = ($w_page == 1? 56 : 57) + 57 * ($w_page-1);
				$sheet -> setCellValue("L{$w_pos_num}", "頁合計 " . $w_page . "/" . $page_cnt);
				$sheet -> setCellValue("O{$w_pos_num}", $page_total);
				$page_total = 0;
			}
		}

		if ($last_cnt <= self::SINGLE_ROWS){
			$sheet -> setCellValue("O48", $page_total);
		} else {
			$w_pos_num = 103 + 57 * ($page_cnt-2);
			$sheet -> setCellValue("L{$w_pos_num}", "頁合計 " . $page_cnt . "/" . $page_cnt);
			$sheet -> setCellValue("O{$w_pos_num}", $page_total);
		}
		switch ($form["md"]){
		    case "estimate":
		        $title = "見積書";  $title_amount = "お見積金額";
		        $issue_date = $today;
		        // 振込情報の文言非表示
		        $sheet -> setCellValue("B".($last_cnt <= self::SINGLE_ROWS? "48":strval(103 + 57 * ($page_cnt-2))), "");
		        $sheet -> setCellValue("B".($last_cnt <= self::SINGLE_ROWS? "54":strval(109 + 57 * ($page_cnt-2))), "");
		        break;
		    case "delivery":
		        $title = "納品書";  $title_amount = "金額";
		        $issue_date = $today;
		        break;
		    default:
		        $title = "請求書";  $title_amount = "ご請求金額";
		        $issue_date = date('Y/m/d',strtotime($replace["wdc_billing_date"]? $replace["wdc_billing_date"]:$replace["wdc_delivered_date"]));
		}

		$sheet -> setCellValue("I1", $title);
		$sheet -> setCellValue("I19", $title_amount);
		$sheet -> setCellValue("O2", $issue_date);
		$sheet -> setCellValue("D12", $replace["wcm_tel"]);
		$sheet -> setCellValue("O12", $w_directions["wmm_name"]);

		$sheet -> setCellValue("B15", $replace["wmk_name"]." ".$replace["wrp_body_type"]." ".$replace["wrp_color_jp"]);
		$sheet -> setCellValue("E15", $replace["wrp_regist_area"].$replace["wrp_regist_class"].$replace["wrp_regist_hira"].$replace["wrp_regist_number"]);
		$sheet -> setCellValue("F15", $replace["wrp_first_date"]=="0000-00-00"? "": PHPExcel_Shared_Date::PHPToExcel(new DateTime($replace["wrp_first_date"])));
		$sheet -> setCellValue("I15", $replace["wrp_regist_lim_date"]=="0000-00-00"? "": PHPExcel_Shared_Date::PHPToExcel(new DateTime($replace["wrp_regist_lim_date"])));
//		$sheet -> getStyle('I15')->getNumberFormat()->setFormatCode("ggge年m月d日");
		if($replace["wdc_storing_date"] && $replace["wdc_storing_date"] != "0000-00-00")
			$sheet -> setCellValue("O15", date('Y/m/d',strtotime($replace["wdc_storing_date"])));
		$sheet -> setCellValue("B17", $replace["wrp_format_body"]);
		$sheet -> setCellValue("E17", $replace["wrp_chassis_number"]);
		$sheet -> setCellValue("I17", $replace["wrp_format_mover"]);
		$sheet -> setCellValue("L17", $replace["wrp_format_number"]);
		$sheet -> setCellValue("N17", $replace["wrp_type_number"]);
		if($replace["wdc_delivered_date"] && $replace["wdc_delivered_date"] != "0000-00-00")
			$sheet -> setCellValue("O17", date('Y/m/d',strtotime($replace["wdc_delivered_date"])));
		$sheet -> setCellValue("D19", $repairClass -> wdc_type_jp[$w_directions["wdc_type"]]);	//作業種別

		if ($replace["wcm_zipcode"]) {
			$sheet -> setCellValue("C3", "〒".$replace["wcm_zipcode"]);
		}
		$sheet -> setCellValue("C4", $replace["wcm_pref"].$replace["wcm_address"]."\n".$replace["wcm_building"]);
		$name = "";
		if(trim($replace["wcm_company"])){
			$name = $replace["wcm_company"]
			. (trim($replace["wcm_name"])? "": "　　御中") ."\n　";
		}
		if($replace["wcm_post"]){
			$name .= $replace["wcm_post"]."　";
		}
		if(trim($replace["wcm_name"])){
			$name .= $replace["wcm_name"]."　　様";
		}
		$sheet -> setCellValue("C8", $name);

		//  諸費用セット
		$w_pos_num = (count($order_list) <= self::SINGLE_ROWS)? 48 : 103 + 57 * ($page_cnt-2);
		if ($w_directions["wdc_weight_tax"]){
			$sheet -> setCellValue("I{$w_pos_num}", $w_directions["wdc_weight_tax"]);
    	}
    	$w_pos_num++;
    	if ($w_directions["wdc_liability_insurance"]){
    		$sheet -> setCellValue("I{$w_pos_num}", $w_directions["wdc_liability_insurance"]);
    	}
    	$w_pos_num++;
    	if ($w_directions["wdc_stamp_tax"]){
    		$sheet -> setCellValue("I{$w_pos_num}", $w_directions["wdc_stamp_tax"]);
    	}
    	$w_pos_num++;
    	if ($w_directions["wdc_inspection_fee"]){
    		$sheet -> setCellValue("I{$w_pos_num}", $w_directions["wdc_inspection_fee"]);
    	}
        // 非課税金額
    	if ($nonTax){
    		$w_pos_num = (count($order_list) <= self::SINGLE_ROWS)? 56 : 111 + 57 * ($page_cnt-2);
    	    $sheet -> setCellValue("O{$w_pos_num}", $nonTax);
    	}

    	if($w_directions["wdc_inc_taxfg"] == 1 || $isDeductible){
    	    //内税
    		$w_pos_num = (count($order_list) <= self::SINGLE_ROWS)? 53 : 108 + 57 * ($page_cnt-2);
    		$sheet -> setCellValue("L{$w_pos_num}", "(内消費税 10%)");
    		$w_pre_pos_num = $w_pos_num - 1;
    		$sheet -> setCellValue("O{$w_pos_num}", "=ROUND(O{$w_pre_pos_num}/11,0)");
    		$w_nxt_pos_num = $w_pos_num + 1;
    		$sheet -> setCellValue("O{$w_nxt_pos_num}", "=O{$w_pre_pos_num}");
    		$w_pos_num = (count($order_list) <= self::SINGLE_ROWS)? 57 : 112 + 57 * ($page_cnt-2);
    		$sheet -> setCellValue("G{$w_pos_num}", "");
    	    $sheet -> setCellValue("I{$w_pos_num}", "");
    	}

		$sheet -> setTitle($title);
		$this -> objPHPExcel -> setActiveSheetIndex(0);
		$sheet = $this -> objPHPExcel -> getActiveSheet();
		$sheet -> getPageSetup()->setPrintArea('A:P');

		$sheet_copy = $sheet -> copy();
		$sheet_copy -> setCellValue("I1", $title."(控)");
		$sheet_copy -> setTitle($title."(控)");
		$this -> objPHPExcel -> addSheet($sheet_copy);

	}

	function set_bill_sum(){
		global $replace, $repairClass, $commonClass, $invoiceClass, $form;


		$this -> objPHPExcel = PHPExcel_IOFactory::load("../excel_tpl/format_invoice_new.xlsx");

		$today = date('Y/m/d');
		$month = $form["month"];
		$re_billing = $form["re-billing"];
		if($re_billing){	// 催促請求書のとき
			$month = date('Y-m-01', strtotime($re_billing));
		}
		$date_from = date('Y-m-01', strtotime($month));
		$date_to = date('Y-m-t', strtotime($date_from));
		$wcm_seq = $form["wcm_seq"];

		$this -> objPHPExcel -> removeSheetByIndex(2);
		$this -> objPHPExcel -> removeSheetByIndex(1);
		$this -> objPHPExcel -> removeSheetByIndex(0);
		$sheet = $this -> objPHPExcel -> getSheetByName('bill_sum');
		$form['fname'] = 'bill_sum_'.$wcm_seq .'_'. substr($month,0,7);

		//修理情報読み込み
		$sql = "";
		$sql.= "select ";
		$sql.= "	w_directions.* ,w_customers.*, w_repair.*, w_maker.wmk_name ";
		$sql.= "	,date_format(if(wdc_billing_date='0000-00-00', wdc_delivered_date, wdc_billing_date),'%Y-%m-01') as month ";
		$sql.= "	,sum(wbl_p_price) as wbl_p_price ";
		$sql.= "	,sum(wbl_w_price) as wbl_w_price ";
		$sql.= "	,sum(wbl_non_tax) as wbl_non_tax ";
		$sql.= "	, (select sum(wpl_base_price) from w_parts_list where wpl_wdcseq = wdc_seq and wpl_delfg = 0 and wpl_is_open = 1) as wpl_base_price ";
		$sql.= "from ";
		$sql.= "	w_directions ";
		$sql.= "	join w_customers on wdc_wcmseq = wcm_seq and wcm_delfg = 0 ";
		$sql.= "	join w_repair on wdc_wrpseq = wrp_seq and wrp_delfg = 0 ";
		$sql.= "	left join w_maker on wrp_wmkseq = wmk_seq ";
		$sql.= "	left join w_billing_list on wdc_seq = wbl_wdcseq and wbl_delfg = 0 and wbl_is_open = 1 ";
		$sql.= "where ";
		$sql.= "	wdc_wcmseq = ".sql_int($wcm_seq)." ";
		$sql.= "	and wdc_delfg = 0 ";
		$sql.= "	and wdc_type not in (" . self::WDC_TYPE_NOWORK . ") ";
		if($re_billing){	// 催促請求書のとき
			$sql.= " and wdc_deposited is null ";
		} else {
			$sql.= " and if(wdc_billing_date='0000-00-00', wdc_delivered_date, wdc_billing_date) between ".sql_esc($date_from)." and ".sql_esc($date_to). " ";
		}
		$sql.= " and wdc_bill_printed is not null ";
//		$sql.= " and wdc_deposited is null ";
		$sql.= "group by wdc_seq ";
		if($re_billing){	// 催促請求書のとき
			$sql.= "having sum(wbl_p_price) + sum(wbl_w_price) + sum(wbl_non_tax) > 0 ";
		}
		$sql.= "order by ";
		$sql.= "	wdc_delivered_date ";

		$rs = mysql_query($sql);

		$w_pos_num = 17;
		$sum_amount = 0;
		$sum_tax = 0;
		$total = 0;
		$deposited = 0;
		while($temp = mysql_fetch_array($rs, MYSQL_ASSOC)){
		    $taxRate = $temp["wdc_inc_taxfg"] == 1? 0: $commonClass::TAX_RATE;
			$sheet -> setCellValue("C{$w_pos_num}", date('m/d', strtotime($temp["wdc_delivered_date"])));	//日付
			$sheet -> setCellValue("D{$w_pos_num}", $temp["wmk_name"]." ".$temp["wrp_body_type"]);	//車名
			$sheet -> setCellValue("G{$w_pos_num}", $temp["wrp_regist_area"]." ".$temp["wrp_regist_class"]."\n".$temp["wrp_regist_hira"]." ".$temp["wrp_regist_number"]);	//登録番号
			$sheet -> setCellValue("I{$w_pos_num}", $repairClass -> wdc_type_jp[$temp["wdc_type"]]);	//作業種別
			$expense_amount_tax = $temp["wdc_weight_tax"] + $temp["wdc_liability_insurance"] + $temp["wdc_stamp_tax"] + floor($temp["wdc_inspection_fee"] * (1 + $taxRate/100));
			$mainte_amount = $temp["wbl_p_price"]+$temp["wbl_w_price"];
			$mainte_tax = preg_match("/^[0-9]+$/",$mainte_amount)? floor( $mainte_amount * $taxRate/100) : round( $mainte_amount * $taxRate/100);
			$temp["amount"] = $mainte_amount + $mainte_tax + $expense_amount_tax + $temp["wbl_non_tax"];	//金額(税込み)
			$sheet -> setCellValue("P{$w_pos_num}", $temp["amount"]);	//金額(税込み)
			$this -> upd_printed($temp["wdc_seq"]);
			if($temp["month"] == $month ){ //当月分
				$total += floor($temp["amount"]);
				$sum_amount += $temp["wbl_p_price"]+$temp["wbl_w_price"]+$temp["wdc_weight_tax"] + $temp["wdc_liability_insurance"] + $temp["wdc_stamp_tax"] + $temp["wdc_inspection_fee"];
			}
			if($temp["wdc_deposited"]){
				$sheet -> setCellValue("L{$w_pos_num}", "\\" . number_format($temp["amount"]) . " ".  date('m/d', strtotime($temp["wdc_deposited"])) . " 済");	//入金済
				$deposited += $temp["amount"];
			}
			$w_pos_num++;
		}

		$sheet -> setCellValue("P2", $today);

		if ($replace["wcm_zipcode"]) {
			$sheet -> setCellValue("C3", "〒".$replace["wcm_zipcode"]);
		}
		$sheet -> setCellValue("C4", $replace["wcm_pref"].$replace["wcm_address"]."\n".$replace["wcm_building"]);
		$sheet -> setCellValue("E12", date('Y年m月d日', strtotime($date_from)) ." ～ ". date('Y年m月d日', strtotime($date_to)));
		$name = "";
		if($replace["wcm_company"]){
			$name = $replace["wcm_company"]
			. (trim($replace["wcm_name"])? "": "　　御中") ."\n　";
		}
		if($replace["wcm_post"]){
			$name .= $replace["wcm_post"]."　";
		}
		if($replace["wcm_name"]){
			$name .= $replace["wcm_name"]."　　様";
		}
		$sheet -> setCellValue("C8", $name);
		//$sheet -> setCellValue("O43", $total);

		// 前回の請求
		$sql= "select * from w_billing_month ";
		$sql.= "where wbm_delfg = 0 and wbm_wcmseq = " . sql_int($wcm_seq) . " ";
		$sql.= " and wbm_month < " . sql_esc($month) . " ";
		$sql.= "order by wbm_month desc limit 1";
		$rs_ml = mysql_query($sql);
		$wbm_l = mysql_fetch_array($rs_ml, MYSQL_ASSOC);
		$last_accrued_amount = $wbm_l? (int)$wbm_l["wbm_accrued_amount"] : 0;
		$last_bill_amount = $wbm_l? (int)$wbm_l["wbm_bill_amount"] : 0;
//		$last_adjust_amount = $wbm_l? (int)$wbm_l["wbm_adjust_amount"] : 0;

		// 今月入金された額
		$sql= "select sum(wbm_bill_amount) as sum_bill_amount, sum(wbm_deposit_amount) as sum_deposit_amount, sum(wbm_adjust_amount) as sum_adjust_amount ";
		$sql.= "from w_billing_month ";
		$sql.= "where wbm_delfg = 0 and wbm_wcmseq = {$wcm_seq} ";
		$sql.= " and date_format(wbm_deposited,'%Y-%m-01') = '{$month}' ";
		$rs_depo = mysql_query($sql);
		$wbm_depo = mysql_fetch_array($rs_depo, MYSQL_ASSOC);
		$this_deposit_amount = $wbm_depo? (int)$wbm_depo["sum_deposit_amount"] : 0;
		$this_bill_amount = $wbm_depo? (int)$wbm_depo["sum_bill_amount"] : 0;
		$this_adjust_amount = $wbm_depo? (int)$wbm_depo["sum_adjust_amount"] : 0;

		$sheet -> setCellValue("B14", $last_accrued_amount + $this_deposit_amount + $this_adjust_amount);	// 前月迄の残額
//		$sheet -> setCellValue("B14", $last_accrued_amount + $this_bill_amount);	// 前月迄の残額
		$sheet -> setCellValue("D14", $this_deposit_amount);	// ご入金額
		$sheet -> setCellValue("E14", $this_adjust_amount);	// 調整額
		$sheet -> setCellValue("F14", $last_accrued_amount);	// 差引繰越金額

		if($wbm_l["wbm_month"] == date('Y-m-d', strtotime($month . ' -1 month'))){	 // 直近が前月か？
		}

		// 当月分
		$sql= "select * ";
		$sql.= "from w_billing_month ";
		$sql.= "where wbm_delfg = 0 and wbm_wcmseq = " . sql_int($wcm_seq);
		$sql.= " and wbm_month = " . sql_esc($month) . " ";
		$rs_m = mysql_query($sql);
		$wbm = mysql_fetch_array($rs_m, MYSQL_ASSOC);
		$adjust_amount = $wbm? (int)$wbm["wbm_adjust_amount"] : 0;
		$deposit_amount = $wbm? (int)$wbm["wbm_deposit_amount"] : 0;
		$total_amount = $last_accrued_amount + $total - $adjust_amount - $deposited;

		$sheet -> setCellValue("G14", $sum_amount);		// 当月御買上額
		$sheet -> setCellValue("I14", $total-$sum_amount);	// 消費税額等
		$sheet -> setCellValue("K14", $total);			// 当月御買上合計額
		$sheet -> setCellValue("O14", $total_amount);	// 今回ご請求額

		if(false && $re_billing){	// 催促請求書のとき(不使用)
			$date_from = date('Y-m-01', strtotime($re_billing));
			$date_to = date('Y-m-t', strtotime($date_from));
			$sheet -> setCellValue("E12", date('Y年m月d日', strtotime($date_from)) ." ～ ". date('Y年m月d日', strtotime($date_to)));
			$sheet -> setCellValue("B14", $total_amount);		// 前月迄の残額
			$sheet -> setCellValue("D14", $deposited);	// 今回ご入金額
			$sheet -> setCellValue("E14", "");		// 調整額
			$sheet -> setCellValue("F14", $total_amount-$deposited);	// 差引繰越金額
			$sheet -> setCellValue("G14", "");	// 当月御買上額
			$sheet -> setCellValue("I14", "");	// 消費税額等
			$sheet -> setCellValue("K14", "");	// 当月御買上合計額
			$sheet -> setCellValue("O14", $total_amount-$deposited);	// 今回ご請求額
			mysqli_data_seek( $rs, 0 );
			$w_pos_num = 17;
			while($temp = mysqli_fetch_array($rs, MYSQLI_ASSOC)){
				$sheet -> setCellValue("C{$w_pos_num}", "");	//日付
				$sheet -> setCellValue("D{$w_pos_num}", "");	//車名
				$sheet -> setCellValue("G{$w_pos_num}", "");	//登録番号
				$sheet -> setCellValue("I{$w_pos_num}", "");	//作業種別
				$sheet -> setCellValue("L{$w_pos_num}", "");	//入金
				$sheet -> setCellValue("P{$w_pos_num}", "");	//金額(税込み)
				$w_pos_num++;
			}
		} else {
			$param = array();
			$param["wbm_wcmseq"] = $wcm_seq;
			$param["wbm_month"] = $month;
			$param["wbm_bill_sum_printed"] = date('Y-m-d H:i:s');
			$param["wbm_bill_amount"] = $total;
			$param["wbm_accrued_amount"] = $last_accrued_amount + $total - $adjust_amount - $deposit_amount;
			$invoiceClass -> upsert_bill_month($param);
			$last_accrued_amount = $param["wbm_accrued_amount"];
			// 当月以降の未収金更新
			$param2 = array();
			$sql= "select * ";
			$sql.= "from w_billing_month ";
			$sql.= "where wbm_delfg = 0 and wbm_wcmseq = " . sql_int($wcm_seq);
			$sql.= " and wbm_month > " . sql_esc($month) . " ";
			$sql.= "order by wbm_month ";
			$rs_mf = mysql_query($sql);
			while($temp = mysql_fetch_array($rs_mf, MYSQL_ASSOC)){
				$param2["wbm_wcmseq"] = $temp["wbm_wcmseq"];
				$param2["wbm_month"] = $temp["wbm_month"];
				$param2["wbm_accrued_amount"] = $last_accrued_amount + $temp["wbm_bill_amount"] - $temp["wbm_deposit_amount"] - $temp["wbm_adjust_amount"];
				$invoiceClass -> upsert_bill_month($param2);
				$last_accrued_amount = $param2["wbm_accrued_amount"];
			}
		}
		$this -> objPHPExcel -> setActiveSheetIndex(0);
		$sheet = $this -> objPHPExcel -> getActiveSheet();
		$sheet -> getPageSetup()->setPrintArea('A1:Q48');

		$title = $sheet -> getCell("I1")->getValue();
		$sheet -> setTitle($title);

		$sheet_copy = $sheet -> copy();
		$sheet_copy -> setCellValue("I1", $title."(控)");
		$sheet_copy -> setTitle($title."(控)");
		$this -> objPHPExcel -> addSheet($sheet_copy);
	}

	function upd_printed($wdc_seq = null){
	    global $form;

	    if(!$wdc_seq){
	    	$wdc_seq = $form["wdc_seq"];
	    }
	    $col_name = "wdc_".$form["md"]."_printed";

	    $param = array();
	    $param[$col_name] = "now()";

	    $where_sql = sprintf("wdc_seq = %d", $wdc_seq);

	    simple_update($param, "w_directions", $where_sql);

	}

	function zeroToNull($val){
	    return ($val == "0")? "" :$val;
	}
}