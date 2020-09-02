let editorOpen = true;
let elementEditor = [];
let selectedElement;
let overlayWidth;
let overlayHeight;
let overlay;

window.addEventListener("load", () =>
{
    InitaliseEditor();
    SetupElements();
});

window.onresize = resizeWindowEvent;

function resizeWindowEvent()
{
    let overlayProperties = overlay.getBoundingClientRect();
    overlayWidth = overlayProperties["width"];
    overlayHeight = overlayProperties["height"];
}

function InitaliseEditor()
{
    let editorPanel = document.querySelectorAll(".editorPanel")[0];
    overlay = document.querySelectorAll(".overlay")[0];
    let moveableElements = document.querySelectorAll(".moveable");

    resizeWindowEvent();

    elementEditor["left"] = document.querySelectorAll(".elementPosition")[0].querySelectorAll("td")[1].firstChild;
    elementEditor["right"] = document.querySelectorAll(".elementPosition")[0].querySelectorAll("td")[3].firstChild;
    elementEditor["top"] = document.querySelectorAll(".elementPosition")[0].querySelectorAll("td")[5].firstChild;
    elementEditor["bottom"] = document.querySelectorAll(".elementPosition")[0].querySelectorAll("td")[7].firstChild;

    elementEditor["left"].oninput = function() //Minimise with function
    {
        selectedElement.style.right = "unset";
        elementEditor["right"].value = null;
        selectedElement.style.left = elementEditor["left"].value + "px";
    }
    elementEditor["right"].oninput = function()
    {
        selectedElement.style.left = "unset";
        elementEditor["left"].value = null;
        selectedElement.style.right = elementEditor["right"].value + "px";
    }
    elementEditor["top"].oninput = function()
    {
        selectedElement.style.bottom = "unset";
        elementEditor["bottom"].value = null;
        selectedElement.style.top = elementEditor["top"].value + "px";
    }
    elementEditor["bottom"].oninput = function()
    {
        selectedElement.style.top = "unset";
        elementEditor["top"].value = null;
        selectedElement.style.bottom = elementEditor["bottom"].value + "px";
    }

    //#region Startup MOVE TO args.js
    let splash = document.getElementById("splash");
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
    //#endregion

    overlay.addEventListener("dblclick", () =>
    {
        if (editorOpen)
        {
            editorPanel.style.width = ".1px";
            setTimeout(() => { editorPanel.style.display = "none"; }, 100);
            moveableElements.forEach(e => { disableDragElement(e); });
        }
        else
        {
            editorPanel.style.display = "table-cell";
            setTimeout(() =>
            {
                editorPanel.style.width = "250px";
                setTimeout(() =>
                {
                    resizeWindowEvent();
                    document.querySelectorAll(".moveable").forEach(e => { dragElement(e); });
                }, 100);
            }, 100);
        }

        editorOpen = !editorOpen;
    });
}

function SetupElements()
{
    document.querySelectorAll(".roundBar").forEach(element =>
    {
        element.querySelectorAll(".progress").forEach(e =>
        {
            e.style.strokeDasharray = (element.getBoundingClientRect()["width"] / 2 - 10) * Math.PI * 2;
        });
    });
}

//Heavily modified from https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(elmnt)
{
    var elBottom = null, elRight = null;
    var xChange = 0, yChange = 0, mouseX = 0, mouseY = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e)
    {
        UpdateElementEditor(elmnt);
        elmnt.style.left = elmnt.offsetLeft + "px";
        elmnt.style.top = elmnt.offsetTop + "px";
        elmnt.style.right = "unset";
        elmnt.style.bottom = "unset";

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
        
        if (mouseX > 250) //Make sure mouse cannot drag elements into the editor panel
        {
            if (mouseX - 250 > overlayWidth / 2)
            {
                elRight = overlayWidth - (elmnt.offsetLeft + elmnt.getBoundingClientRect()["width"]);
                elementEditor["left"].value = null;
                elementEditor["right"].value = elRight;
            }
            else
            {
                elRight = null;
                elementEditor["right"].value = null;
                elementEditor["left"].value = elmnt.offsetLeft;
            }

            if (mouseY > overlayHeight / 2)
            {
                elBottom = overlayHeight - (elmnt.offsetTop + elmnt.getBoundingClientRect()["height"]);
                elementEditor["top"].value = null;
                elementEditor["bottom"].value = elBottom;
            }
            else
            {
                elBottom = null;
                elementEditor["bottom"].value = null;
                elementEditor["top"].value = elmnt.offsetTop;
            }

            elmnt.style.left = elmnt.offsetLeft + xChange + "px";
            elmnt.style.top = elmnt.offsetTop + yChange + "px";
            
            //UpdateElementEditor(elmnt);
        }
    }
      
    function closeDragElement()
    {
        //Stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;

        if (elRight != null)
        {
            elmnt.style.right = elRight + "px";
            elmnt.style.left = "unset";
        }
        if (elBottom != null)
        {
            elmnt.style.bottom = elBottom + "px";
            elmnt.style.top = "unset";
        }
    }
}

function disableDragElement(elmnt) { elmnt.onmousedown = null; }

function UpdateElementEditor(e)
{
    selectedElement = e;
    elementEditor["left"].value = selectedElement.getBoundingClientRect()["left"];
    elementEditor["right"].value = selectedElement.getBoundingClientRect()["right"];
    elementEditor["top"].value = selectedElement.getBoundingClientRect()["top"];
    elementEditor["bottom"].value = selectedElement.getBoundingClientRect()["bottom"];
}