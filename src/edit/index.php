<?php
    $title = 'BSDP Overlay | Editor';

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
    <link rel="stylesheet" href="../edit/assets/css/main.css">
    <script type="module" src="../edit/assets/js/index.ts.js"></script>
    <script src="<?php echo $WEB_ROOT; ?>/assets/js/headerSlide.js"></script>
</head>
<header id="header"><?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?></header>
<body>
    <span id="splashScreen">
        <div class="center text">
            <h2 id="ssHeader">BSDP Overlay</h2>
            <img class="imgMedium" alt="A missing picture of me ;)" src="https://cdn.global-gaming.co/images/team/members/readiecircle.png">
            <h3 id="ssSubHeader">Loading...</h3>
        </div>
    </span>
    <span class="slideMenuClick view"></span>
    <table>
        <tbody>
            <tr>
                <td id="editorContainer"></td>
                <td class="overlayContainer" style="background-image: url('<?php echo $WEB_ROOT; ?>/assets/images/beat-saber.jpg');">*/
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>