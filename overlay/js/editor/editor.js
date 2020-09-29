let editorOpen = true;
let elementEditor = [];
let selectedElement;
let overlay = [];

window.addEventListener("load", () => { InitaliseEditor(); });

window.onresize = resizeWindowEvent;

function resizeWindowEvent()
{
    let overlayProperties = overlay.el.getBoundingClientRect();
    overlay.width = overlayProperties.width;
    overlay.height = overlayProperties.height;
}

function InitaliseEditor()
{
    window.dispatchEvent(new CustomEvent("NewElement", { detail: null }));
    let observer = new MutationObserver((mutations) => { window.dispatchEvent(new CustomEvent("NewElement", { detail: null })); });
    observer.observe(document.getElementById("overlay"), {childList: true});

    let editorPanel = document.getElementById("editorPanel");
    overlay.el = document.getElementById("overlay");

    editorPanel.querySelectorAll("*").forEach(e =>
    {
        let elementCss = window.getComputedStyle(e);
        if (elementCss["min-width"] != "0px") { e.style.width = elementCss["min-width"]; }
        if (elementCss["min-height"] != "0px") { e.style.height = elementCss["min-height"]; }
    })

    resizeWindowEvent();

    document.getElementById("editorElements").querySelectorAll("tr").forEach(e =>
    {
        var cells = -3;
        var slideIndex = 0;
        e.querySelectorAll("td").forEach(el =>
        {
            if (el.classList.contains("button"))
            {
                el.onclick = function()
                {
                    if (el.innerHTML == "❮")
                    {
                        e.querySelectorAll("td")[slideIndex + 1].style.display = "none";
                        slideIndex = slideIndex == 0 ? cells : slideIndex - 1;
                        e.querySelectorAll("td")[slideIndex + 1].style.display = "table-cell";
                    }
                    else if ((el.innerHTML == "❯"))
                    {
                        e.querySelectorAll("td")[slideIndex + 1].style.display = "none";
                        slideIndex = slideIndex == cells ? 0 : slideIndex + 1;
                        e.querySelectorAll("td")[slideIndex + 1].style.display = "table-cell";
                    }
                }
            }
            else if (!el.classList.contains("placeholder"))
            {
                el.ondblclick = function()
                {
                    let noMove = el.children[0].classList.contains("noMove");
                    let noResize = el.children[0].classList.contains("noResize");

                    let childElementCss = window.getComputedStyle(el.children[0]);
                    let container = document.createElement("div");
                    container.className = noMove ? "" : " moveable";
                    container.className += noResize ? "" : " resizable";
                    container.style =`
                        min-width: ${childElementCss["min-width"]};
                        min-height: ${childElementCss["min-height"]};
                        left: 45%;
                        top: 45%;`;
                    container.innerHTML = el.innerHTML;
                    overlay.el.appendChild(container);
                    dragElement(container);
                    UpdateElementEditor(container);
                }
            }
            cells++;
        });
    });

    let elementPosition = document.querySelectorAll(".elementPosition")[0].querySelectorAll("td");
    elementEditor.left = elementPosition[1].firstChild;
    elementEditor.right = elementPosition[3].firstChild;
    elementEditor.top = elementPosition[5].firstChild;
    elementEditor.bottom = elementPosition[7].firstChild;
    elementEditor.left.oninput = () => { UpdateElementPosition("left"); };
    elementEditor.right.oninput = () => { UpdateElementPosition("right"); };
    elementEditor.top.oninput = () => { UpdateElementPosition("top"); };
    elementEditor.bottom.oninput = () => { UpdateElementPosition("bottom"); };
    function UpdateElementPosition(toSet)
    {
        let opposite;
        switch(toSet)
        {
            case "left": opposite = "right"; break;
            case "right": opposite = "left"; break;
            case "top": opposite = "bottom"; break;
            default: opposite = "top"; break;
        }

        let bcr = selectedElement.getBoundingClientRect();
        if (elementEditor[toSet].value < 0) { elementEditor[toSet].value = 0; }
        if ((toSet == "left" || toSet == "right") && elementEditor[toSet].value > overlay.width - bcr.width) { elementEditor[toSet].value = overlay.width - bcr.width; }
        if ((toSet == "top" || toSet == "bottom") && elementEditor[toSet].value > overlay.height - bcr.height) { elementEditor[toSet].value = overlay.height - bcr.height; }

        selectedElement.style[opposite] = "unset";
        elementEditor[opposite].value = null;
        selectedElement.style[toSet] = elementEditor[toSet].value + "px";
    }

    let TestBackground = document.querySelector("#TestBackground");
    TestBackground.oninput = function()
    {
        if (TestBackground.checked) { overlay.el.style.backgroundImage = "url(../assets/TestBackground.jpg)"; }
        else { overlay.el.style.backgroundImage = "none"; }
    }

    overlay.el.addEventListener("dblclick", () =>
    {
        if (!unloadEditor)
        {
            if (editorOpen)
            {
                overlay.el.style.backgroundImage = "none";
                editorPanel.style.width = ".1px";
                setTimeout(() => { editorPanel.style.display = "none"; }, 100);
                document.querySelectorAll(".moveable").forEach(e => { disableDragElement(e); });
            }
            else
            {
                editorPanel.style.display = "table-cell";
                setTimeout(() =>
                {
                    if (TestBackground.checked) { overlay.el.style.backgroundImage = "url(../assets/TestBackground.jpg)"; }
                    editorPanel.style.width = "250px";
                    setTimeout(() =>
                    {
                        resizeWindowEvent();
                        document.querySelectorAll(".moveable").forEach(e => { dragElement(e); });
                    }, 100);
                }, 100);
            }
    
            editorOpen = !editorOpen;
        }
    });

    document.querySelector("#saveOverlayContainer").children[1].addEventListener("click", () =>
    {
        document.querySelector("#saveOverlayContainer").style.opacity = 0;
        setTimeout(() => { document.querySelector("#saveOverlayContainer").style.display = "none"; }, 100);
    })

    document.querySelector("#SaveOverlay").onclick = function()
    {
        let overlayClone = document.createElement("div");
        overlayClone.id = "overlayClone";
        overlayClone.innerHTML = overlay.el.innerHTML;
        document.body.appendChild(overlayClone);

        domtoimage.toPng(overlayClone, { width: 1280, height: 720, windowWidth: 1280, windowHeight: 720 })
        .then(function (dataUrl)
        {
            document.body.removeChild(overlayClone);
            document.getElementById("overlayThumbnail").children[0].src = dataUrl;
            document.querySelector("#saveOverlayContainer").style.opacity = 0;
            document.querySelector("#saveOverlayContainer").style.display = "block";
            setTimeout(() => { document.querySelector("#saveOverlayContainer").style.opacity = 1; }, 100);
        })
        .catch(function (error) { console.error(error); });
    }

    document.querySelector("#save").onclick = function()
    {
        let overlayName = document.querySelector("#overlayName");
        let overlayDescription = document.querySelector("#overlayDescription");
        if (READIE_UI == null || READIE_UP == null) { document.querySelector("iframe").style.display = "block"; }
        else if (overlayName.value == "" || overlayDescription.value == "") { alert("Please fill out all the fields."); }
        else
        {
            let unid = encodeURIComponent(READIE_UI);
            let pass = encodeURIComponent(READIE_UP);
            let oid = encodeURIComponent(urlParams.get("style"));
            overlayName = encodeURIComponent(overlayName.value);
            overlayDescription = encodeURIComponent(overlayDescription.value);
            let p = document.querySelector("#overlayPublic").checked ? "1" : "0";
            let html = encodeURIComponent(overlay.el.innerHTML.split("<!--Custom overlays begin below-->")[1].replace(/(?<=\>)\s*(?=\<)/gm, "")); //Place MOST text on one line (remove whitespace) outside of tags
            let css = encodeURIComponent(""); //Not implemented yet
            let js = encodeURIComponent(""); //Not implemented yet
            let b64imagedata = atob(document.querySelector("#overlayThumbnail").children[0].src.split(",")[1]); //Thanks UnskilledFreak
            let byteArray = new Array(b64imagedata.length); //Create the char array with same size
            for (let i = 0; i < b64imagedata.length; i++) { byteArray[i] = b64imagedata.charCodeAt(i); }
            let thumbnail = new Uint8Array(byteArray);

            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", `overlay.php`, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(`method=Save&unid=${unid}&pass=${pass}&oid=${oid}&oname=${overlayName}&comment=${overlayDescription}&public=${p}&html=${html}&css=${css}&js=${js}&b64=${thumbnail}`);
                
            if (xhttp.responseText.includes("<br />") || xhttp.responseText.startsWith("Err"))
            {
                console.log("Error creating overlay: response: " + xhttp.responseText);
                //Alert user of overlay creation error
            }
            else
            {
                //Alert user of sucessful overlay creation
                urlParams.set("style", xhttp.responseText);
                window.history.pushState(xhttp.responseText, `BSDP Overlay | Editor`, "?" + urlParams.toString());
            }
        }
    }
}

