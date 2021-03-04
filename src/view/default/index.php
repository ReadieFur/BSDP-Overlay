<?php
    $title = 'Default | BSDP Overlay';

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
    <style id="overlayThemeColours"></style>
</head>
<header id="header">
    <?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?>
    <link rel="stylesheet" href="./default.css">
    <script src="./default.js" type="module"></script>
</header>
<body>
    <span class="slideMenu"></span>

    <div id="overlay">
        <table id="stats">
            <tbody>
                <tr>
                    <td id="time">Time</td>
                    <td id="score">Score</td>
                    <td id="accuracy">Accuracy</td>
                    <td id="combo">Combo</td>
                </tr>
            </tbody>
        </table>

        <table id="modifiersAndHealth">
            <tbody>
                <tr id="modifiersAndHealthTR">
                    <td id="healthColumn">
                        <div class="healthContainer">
                            <div class="healthBackground">
                                <div id="health"></div>
                            </div>
                        </div>
                    </td>
                    <td id="modifiersColumn">
                        <table>
                            <tbody>
                                <tr id="IF"><td>IF</td></tr>
                                <tr id="BE"><td>BE</td></tr>
                                <tr id="DA"><td>DA</td></tr>
                                <tr id="GN"><td>GN</td></tr>
                                <tr id="FS"><td>FS</td></tr>
                                <tr id="NF"><td>NF</td></tr>
                                <tr id="NO"><td>NO</td></tr>
                                <tr id="NB"><td>NB</td></tr>
                                <tr id="SS"><td>SS</td></tr>
                                <tr id="NA"><td>NA</td></tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>

        <table id="mapDetails">
            <tbody>
                <tr id="mapDetailsTR">
                    <td id="mapCoverTD">
                        <p id="preBSR">Pre BSR:</p>
                        <div id="mapCoverContainer">
                            <img id="mapCover" src="<?php echo $WEB_ROOT; ?>/assets/images/BeatSaberIcon.jpg">
                        </div>
                    </td>
                    <td id="mapDetailsContainer">
                        <!--The classes in here get changed by UI.ts, they are only added here for the first load-->
                        <p id="bsr" class="topRightRadius">BSR</p>
                        <p id="mapper" class="topRightRadius">Mapper</p>
                        <p id="artistName" class="topRightRadius">Artist Name</p>
                        <p id="songName" class="topRightRadius bottomRightRadius">Song Name</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
<footer id="footer"></footer>
</html>