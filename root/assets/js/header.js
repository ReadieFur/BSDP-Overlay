function highlightActivePage()
{
    var path = window.location.pathname.split("/").filter((el) => { return el != ""; });

    if (path.length == 1 && path[0] == "bsdp-overlay") { document.querySelector("#header").querySelectorAll("a")[2].className += " accentText"; }
    else
    {
        document.querySelector("#header").querySelectorAll("a").forEach(element =>
        {
            if(new RegExp(path.join("|")).test(element.innerHTML.replace(" ", "").replace("+", "").toLowerCase()))
            {
                if (!element.classList.contains("accentText"))
                {
                    element.classList.add("accentText");
                    let dropdownParent = element.parentElement.parentElement.parentElement.children[0];
                    if (dropdownParent.nodeName == "A") { dropdownParent.classList.add("accentText"); }
                }
            }
        });
    }
}
highlightActivePage();