<?php
    $title = 'View | BSDP Overlay';

    $WEB_ROOT;
    $SITE_ROOT;
    $DOCUMENT_ROOT = $_SERVER["DOCUMENT_ROOT"];
    require_once "$DOCUMENT_ROOT/roots.php";
    require_once "$SITE_ROOT/assets/php/main.php";

    $REQUEST_SCHEME = $_SERVER["REQUEST_SCHEME"];
    $HTTP_HOST = $_SERVER["HTTP_HOST"];

    $page;
    $splitPath = array_filter(explode('/', $REQUEST_URI));
    $idPosition = array_search('view', $splitPath);

    if (!(strlen($splitPath[$idPosition + 1]) === 13 && count($splitPath) === $idPosition + 1))
    { header("Location: $REQUEST_SCHEME://$HTTP_HOST$WEB_ROOT/view/default/", true, 302); }
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
            <h2 id="ssHeader">BSDP Overlay</h2>
            <img class="medium" alt="A missing picture of me ;)" src="https://cdn.global-gaming.co/images/team/members/readiecircle.png">
            <h3 id="ssSubHeader">Loading...</h3>
        </div>
    </span>
    <div id="overlay"></div>
</body>
<footer id="footer"></footer>
</html>