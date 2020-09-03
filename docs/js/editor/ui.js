window.addEventListener("load", () =>
{
    SetupElements();
    tmp();
});

function SetupElements()
{
    document.querySelectorAll(".roundBar").forEach(element =>
    {
        element.querySelectorAll(".progress").forEach(e =>
        {
            e.style.strokeDasharray = (element.getBoundingClientRect().width / 2 - 10) * Math.PI * 2;
        });
    });
}

function tmp()
{
    document.querySelectorAll(".mapTime").forEach(mapTime =>
        {
            if (mapTime.classList.contains("roundbar"))
            {
                let progressRing = mapTime.querySelectorAll(".progress")[0];
                progressRing.style.strokeDashoffset = (1 - 50 / 84) * progressRing.style.strokeDasharray;
    
                let mapTimeText = mapTime.querySelectorAll("div")[0].querySelectorAll("p");
                mapTimeText[0].innerHTML = "0:50";
                mapTimeText[1].innerHTML = "1:40";
            }
            else { mapTime.innerHTML = "ELAPSED"; }
        });
}