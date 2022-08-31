<?php
    $title = 'Home | BSDP Overlay';

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
    <link rel="stylesheet" href="../assets/css/markdown.css">
    <script src="https://cdn.readiefur.com/resources/scripts/marked/marked-2.0.3.min.js"></script>
    <script src="./index.js" type="module" defer></script>
</head>
<header id="header"><?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?></header>
<body>
    <div class="splashText">
        <div class="center">
            <h1 class="center x text">BSDP Overlay</h1>
            <p class="center x text">The official overlay tool for BSDataPuller</p>
        </div>
    </div>
    <div id="splashVideoAndAbout">
        <div class="fixedBackground">
            <div class="background">
                <!-- <video src="http://www.w3schools.com/html/mov_bbb.mp4" autoplay muted loop></video> -->
                <video autoplay muted loop></video>
            </div>
            <div class="contentAfter">
                <div>
                    <br>
                    <section id="about" class="markdown"></section>
                </div>
            </div>
        </div>
    </div>
</body>
<footer id="footer"><?php echo execAndRead("{$SITE_ROOT}/assets/php/footer.php"); ?></footer>
</html>