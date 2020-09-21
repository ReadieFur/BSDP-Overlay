var unloadEditor = false;

window.addEventListener("load", () => //Unload editor is style is present, unless it is the owner. OR load it if style is not present
{
    let splash = document.getElementById("splash");
    let editorPanel = document.getElementById("editorPanel");
    if (urlParams.has("style"))
    {
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
            else if (this.readyState == 4 && this.status != 200) { window.location.replace(window.location.origin + window.location.pathname); }
        }
        xhttp.send();

        let script = document.createElement("script");
        script.src = `public/${urlParams.get("style")}/script.js`;
        document.head.appendChild(script);

        if (READIE_UI != null || READIE_UP != null)
        {
            let unid = encodeURIComponent(READIE_UI);
            let pass = encodeURIComponent(READIE_UP);
            let oid = encodeURIComponent(urlParams.get("style"));
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", `overlay.php`, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(`method=Verify&unid=${unid}&pass=${pass}&oid=${oid}`);

            if (xhttp.responseText == "false") { unloadEditor = true; splash.innerHTML = null; }
            else { splash.innerHTML += " open the editor"; document.querySelector("#OverlayName").value = xhttp.responseText; }
        }
        else { unloadEditor = true; splash.innerHTML = null; }

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

    //if ((READIE_UI == null || READIE_UP == null) && !urlParams.has("style")) { document.querySelector("iframe").style.display = "block"; }
    if ((READIE_UI == null || READIE_UP == null) && !urlParams.has("style")) { window.location.replace(`https://api-readie.global-gaming.co/account/?redirect=${encodeURIComponent(window.location.href)}`); }
})