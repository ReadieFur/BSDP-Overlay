<?php
    global $REQUEST_URI;
    global $WEB_ROOT;
    global $SITE_ROOT;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:type" content="website">
    <meta property="og:title" content="BSDP-Overlay"/>
    <meta property="og:url" content="https://readie.global-gaming.co/bsdp-overlay<?php echo $REQUEST_URI; ?>"/>
    <link rel="icon" href="https://cdn.global-gaming.co/images/team/members/readiecircle.png" type="image/png">
    <title>BSDP Overlay | Preset</title>
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,600,700,800" rel="stylesheet">
    <link rel="stylesheet" href="default/assets/css/extra.css">
    <link rel="stylesheet" href="default/assets/css/preset.css">
    <script src="default/assets/js/client.js"></script>
    <script src="default/assets/js/elements.js"></script>
    <script src="default/assets/js/args.js"></script>
    <script src="default/assets/js/ui.js"></script>
    <script src="<?php echo $WEB_ROOT; ?>/assets/js/main.js"></script>
    <script src="<?php echo $WEB_ROOT; ?>/assets/js/headerSlide.js"></script>
    <style id="themeColours"></style>
</head>
<header id="header"><?php echo execAndRead("{$SITE_ROOT}/assets/php/header.php"); ?></header>
<body>
    <span class="slideMenu"></span>

    <div class="scoreStats">
        <h2 class="time">Time</h2>
        <h2 class="score">Score</h2>
        <h2 class="accuracy">Accuracy</h2>
        <h2 class="combo">Combo</h2>
    </div>

    <div class="mapInfo">
        <p class="preBSR">Pre BSR:</p>
        <div>
            <div class="beatmapImageContainer">
                <img class="beatmapImage" src="default/assets/images/BeatSaberIcon.jpg" alt="Couldn't load image ;(">
            </div>
            <div class="beatmapInfo">
                <p class="bsr">BSR</p>
                <p class="mapper">Mapper</p>
                <p class="artist">ArtistName</p>
                <h1 class="song">SongName</h1>
            </div>
        </div>
    </div>

    <div class="modifiersHealth">
        <div class="modifiers">
            <h2 class="IF">IF</h2>
            <h2 class="BE">BE</h2>
            <h2 class="DA">DA</h2>
            <h2 class="GN">GN</h2>
            <h2 class="FS">FS</h2>
            <h2 class="NF">NF</h2>
            <h2 class="NO">NO</h2>
            <h2 class="NB">NB</h2>
            <h2 class="SS">SS</h2>
            <h2 class="NA">NA</h2>
        </div>
        <div class="healthContainer">
            <div class="healthBackground">
                <div class="health"></div>
            </div>
        </div>
    </div>
    <!--By kOF.Readie-->
</body>
</html>