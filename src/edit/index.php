<?php
    $title = 'Edit | BSDP Overlay';

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
            <img class="medium" src="https://cdn.global-gaming.co/images/team/members/readiecircle.png">
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
    <table id="editorRootContainer">
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
                            <!--So many tables, I don't rembember how to get these to position properly so im just going to use lots of tables.-->
                            <tr id="optionsRow">
                                <td>
                                    <hr>
                                    <div id="optionTabs">
                                        <div class="joinButtons">
                                            <button id="optionPositionButton">Position</button>
                                            <button id="optionSizeButton">Size</button>
                                            <button id="optionColourButton">Colour</button>
                                            <button id="optionFontButton">Font</button>
                                            <button id="optionAlignmentButton">Alignment</button>
                                            <button id="optionMiscButton">Misc</button>
                                        </div>
                                    </div>
                                    <form id="optionsForm">
                                        <table>
                                            <tbody id="optionsPosition">
                                                <tr>
                                                    <td>
                                                        <p>Top:</p>
                                                    </td>
                                                    <td>
                                                        <input id="optionsTop" type="number">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>Left:</p>
                                                    </td>
                                                    <td>
                                                        <input id="optionsLeft" type="number">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>Bottom:</p>
                                                    </td>
                                                    <td>
                                                        <input id="optionsBottom" type="number">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>Right:</p>
                                                    </td>
                                                    <td>
                                                        <input id="optionsRight" type="number">
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody id="optionsSize">
                                                <tr>
                                                    <td>
                                                        <p>Width:</p>
                                                    </td>
                                                    <td>
                                                        <input id="optionsWidth" type="number">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>Height:</p>
                                                    </td>
                                                    <td>
                                                        <input id="optionsHeight" type="number">
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody id="optionsColour">
                                                <tr id="optionsForegroundColourGroup">
                                                    <td class="onePercent">
                                                        <p>Foreground:</p>
                                                    </td>
                                                    <td>
                                                        <input id="optionsForegroundColour" type="color">
                                                    </td>
                                                </tr>
                                                <tr id="optionsBackgroundColourGroup">
                                                    <td class="onePercent">
                                                        <p>Background:</p>
                                                    </td>
                                                    <td>
                                                        <input id="optionsBackgroundColour" type="color">
                                                    </td>
                                                </tr>
                                                <tr id="optionsAltColourGroup">
                                                    <td class="onePercent">
                                                        <p>Extra:</p>
                                                    </td>
                                                    <td>
                                                        <input id="optionsAltColour" type="color">
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody id="optionsFont">
                                                <tr>
                                                    <td>
                                                        <p>Font Size:</p>
                                                    </td>
                                                    <td>
                                                        <input id="optionsFontSize" type="number" min="16" max="100">
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody id="optionsAlignment">
                                                <tr id="optionsHorizontalAlignmentGroup">
                                                    <td class="onePercent">
                                                        <p>Horizontal Alignment:</p>
                                                    </td>
                                                    <td>
                                                        <select id="optionsHorizontalAlignment">
                                                            <option value="left">Left</option>
                                                            <option value="right">Right</option>
                                                            <option value="center">Center</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr id="optionsVerticalAlignmentGroup">
                                                    <td class="onePercent">
                                                        <p>Vertical Alignment:</p>
                                                    </td>
                                                    <td>
                                                        <select id="optionsVerticalAlignment">
                                                            <option value="top">Top</option>
                                                            <option value="bottom">Bottom</option>
                                                            <option value="center">Center</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr id="optionsBothAlignmentGroup">
                                                    <td class="onePercent">
                                                        <p>Alignment:</p>
                                                    </td>
                                                    <td>
                                                        <select id="optionsBothAlignment" type="color">
                                                            <option value="topLeft">Top Left</option>
                                                            <option value="bottomRight">Bottom Right</option>
                                                            <option value="center">Center</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody id="optionsMisc">
                                                <tr id="optionsTextGroup">
                                                    <td class="onePercent">
                                                        <p>Text:</p>
                                                    </td>
                                                    <td>
                                                        <input id="optionsText" type="text" maxlength="32">
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </form>
                                    <!--<small class="center x text">'ctrl' + 'alt' + 'click' to delete.</small>-->
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
    <canvas id="resizeCanvas"></canvas>
</body>
<footer id="footer"></footer>
</html>