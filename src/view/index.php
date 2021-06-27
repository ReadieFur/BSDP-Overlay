<?php
    $title = 'View | BSDP Overlay';

    $WEB_ROOT;
    $SITE_ROOT;
    $DOCUMENT_ROOT = $_SERVER["DOCUMENT_ROOT"];
    require_once "$DOCUMENT_ROOT/roots.php";
    require_once "$SITE_ROOT/assets/php/main.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php echo execAndRead("{$SITE_ROOT}/assets/php/head.php"); ?>
    <link rel="stylesheet" href="<?php echo $WEB_ROOT; ?>/view/view.css">
    <script src="<?php echo $WEB_ROOT; ?>/view/view.js" type="module"></script>
</head>
<header id="header"><?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?></header>
<body>
    <span class="slideMenu"></span>
    <span id="splashScreen">
        <div class="center">
            <h2>BSDP Overlay</h2>
            <h3 id="ssDetails">
                <span id="ssName">Overlay</span>
                <span>By</span>
                <span id="ssUsername">Creator</span>
            </h3>
            <img id="ssThumbnail" src="https://cdn.global-gaming.co/images/team/members/readiecircle.png">
            <h3 id="ssSubText">Loading...</h3>
            <div class="ssProgressContainer">
                <div id="ssProgress"></div>
            </div>
        </div>
    </span>
    <div id="overlay"></div>
</body>
<footer id="footer"></footer>
</html>