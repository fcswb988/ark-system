<?php

require("../system2/basicFunc.php");
require("../system2/flex/flexFunc.php");
require("../lib/commonClass.php");
require("../lib/customersClass.php");
require("../lib/repairClass.php");

$GLOBALS["basicFunc"] = new basicFunc();
$mysqlConnect = new mysqlConnect();
$mysqlConnect->open_mysql();
$form = allRequest();
$commonClass = new commonClass();
$commonClass->login_check();

if (isset($form['action']) && $form['action'] === 'getCustomerDetail') {
    $customerInstance = customersClass::getInstance();
    $customerDetail = $customerInstance->make_details($customerInstance->getCustomerById($form['customerId'] ?? null));
    return response_json([
        'status' => true,
        'detail' => $customerDetail,
    ]);
}

if (isset($form['action']) && $form['action'] === 'saveCustomerRepair'
    && !empty($form['customerId']) && !empty($form['repairId'])) {

        $sql = "update w_repair set wrp_wcmseq = " . sql_int($form['customerId'])
        . " where wrp_seq = " . sql_int($form['repairId']);
        mysql_query($sql);

        $sql = "update w_directions set wdc_wcmseq = " . sql_int($form['customerId'])
        . " where wdc_seq = " . sql_int($form['directionsId']);
        mysql_query($sql);

    return response_json(['status' => true]);
}
