<?php
    $title = 'About | BSDP Overlay';

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
    <link rel="stylesheet" href="./index.css">
    <script src="./index.js" type="module"></script>
</head>
<header id="header"><?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?></header>
<body>
    <div class="fullFrontPage">
        <video src="" autoplay muted loop></video>
        <section>
            <div></div>
            <div class="center text bottomStrip">
                <h3>BSDP Overlay</h3>
                <p>The only overlay tool you will need for BeatSaber</p> <!--This won't be the final quote XD-->
            </div>
        </section>
    </div>
</body>
<footer id="footer"><?php echo execAndRead("{$SITE_ROOT}/assets/php/footer.php"); ?></footer>
</html>