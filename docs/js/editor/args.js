window.addEventListener("load", () =>
{
    let splash = document.getElementById("splash");
    let editorPanel = document.getElementById("editorPanel");
    if (urlParams.has("style"))
    {
        splash.innerHTML += " open the editor";
        editorPanel.style.transition = "none";
        editorPanel.style.display = "none";
        editorPanel.style.width = ".1px";
        editorPanel.style.transition = "all 100ms";
        editorOpen = false;
    }
    else
    {
        splash.innerHTML += " hide the editor";
        document.querySelectorAll(".moveable").forEach(e => { dragElement(e); });
    }
    setTimeout(() =>
    {
        splash.style = "transition: all 1000ms; opacity: 0;";
        setTimeout(() => { splash.style.display = "none"; }, 1000);
    }, 1000);
})