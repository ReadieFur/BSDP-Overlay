<?php
    $title = 'Element Preview | BSDP Overlay';

    global $WEB_ROOT;
    global $SITE_ROOT;
    $DOCUMENT_ROOT = $_SERVER["DOCUMENT_ROOT"];
    require_once "$DOCUMENT_ROOT/roots.php";
    require_once "$SITE_ROOT/assets/php/main.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php echo execAndRead("{$SITE_ROOT}/assets/php/head.php"); ?>
    <link href="./overlay_elements.css" rel="stylesheet">
    <script src="./overlay_elements.js" type="module" defer></script>
</head>
<header id="header"><?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?></header>
<body>
    <span class="slideMenu"></span>
    <!--Example URL: http://readie.global-gaming.localhost/bsdp-overlay/assets/overlay_elements/?element=round_bar/time/01-->
    <div id="overlay">
        <div id="element_01" class="elementContainer"></div>
    </div>
</body>
<footer id="footer"></footer>
</html>