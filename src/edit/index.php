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
    <link rel="stylesheet" href="<?php echo $WEB_ROOT; ?>/edit/editor.css">
    <script src="https://cdn.global-gaming.co/resources/scripts/dom-to-image.min.js"></script>
    <script src="<?php echo $WEB_ROOT; ?>/edit/editor.js" type="module"></script>
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
    <div id="saveMenuContainer">
        <div id="saveMenuBackground"></div>
        <div id="saveMenu">
            <table>
                <tbody>
                    <tr>
                        <td id="detailsContainer">
                            <form>
                                <table>
                                    <tr>
                                        <td id="titleContainer">
                                            <h3>Title</h3>
                                            <input id="title" type="text" required minlength="5" maxlength="32" class="larger">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h3>Description</h3>
                                            <textarea id="description" maxlength="128"></textarea>
                                        </td>
                                    </tr>
                                </table>
                            </form>
                        </td>
                        <td id="publishContainer">
                            <table>
                                <tbody>
                                    <tr>
                                        <td id="thumbnailContainer">
                                            <img id="thumbnail">
                                            <h4>Loading<br>Thumbnail</h4>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td id="overlayPrivateContainer">
                                            <label id="overlayPrivate" class="checkboxContainer">
                                                <span><h4>Private</h4></span>
                                                <input type="checkbox" disabled>
                                                <span class="checkmark"></span>
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td id="publishButtonContainer">
                                            <button id="publishButton">Save</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
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
                                    <!--Make the arrows SVGs in the future-->
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
                            <tr id="ssc">
                                <td>
                                    <button id="showSaveContainer">Save</button>
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
    <div id="imageRendererContainer"></div>
</body>
<footer id="footer"></footer>
</html>