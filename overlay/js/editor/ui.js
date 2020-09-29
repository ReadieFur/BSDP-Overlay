var StaticData;
var LiveData;

window.addEventListener("load", () =>
{
    SetupElements();
});

function SetupElements()
{
    document.querySelectorAll(".progress").forEach(e => { e.style.strokeDasharray = (e.parentElement.getBoundingClientRect().width / 2 - 10) * Math.PI * 2; });
}

let mapLength;

window.addEventListener("StaticDataUpdated", (data) =>
{
    StaticData = data.detail;

    document.querySelectorAll(".coverImage").forEach(e => { e.src = StaticData.coverImage; })

    document.querySelectorAll(".time").forEach(e =>
    {
        if (e.classList.contains("roundbar"))
        {
            let innerText = e.querySelectorAll("div")[0].children;
            innerText[0].innerHTML = "0:00";
            innerText[1].innerHTML = `${SecondsToMins(mapLength = StaticData.Length)}`;
        }
    });
})

window.addEventListener("LiveDataUpdated", (data) =>
{
    LiveData = data.detail;

    document.querySelectorAll(".time").forEach(e =>
    {
        if (e.classList.contains("roundbar"))
        {
            let progress = e.querySelectorAll(".progress")[0];
            progress.style.strokeDashoffset = (1 - LiveData.TimeElapsed / mapLength) * progress.style.strokeDasharray;
            progress.setAttribute("value", LiveData.TimeElapsed);
            e.querySelectorAll("div")[0].children[0].innerHTML = SecondsToMins(LiveData.TimeElapsed);
        }
    });

    document.querySelectorAll(".health").forEach(e =>
    {
        if (e.classList.contains("roundbar")) { setProgressRing(e, LiveData.PlayerHealth); }
    })

    document.querySelectorAll(".accuracy").forEach(e =>
    {
        if (e.classList.contains("roundbar")) { setProgressRing(e, LiveData.Accuracy); }
    })

    //Internal functions
    function setProgressRing(e, d)
    {
        let progress = e.querySelectorAll(".progress")[0];
        progress.style.strokeDashoffset = (1 - d / 100) * progress.style.strokeDasharray;
        progress.setAttribute("value", d);
        e.querySelectorAll("div")[0].children[1].innerHTML = Math.trunc(d) + "%";
    }
})

function SecondsToMins(seconds)
{
    let Mins = Math.floor(seconds / 60).toString();
    let Seconds = (seconds - (Math.floor(seconds / 60) * 60)).toString().padStart(2, "0");
    return `${Mins}:${Seconds}`;
}