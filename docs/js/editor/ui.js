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
    data = data.detail;

    times.forEach(e =>
    {
        if (e.classList.contains("roundbar"))
        {
            let innerText = e.querySelectorAll("div")[0].children;
            innerText[0].innerHTML = "0:00";
            innerText[1].innerHTML = `${SecondsToMins(mapLength = data.Length)}`;
        }
    });
})

window.addEventListener("LiveDataUpdated", (data) =>
{
    data = data.detail;

    times.forEach(e =>
    {
        if (e.classList.contains("roundbar"))
        {
            let progress = e.querySelectorAll(".progress")[0];
            progress.style.strokeDashoffset = (1 - data.TimeElapsed / mapLength) * progress.style.strokeDasharray;
            e.querySelectorAll("div")[0].children[0].innerHTML = SecondsToMins(data.TimeElapsed);
        }
    });

    healths.forEach(e =>
    {
        if (e.classList.contains("roundbar")) { setProgressRing(e, data.PlayerHealth) }
    })

    accuracies.forEach(e =>
    {
        if (e.classList.contains("roundbar")) { setProgressRing(e, data.Accuracy) }
    })

    //Internal functions
    function setProgressRing(e, d)
    {
        let progress = e.querySelectorAll(".progress")[0];
        progress.style.strokeDashoffset = (1 - d / 100) * progress.style.strokeDasharray;
        e.querySelectorAll("div")[0].children[1].innerHTML = Math.trunc(d) + "%";
    }
})

function SecondsToMins(seconds)
{
    let Mins = Math.floor(seconds / 60).toString();
    let Seconds = (seconds - (Math.floor(seconds / 60) * 60)).toString().padStart(2, "0");
    return `${Mins}:${Seconds}`;
}