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
    <link rel="stylesheet" href="./browser.css">
    <script src="browser.js" type="module"></script>
</head>
<header id="header"><?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?></header>
<body>
    <section id="overlayList">
        <div class="top">
            <h4>Browser</h4>
            <form id="search">
                <input type="text" placeholder="Search"><input class="asButton" type="submit" value="Search">
            </form>
        </div>
        <hr>
        <table id="overlays">
            <tbody>
                <tr>
                    <th>Preview</th>
                    <th>Overlay Name</th>
                    <th>Creator</th>
                </tr>
            </tbody>
            <tbody>
                <!--<tr>
                    <td><img src="https://cdn.global-gaming.co/images/team/members/readiecircle.png"></td>
                    <td>Overlay Name</td>
                    <td>kOF.Readie</td>
                </tr>-->
            </tbody>
        </table>
        <p id="resultsText">Showing results: 0-0 of 0</p>
        <div id="pages">
        </div>
    </section>
</body>
<footer id="footer"><?php echo execAndRead("{$SITE_ROOT}/assets/php/footer.php"); ?></footer>
</html>