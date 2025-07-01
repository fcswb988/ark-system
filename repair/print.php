<?php

require("../system2/basicFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");
require("../lib/repairClass.php");
require("../lib/wbsClass.php");
require("../lib/invoiceClass.php");
//require("../lib/PHPExcel.php");
//require("../lib/PHPExcel/IOFactory.php");

require_once('../vendor/autoload.php');

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$form = allRequest();
$replace = array();

$commonClass = new commonClass();
//$commonClass -> login_check();
//$replace = $commonClass -> load_basic($replace);

$repairClass = new repairClass();
$wbsClass = new wbsClass();
$invoiceClass = new invoiceClass();

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
header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
header("Content-Disposition: attachment;filename=".$form["md"].".xlsx");
header("Cache-Control: max-age=0");

$objWriter = PHPExcel_IOFactory::createWriter($printClass -> objPHPExcel, "Excel2007");
$objWriter -> save("php://output");

exit;

class printClass {
    var $objPHPExcel = false;
    var $unit_rep = array(
        "0" => "",
        "1" => "個",
        "2" => "枚",
        "3" => "本",
        "4" => "式",
        "5" => "回",
        "6" => "台",
        "7" => "ｾｯﾄ",
        "8" => "Ｌ",
        "9" => "％",
        "10" => "％",
        "11" => "％",
        "12" => "％",
        "13" => "％",
    );

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

        if ($replace["wrp_body_shape"] == 1){//4ドア
            $this -> objPHPExcel -> removeSheetByIndex(4);
            $this -> objPHPExcel -> removeSheetByIndex(3);
            $this -> objPHPExcel -> removeSheetByIndex(1);
            $this -> objPHPExcel -> removeSheetByIndex(0);
            $sheet = $this -> objPHPExcel -> getSheetByName("4DOOR");
        } else if ($replace["wrp_body_shape"] == 2){//2ドア
            $this -> objPHPExcel -> removeSheetByIndex(4);
            $this -> objPHPExcel -> removeSheetByIndex(3);
            $this -> objPHPExcel -> removeSheetByIndex(2);
            $this -> objPHPExcel -> removeSheetByIndex(0);
            $sheet = $this -> objPHPExcel -> getSheetByName("2DOOR");
        } else if ($replace["wrp_body_shape"] == 3){//1BOX
            $this -> objPHPExcel -> removeSheetByIndex(4);
            $this -> objPHPExcel -> removeSheetByIndex(2);
            $this -> objPHPExcel -> removeSheetByIndex(1);
            $this -> objPHPExcel -> removeSheetByIndex(0);
            $sheet = $this -> objPHPExcel -> getSheetByName("1BOX");
        } else if ($replace["wrp_body_shape"] == 4){//SUV
            $this -> objPHPExcel -> removeSheetByIndex(3);
            $this -> objPHPExcel -> removeSheetByIndex(2);
            $this -> objPHPExcel -> removeSheetByIndex(1);
            $this -> objPHPExcel -> removeSheetByIndex(0);
            $sheet = $this -> objPHPExcel -> getSheetByName("SUV");
        } else {
            $this -> objPHPExcel -> removeSheetByIndex(4);
            $this -> objPHPExcel -> removeSheetByIndex(3);
            $this -> objPHPExcel -> removeSheetByIndex(2);
            $this -> objPHPExcel -> removeSheetByIndex(1);
            $sheet = $this -> objPHPExcel -> getSheetByName("FORMAT");
        }

        $sheet -> setCellValue("C14", $replace["wrp_regist_area"].$replace["wrp_regist_class"].$replace["wrp_regist_hira"].$replace["wrp_regist_number"]);
        $sheet -> setCellValue("C10", $replace["wcm_company"]." ".$replace["wcm_name"]." 様");
        $sheet -> setCellValue("C12", $replace["wrp_chassis_number"]);
        $sheet -> setCellValue("C16", $replace["wrp_color_jp"]);
        $sheet -> setCellValue("F16", $replace["wrp_first_date"]=="0000-00-00"? "" : PHPExcel_Shared_Date::PHPToExcel(new DateTime($replace["wrp_first_date"])));
        $sheet -> setCellValue("F17", $replace["wrp_first_date"]=="0000-00-00"? "" : PHPExcel_Shared_Date::PHPToExcel(new DateTime($replace["wrp_first_date"])));
        $sheet -> setCellValue("C7", $replace["wmk_name"]." ".$replace["wrp_body_type"]);

