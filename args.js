const urlParams = new URLSearchParams(location.search);

function args()
{
    document.body.style.zoom = urlParams.has("scale") ? urlParams.get("scale") : 1;
    document.getElementById("beatmapInfo").style.visibility = urlParams.has("beatmapVis") ? urlParams.get("beatmapVis") : "visible";
    document.getElementById("stats").style.visibility = urlParams.has("statsVis") ? urlParams.get("statsVis") : "visible";
    document.getElementById("rightBar").style.visibility = urlParams.has("modifiersVis") ? urlParams.get("modifiersVis") : "visible";
};

args();