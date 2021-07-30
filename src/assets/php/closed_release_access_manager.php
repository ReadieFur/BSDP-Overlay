<?php
//This file will be edited manually and I have not made it a database check because it is only a temporary thing.

$allowedUsers = array(
    '60d1de6254a82537157312', //readie - localhost
    '60fad16b06c78865178484', //readiealt - localhost
);

if (!in_array($_COOKIE['READIE_UID']??null, $allowedUsers))
{
    http_response_code(401);
    echo "401 Unauthorized";
    exit;
}