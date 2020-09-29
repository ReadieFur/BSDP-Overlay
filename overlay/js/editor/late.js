window.addEventListener("load", () => { window.dispatchEvent(new CustomEvent("loaded")); })

window.addEventListener("loaded", () =>
{
    var style = document.createElement("link");
    style.rel = "stylesheet";
    style.setAttribute("href", "../css/editor/late.css");
    document.head.appendChild(style);

    document.querySelector("#saveOverlayContainer").style.opacity = 0;
    document.querySelector("#saveOverlayContainer").style.display = "none";

    //#region All loading complete
    setTimeout(() =>
    {
        let loading = document.querySelector("#loading");
        loading.style.opacity = 0;
        setTimeout(() => { loading.style.display = "none"; }, 500);
    }, 500);

    setTimeout(() =>
    {
        splash = document.getElementById("splash"); //Splash defined in args.js
        splash.style = "transition: opacity 1000ms; opacity: 0;";
        setTimeout(() => { splash.style.display = "none"; }, 1000);
    }, 2000);
    //#endregion
})

window.addEventListener("message", event =>
{
    if (event.origin.includes("readie.global-gaming.co"))
    {
        if (RetreiveCache("READIE-UI") != null && RetreiveCache("READIE-UP") != null && event.data.AccountWindowClose == true)
        { document.querySelector("iframe").style.display = "none"; }
        if (event.data.LoginSuccessful == true)
        {
            READIE_UI = RetreiveCache("READIE-UI");
            READIE_UN = RetreiveCache("READIE-UN");
            READIE_UP = RetreiveCache("READIE-UP");
        }
    }
});