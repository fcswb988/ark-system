<?php

set_time_limit(0);
ini_set('display_errors', 1);

error_reporting(E_ALL);

$ppp = "move/";
$GLOBALS["remove_fg"] = 1;
//1は転送後削除

$targ_path = "/public_html/".$ppp;
$base_path = "./".$ppp;



$cn = ftp_connect("ftp.lolipop.jp");

if ($res = ftp_login($cn, "sub.jp-ark-system", "7mmczDGdkKdC")){
	ftp_pasv($cn, true);
	
	if (@ftp_mkdir($cn, $targ_path)){
		$perms = fileperms($base_path);
		ftp_chmod($cn, $perms, $targ_path);
	}
	
	check_dir();
	
	/*
	ftp_put($cn, $targ_path.'hoge.txt', 'index02.html', FTP_BINARY);
	ftp_mkdir($cn, $targ_path."1");
	ftp_chmod($cn, 0644, $targ_path."1");
	*/
	
	ftp_close($cn);
}

function check_dir($seek_path = ""){
	global $targ_path, $base_path, $cn;
	
	if (is_dir($base_path.$seek_path) && $fp = opendir($base_path.$seek_path)){
		while(($file_nm = readdir($fp)) !== false){
			if (in_array($file_nm, array(".", "..")) !== false ){
				continue;
			}
			
			if (filetype($path = $base_path.$seek_path.$file_nm) == "file"){
				$perms = fileperms($base_path.$seek_path.$file_nm);
				ftp_put($cn, $targ_path.$seek_path.$file_nm, $base_path.$seek_path.$file_nm, FTP_BINARY);
				ftp_chmod($cn, $perms, $targ_path.$seek_path.$file_nm);
				if ($GLOBALS["remove_fg"]){
					unlink($base_path.$seek_path.$file_nm);
				}
				
				echo $targ_path.$seek_path.$file_nm." - ".$base_path.$seek_path.$file_nm."<br>";
			} else if (filetype($path = $base_path.$seek_path.$file_nm) == "dir"){
				$perms = fileperms($base_path.$seek_path.$file_nm);
				if (@ftp_mkdir($cn, $targ_path.$seek_path.$file_nm)){
					ftp_chmod($cn, $perms, $targ_path.$seek_path.$file_nm);
				}
				
				echo $seek_path.$file_nm."/<br>";
				check_dir($seek_path.$file_nm."/");
			}
			@ob_flush();
			@flush();
		}
	}
}

echo "fin";
exit;

