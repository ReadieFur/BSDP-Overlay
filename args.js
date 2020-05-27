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
        document.getElementById("coverContainer").style.borderRadius = "10px 10px 0px 10px";
    }
};

args();