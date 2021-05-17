<?php
    $title = 'BSDP Overlay';

    $WEB_ROOT;
    $SITE_ROOT;
    $DOCUMENT_ROOT = $_SERVER["DOCUMENT_ROOT"];
    require_once "$DOCUMENT_ROOT/roots.php";
    require_once "$SITE_ROOT/assets/php/main.php";
?>
<!--The only reason I am loading the head is for the tags for sites to preview, assuming that they don't follow the redirect-->
<!DOCTYPE html>
<html lang="en">
<head><?php echo execAndRead("{$SITE_ROOT}/assets/php/head.php"); ?></head>
</html>
<?php header('Location: ' . $WEB_ROOT . '/home/', true, 301); ?>