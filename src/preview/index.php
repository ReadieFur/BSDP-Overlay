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
                        <img id="thumbnail">
                    </td>
                    <td id="overlayTextContainer">
                        <div>
                            <h3 id="name">Overlay Name</h3>
                            <p id="description">Overlay Description</p>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="joinButtons">
                                                <button id="overlayLinkContainer" class="containsLink ignore"><a id="overlayLink">Use Overlay</a></button>
                                                <!--Id like to have these two (^v) as an 'a' element but my css wont allow for it, and I can't be arsed to change it.-->
                                                <!--So instead I just put the 'a' element inside the button with a midified button/a hitbox (padding).-->
                                                <button id="editLinkContainer" class="containsLink"><a id="editLink">Edit</a></button>
                                                <button id="deleteButton">Delete</button>
                                            </div>
                                        </td>
                                        <td>
                                            <span>Creator: <a id="username" class="light">Overlay Creator</a></span>
                                            <span>ID: <a id="id" class="light">Overlay ID</a></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</body>
<footer id="footer"><?php echo execAndRead("{$SITE_ROOT}/assets/php/footer.php"); ?></footer>
</html>