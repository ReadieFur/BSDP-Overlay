<?php
    $WEB_ROOT;
    $SITE_ROOT;
    $DOCUMENT_ROOT = $_SERVER["DOCUMENT_ROOT"];
    require_once "$DOCUMENT_ROOT/roots.php";
    require_once "$SITE_ROOT/assets/php/main.php";

    $head;
    $body;
    $splitPath = array_filter(explode('/', $REQUEST_URI));
    $overlayID = $splitPath[count($splitPath)];

    if (strlen($overlayID) == 13)
    {
        
    }
    else
    {
        $head = execAndRead("default/head.php");
        $body = execAndRead("default/body.php");
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:type" content="website">
    <meta property="og:title" content="BSDP-Overlay"/>
    <meta property="og:url" content="https://readie.global-gaming.co/bsdp-overlay<?php echo $REQUEST_URI; ?>"/>
    <link rel="icon" href="https://cdn.global-gaming.co/images/team/members/readiecircle.png" type="image/png">
    <?php echo $head; ?>
</head>
<body><?php echo $body; ?></body>
</html>