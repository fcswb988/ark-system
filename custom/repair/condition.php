<?php

require("../../system2/basicFunc.php");
require("../../system2/flex/flexFunc.php");
require("../../lib/commonClass.php");
require("../../lib/customersClass.php");
require("../../lib/repairClass.php");
require("../../vendor/autoload.php");

$GLOBALS["basicFunc"] = new basicFunc();
$mysqlConnect = new mysqlConnect();
$mysqlConnect->open_mysql();
$form = allRequest();
$commonClass = new commonClass();
$commonClass->login_check();

if (isset($form['action']) && $form['action'] === 'dragImageRepairCondition'
    && !empty($form['sourceId']) && !empty($form['desId'])) {
    $sourceParams = $desParams = [];
    for ($i = 1; $i <= 40; $i++) {
        $col = "wcd_photo" . ($i === 1 ? '' : $i);
        $sourceParams[$col] = sql_esc($form['sourceImages'][$i - 1] ?? '');
        $desParams[$col] = sql_esc($form['desImages'][$i - 1] ?? '');
    }
    simple_update($sourceParams, 'w_condition', 'wcd_seq = ' . sql_int($form['sourceId']));
    simple_update($desParams, 'w_condition', 'wcd_seq = ' . sql_int($form['desId']));

    return response_json(['status' => true]);
}
