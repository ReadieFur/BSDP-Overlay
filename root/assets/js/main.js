window.addEventListener('DOMContentLoaded', (event) =>
{
    var head = document.querySelector("#head");
    $.ajax(
    {
        url: "/bsdp-overlay/assets/html/head.html",
        dataType: "html",
        success: (data) => { head.innerHTML = head.innerHTML + data; }
    });
    $("#header").load("/bsdp-overlay/assets/html/header.html");
    $("#footer").load("/bsdp-overlay/assets/html/footer.html");
});

function RetreiveCache(cookie_name)
{
    var i, x , y, ARRcookies = document.cookie.split(";");
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
    let domain = ".global-gaming.co";
    var expDate = new Date();
    expDate.setDate(expDate.getDate() + time);
    document.cookie = `${cookie_name}=${value}; expires=${expDate.toUTCString()}; path=/; domain=${domain};`;
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