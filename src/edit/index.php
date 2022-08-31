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
    <script src="https://cdn.readiefur.com/resources/scripts/dom-to-image.min.js"></script>
    <script src="<?php echo $WEB_ROOT; ?>/edit/editor.js" type="module" defer></script>
</head>
<header id="header"><?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?></header>
<body>
    <span id="splashScreen">
        <div class="center">
            <h2 id="ssHeader">BSDP Overlay</h2>
            <img class="medium" src="https://cdn.readiefur.com/images/team/members/readiecircle.png">
            <h3 id="ssSubText">Loading...</h3>
            <div class="ssProgressContainer">
                <div id="ssProgress"></div>
            </div>
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
                                            <textarea id="description" maxlength="256"></textarea>
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
    <div id="optionsMenuContainer">
        <div class="background"></div>
        <div class="container">
            <div>
                <h4>Help</h4>
                <button id="walkthroughButton" class="light">Show Walkthrough</button>
            </div>
            <!-- <div>
                <h4>Editor size</h4>
                <form>
                    <label class="radioButtonContainer" id="autoSizeRadio">
                        <span><p>Auto Size</p></span>
                        <input type="radio" name="radio">
                        <span class="radioButton"></span>
                    </label>
                    <label class="radioButtonContainer" id="manualSizeRadio">
                        <span><p>Manual Size</p></span>
                        <input type="radio" name="radio">
                        <span class="radioButton"></span>
                    </label>
                </form>
            </div> -->
            <div class="editorBackgroundOptions">
                <h4>Editor background</h4>
                <form>
                    <label class="radioButtonContainer" id="defaultBackgroundRadio">
                        <span><p>Default Background</p></span>
                        <input type="radio" name="radio">
                        <span class="radioButton"></span>
                    </label>
                    <table>
                        <tbody>
                            <tr>    
                                <td>
                                    <label class="radioButtonContainer" id="customBackgroundRadio">
                                        <span><p>Custom Background</p></span>
                                        <input type="radio" name="radio">
                                        <span class="radioButton"></span>
                                    </label>
                                </td>
                                <td>
                                    <input type="file" id="customBackgroundInput" accept="image/*">
                                </td>
                            </tr>
                        </tbody>                                    
                    </table>
                </form>
            </div>
            <div>
                <h4>Data</h4>
                <label class="radioButtonContainer" id="placeholderDataRadio">
                    <span><p>Placeholder Data</p></span>
                    <input type="radio" name="radio">
                    <span class="radioButton"></span>
                </label>
                <label class="radioButtonContainer" id="sampleDataRadio">
                    <span><p>Sample Data</p></span>
                    <input type="radio" name="radio">
                    <span class="radioButton"></span>
                </label>
                <table class="gameOptionsContainer">
                    <tbody>
                        <tr>
                            <td>
                                <label class="radioButtonContainer" id="gameDataRadio">
                                    <span><p>Game Data</p></span>
                                    <input type="radio" name="radio">
                                    <span class="radioButton"></span>
                                </label>
                            </td>
                            <td>
                                <form id="ipForm">
                                    <table class="ipTable">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p id="ipLabel" class="light">IP:</p>
                                                </td>
                                                <td>
                                                    <input type="text" id="gameIP">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </form>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div id="walkthroughContainer">
        <div class="background"></div>
        <div class="container">
            <h3>Walkthrough</h3>
            <p>This walkthrough can be viewed again through the options menu.</p>
            <h4>Creating elements</h4>
            <p class="light">To create elements, double click on the desired element and it will be place in the top right corner of the overlay window.</p>
            <h4>Deleting elements</h4>
            <p class="light">To delete an element, press <code>CTRL + ALT + CLICK</code> on the element you wish to delete.</p>
            <h4>Customizing elements</h4>
            <p class="light">Each type of element has different customisation options, some include:</p>
            <ul>
                <li class="light">Size</li>
                <li class="light">Colour</li>
                <li class="light">Font</li>
                <li class="light">Alignment</li>
            </ul>
            <p class="light">
                To customise these properties, click on the element you wish to customise and browse through the avaliable options for that element.<br>
                Each element can be moved either by the properties panel or by dragging it around on the overlay.
            </p>
            <h4>Displayed data</h4>
            <p class="light">If you visit the options menu you can pick from different data sets to be shown on the elements in the editor, these data sets are:</p>
            <ul>
                <li class="light">Placeholder data</li>
                <li class="light">Sample data</li>
                <li class="light">Game data</li>
            </ul>
            <h4>Saving your overlay</h4>
            <p class="light">
                When saving your overlay you can customise the title, description and publicity.<br>
                <span>Note:</span> Your overlay must have at least two elements on it in order for it to be published.
            </p>
            <h4>Using the overlay</h4>
            <p class="light">
                Overlays can be used in programs such as OBS by opening the saved overlay in view mode, the URL for this is <code>...bsdp-overlay/view/&ltOVERLAY_ID&gt</code> alternatively this page can be reached by searching for your overlay in the overlay browser.<br>
                Once you have chosen your desired overlay, copy the URL and, in the case of OBS, add it as a browser source to your scene.<br>
                <span>Note:</span> If the overlay is private you must log in on your streaming software to access the overlay. (More info on this can be found on the websites <a class="light" href="<?php echo $WEB_ROOT; ?>">home</a> page under 'Private overlays & OBS'.)
            </p>
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
                                </td>
                            </tr>
                            <tr id="miscRow">
                                <td>
                                    <div class="joinButtons center x">
                                        <button id="showOptionsContainer">Options</button>
                                        <button id="showSaveContainer">Save</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td class="overlayContainer">
                    <!-- <div id="overlaySizeContainer"></div> -->
                    <div id="overlay"></div>
                </td>
            </tr>
        </tbody>
    </table>
    <div id="imageRendererContainer"></div>
</body>
<footer id="footer"></footer>
</html>