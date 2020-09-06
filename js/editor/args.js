window.addEventListener("load", () =>
{
    let splash = document.getElementById("splash");
    let editorPanel = document.getElementById("editorPanel");
    if (urlParams.has("style"))
    {
        splash.innerHTML += " open the editor";

        let styles = document.createElement("link");
        styles.rel = "stylesheet";
        styles.href = `public/${urlParams.get("style")}/styles.css`;
        document.head.appendChild(styles);

        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", `public/${urlParams.get("style")}/html.txt`);
        xhttp.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                document.querySelector("#overlay").innerHTML += this.responseText;
                document.querySelectorAll(".moveable").forEach(e => { e.style.resize = "none"; })
            }
        }
        xhttp.send();

        let script = document.createElement("script");
        script.src = `public/${urlParams.get("style")}/script.js`;
        document.head.appendChild(script);

        window.addEventListener("loaded", () =>
        {
            editorPanel.style.transition = "none";
            editorPanel.style.display = "none";
            editorPanel.style.width = ".1px";
            editorPanel.style.transition = "all 100ms";
            editorOpen = false;
        })
    }
    else { splash.innerHTML += " hide the editor"; }
    setTimeout(() =>
    {
        splash = document.getElementById("splash");
        splash.style = "transition: all 1000ms; opacity: 0;";
        setTimeout(() => { splash.style.display = "none"; }, 1000);
    }, 1000);
})