var elements = [];

window.addEventListener("load", () =>
{
    let observer = new MutationObserver(getAllElements);
    observer.observe(document.getElementById("overlay"), {childList: true});
    getAllElements();
})

function getAllElements(mutations)
{
    if (mutations != undefined)
    {
        try
        {
            if (mutations[0].addedNodes != null) { mutations[0].addedNodes.forEach(element => { addElementToList(element); }); }
            if (mutations[0].removedNodes != null)
            {
                mutations[0].removedNodes.forEach(element =>
                {
                    if (element.id != "")
                    {
                        elements.id[element.id] = element;
                    }
                    if (element.classList != "")
                    {
                        elements.forEach(e =>
                        {
                            if (e.id == element.id) { elements.splice(e); }    
                        });
                    }
                });
            }
        }
        catch (err) { console.error(err); getAllElements(); }
    }
    else
    {
        elements.id = [];
        elements.class = [];
        elements.tag = [];
        document.body.querySelectorAll("*").forEach(element => { addElementToList(element); })
    }

    function addElementToList(element)
    {
        if (element.id != "") { elements.id[element.id] = element; }
        if (element.classList != "")
        {
            element.classList.forEach(classItem =>
            {
                if (elements.class[classItem] == undefined) { elements.class[classItem] = []; }
                elements.class[classItem].push(element);
            });
        }

        if (elements.tag[element.tagName] == undefined) { elements.tag[element.tagName] = []; }
        elements.tag[element.tagName].push(element);
    }
}