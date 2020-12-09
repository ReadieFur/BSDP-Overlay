<?php
    $REQUEST_URI = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    function execAndRead($path)
    {
        ob_start();
        require_once $path;
        $output = ob_get_contents();
        ob_end_clean();
        return $output;
    }
?>