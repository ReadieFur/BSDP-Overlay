window.addEventListener("load", () => { window.dispatchEvent(new CustomEvent("loaded")); })

window.addEventListener("loaded", () =>
{
    var style = document.createElement("link");
    style.rel = "stylesheet";
    style.setAttribute("href", "../css/editor/late.css");
    document.head.appendChild(style);
})