        if ($replace["wdc_form_cure"]){
            $sheet -> setCellValue("D26", $replace["wdc_form_cure"]);
        }
        if ($replace["wdc_color_ad"]){
            $sheet -> setCellValue("D30", $replace["wdc_color_ad"]);
        }
        if ($replace["wdc_painting"]){
            $sheet -> setCellValue("E30", $replace["wdc_painting"]);
        }
        if ($replace["wdc_assembling"]){
            $sheet -> setCellValue("E26", $replace["wdc_assembling"]);
        }

        $sum_outsc_days = 0;
        for($i=1; $i<=10; $i++){
            $sum_outsc_days += intval($replace["wdc_outsc_days".$i]);
        }

        if ($sum_outsc_days){
            $sheet -> setCellValue("D34", $sum_outsc_days);
        }

        $sum_parts_days = 0;
        for($i=1; $i<=10; $i++){
            $sum_parts_days += intval($replace["wdc_parts_days".$i]);
        }
        if ($sum_parts_days){
            $sheet -> setCellValue("B26", $sum_parts_days);
        }

        $sheet -> setCellValue("G42", $this -> result_yes_no($replace["wdc_chk_etc"]));
        $sheet -> setCellValue("G44", $this -> result_ok_ng($replace["wdc_chk_window"]));
        $sheet -> setCellValue("G46", $this -> result_ok_ng($replace["wdc_chk_audio"]));
        $sheet -> setCellValue("G48", $this -> result_ok_ng($replace["wdc_chk_light"]));
        $sheet -> setCellValue("G50", $this -> result_yes_no($replace["wdc_chk_loading"]));


        //作業リスト読み込み
        $item_list = array();

