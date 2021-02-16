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
    else //Default overlay
    {
        $REQUEST_SCHEME = $_SERVER["REQUEST_SCHEME"];
        $HTTP_HOST = $_SERVER["HTTP_HOST"];
        header("Location: $REQUEST_SCHEME://$HTTP_HOST$WEB_ROOT/view/default/", true, 301);
    }
    echo $page;
?>