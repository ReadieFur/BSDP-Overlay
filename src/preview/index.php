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
    <section>
        <table>
            <tr>
                <td class="overlayImageContainer"><img id="overlayImage" src="" alt="Couldnt load preview"></td>
                <td class="textContainer">
                    <div>
                        <h3 id="overlayName">Overlay Name</h3>
                        <p id="overlayDescription">Overlay Description</p>
                        <button id="overlayButton" class="hollowButton">Use Overlay</button>
                        <span>Creator: <a id="overlayCreator">Overlay Creator</a></span>
                        <span>ID: <a id="overlayID">Overlay ID</a></span>
                    </div>
                </td>
            </tr>
        </table>
    </section>
</body>
<footer id="footer"><?php echo execAndRead("{$SITE_ROOT}/assets/php/footer.php"); ?></footer>
</html>