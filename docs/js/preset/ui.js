//This is partially using methods that will bue used in my upcoming overlay editor. Once that has been created this may no longer be the same.
let mapLength;

var topCurve = "0px 10px 0px 0px";
var bottomCurve = "0px 0px 10px 0px";
var bothCurve = "0px 10px 10px 0px";
var noCurve = "0px";
var coverRadiusHid = "10px 10px 0px 10px";
var coverRadiusVis = "0px 10px 0px 10px";

var beatmapImageContainer;
var bsr;
var mapper;
var artist;
var songName;

window.addEventListener("load", () =>
{
    /*setTimeout(() =>
    {
        document.getElementById("splash").style = "transition: all 1000ms; opacity: 0;";
        setTimeout(() => { splash.style.display = "none"; }, 1000);
    }, 1000);*/

    //window.addEventListener("dblclick", () => { window.location = "/editor"; });
})

window.addEventListener("StaticDataUpdated", (data) =>
{
    data = data.detail;

    //#region mapInfo
    beatmapImages.forEach(e => { e.src = data.coverImage == null ? "assets/BeatSaberIcon.jpg" : data.coverImage; });
    BSRs.forEach(e =>
    {
        if (data.BSRKey == null) { e.style.display = "none"; }
        else { e.style.display = "block"; e.innerHTML = `BSR: ${data.BSRKey}`; }
    });
    mappers.forEach(e => { e.innerHTML = data.Mapper == null ? "Mapper" : data.Mapper; });
    artists.forEach(e => { e.innerHTML = data.SongAuthor == null ? "ArtistName" : data.SongAuthor; });
    songNames.forEach(e => { e.innerHTML = data.SongName == null ? "SongName" : data.SongName; });
    preBSRs.forEach(e =>
    {
        if (data.PreviousBSR == null)
        {
            e.style.display = "none";
            beatmapImageContainer.style.borderRadius = coverRadiusHid;
        }
        else
        {
            e.innerHTML = `Pre BSR: ${data.PreviousBSR}`;
            e.style.display = "block";
            beatmapImageContainer.style.borderRadius = coverRadiusVis;
        }
    });
    StyleMapText();
    //#endregion

    //#region modifiersHealth
    for (let [key, value] of Object.entries(data.Modifiers))
    {
        ModifiersShort[key].forEach(e => { e.style.color = value ? "white" : "rgba(80, 80, 80, 0.8)"; });
    }
    //#endregion

    times.forEach(e => { e.innerHTML = `00:00/${mapLength = SecondsToMins(data.Length)}`; });
})

window.addEventListener("LiveDataUpdated", (data) =>
{
    data = data.detail;
    times.forEach(e => { e.innerHTML = `${SecondsToMins(data.TimeElapsed)}/${mapLength}`; });
    scores.forEach(e => { e.innerHTML = data.Score.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ','); });
    accuracies.forEach(e => { e.innerHTML = `${Math.round((data.Accuracy + Number.EPSILON) * 10) / 10}%`; });
    combos.forEach(e => { e.innerHTML = data.Combo.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ','); });
    healthBars.forEach(e => { e.style.height = `${data.PlayerHealth}%`});
})

function SecondsToMins(seconds)
{
    let Mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    let Seconds = (seconds - (Math.floor(seconds / 60) * 60)).toString().padStart(2, "0");
    return `${Mins}:${Seconds}`;
}

function StyleMapText()
{
    switch(urlParams.has("flipVert"))
    {
        case true:
            //Song style
            if (songName.clientWidth < artist.clientWidth) { songName.style.borderRadius = topCurve; } //Self < Top
            else { songName.style.borderRadius = bothCurve; }

            //Artist style
            if (artist.clientWidth > songName.clientWidth && artist.clientWidth > mapper.clientWidth) { artist.style.borderRadius = bothCurve; } //Self > Bottom & Self > Top
            else if (artist.clientWidth < songName.clientWidth && artist.clientWidth > mapper.clientWidth) { artist.style.borderRadius = bottomCurve; } //Self < Bottom & Self > Top
            else if (artist.clientWidth > songName.clientWidth && artist.clientWidth < mapper.clientWidth) { artist.style.borderRadius = topCurve; } //Self > Bottom & Self < Top
            else { artist.style.borderRadius = noCurve; }

            //Mapper style
            if (mapper.clientWidth > artist.clientWidth && mapper.clientWidth > bsr.clientWidth) { mapper.style.borderRadius = bothCurve; } //Self > Bottom & Self > Top
            else if (mapper.clientWidth < artist.clientWidth && mapper.clientWidth > bsr.clientWidth) { mapper.style.borderRadius = bottomCurve; } //Self < Bottom & Self > Top
            else if (mapper.clientWidth > artist.clientWidth && mapper.clientWidth < bsr.clientWidth) { mapper.style.borderRadius = topCurve; } //Self > Bottom & Self < Top
            else { mapper.style.borderRadius = noCurve; }
        
            //BSR style
            if (bsr.clientWidth < mapper.clientWidth) { bsr.style.borderRadius = bottomCurve; } //Self < Bottom
            else { bsr.style.borderRadius = bothCurve; }
            break;

        case false:
            //Song style
            if (songName.clientWidth < artist.clientWidth) { songName.style.borderRadius = bottomCurve; } //Self < Top
            else { songName.style.borderRadius = bothCurve; }

            //Artist style
            if (artist.clientWidth > songName.clientWidth && artist.clientWidth > mapper.clientWidth) { artist.style.borderRadius = bothCurve; } //Self > Bottom & Self > Top
            else if (artist.clientWidth < songName.clientWidth && artist.clientWidth > mapper.clientWidth) { artist.style.borderRadius = topCurve; } //Self < Bottom & Self > Top
            else if (artist.clientWidth > songName.clientWidth && artist.clientWidth < mapper.clientWidth) { artist.style.borderRadius = bottomCurve; } //Self > Bottom & Self < Top
            else { artist.style.borderRadius = noCurve; }

            //Mapper style
            if (mapper.clientWidth > artist.clientWidth && mapper.clientWidth > bsr.clientWidth) { mapper.style.borderRadius = bothCurve; } //Self > Bottom & Self > Top
            else if (mapper.clientWidth < artist.clientWidth && mapper.clientWidth > bsr.clientWidth) { mapper.style.borderRadius = topCurve; } //Self < Bottom & Self > Top
            else if (mapper.clientWidth > artist.clientWidth && mapper.clientWidth < bsr.clientWidth) { mapper.style.borderRadius = bottomCurve; } //Self > Bottom & Self < Top
            else { mapper.style.borderRadius = noCurve; }
        
            //BSR style
            if (bsr.clientWidth < mapper.clientWidth) { bsr.style.borderRadius = topCurve; } //Self < Bottom
            else { bsr.style.borderRadius = bothCurve; }
            break;
    }
}