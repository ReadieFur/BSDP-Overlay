<?php
    $title = 'Editor | BSDP Overlay';

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
    <link rel="stylesheet" href="./assets/css/editor.css">
    <script src="./assets/js/editor.js" type="module"></script>
</head>
<header id="header"><?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?></header>
<body>
    <span id="splashScreen">
        <div class="center">
            <h2 id="ssHeader">BSDP Overlay</h2>
            <img class="medium" alt="A missing picture of me ;)" src="https://cdn.global-gaming.co/images/team/members/readiecircle.png">
            <h3 id="ssSubHeader">Loading...</h3>
        </div>
    </span>
    <table>
        <tbody>
            <tr>
                <td class="menuContainer">
                    <table>
                        <tbody>
                            <tr class="slideMenuContainer">
                                <td>
                                    <table>
                                        <tbody>
                                            <tr class="slideMenu">
                                            <td>
                                                <hr>
                                                <hr>
                                                <hr>
                                            </td>
                                            <td>
                                                <h3>Menu</h3>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr id="elementsRow">
                                <td>
                                    <table id="elementsTable">
                                        <tbody></tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr id="optionsRow">
                                <td>
                                    <hr>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td class="overlayContainer">
                    <div id="overlay"></div>
                </td>
            </tr>
        </tbody>
    </table>
</body>
<footer id="footer"></footer>
</html>