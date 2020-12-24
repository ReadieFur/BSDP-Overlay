window.addEventListener("DOMContentLoaded", () =>
{
    highlightActivePage();

    if (RetreiveCache("READIE-DARK") != "false") { darkTheme(true); }
    else { darkTheme(false); }
    document.querySelector("#darkMode").addEventListener("click", () =>
    {
        let cachedValue = RetreiveCache("READIE-DARK");
        if (cachedValue == undefined || cachedValue == "false") { darkTheme(true); }
        else { darkTheme(false); }
    });
});

window.addEventListener("load", () =>
{
    let staticStyles = document.createElement("style");
    staticStyles.innerHTML = `* { transition: background-color ease 100ms; }`;
    document.head.appendChild(staticStyles);
});

function highlightActivePage()
{
    let path = window.location.pathname.split("/").filter((el) => { return el != ""; });
    for (let i = 0; i < path.length; i++) { path[i] = path[i].replace("_", ""); }
    
    document.querySelector("#header").querySelectorAll("a").forEach(element =>
    {
        if (element.href == window.location.href)
        {
            element.classList.add("accentText");
            try
            {
                let whyIsThisSoFarBack = element.parentElement.parentElement.parentElement;
                if (whyIsThisSoFarBack.classList.contains("naviDropdown")) { whyIsThisSoFarBack.firstElementChild.classList.add("accentText"); }
            }
            catch (error) { /*console.error(error);*/ }
        }
    });
}

function darkTheme(dark)
{
    try
    {
        SetCache("READIE-DARK", dark ? "true" : "false", 365);
        let darkButton = document.querySelector("#darkMode");
        let themeColours = document.querySelector("#themeColours");
        if (dark) { darkButton.classList.add("accentText"); }
        else { darkButton.classList.remove("accentText"); }
        themeColours.innerHTML = `
            :root
            {
                --foreground: ${dark ? "white" : "black"};
                --background: rgb(${dark ? "13, 17, 23" : "255, 255, 255"});
                --backgroundAlt: rgb(${dark ? "22, 27, 34" : "225, 225, 225"});
            }
        `;
    }
    catch (err) { console.log(err); }
}

function RetreiveCache(cookie_name)
{
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++)
    {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == cookie_name) { return unescape(y); }
    }
}

function SetCache(cookie_name, value, time)
{
    let hostSplit = window.location.host.split("."); //Just for localhost testing
    let domain = `readie.global-gaming.${hostSplit[hostSplit.length - 1]}`; 
    var expDate = new Date();
    expDate.setDate(expDate.getDate() + time);
    document.cookie = `${cookie_name}=${value}; expires=${expDate.toUTCString()}; path=/; domain=${domain};`;
}