<?php
//This file will be edited manually and I have not made it a database check because it is only a temporary thing.

$allowedUsers = array(
    '60d1de6254a82537157312', //readie - localhost
    '6098449426bca059481523', //readie
    '60d6433d807c2825942598', //unskilledfreak
);

if (!in_array($_COOKIE['READIE_UID']??null, $allowedUsers))
{
    http_response_code(401);
    echo "401 Unauthorized";
    exit;
}