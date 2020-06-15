const urlParams = new URLSearchParams(location.search);

function args()
{
    document.body.style.zoom = urlParams.has("scale") ? urlParams.get("scale") : 1;
    
    document.getElementById("beatmapInfo").style.visibility = urlParams.has("beatmapVis") ? "hidden" : "visible";
    document.getElementById("stats").style.visibility = urlParams.has("statsVis") ? "hidden" : "visible";
    document.getElementById("rightBar").style.visibility = urlParams.has("modifiersVis") ? "hidden" : "visible";
    if (urlParams.has("moveBSR"))
    {
        document.getElementById("previousBSRContainer").style.visibility = "visible";
        document.getElementById("bottomBSR").style.visibility = "hidden";
        document.getElementById("coverContainer").style.borderRadius = urlParams.has("flip") ? "10px 10px 10px 0px" : "10px 10px 0px 10px";
    }

    if (urlParams.has("flip") && urlParams.has("top"))
    {
        document.getElementById("beatmapText").appendChild(document.getElementById("artist"));
        document.getElementById("beatmapText").appendChild(document.getElementById("mapper"));
        document.getElementById("beatmapText").appendChild(document.getElementById("bsr"));
        
        document.getElementById("rightBar").className = "rightBarLeft";
        document.getElementById("modifiers").className = "modifiersLeft";
        document.getElementById("healthContainer").className = "healthContainerLeft";
        document.getElementById("healthBarBackground").className = "healthBarBackgroundLeft";

        document.getElementById("stats").className = "statsBottom";
        document.getElementById("mainStats").className = "mainStatsBottom";
        document.getElementById("previousBSRContainer").className = "previousBSRContainerBottom";

        document.getElementById("beatmapInfo").className = "beatmapInfoTopRight";
        document.getElementById("bottomBSR").className = "bottomBSRTopRight";
        document.getElementById("coverContainer").className = "coverContainerTopRight";
        document.getElementById("beatmapCover").id = "beatmapCoverTopRight";
        document.getElementById("beatmapText").className = "beatmapTextTopRight";
        document.getElementById("bsr").className = "bsrTopRight";
        document.getElementById("mapper").className = "mapperTopRight";
        document.getElementById("artist").className = "artistTopRight";
        document.getElementById("mapName").style.borderRadius = "10px 0px 0px 10px";

        topCurve = "10px 0px 0px 0px";
        bottomCurve = "0px 0px 0px 10px";
        bothCurve = "10px 0px 0px 10px";
        coverRadiusHid = "0px 10px 10px 10px";
        coverRadiusVis = "0px 10px 0px 10px";
    }
    else if (urlParams.has("flip"))
    {
        document.getElementById("rightBar").className = "rightBarLeft";
        document.getElementById("modifiers").className = "modifiersLeft";
        document.getElementById("healthContainer").className = "healthContainerLeft";
        document.getElementById("healthBarBackground").className = "healthBarBackgroundLeft";
        
        document.getElementById("beatmapInfo").className = "beatmapInfoRight";
        document.getElementById("bottomBSR").className = "bottomBSRRight";
        document.getElementById("coverContainer").className = "coverContainerRight";
        document.getElementById("beatmapText").className = "beatmapTextRight";
        document.getElementById("bsr").className = "bsrRight";
        document.getElementById("mapper").className = "mapperRight";
        document.getElementById("artist").className = "artistRight";
        document.getElementById("mapName").style.borderRadius = "10px 0px 0px 10px";

        topCurve = "10px 0px 0px 0px";
        bottomCurve = "0px 0px 0px 10px";
        bothCurve = "10px 0px 0px 10px";
        coverRadiusHid = "10px 10px 10px 0px";
        coverRadiusVis = "10px 0px 10px 0px";
    }
    else if (urlParams.has("top"))
    {
        document.getElementById("beatmapText").appendChild(document.getElementById("artist"));
        document.getElementById("beatmapText").appendChild(document.getElementById("mapper"));
        document.getElementById("beatmapText").appendChild(document.getElementById("bsr"));

        document.getElementById("stats").className = "statsBottom";
        document.getElementById("mainStats").className = "mainStatsBottom";
        document.getElementById("previousBSRContainer").className = "previousBSRContainerBottom";

        document.getElementById("beatmapInfo").className = "beatmapInfoTopLeft";
        document.getElementById("bottomBSR").className = "bottomBSRTopLeft";
        document.getElementById("coverContainer").className = "coverContainerTopLeft";
        document.getElementById("beatmapCover").id = "beatmapCoverTopLeft";
        document.getElementById("beatmapText").className = "beatmapTextTopLeft";
        document.getElementById("bsr").className = "bsrTopLeft";
        document.getElementById("mapper").className = "mapperTopLeft";
        document.getElementById("artist").className = "artistTopLeft";

        coverRadiusHid = "10px 0px 10px 10px";
        coverRadiusVis = "10px 0px 10px 0px";
    }
};

args();