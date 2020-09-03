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
    overlayWidth = overlayProperties.width;
    overlayHeight = overlayProperties.height;
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

        if (elementEditor[toSet].value < 0) { elementEditor[toSet].value = 0; }
        if ((toSet == "left" || toSet == "right") && elementEditor[toSet].value > overlayWidth - selectedElement.getBoundingClientRect().width) { elementEditor[toSet].value = overlayWidth - selectedElement.getBoundingClientRect().width; }
        if ((toSet == "top" || toSet == "bottom") && elementEditor[toSet].value > overlayHeight - selectedElement.getBoundingClientRect().height) { elementEditor[toSet].value = overlayHeight - selectedElement.getBoundingClientRect().height; }

        selectedElement.style[opposite] = "unset";
        elementEditor[opposite].value = null;
        selectedElement.style[toSet] = elementEditor[toSet].value + "px";
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
            e.style.strokeDasharray = (element.getBoundingClientRect().width / 2 - 10) * Math.PI * 2;
        });
    });
}

//Heavily modified from https://www.w3schools.com/howto/howto_js_draggable.asp
var elBottom = null, elRight = null;
function dragElement(elmnt)
{
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
        
        if (mouseX > 250 && mouseX - 250 < overlayWidth && mouseY > 0 && mouseY < overlayHeight) //Make sure mouse cannot drag elements into the editor panel
        {
            if (mouseX - 250 > overlayWidth / 2)
            {
                elRight = overlayWidth - (elmnt.offsetLeft + elmnt.getBoundingClientRect().width);
                elementEditor.left.value = null;
                elementEditor.right.value = elRight;
            }
            else
            {
                elRight = null;
                elementEditor.right.value = null;
                elementEditor.left.value = elmnt.offsetLeft;
            }

            if (mouseY > overlayHeight / 2)
            {
                elBottom = overlayHeight - (elmnt.offsetTop + elmnt.getBoundingClientRect().height);
                elementEditor.top.value = null;
                elementEditor.bottom.value = elBottom;
            }
            else
            {
                elBottom = null;
                elementEditor.bottom.value = null;
                elementEditor.top.value = elmnt.offsetTop;
            }

            elmnt.style.left = elmnt.offsetLeft + xChange + "px";
            elmnt.style.top = elmnt.offsetTop + yChange + "px";
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

        UpdateElementEditor(elmnt);
    }
}

function disableDragElement(elmnt) { elmnt.onmousedown = null; }

//Try to make ELEMENT.offsetRight a global function
function UpdateElementEditor(e)
{
    selectedElement = e;
    let offsetRight = overlayWidth - (selectedElement.offsetLeft + selectedElement.getBoundingClientRect().width);
    let offsetBottom = overlayHeight - (selectedElement.offsetTop + selectedElement.getBoundingClientRect().height);

    if (selectedElement.offsetLeft < 0) { selectedElement.style.left = "0px"; }
    else if (offsetRight < 0) { selectedElement.style.right = (offsetRight = 0) + "px"; }
    if (selectedElement.offsetTop < 0) { selectedElement.style.top = "0px"; }
    else if (offsetBottom < 0) { selectedElement.style.bottom = (offsetBottom = 0) + "px"; }

    if (elRight == null) { elementEditor.left.value = selectedElement.offsetLeft; }
    else { elementEditor.right.value = offsetRight; }
    if (elBottom == null) { elementEditor.top.value = selectedElement.offsetTop; }
    else { elementEditor.bottom.value = offsetBottom; }
}