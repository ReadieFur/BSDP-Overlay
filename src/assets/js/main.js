window.addEventListener("DOMContentLoaded", () =>
{
    highlightActivePage();

    if (RetreiveCache("READIE-DARK") == "true") { switchTheme(true); }
    document.querySelector("#darkMode").addEventListener("click", () =>
    {
        let cachedValue = RetreiveCache("READIE-DARK");
        if (cachedValue == undefined || cachedValue == "false")
        { SetCache("READIE-DARK", "true", 365); switchTheme(true); }
        else { SetCache("READIE-DARK", "false", 365); switchTheme(false); }
    });
});

window.addEventListener("load", () =>
{
    let staticStyles = document.createElement("style");
    staticStyles.innerHTML = `
    *
    {
        transition: background-color ease 100ms;
    }`;
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

function switchTheme(dark)
{
    try
    {
        let darkButton = document.querySelector("#darkMode");
        let themeColours = document.querySelector("#themeColours");
        if (dark)
        {
            darkButton.classList.add("accentText");
            themeColours.innerHTML = `
            :root
            {
                --main-foreground: white;
                --main-foreground09: rgba(255, 255, 255, 0.9);
                --main-foreground05: rgba(255, 255, 255, 0.5);
                --main-foreground01: rgba(255, 255, 255, 0.1);
                --main-background: rgb(20, 20, 20);
                --main-background09: rgba(20, 20, 20, 0.9);
                --main-background05: rgba(20, 20, 20, 0.5);
                --main-background01: rgba(20, 20, 20, 0.1);
            }`;
        }
        else
        {
            darkButton.classList.remove("accentText");
            themeColours.innerHTML = `
            :root
            {
                --main-background: white;
                --main-background09: rgba(255, 255, 255, 0.9);
                --main-background05: rgba(255, 255, 255, 0.5);
                --main-background01: rgba(255, 255, 255, 0.1);
                --main-foreground: black;
                --main-foreground09: rgba(0, 0, 0, 0.9);
                --main-foreground05: rgba(0, 0, 0, 0.5);
                --main-foreground01: rgba(0, 0, 0, 0.1);
            }`;
        }
    }
    catch (err)
    {
        console.log("err");
    }
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
    let domain = "readie.global-gaming.co";
    //domain = "readie.global-gaming.localhost"; //Localhost testing
    var expDate = new Date();
    expDate.setDate(expDate.getDate() + time);
    document.cookie = `${cookie_name}=${value}; expires=${expDate.toUTCString()}; path=/; domain=${domain};`;
}