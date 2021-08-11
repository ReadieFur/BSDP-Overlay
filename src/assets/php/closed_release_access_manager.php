<?php
//This file will be edited manually and I have not made it a database check because it is only a temporary thing.

$allowedUsers = array(
    '60d1de6254a82537157312', //readie - localhost
    '60fad16b06c78865178484', //readiealt - localhost
    '6098449426bca059481523', //readie
    '60d2968705af7717659797', //remy
    '60d6433d807c2825942598', //unskilledfreak
    '60db9eafd4559818088340', //pixelboom
    '60dd6af2547a0534874813', //charalol
    '60ff2e7f0e478823584208', //aetherialflow
    '610453d779844521709098', //laco
    '610456af0f4f7662694321', //dragonplays
    '61059e879a3ad718692282', //bandoot
    '6106b9d071262833517563', //norikittea
    '61082adccee2b277702044', //shiroisakuravt
    '61082be14c147452908091', //jiveoff
    '610abd414eb1c662397226', //rhyho
    '61138a4b35a05550198748', //cadavren
);

if (!in_array($_COOKIE['READIE_UID']??null, $allowedUsers))
{
    http_response_code(401); //This probably does nothing because of the 302 redirect below. I want to redirect but still tell the client that they are unauthorized.
    echo "401 Unauthorized";
    header(
        'Location: https://api-readie.global-gaming.co/account/?redirect=' . urlencode(
            (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']),
        true,
        302
    );

    // header("HTTP/1.1 401 Unauthorized");
    // header('Location: https://api-readie.global-gaming.co/account/?redirect=' . urlencode(
    //     (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'])
    // );

    exit;
}