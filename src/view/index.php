<?php
    $WEB_ROOT;
    $SITE_ROOT;
    $DOCUMENT_ROOT = $_SERVER["DOCUMENT_ROOT"];
    require_once "$DOCUMENT_ROOT/roots.php";
    require_once "$SITE_ROOT/assets/php/main.php";

    $page;
    $splitPath = array_filter(explode('/', $REQUEST_URI));
    $overlayID = $splitPath[count($splitPath)];

    if (strlen($overlayID) == 13) { $page = execAndRead("../edit/index.php"); }
    else { $page = execAndRead("./default/index.php"); } //Default overlay
    echo $page;
?>