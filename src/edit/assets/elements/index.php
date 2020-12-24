<?php
    $WEB_ROOT;
    $SITE_ROOT;
    $DOCUMENT_ROOT = $_SERVER["DOCUMENT_ROOT"];
    require_once "$DOCUMENT_ROOT/roots.php";
    require_once "$SITE_ROOT/assets/php/main.php";

    $elements = json_decode(file_get_contents("elements.json"), true);

    $body;
    $splitPath = array_filter(explode('/', $REQUEST_URI));
    $element = $splitPath[count($splitPath)];

    $elementType = null;
    for ($i = 0; $i < count($elements); $i++)
    {
        if ($elements[$i]['name'] == $element)
        {
            $elementType = $elements[$i]['type'];
            break;
        }
    }
    if ($elementType == null) { http_response_code(404); }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $element; ?></title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="module" src="<?php echo $WEB_ROOT; ?>/edit/assets/js/index.ts.js"></script>
    <link rel="stylesheet" type="text/css" href="<?php echo $WEB_ROOT; ?>/assets/css/main.css"/>
    <link href="../<?php echo $elementType . '/' . $element; ?>/css.css">
    <style>
        :root
        {
            --foreground: white;
            --background: rgb(13, 17, 23);
            --backgroundAlt: rgb(22, 27, 34);
        }
    </style>
</head>
<body>
    <div class="elementContainer resize move">
        <?php echo file_get_contents(getcwd() . "\\$elementType\\$element\\html.html"); ?>
    </div>
</body>
</html>