        if ($replace["wdc_chk_etc"]){
            $item_list[] = "ETCカード OK";
        }
        if ($replace["wdc_chk_window"]){
            $item_list[] = "パワーウインドウ動作状態 OK";
        }
        if ($replace["wdc_chk_audio"]){
            $item_list[] = "ナビ・オーディオ動作状態 OK";
        }
        if ($replace["wdc_chk_light"]){
            $item_list[] = "ライト点灯状況 OK";
        }
        if ($replace["wdc_chk_loading"]){
            $item_list[] = "高額積載物 OK";
        }

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
            if ($temp["wwl_title"]){
                $item_list[] = $temp["wwl_title"];
            }
        }

        /*
         for($i=1; $i<=70; $i++){
         if ($replace["repair_view"][$i] && $replace["wdc_work_title".$i]){
         $item_list[] = $replace["wdc_work_title".$i];
         }
         }
         */

        if ($item_list[0]) $sheet -> setCellValue("B42", $item_list[0]);
        if ($item_list[1]) $sheet -> setCellValue("B44", $item_list[1]);
        if ($item_list[2]) $sheet -> setCellValue("B46", $item_list[2]);
        if ($item_list[3]) $sheet -> setCellValue("B48", $item_list[3]);
        if ($item_list[4]) $sheet -> setCellValue("B50", $item_list[4]);
        if ($item_list[5]) $sheet -> setCellValue("B52", $item_list[5]);
        if ($item_list[6]) $sheet -> setCellValue("B54", $item_list[6]);

        if ($item_list[7]) $sheet -> setCellValue("B56", $item_list[7]);
        if ($item_list[8]) $sheet -> setCellValue("B58", $item_list[8]);
        if ($item_list[9]) $sheet -> setCellValue("B60", $item_list[9]);
        if ($item_list[10]) $sheet -> setCellValue("B62", $item_list[10]);
        if ($item_list[11]) $sheet -> setCellValue("B64", $item_list[11]);

        if ($item_list[12]) $sheet -> setCellValue("I45", $item_list[12]);
        if ($item_list[13]) $sheet -> setCellValue("I47", $item_list[13]);
        if ($item_list[14]) $sheet -> setCellValue("I49", $item_list[14]);
        if ($item_list[15]) $sheet -> setCellValue("I51", $item_list[15]);
        if ($item_list[16]) $sheet -> setCellValue("I53", $item_list[16]);
        if ($item_list[17]) $sheet -> setCellValue("I55", $item_list[17]);
        if ($item_list[18]) $sheet -> setCellValue("I57", $item_list[18]);
        if ($item_list[19]) $sheet -> setCellValue("I59", $item_list[19]);
        if ($item_list[20]) $sheet -> setCellValue("I61", $item_list[20]);
        if ($item_list[21]) $sheet -> setCellValue("I63", $item_list[21]);
        if ($item_list[22]) $sheet -> setCellValue("I65", $item_list[22]);

        list($yy, $mm, $dd) = preg_split("/\-/", $replace["wdc_storing_date"]);

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

    const SINGLE_MAX = 25;
    const DOUBLE_1ST_MAX = 32;

    function set_bill($isDeductible = false){
        global $replace, $repairClass, $form;

        $this -> objPHPExcel = PHPExcel_IOFactory::load("../excel_tpl/format_invoice.xlsx");

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
                        "wdc_work_unit" => $this -> unit_rep[$temp["wbl_unit"]],
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
                        "wdc_work_unit" => $this -> unit_rep[$temp["wwl_unit"]],
                        "wdc_work_u_price" => $temp["wwl_u_price"],
                        "wdc_work_p_price" => $temp["wwl_p_price"],
                        "wdc_work_t_price" => $temp["wwl_w_price"],
                        "line_sum" => ($temp["wwl_p_price"] + $temp["wwl_w_price"]),
                    );
                }
            }

            /* No.74 部品発注部分は出力しない。
             //パーツリスト読み込み
             $w_parts_list = array();
             $last_cnt = count($order_list);
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
             $temp["cnt"] = $last_cnt;
             $w_parts_list[] = $temp;
             $last_cnt++;
             }
             */
        } else {
            $order_list[] = array(
                "cnt" => 1,
                "wdc_work_title" => "免責金額",
                "wdc_work_num" => null,
                "wdc_work_unit" => $this -> unit_rep["0"],
                "wdc_work_u_price" => null,
                "wdc_work_p_price" => null,
                "wdc_work_t_price" => $w_directions["wdc_deductible"],
                "line_sum" => $w_directions["wdc_deductible"],
            );
        }
        $last_cnt = count($order_list);
        $today = date('Y/m/d');

        if ($last_cnt <= self::SINGLE_MAX){
            $this -> objPHPExcel -> removeSheetByIndex(2);
            $this -> objPHPExcel -> removeSheetByIndex(1);
            $sheet = $this -> objPHPExcel -> getSheetByName("bill_single");
        } else {
            $this -> objPHPExcel -> removeSheetByIndex(2);
            $this -> objPHPExcel -> removeSheetByIndex(0);
            $sheet = $this -> objPHPExcel -> getSheetByName("bill_double1");
        }

        $count = 0;
        $page_total = 0;
        if (count($order_list)){
            foreach($order_list as $part){
                $count++;
                $w_pos_num = ($count <= self::DOUBLE_1ST_MAX)? $count+21 : $count+31;

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
                if($count == self::DOUBLE_1ST_MAX) {
                    $sheet -> setCellValue("N55", $page_total);
                    $page_total = 0;
                }
            }
        }

        /*
         if (count($w_parts_list)){
         foreach($w_parts_list as $part){
         $count++;
         $w_pos_num = ($count <= self::DOUBLE_1ST_MAX)? $count+21 : $count+31;

         $sheet -> setCellValue("C{$w_pos_num}", $part["wpl_name"]);

         if ($part["wpl_amount"]){
         $sheet -> setCellValue("I{$w_pos_num}", $part["wpl_amount"]);
         }
         if ($part["wpl_base_price"]){
         $sheet -> setCellValue("M{$w_pos_num}", $part["wpl_base_price"]);
         }
         $page_total += $part["wpl_base_price"];
         if($count == self::DOUBLE_1ST_MAX) {
         $sheet -> setCellValue("O55", $page_total);
         $page_total = 0;
         }
         }
         }
         */
        if ($last_cnt <= self::SINGLE_MAX){
            $sheet -> setCellValue("O48", $page_total);
        } else {
            $sheet -> setCellValue("O103", $page_total);
        }
        switch ($form["md"]){
            case "estimate":
                $title = "見積書";  $title_amount = "お見積金額";  break;
            case "delivery":
                $title = "納品書";  $title_amount = "金額";  break;
            default:
                $title = "請求書";  $title_amount = "ご請求金額";
        }

        $sheet -> setCellValue("I1", $title);
        $sheet -> setCellValue("I19", $title_amount);
        $sheet -> setCellValue("O2", $today);
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
                    $name = $replace["wcm_company"]."　　御中"."\n　";
                }
                if($replace["wcm_post"]){
                    $name .= $replace["wcm_post"]."　";
                }
                if(trim($replace["wcm_name"])){
                    $name .= $replace["wcm_name"]."　　様";
                }
                $sheet -> setCellValue("C8", $name);

                //  諸費用セット
                $w_pos_num = (count($order_list) <= self::SINGLE_MAX)? 48 : 103;
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
                    $w_pos_num = (count($order_list) <= self::SINGLE_MAX)? 56 : 111;
                    $sheet -> setCellValue("O{$w_pos_num}", $nonTax);
                }

                if($w_directions["wdc_inc_taxfg"] == 1 || $isDeductible){
                    //内税
                    $sheet -> setCellValue("L53", "");
                    $sheet -> setCellValue("O53", "");
                    $sheet -> setCellValue("G57", "");
                    $sheet -> setCellValue("I57", "");
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


        $this -> objPHPExcel = PHPExcel_IOFactory::load("../excel_tpl/format_invoice.xlsx");

        $today = date('Y/m/d');
        $date_from = $form["date_from"];
        $date_to = $form["date_to"];

        $this -> objPHPExcel -> removeSheetByIndex(1);
        $this -> objPHPExcel -> removeSheetByIndex(0);
        $sheet = $this -> objPHPExcel -> getSheetByName("bill_sum");

        //修理情報読み込み
        $sql = "";
        $sql.= "select ";
        $sql.= "	w_directions.* ,w_customers.*, w_repair.*, w_maker.wmk_name ";
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
        $sql.= "	wdc_wcmseq = ".sql_int($form["wcm_seq"])." ";
        $sql.= " and wdc_delfg = 0 ";
        $sql.= " and if(wdc_billing_date='0000-00-00', wdc_delivered_date, wdc_billing_date) between ".sql_esc($date_from)." and ".sql_esc($date_to). " ";
        $sql.= " and wdc_bill_printed is not null ";
        $sql.= " and wdc_deposited is null ";
        $sql.= "group by wdc_seq ";
        $sql.= "order by ";
        $sql.= "	wdc_delivered_date ";

        $rs = mysql_query($sql);

        $w_pos_num = 17;
        $page_total = 0;
        while($temp = mysql_fetch_array($rs, MYSQL_ASSOC)){
            $taxRate = $temp["wdc_inc_taxfg"] == 1? 0: $commonClass::TAX_RATE;
            $sheet -> setCellValue("C{$w_pos_num}", date('m/d', strtotime($temp["wdc_delivered_date"])));	//日付
            $sheet -> setCellValue("D{$w_pos_num}", $temp["wmk_name"]." ".$temp["wrp_body_type"]);	//車名
            $sheet -> setCellValue("G{$w_pos_num}", $temp["wrp_regist_area"]." ".$temp["wrp_regist_class"]."\n".$temp["wrp_regist_hira"]." ".$temp["wrp_regist_number"]);	//登録番号
            $sheet -> setCellValue("I{$w_pos_num}", $repairClass -> wdc_type_jp[$temp["wdc_type"]]);	//作業種別
            $expense_amount_tax = $temp["wdc_weight_tax"] + $temp["wdc_liability_insurance"] + $temp["wdc_stamp_tax"] + floor($temp["wdc_inspection_fee"] * (1 + $taxRate/100));
            $sheet -> setCellValue("P{$w_pos_num}", $temp["amount"] = floor($temp["wbl_p_price"]+$temp["wbl_w_price"]) * (1 + $taxRate/100) + $expense_amount_tax + $temp["wbl_non_tax"]);	//金額(税込み)
            $this -> upd_printed($temp["wdc_seq"]);
            $page_total += $temp["amount"];
            $w_pos_num++;
        }
        //ini_set('date.timezone', 'Asia/Tokyo');
        //		$param = array();
        //		$param["wbm_wcmseq"] = $form["wcm_seq"];
        //		$param["wbm_month"] = date("Y-m-01", strtotime($date_from));
        //		$param["wbm_bill_sum_printed"] = date('Y-m-d H:i:s');
        //		$param["wbm_bill_amount"] = $page_total;
        //		$invoiceClass -> upsert_bill_month($param);

        $sheet -> setCellValue("P2", $today);

        if ($replace["wcm_zipcode"]) {
            $sheet -> setCellValue("C3", "〒".$replace["wcm_zipcode"]);
        }
        $sheet -> setCellValue("C4", $replace["wcm_pref"].$replace["wcm_address"]."\n".$replace["wcm_building"]);
        $sheet -> setCellValue("F13", date('Y年m月d日', strtotime($date_from)) ." ～ ". date('Y年m月d日', strtotime($date_to)));
        $name = "";
        if($replace["wcm_company"]){
            $name = $replace["wcm_company"]."　　御中"."\n　";
        }
        if($replace["wcm_post"]){
            $name .= $replace["wcm_post"]."　";
        }
        if($replace["wcm_name"]){
            $name .= $replace["wcm_name"]."　　様";
        }
        $sheet -> setCellValue("C8", $name);
        $sheet -> setCellValue("O43", $page_total);

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