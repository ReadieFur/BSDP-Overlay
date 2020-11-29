let StaticData;

window.addEventListener("load", () =>
{
    SetupElements();
});

function SetupElements()
{
    document.querySelectorAll(".progress").forEach(e =>
    {
        if (e.parentElement.classList.contains("roundBar")) { e.style.strokeDasharray = (e.parentElement.getBoundingClientRect().width / 2 - 10) * Math.PI * 2; }
    });
}

window.addEventListener("StaticDataUpdated", (data) =>
{
    StaticData = data.detail;

    document.querySelectorAll(".coverImage").forEach(e => { e.src = StaticData.coverImage; })

    document.querySelectorAll(".time").forEach(e =>
    {
        if (e.classList.contains("roundbar"))
        {
            let innerText = e.querySelector("div").children;
            innerText[0].innerHTML = "0:00";
            innerText[1].innerHTML = `${SecondsToMins(StaticData.Length)}`;
        }
        else if (e.classList.contains("straightbar")) { e.querySelector(".progress").style.width = "0%"; }
    });
})

window.addEventListener("LiveDataUpdated", (data) =>
{
    data = data.detail;

    document.querySelectorAll(".time").forEach(e =>
    {
        if (e.classList.contains("roundbar"))
        {
            let progress = e.querySelector(".progress");
            progress.style.strokeDashoffset = (1 - data.TimeElapsed / StaticData.Length) * progress.style.strokeDasharray;
            progress.setAttribute("value", data.TimeElapsed);
            e.querySelectorAll("div")[0].children[0].innerHTML = SecondsToMins(data.TimeElapsed);
        }
        else if (e.classList.contains("straightbar")) { e.querySelector(".progress").style.width = (data.TimeElapsed / StaticData.Length) * 100 + "%"; }
    });

    document.querySelectorAll(".health").forEach(e =>
    {
        if (e.classList.contains("roundbar")) { setProgressRing(e, data.PlayerHealth); }
        else if (e.classList.contains("straightbar")) { setStraightBar(e, data.PlayerHealth); }
    })

    document.querySelectorAll(".accuracy").forEach(e =>
    {
        if (e.classList.contains("roundbar")) { setProgressRing(e, data.Accuracy); }
        else if (e.classList.contains("straightbar")) { setStraightBar(e, data.Accuracy); }
    })

    //Internal functions
    function setProgressRing(e, d)
    {
        let progress = e.querySelectorAll(".progress")[0];
        progress.style.strokeDashoffset = (1 - d / 100) * progress.style.strokeDasharray;
        progress.setAttribute("value", d);
        e.querySelectorAll("div")[0].children[1].innerHTML = Math.trunc(d) + "%";
    }

    function setStraightBar(e, d) { e.querySelector(".progress").style.width = d + "%"; }
})

function SecondsToMins(seconds)
{
    let Mins = Math.floor(seconds / 60).toString();
    let Seconds = (seconds - (Math.floor(seconds / 60) * 60)).toString().padStart(2, "0");
    return `${Mins}:${Seconds}`;
}