<?php
    global $WEB_ROOT;
    global $REQUEST_URI;
    global $title;
    global $description;
    $DirName = ltrim(ucwords(str_replace("_", " ", basename($REQUEST_URI))));
?>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark light">
<meta property="og:type" content="website">
<meta property="og:title" content="<?php echo $title != null ? $title : "$DirName | BSDP Overlay"; ?>"/>
<meta property="og:description" content="<?php echo $description != null ? $description : $DirName; ?>"/>
<meta property="og:url" content="https://readie.global-gaming.co/bsdp-overlay<?php echo $REQUEST_URI; ?>"/>
<meta property="og:image" content="https://cdn.global-gaming.co/images/team/members/readiecircle.png"/>
<title><?php echo $title != null ? $title : "$DirName | BSDP Overlay"; ?></title>
<link rel="icon" href="https://cdn.global-gaming.co/images/team/members/readiecircle.png" type="image/png">
<link href="https://cdn.global-gaming.co/resources/fonts/montserrat/stylesheet.css" rel="stylesheet" type="text/css"> <!--Main font-->
<link href="https://cdn.global-gaming.co/resources/fonts/open_sans/stylesheet.css" rel="stylesheet" type="text/css"> <!--Fallback font-->
<link rel="stylesheet" type="text/css" href="<?php echo $WEB_ROOT; ?>/assets/css/head.css"/>
<link rel="stylesheet" type="text/css" href="<?php echo $WEB_ROOT; ?>/assets/css/main.css"/>
<script src="https://cdn.global-gaming.co/resources/scripts/jquery/jquery-3.5.1.min.js"></script>
<script>var WEB_ROOT = "<?php echo $WEB_ROOT; ?>";</script>
<style id="themeColours"></style>
<!--I'd like to move the alert box and account container here but I was having som annoying css ussues with it that I can't be arsed to fix right now.-->
<div id="tooltipContainer"><small id="tooltipText"></small></div>