<?php global $WEB_ROOT; ?>
<link rel="stylesheet" type="text/css" href="<?php echo $WEB_ROOT ?>/assets/css/header.css"/>
<section>
    <span class="bottomStripThin"></span>
    <div class="titleContainer">
        <a href="<?php echo $WEB_ROOT ?>/">
            <img class="imgSmall titleIcon" src="https://cdn.global-gaming.co/images/team/members/readiecircle.png">
            <h3 class="title">BSDP Overlay</h3>
        </a>
    </div>
    <div class="navigationContainer">
        <!--<a href="/">Home</a>-->
        <!--<a href="<?php echo $WEB_ROOT ?>/">About</a>-->
        <!--<a href="<?php echo $WEB_ROOT ?>/mod">Mod</a>-->
        <a href="<?php echo $WEB_ROOT ?>/browser/">Browser</a>
        <a href="<?php echo $WEB_ROOT ?>/view/">Default</a>
        <a href="<?php echo $WEB_ROOT ?>/edit/">Editor</a>
        <!--<div class="naviDropdown">
            <a>Overlay +</a>
            <div class="dropdownContent">
                <div></div>
                <div class="bottomStrip">
                    <a href="<?php echo $WEB_ROOT ?>/browser/">Browser</a>
                    <a href="http://u-readie.global-gaming.co/bsdp-overlay/">Default</a>
                    <a href="http://u-readie.global-gaming.co/bsdp-overlay/editor/">Editor</a>
                </div>                
            </div>
        </div>-->
        <div class="naviDropdown">
            <a>Account +</a>
            <div class="dropdownContent">
                <div></div>
                <div class="bottomStrip">
                    <a href="<?php echo $WEB_ROOT ?>/my_overlays/">My Overlays</a>
                    <a href="https://api-readie.global-gaming.co/account/">Managment</a>
                    <a id="darkMode">Dark Mode</a>
                </div>                
            </div>
        </div>
    </div>
</section>
<!--<hr>-->