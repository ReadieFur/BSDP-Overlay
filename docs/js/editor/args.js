window.addEventListener("load", () =>
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
});

/*if (mouseX - 250 < overlayWidth / 2)
        {
            elLeft = true;
        }
        else
        {
            elLeft = false;
            //elmnt.style.left = "unset";
            //elmnt.style.right = (Math.round((overlayWidth / 2) - ((mouseX - 200) - (overlayWidth / 2))) + pos1) + "px";
        }
        if (mouseY < overlayHeight / 2)
        {
            //elmnt.style.bottom = "unset";
            //elmnt.style.top = (elmnt.offsetTop + yChange) + "px";
        }
        else
        {
            //elmnt.style.top = "unset";
            //elmnt.style.bottom = (elmnt.offsetBottom + yChange) + "px";
        }*/