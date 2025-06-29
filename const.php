<?php
class constClass {

	const TAX_RATE = 10;	// 消費税率（%）

	const MARGIN_RATE = 0.6;	// 請負マージン率

	//顧客区分
	const CUSTOMER_TYPE_INDIVIDUAL = "1";	   // 個人
	const CUSTOMER_TYPE_CORPORATE = "2";	   // 法人
	const CUSTOMER_TYPE = array(
			"1" => "個人",
			"2" => "法人",
	);

	const WDC_TYPE_REPAIR = "1";		// 板金・塗装
	const WDC_TYPE_INSPECTION = "2";	// 車検・整備
	const WDC_TYPE_PARTS = "3";		// パーツ
	const WDC_TYPE_CLEANING = "4";		// 光触媒・室内清掃
	const WDC_TYPE_NOWORK = "5";		// 作業なし
	const WDC_TYPE_ESTIMATE = "6";		// 見積のみ
	const WDC_TYPE_OTHER = 9;			// その他
	const WDC_TYPES = array(
			self::WDC_TYPE_REPAIR => "板金・塗装",
			self::WDC_TYPE_INSPECTION => "車検・整備",
			self::WDC_TYPE_PARTS => "パーツ",
			self::WDC_TYPE_CLEANING => "光触媒・室内清掃",
			self::WDC_TYPE_NOWORK => "作業なし",
			self::WDC_TYPE_ESTIMATE => "見積のみ",
			self::WDC_TYPE_OTHER => "その他",
	);

	//支払い区分
	const PAY_TYPE_CASH = "1";	   // 現金
	const PAY_TYPE_INSURANCE = "2";	   // 保険
	const PAY_TYPE_CLAIM = 8;		// クレーム
	const PAY_TYPE = array(
			"1" => "現金",
			"2" => "保険",
			"3" => "無料",
			"8" => "クレーム",
	);

	const OTH_BILL_TYPE_SUBSTCAR = "1";	   // 代車代
	const OTH_BILL_TYPE_WRECKER = "2";	   // ﾚｯｶｰ代
	const OTH_BILL_TYPE_DEDUCTIBLE = "8"; // 免責
	const OTH_BILL_TYPE_OTHER = "9"; // その他
	const OTHER_BILL_TYPE = array(	//その他請求書タイプ
	    self::OTH_BILL_TYPE_SUBSTCAR => array("name"=>"代車代", "bill_to"=>"claims_payer", "bill_by"=>"subcarOwner",),
	    self::OTH_BILL_TYPE_WRECKER => array("name"=>"レッカー代", "bill_to"=>"claims_payer", "bill_by"=>"default",),
	    self::OTH_BILL_TYPE_DEDUCTIBLE => array("name"=>"免責", "bill_to"=>"customer", "bill_by"=>"default",),
		self::OTH_BILL_TYPE_OTHER => array("name"=>"その他", "bill_to"=>"customer", "bill_by"=>"default",),
	);

	const UNIT_TYPE = array(
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
	    "14" => "Km",
	    "15" => "日",
	);

	const CAL_COLOR = array(	// カレンダー表示色
			"regist" => "1",
			"storing" => "3",
			"repair" => "2",
			"formation" => "4",
			"color" => "5",
			"event" => "6",
			"assembling" => "7",
	);

	const PURCHASER_TYPE_SELF = "1";	// 自社
	const PURCHASER_TYPE_OTHER = "2";	// 他社

	const WMM_JOB_TYPE_SALES = "7";	   	// 営業担当
	const WMM_JOB_TYPE_OFFICE = "8";	// 事務担当

	const WCD_CAL_TYPE_STAFF = "staff";	   	// スタッフ
	const WCD_CAL_TYPE_MEMO = "memo";	   	// メモ

	// 工程
	const PROCS = array(
			"formation"=>["title"=>"鈑金", "jobNo"=>1],
			"color"=>["title"=>"調色", "jobNo"=>2],
			"event"=>["title"=>"塗装", "jobNo"=>3],
			"assembling"=>["title"=>"組付", "jobNo"=>4]
	);

}