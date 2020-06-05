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
    
    if (urlParams.has("flip"))
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
        document.getElementById("mapName").className = "mapNameRight";
        document.getElementById("mapName").style.borderRadius = "10px 0px 0px 10px";

        topCurve = "10px 0px 0px 0px";
        bottomCurve = "0px 0px 0px 10px";
        bothCurve = "10px 0px 0px 10px";
        coverRadiusHid = "10px 10px 10px 0px";
        coverRadiusVis = "10px 0px 10px 0px";
    }
};

args();