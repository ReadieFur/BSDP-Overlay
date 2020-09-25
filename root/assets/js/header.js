//JQuery After DOM finsihed loading
$(() =>
{
    highlightActivePage();

    if (RetreiveCache("READIE-DARK") == "true") { switchTheme(true); }
    document.querySelector("#darkMode").addEventListener("click", () =>
    {
        let cachedValue = RetreiveCache("READIE-DARK");
        if (cachedValue == undefined || cachedValue == "false")
        { SetCache("READIE-DARK", "true", 365); switchTheme(true); }
        else { SetCache("READIE-DARK", "false", 365); switchTheme(false); }
    })
});

function highlightActivePage() //This one is not dynamic for BSDP-Overlay, my folder layout made this a lot harder to be dynamic so it is mostly hardcoded
{
    let path = window.location.pathname.split("/").filter((el) => { return el != ""; });
    let headerA = document.querySelector("#header").querySelectorAll("a");
    console.log();

    if (path.length == 1 && path[0] == "bsdp-overlay") { headerA[1].classList.add("accentText"); }
    if (path.length == 2 && path[1] == "overlay") { headerA[2].classList.add("accentText"); }
    else
    {
        headerA.forEach(element =>
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