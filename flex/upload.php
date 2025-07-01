<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");

$GLOBALS["basicFunc"] = new basicFunc();

$mysqlConnect = new mysqlConnect();
$mysqlConnect -> open_mysql();

$replace = array();

$form = allRequest();

$this_pg = "upload.php";

$file_type_list = array(
	array("mime" => "jpg|jpeg", "ext" => "jpg", "image" => true, "type" => "JPG画像"),
	array("mime" => "gif", "ext" => "gif", "image" => true, "type" => "GIF画像"),
	array("mime" => "png", "ext" => "png", "image" => true, "type" => "PNG画像"),
	array("mime" => "application/pdf", "ext" => "pdf", "image" => false, "type" => "PDFドキュメント"),
	array("mime" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ext" => "xlsx", "image" => false, "type" => "XLSXドキュメント"),
	array("mime" => "application/vnd.openxmlformats-officedocument.presentationml.presentation", "ext" => "pptx", "image" => false, "type" => "PPTXドキュメント"),
	array("mime" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "ext" => "docx", "image" => false, "type" => "DOCXドキュメント"),
	array("mime" => "application/vnd.ms-excel", "ext" => "xls", "image" => false, "type" => "EXCELドキュメント"),
	array("mime" => "application/vnd.ms-powerpoint", "ext" => "ppt", "image" => false, "type" => "POWERPOINTドキュメント"),
	array("mime" => "application/msword", "ext" => "doc", "image" => false, "type" => "WORDドキュメント"),
);

$tfl_seq = intval($form["tfl_seq"]);
$tfl_name = $form["tfl_name"];

if ($form["md"] == "upload" && isset($_FILES)){
	if ($_FILES["upfile"]["tmp_name"]){
		$file_type = $_FILES["upfile"]["type"];
		$file_size = number_format($_FILES["upfile"]["size"]);
		$file_dir = date("Ymd");
		$time_str = sprintf("%02d", (time() % 1000));
		$rand_str = rand(10, 99);
		
		$sql = "";
		$sql.= "select ";
		$sql.= "	max(tfi_seq) ";
		$sql.= "from ";
		$sql.= "	t_file ";
		$rs = mysql_query($sql);
		
		list($max_num) = mysql_fetch_array($rs, MYSQL_NUM);
		$max_num++;
		
		$new_name = sprintf("%06d%02d", $max_num, $time_str);
		
		$file_check = false;
		
		$extention = false;
		foreach($file_type_list as $temp){
			$mime_match = $temp["mime"];
			$mime_match = preg_replace("/\//", "\/", $mime_match);
			$mime_match = preg_replace("/\-/", "\-", $mime_match);
			$mime_match = preg_replace("/\./", "\.", $mime_match);
			if (preg_match("/".$mime_match."/", $file_type)){
				$new_name .= ".".$temp["ext"];
				$file_data = $temp;
				$file_check = true;
				break;
			}
		}
		
		if ($file_check){
			$sql = "";
			$sql.= "select ";
			$sql.= "	* ";
			$sql.= "from ";
			$sql.= "	t_flex ";
			$sql.= "where ";
			$sql.= "	tfl_seq = ".$tfl_seq." ";
			$rs = mysql_query($sql);
			
			$data = mysql_fetch_array($rs, MYSQL_ASSOC);
			
			if ((!file_exists(image_dir.$file_dir))&&(!is_dir(image_dir.$file_dir))){
				mkdir(image_dir.$file_dir);
				chmod(image_dir.$file_dir, 0777);
			}
			
			if ((!file_exists(image_dir_th.$file_dir))&&(!is_dir(image_dir_th.$file_dir))){
				mkdir(image_dir_th.$file_dir);
				chmod(image_dir_th.$file_dir, 0777);
			}
			
			move_uploaded_file($_FILES["upfile"]["tmp_name"], image_dir.$file_dir."/".$new_name);
			
			if (($data["tfl_size"])||($data["tfl_rows"])){
				makeThumbnail($file_dir, $new_name, $data["tfl_size"], $data["tfl_rows"]);
				$check_file = view_img_th.$file_dir."/".$new_name;
			} else $check_file = view_img.$file_dir."/".$new_name;
			
			$param = array();
			$param["tfi_path"] = sql_esc($file_dir."/".$new_name);
			$param["tfi_type"] = sql_esc($file_data["ext"]);
			$param["tfi_mime"] = sql_esc($_FILES["upfile"]["type"]);
			$param["tfi_size"] = sql_esc($_FILES["upfile"]["size"]);
			$param["tfi_title"] = sql_esc($_FILES["upfile"]["name"]);
			$param["tfi_date"] = "now()";
			simple_insert($param, "t_file");
			
			$tfi_path = $file_dir."/".$new_name;
		}
	}
}

function makeThumbnail($file_dir, $file_name, $img_width, $img_height){
	$base_file = image_dir.$file_dir."/".$file_name;
	
	if (preg_match("/jpg/", $file_name)) $img_type = "jpg";
	else if (preg_match("/png/", $file_name)) $img_type = "png";
	else if (preg_match("/gif/", $file_name)) $img_type = "gif";
	else $img_type = false;

	if ($img_type && ($img_width || $img_height)){
		if ($img_type == "jpg") $temp_img = imagecreatefromjpeg($base_file);
		else if ($img_type == "gif") $temp_img = imagecreatefromgif($base_file);
		else if ($img_type == "png") $temp_img = imagecreatefrompng($base_file);

		$r_width = imagesx($temp_img);
		$r_height = imagesy($temp_img);
		
		if (!$img_height){
			$img_height = floor(($img_width / $r_width) * $r_height);
		} else if (!$img_width){
			$img_width = floor(($img_height / $r_height) * $r_width);
		} else {
			$single = true;
		}

		$xx = $img_width / $r_width;	//	400 / 1024 = 0.39
		$yy = $img_height / $r_height;	//	600	/ 768 = 0.78
		
		$new_img = imagecreatetruecolor($img_width, $img_height);
		
		if (empty($single)){
			if ($xx > $yy) {
				$src_x = 0;
				$src_w = $r_width;
				$src_h = floor($img_height / $xx);
				$src_y = floor(($r_height - $src_h) / 2);
			} else {
				$src_y = 0;
				$src_h = $r_height;
				$src_w = floor($img_width / $yy);
				$src_x = floor(($r_width - $src_w) / 2);
			}
			imagecopyresampled($new_img, $temp_img, 0, 0, $src_x, $src_y, $img_width, $img_height ,$src_w  ,$src_h);
		} else {
			/*
			$white = imagecolorallocate($new_img, 255, 255, 255);
			imagefill($new_img, 0, 0, $white);
			
			if ($xx < $yy) {
				$src_x = 0;
				$src_w = $img_width;
				$src_h = floor($r_height * $xx);
				$src_y = floor(($img_height - $src_h) / 2);
			} else {
				$src_y = 0;
				$src_h = $img_height;
				$src_w = floor($r_width * $yy);
				$src_x = floor(($img_width - $src_w) / 2);
			}
			
			imagecopyresampled($new_img, $temp_img, $src_x, $src_y, 0, 0, $src_w, $src_h ,$r_width  ,$r_height);
			*/
			
			if ($xx > $yy) {
				$src_x = 0;
				$src_w = $r_width;
				$src_h = floor($img_height / $xx);
				$src_y = floor(($r_height - $src_h) / 2);
			} else {
				$src_y = 0;
				$src_h = $r_height;
				$src_w = floor($img_width / $yy);
				$src_x = floor(($r_width - $src_w) / 2);
			}
			imagecopyresampled($new_img, $temp_img, 0, 0, $src_x, $src_y, $img_width, $img_height ,$src_w  ,$src_h);
		}
	
		if ($img_type == "jpg") imagejpeg($new_img, image_dir_th.$file_dir."/".$file_name, 100);
		else if ($img_type == "gif") imagegif($new_img, image_dir_th.$file_dir."/".$file_name);
		else if ($img_type == "png") imagepng($new_img, image_dir_th.$file_dir."/".$file_name);
	
		imagedestroy($new_img);
		imagedestroy($temp_img);
	}
}

?><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja-JP" lang="ja-JP">
<head>
<meta charset="UTF-8" />
<script type="text/javascript" src="../js/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="../js/fileFunc.js"></script>
<?php if ($check_file || $tfi_path){ ?>
<script type="text/javascript">
fileFunc.data.tfi_path = '<?php echo $tfi_path; ?>';
fileFunc.data.check_file = '<?php echo $check_file; ?>';
fileFunc.data.tfl_name = '<?php echo $tfl_name; ?>';
fileFunc.passStart = 'on';
</script>
<?php } ?>
<style type="text/css">
body, html, table, td { margin: 0; padding: 0;}
td { height: 25px;}
input[type=submit] { -webkit-appearance: none;}
</style>
</head>
<body>
<form action="<?php echo $this_pg; ?>" method="post" enctype="multipart/form-data" name="sendForm">
<table>
<tr><td>
	<input type="hidden" name="MAX_FILE_SIZE" value="30000000">
	<input type="file" name="upfile" value="">
	<input type="hidden" name="md" value="upload">
	<input type="hidden" name="tfl_seq" value="<?php echo $tfl_seq; ?>">
	<input type="hidden" name="tfl_name" value="<?php echo $tfl_name; ?>">
	<input type="submit" value="アップロード"></td></tr>
</table>
</form>
</body>
</html>