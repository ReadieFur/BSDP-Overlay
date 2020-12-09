<?php
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
    <link rel="stylesheet" href="styles.css">
    <script src="script.js"></script>
</head>
<header id="header"><?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?></header>
<body>
    <section id="overlayList">
        <div class="top">
            <h4>Browser</h4>
            <form id="search">
                <input type="text" placeholder="Search"><input class="hollowButton" type="submit" value="Search">
            </form>
        </div>
        <hr>
        <table id="overlays">
            <tr>
                <th>Preview</th>
                <th>Overlay Name</th>
                <th>Creator</th>
            </tr>
        </table>
        <div id="pages">
        </div>
    </section>
</body>
<footer id="footer"><?php echo execAndRead("{$SITE_ROOT}/assets/php/footer.php"); ?></footer>
</html>