
var extIfClass = {
	saving : false,

	init : function(){

		//
		if($('#koguniCopy').length){
			$('#koguniCopy').on('click', extIfClass.copyForKogni);
		}
	},

	//コグニフォトベース案件登録用情報をクリップボードにCOPY
	copyForKogni : function () {
	//{"AreaName":"神戸" ,"ClassNo":"555" ,"Purpose":"へ" ,"SeqNo":"1234" ,"customer":"木下" }
		var ClipID = "KOGUNI_PHOTO_BASIC_INFO";	// チェック用
		//基本情報
		var AcceptNo = $('input[name="acceptNo"]').val();	//受付番号（事案番号）
		var AreaName = $('input[name="areaName"]').val();	//登録番号（神戸）
		var ClassNo = $('input[name="classNo"]').val();		//登録番号（333）
		var Purpose = $('input[name="purpose"]').val();		//登録番号（わ）
		var SeqNo = $('input[name="seqNo"]').val();			//登録番号（1234）
		var Customer = $('input[name="customer"]').val();	//お客様名
//		var InsurancePrice = $('input[name="insurancePrice"]').val();	//車両保険金額
		var DisclaimerPrice = $('input[name="disclaimerPrice"]').val();	//免責金額
//		var AccidentDate = $('input[name="accidentDate"]').val();		//事故日
		var WarehousingDate = $('input[name="warehousingDate"]').val();	//入庫日
		//車両情報
//		var DamagePrice = $('input[name="damagePrice"]').val();	//概算損害額
		var FirstRegistYmEra = $('input[name="firstRegistYmEra"]').val();	//初度登録年月年号
		var FirstRegistYear = $('input[name="firstRegistYear"]').val();		//初度登録年月　年（和暦）
		var FirstRegistMonth = $('input[name="firstRegistMonth"]').val();	//初度登録年月　月
		var CarName = $('input[name="carName"]').val();			//車名
		var ChassisNumber = $('input[name="chassisNumber"]').val();		//車体番号
		var TypeName = $('input[name="typeName"]').val();		//型式
		var TypeSpecifiedNo = $('input[name="typeSpecifiedNo"]').val();	//型式指定番号
		var ClassDivNo = $('input[name="classDivNo"]').val();	//類別区分番号
//		var OwnerName = $('input[name="ownerName"]').val();		//車両所有者
//		var UserName = $('input[name="userName"]').val();		//車両使用者
//		var ColorCode = $('input[name="colorCode"]').val();		//カラーコード

		var jsonObj = {
			ClipID: ClipID,
			AcceptNo: AcceptNo,
			AreaName: AreaName,
			ClassNo: ClassNo,
			Purpose: Purpose,
			SeqNo: SeqNo,
			Customer: Customer,
//			InsurancePrice: InsurancePrice,
			DisclaimerPrice: DisclaimerPrice,
//			AccidentDate: AccidentDate,
			WarehousingDate: WarehousingDate,
//			DamagePrice: DamagePrice,
			FirstRegistYmEra: FirstRegistYmEra,
			FirstRegistYear: FirstRegistYear,
			FirstRegistMonth: FirstRegistMonth,
			CarName: CarName,
			ChassisNumber: ChassisNumber,
			TypeName: TypeName,
			TypeSpecifiedNo: TypeSpecifiedNo,
			ClassDivNo: ClassDivNo,
//			OwnerName: OwnerName,
//			UserName: UserName,
//			ColorCode: ColorCode,
		};

		var jsonStr = JSON.stringify(jsonObj);

		if(navigator.clipboard){
			navigator.clipboard.writeText(jsonStr).then(() => {
				alert('クリップボードにコピーしました！')
			});
		} else {
			alert("クリップボード使用不可!!");
		}
	},
}

$(document).ready(extIfClass.init);

