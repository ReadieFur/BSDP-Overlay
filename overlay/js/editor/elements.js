//Get all elements to change
var elements = [];

window.addEventListener("load", () =>
{
    let observer = new MutationObserver(GetElements);
    observer.observe(document.getElementById("overlay"), {childList: true});
    GetElements();
})

function GetElements(mutations) //Try to only get the new element instead of getting all of them again
{
    elements.moveable = document.querySelectorAll(".moveable");

    //#region StaticData
    elements.coverImages = document.querySelectorAll(".coverImage");
    //#endregion

    //#region LiveData
    elements.times = document.querySelectorAll(".time");
    elements.accuracies = document.querySelectorAll(".accuracy");
    elements.healths = document.querySelectorAll(".health");
    //#endregion

    window.dispatchEvent(new CustomEvent("NewElement", { detail: elements }));
}