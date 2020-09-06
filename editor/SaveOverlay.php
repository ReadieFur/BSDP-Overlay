<?php
    try
    {
        $uid = uniqid();
        mkdir("public/$uid");
    
        $html = fopen("public/$uid/html.txt", "w");
        fwrite($html, $_POST["html"]);
        fclose($html);
    
        $css = fopen("public/$uid/styles.css", "w");
        fwrite($css, $_POST["css"]);
        fclose($css);
    
        $js = fopen("public/$uid/script.js", "w");
        fwrite($js, $_POST["js"]);
        fclose($js);
    
        echo $uid;
    }
    catch (Exception $e) { echo "Error: ", $e->getMessage(); }