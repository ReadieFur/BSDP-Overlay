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
    <script type="module" src="../js/index.ts.js"></script>
</head>
<body>
    
</body>
</html>