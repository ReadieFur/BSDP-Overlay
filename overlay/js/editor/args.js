var unloadEditor = false;

window.addEventListener("load", () => //Unload editor is style is present, unless it is the owner. OR load it if style is not present
{
    document.body.style.zoom = urlParams.has("scale") ? urlParams.get("scale") : 1;

    let editorPanel = document.getElementById("editorPanel");
    if (urlParams.has("style"))
    {
        let oid = encodeURIComponent(urlParams.get("style"));
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", `overlay.php`, false);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(`method=Get&oid=${oid}`);

        if (xhttp.responseText == "null") { urlParams.delete("style"); window.location.replace("?" + urlParams.toString()); }
        else
        {
            let response = JSON.parse(xhttp.responseText);
            document.querySelector("#overlay").innerHTML += response.html;
            document.querySelector("#overlayName").value = response.oname;
            document.querySelector("#overlayDescription").value = response.comment;
            document.querySelector("#overlayPublic").checked = response.p == 1 ? true : false;
            document.querySelector("#overlayThumbnail").children[0].src = "data:image/png;base64," + btoa(
                new Uint8Array(response.b64)
                .reduce((bytedata, byte) => bytedata + String.fromCharCode(byte), '')
            );
            document.querySelectorAll(".resizable").forEach(e => { e.style.resize = "none"; })
        }

        if (READIE_UI != null || READIE_UP != null)
        {
            let unid = encodeURIComponent(READIE_UI);
            let pass = encodeURIComponent(READIE_UP);
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", `overlay.php`, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(`method=Verify&unid=${unid}&pass=${pass}&oid=${oid}`);

            if (xhttp.responseText == "false") { unloadEditor = true; document.getElementById("splash").innerHTML = null; }
            else { document.getElementById("splash").innerHTML += " open the editor"; }
        }
        else { unloadEditor = true; document.getElementById("splash").innerHTML = null; }

        window.addEventListener("loaded", () =>
        {
            editorPanel.style.transition = "none";
            editorPanel.style.display = "none";
            editorPanel.style.width = ".1px";
            editorPanel.style.transition = "all 100ms";
            editorOpen = false;
        })
    }
    else { document.getElementById("splash").innerHTML += " hide the editor"; }

    //if ((READIE_UI == null || READIE_UP == null) && !urlParams.has("style")) { document.querySelector("iframe").style.display = "block"; }
    if ((READIE_UI == null || READIE_UP == null) && !urlParams.has("style")) { window.location.replace(`https://api-readie.global-gaming.co/account/?redirect=${encodeURIComponent(window.location.href)}`); }
})