//Modified from https://www.w3schools.com/howto/howto_js_draggable.asp
var elBottom = null, elRight = null;
function dragElement(el) //Work percentages into it, perhapse bydefault after the first half of the quadrent it is being dragged in
{
    var xChange = 0, yChange = 0, mouseX = 0, mouseY = 0;
    el.onmousedown = dragMouseDown;
    el.style.resize = "both";

    function dragMouseDown(e)
    {
        UpdateElementEditor(el);
        el.style.left = el.offsetLeft + "px";
        el.style.top = el.offsetTop + "px";
        el.style.right = "unset";
        el.style.bottom = "unset";

        //Get the mouse cursor position at startup:
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmouseup = closeDragElement;
        //Call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e)
    {
        //Calculate the new cursor position:
        xChange = - (mouseX - e.clientX);
        yChange = - (mouseY - e.clientY);
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (e.clientX - el.getBoundingClientRect().x < el.getBoundingClientRect().width - 15 && e.clientY - el.getBoundingClientRect().y < el.getBoundingClientRect().height - 15)
        {
            if (mouseX > 250 && mouseX - 250 < overlay.width) //Make sure mouse cannot drag elements into the editor panel
            {
                if (mouseX - 250 > overlay.width / 2)
                {
                    elementEditor.left.value = null;
                    elementEditor.right.value = elRight = offsetRight(el);
                }
                else
                {
                    elementEditor.right.value = elRight = null;
                    elementEditor.left.value = el.offsetLeft;
                }
                el.style.left = el.offsetLeft + xChange + "px";
            }
    
            if (mouseY > 0 && mouseY < overlay.height)
            {
                if (mouseY > overlay.height / 2)
                {
                    elementEditor.top.value = null;
                    elementEditor.bottom.value = elBottom = offsetBottom(el);
                }
                else
                {
                    elementEditor.bottom.value = elBottom = null;
                    elementEditor.top.value = el.offsetTop;
                }
                el.style.top = el.offsetTop + yChange + "px";
            }
        }
        else if (el.classList.contains("resizable"))
        {
            //let bcr = el.getBoundingClientRect();
            el.style.height = el.style.width;
            el.children[0].style.width = el.style.width;
            el.children[0].style.height = el.style.width;
            //el.children[0].style.height = Math.round((bcr.width / bcr.height) * bcr.width) + "px";
            el.dispatchEvent(new CustomEvent("ElementResized", { detail: null }));
        }
    }
      
    function closeDragElement()
    {
        //Stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;

        if (elRight != null)
        {
            el.style.right = elRight + "px";
            el.style.left = "unset";
        }
        if (elBottom != null)
        {
            el.style.bottom = elBottom + "px";
            el.style.top = "unset";
        }

        UpdateElementEditor(el);
    }
}

function disableDragElement(e) { e.onmousedown = null; e.style.resize = "none"; }

//Try to make ELEMENT.offsetRight a global function
function UpdateElementEditor(e)
{
    selectedElement = e;

    if (selectedElement.offsetLeft < 0) { selectedElement.style.left = "0px"; }
    else if (offsetRight(selectedElement) < 0) { selectedElement.style.right = "0px"; }
    if (selectedElement.offsetTop < 0) { selectedElement.style.top = "0px"; }
    else if (offsetBottom(selectedElement) < 0) { selectedElement.style.bottom = "0px"; }

    if (elRight == null) { elementEditor.left.value = selectedElement.offsetLeft; }
    else { elementEditor.right.value = offsetRight(selectedElement); }
    if (elBottom == null) { elementEditor.top.value = selectedElement.offsetTop; }
    else { elementEditor.bottom.value = offsetBottom(selectedElement); }
}

function offsetRight(e) { return e.parentElement.getBoundingClientRect().width - (e.offsetLeft + e.getBoundingClientRect().width); }
function offsetBottom(e) { return e.parentElement.getBoundingClientRect().height - (e.offsetTop + e.getBoundingClientRect().height); }

window.addEventListener("NewElement", () =>
{
    document.querySelectorAll(".roundbar").forEach(e =>
    {
        e.parentElement.addEventListener("ElementResized", () =>
        {
            let bcr = e.getBoundingClientRect();
            e.children[1].style.width = e.style.width;
            e.children[1].style.height = e.style.height;

            let circles = e.querySelectorAll(".remaining, .progress");
            let c = e.getBoundingClientRect().width / 2;
            circles.forEach(el =>
            {
                el.setAttribute("cx", c);
                el.setAttribute("cy", c);
                el.setAttribute("r", c - 10);
            })

            circles[1].style.transition = "none";
            circles[1].style.strokeDasharray = (circles[1].parentElement.getBoundingClientRect().width / 2 - 10) * Math.PI * 2;
            //let d = Math.round(-(circles[1].style.strokeDashoffset / circles[1].style.strokeDasharray - 1) * 100); //Calculation would only work for upscaling (most of the time)
            circles[1].style.strokeDashoffset = (1 - circles[1].getAttribute("value") / 100) * circles[1].style.strokeDasharray;
            circles[1].style.transition = ".2s all";
        })
    })
})

window.addEventListener("loaded", () =>
{
    //#region Test data
    let staticTestData = `{
        "SongName": "SongName",
        "SongSubName": "SongSubName",
        "SongAuthor": "ArtistName",
        "Mapper": "Mapper",
        "BSRKey": "2946",
        "coverImage": "http://u-readie.global-gaming.co/bsdp-overlay/assets/BeatSaberIcon.jpg",
        "Length": 123,
        "Difficulty": 6,
        "BPM": 180,
        "NJS": 21.3,
        "Modifiers":
        {
            "noFail": true
        },
        "PracticeMode": true,
        "PracticeModeModifiers":
        {
            "songSpeedMul": 120
        },
        "PreviousRecord": 1204680,
        "PreviousBSR": 1234
    }`

    let liveTestData = `{
        "InLevel": true,
        "LevelPaused": false,
        "LevelFinished": false,
        "LevelQuit": false,
        "Score": 3480,
        "FullCombo": true,
        "Combo": 7,
        "Misses": 4,
        "Accuracy": 94.6,
        "BlockHitScores": [],
        "PlayerHealth": 63,
        "TimeElapsed": 32
    }`

    window.dispatchEvent(new CustomEvent(`StaticDataUpdated`, { detail: JSON.parse(staticTestData) }));
    window.dispatchEvent(new CustomEvent(`LiveDataUpdated`, { detail: JSON.parse(liveTestData) }));
    //#endregion
})