<?php
    $WEB_ROOT;
    $SITE_ROOT;
    $DOCUMENT_ROOT = $_SERVER["DOCUMENT_ROOT"];
    require_once "$DOCUMENT_ROOT/roots.php";
    require_once "$SITE_ROOT/assets/php/main.php";
    $title = 'Preview | BSDP Overlay';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php echo execAndRead("{$SITE_ROOT}/assets/php/head.php"); ?>
    <link rel="stylesheet" href="<?php echo $WEB_ROOT; ?>/preview/preview.css">
    <script src="<?php echo $WEB_ROOT; ?>/preview/preview.js" type="module"></script>
</head>
<header id="header"><?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?></header>
<body>
    <section>
        <table id="overlayDetailsContainer">
            <tbody>
                <tr>
                    <td id="overlayImageContainer">
                        <img id="thumbnail" alt="Couldnt load preview">
                    </td>
                    <td id="overlayTextContainer">
                        <div>
                            <h3 id="name">Overlay Name</h3>
                            <p id="description">Overlay Description</p>
                            <a id="overlayLink" class="asButton">Use Overlay</a>
                            <span>Creator: <a id="username">Overlay Creator</a></span>
                            <span>ID: <a id="id">Overlay ID</a></span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</body>
<footer id="footer"><?php echo execAndRead("{$SITE_ROOT}/assets/php/footer.php"); ?></footer>
</html>