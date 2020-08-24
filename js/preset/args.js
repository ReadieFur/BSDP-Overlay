//This is very messy and will be changed, I just wanted to get the update out for now
window.addEventListener("load", () =>
{
    let textContainer;
    beatmapImages.forEach(e => { if (e.parentElement.parentElement.parentElement.className.includes("mapInfo")) { beatmapImageContainer = e.parentElement; } });
    BSRs.forEach(e => { if (e.parentElement.parentElement.parentElement.className.includes("mapInfo")) { bsr = e; textContainer = e.parentElement; } });
    mappers.forEach(e => { if (e.parentElement.parentElement.parentElement.className.includes("mapInfo")) { mapper = e; } });
    artists.forEach(e => { if (e.parentElement.parentElement.parentElement.className.includes("mapInfo")) { artist = e; } });
    songNames.forEach(e => { if (e.parentElement.parentElement.parentElement.className.includes("mapInfo")) { songName = e; } });
    
    document.body.style.zoom = urlParams.has("scale") ? urlParams.get("scale") : 1;

    if (urlParams.has("flipHori") && urlParams.has("flipVert"))
    {
        textContainer.appendChild(artist);
        textContainer.appendChild(mapper);
        textContainer.appendChild(bsr);
        textContainer.parentElement.appendChild(beatmapImageContainer);
        preBSRs[0].parentElement.appendChild(preBSRs[0]);

        document.getElementsByClassName("scoreStats")[0].className = "scoreStatsBottom";
        document.getElementsByClassName("mapInfo")[0].className += " Right Top";
        document.getElementsByClassName("modifiersHealth")[0].className = "modifiersHealthLeft";

        topCurve = "10px 0px 0px 0px";
        bottomCurve = "0px 0px 0px 10px";
        bothCurve = "10px 0px 0px 10px";
        coverRadiusHid = "0px 10px 10px 10px";
        coverRadiusVis = "0px 10px 0px 10px";

        beatmapImageContainer.style.borderRadius = coverRadiusVis;
        StyleMapText();
    }
    else if (urlParams.has("flipHori"))
    {
        document.getElementsByClassName("mapInfo")[0].className += " Right";
        document.getElementsByClassName("modifiersHealth")[0].className = "modifiersHealthLeft";

        textContainer.parentElement.appendChild(beatmapImageContainer);

        topCurve = "10px 0px 0px 0px";
        bottomCurve = "0px 0px 0px 10px";
        bothCurve = "10px 0px 0px 10px";
        coverRadiusHid = "10px 10px 10px 0px";
        coverRadiusVis = "10px 0px 10px 0px";

        beatmapImageContainer.style.borderRadius = coverRadiusVis;
        StyleMapText();
    }
    else if (urlParams.has("flipVert"))
    {
        textContainer.appendChild(artist);
        textContainer.appendChild(mapper);
        textContainer.appendChild(bsr);
        preBSRs[0].parentElement.appendChild(preBSRs[0]);

        document.getElementsByClassName("scoreStats")[0].className = "scoreStatsBottom";
        document.getElementsByClassName("mapInfo")[0].className += " Top";

        coverRadiusHid = "10px 0px 10px 10px";
        coverRadiusVis = "10px 0px 10px 0px";

        beatmapImageContainer.style.borderRadius = coverRadiusVis;
        StyleMapText();
    }

    if (urlParams.has("hideStats")) { times.forEach(e => { e.parentElement.style.display = "none"; }); }
    if (urlParams.has("hideMapDetails")) { preBSRs.forEach(e => { e.parentElement.style.display = "none"; }); }
    if (urlParams.has("hideModifiersHealth")) { document.querySelectorAll(".IF").forEach(e => { e.parentElement.parentElement.style.display = "none"; }); }
})