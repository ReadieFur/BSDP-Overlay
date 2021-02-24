import { Main } from "../main";
import { MapData, LiveData } from "./client";

export class UI
{
    public overlay!: HTMLDivElement;
    public importedElements!: ElementsJSON;
    public activeElements!: ActiveElements;

    public async Init(): Promise<UI>
    {
        this.overlay = Main.ThrowIfNullOrUndefined(document.querySelector("#overlay"));
        this.importedElements = await this.ImportElements();
        this.activeElements =
        {
            idCount: 0,
            locations: {},
            elements: {}
        };
        return this;
    }

    public static SecondsToMinutes(_seconds: number): string
    {
        let mins: string = Math.floor(_seconds / 60).toString().padStart(2, "0");
        let seconds: string = (_seconds - (Math.floor(_seconds / 60) * 60)).toString().padStart(2, "0");
        return `${mins}:${seconds}`;
    }

    public UpdateMapData(data: MapData): void
    {
        for (const category of Object.keys(this.activeElements.elements))
        {
            for (const type of Object.keys(this.activeElements.elements[category]))
            {
                for (const id of Object.keys(this.activeElements.elements[category][type]))
                {
                    this.activeElements.elements[category][type][id].script.UpdateMapData(data);
                }
            }
        }
    }

    public UpdateLiveData(data: LiveData): void
    {
        for (const category of Object.keys(this.activeElements.elements))
        {
            for (const type of Object.keys(this.activeElements.elements[category]))
            {
                for (const id of Object.keys(this.activeElements.elements[category][type]))
                {
                    this.activeElements.elements[category][type][id].script.UpdateLiveData(data);
                }
            }
        }
    }

    //This is not final
    public CreateElement(category: string, type: string, id: string, editorPreview: boolean = false): HTMLDivElement
    {
        if (this.importedElements[category][type][id] === undefined)
        { throw new TypeError(`${type}/${category}/${id} was not found in the imported elements list.`); } //Or return ""

        if (this.activeElements.elements[category] === undefined) { this.activeElements.elements[category] = {}; }
        if (this.activeElements.elements[category][type] === undefined) { this.activeElements.elements[category][type] = {}; }
        if (this.activeElements.elements[category][type][id] === undefined)
        {
            var style: HTMLStyleElement = document.createElement("style");
            style.id = `style_${type}/${category}/${id}`;
            style.innerHTML = this.importedElements[category][type][id].css;
            this.overlay.appendChild(style);

            this.activeElements.elements[category][type][id] =
            {
                script: new this.importedElements[category][type][id].script(),
                elements: {}
            };
        }

        var container: HTMLDivElement = document.createElement("div");
        container.id = `element_${editorPreview ? `${[category]}/${[type]}/${[id]}` : ++this.activeElements.idCount}`;
        container.classList.add("container");
        container.innerHTML = this.importedElements[category][type][id].html;
        
        this.activeElements.elements[category][type][id].script.AddElement(container); //Pass the element here, not the ID

        if (editorPreview === false)
        {
            //Press 'ctrl' + 'alt' + 'click' to delete the element.
            container.addEventListener("mousedown", (ev: MouseEvent) => { if (ev.ctrlKey && ev.altKey) { this.DeleteElement(container.id); } });
            this.overlay.appendChild(container);
            //When deleting an element these will still exist, eventually taking up a large amount of memory, fix this (unless GC is automatic).
            //Only do this if in editor mode.
            new MutationObserver((ev: MutationRecord[]) =>
            {
                this.UpdateElementProperties(container);
            }).observe(container, { attributes: true });
            new DragElement(container, this.overlay);
    
            this.activeElements.locations[container.id] = [category, type, id, container.id];
            this.activeElements.elements[category][type][id].elements[container.id] =
            {
                left: container.offsetLeft.toString(),
                top: container.offsetTop.toString(),
                width: container.clientWidth.toString(),
                height: container.clientHeight.toString()
            };
        }

        return container;
    }

    public DeleteElement(elementID: string): void
    {
        var location: [string, string, string, string] = this.activeElements.locations[elementID];
        delete this.activeElements.locations[elementID];
        delete this.activeElements.elements[location[0]][location[1]][location[2]].elements[location[3]];
        this.overlay.removeChild(Main.ThrowIfNullOrUndefined(this.overlay.querySelector(`#${elementID}`)));
        if (Object.keys(this.activeElements.elements[location[0]][location[1]][location[2]].elements).length === 0)
        {
            delete this.activeElements.elements[location[0]][location[1]][location[2]];
            if (Object.keys(this.activeElements.elements[location[0]][location[1]]).length === 0)
            {
                delete this.activeElements.elements[location[0]][location[1]];
                if (Object.keys(this.activeElements.elements[location[0]]).length === 0)
                { delete this.activeElements.elements[location[0]]; }
            }
        }
    }

    private async ImportElements(): Promise<ElementsJSON>
    {
        var elements: ElementsJSON = await jQuery.ajax(
        {
            type: "GET",
            url: `${Main.WEB_ROOT}/assets/overlay_elements/elements.json`,
            dataType: "json",
            error: Main.ThrowAJAXJsonError
        });

        if (typeof(elements) !== "object") { throw new TypeError(`${elements} is not a type of object.`); }

        for (const category of Object.keys(elements))
        {
            for (const type of Object.keys(elements[category]))
            {
                for (const name of Object.keys(elements[category][type]))
                {
                    let elementPath: string = `${category}/${type}/${name}`;

                    elements[category][type][name].html = await jQuery.ajax(
                    {
                        type: "GET",
                        url: `${Main.WEB_ROOT}/assets/overlay_elements/${elementPath}/html.html`,
                        dataType: "html"
                    });

                    elements[category][type][name].css = await jQuery.ajax(
                    {
                        type: "GET",
                        url: `${Main.WEB_ROOT}/assets/overlay_elements/${elementPath}/css.css`,
                        dataType: "html" //CSS
                    });

                    elements[category][type][name].script = (await import(`${Main.WEB_ROOT}/assets/overlay_elements/${elementPath}/script.js`)).Script;
                }
            }
        }

        return elements;
    }

    //Fix this still being fired when the element is deleted. (Perhaps store the 'MutationObserver' on the object in 'activeElements', but when saving only take the required values).
    private UpdateElementProperties(element: HTMLDivElement): void
    {
        try //Temporary try/catch
        {
            var location: [string, string, string, string] = this.activeElements.locations[element.id];
            this.activeElements.elements[location[0]][location[1]][location[2]].elements[location[3]].left = element.offsetLeft.toString();
            this.activeElements.elements[location[0]][location[1]][location[2]].elements[location[3]].top = element.offsetTop.toString();
            this.activeElements.elements[location[0]][location[1]][location[2]].elements[location[3]].width = element.clientWidth.toString();
            this.activeElements.elements[location[0]][location[1]][location[2]].elements[location[3]].height = element.clientHeight.toString();
        } catch {}
    }

    private IsMapData(data: MapData | LiveData): data is MapData
    {
        return (data as MapData).PluginVersion !== undefined;
    }
}

class DragElement
{
    private container: HTMLElement;
    private element: HTMLElement;
    private mouseX: number;
    private mouseY: number;
    private xChange: number;
    private yChange: number;

    constructor(_element: HTMLDivElement, _container?: HTMLElement)
    {
        if (_container !== undefined) { this.container = _container; }
        else { this.container = document.body; }
        this.element = _element;
        this.mouseX = 0;
        this.mouseY = 0;
        this.xChange = 0;
        this.yChange = 0;

        //Event listeners were being a problem here so for now I will be setting only one event to the container (this will stop me from being able to use this event on this element elsewhere).
        this.element.onmousedown = (e: MouseEvent) => { this.MouseDownEvent(e); };
    }

    private MouseDownEvent(e: MouseEvent): void
    {
        //When this was inside the if statment below the element would resizse from the side it was offset from which was good but it was very hard to control.
        this.element.style.left = `${this.element.offsetLeft}px`;
        this.element.style.top = `${this.element.offsetTop}px`;
        this.element.style.right = "unset";
        this.element.style.bottom = "unset";
        this.container.onmouseup = (e: MouseEvent) => { this.MouseUpEvent(e); };

        if (e.offsetX < this.element.clientWidth - 15 && e.offsetY < this.element.clientHeight - 15) //The resize grabber is 15px
        {
            e.preventDefault();
            //Remove the elements right/bottom position and replace it back to left/top.
            //Set mouse position when the mouse is first down.
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            //If using element instead of the container, if the mouse moves fast enough to escape the element before its position is updated, it will stop updating the elements position until the mouse goes over the element again.
            this.container.onmousemove = (e: MouseEvent) => { this.MouseMoveEvent(e); };
        }
    }
    
    private MouseMoveEvent(e: MouseEvent): void
    {
        e.preventDefault();
        //Calculate the change in mouse position. Is this not just the same as 'e.MovmentX/Y'?
        this.xChange = this.mouseX - e.clientX;
        this.yChange = this.mouseY - e.clientY;
        //Set the new position of the mouse.
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        //Move the element to the new position.
        var elementLeft: number;
        if (this.element.offsetLeft + this.element.clientWidth > this.container.clientWidth)
        { elementLeft = this.container.clientWidth - this.element.clientWidth }
        else if (this.element.offsetLeft < 0)
        { elementLeft = 0; }
        else
        { elementLeft = this.element.offsetLeft - this.xChange; }
        this.element.style.left = `${elementLeft}px`;

        var elementTop: number;
        if (this.element.offsetTop + this.element.clientHeight > this.container.clientHeight)
        { elementTop = this.container.clientHeight - this.element.clientHeight }
        else if (this.element.offsetTop < 0)
        { elementTop = 0; }
        else
        { elementTop = this.element.offsetTop - this.yChange; }
        this.element.style.top = `${elementTop}px`;
    }
    
    private MouseUpEvent(e: MouseEvent): void
    {
        //Stop moving when the mouse is released.
        this.container.onmouseup = null;
        this.container.onmousemove = null;

        //Set the elements position with left/right/top/bottom, work % values into this
        if (this.element.offsetLeft > this.container.clientWidth / 2)
        {
            this.element.style.right = `${this.container.clientWidth - this.element.offsetLeft - this.element.clientWidth}px`;
            this.element.style.left = "unset";
        }

        if (this.element.offsetTop > this.container.clientHeight / 2)
        {
            this.element.style.bottom = `${this.container.clientHeight - this.element.offsetTop - this.element.clientHeight}px`;
            this.element.style.top = "unset";
        }
    }
}

export type ElementsJSON =
{
    [category: string]:
    {
        [type: string]:
        {
            [name: string]:
            {
                showInEditor: boolean,
                html: string,
                css: string,
                script: ElementScript
            }
        }
    }
}

export type ActiveElements =
{
    idCount: number,
    locations: { [id: string]: [string, string, string, string] }, //This just makes it easier for me to navigate this object.
    elements:
    {
        [category: string]:
        {
            [type: string]:
            {
                [id: string]:
                {
                    script: ElementScript,
                    elements:
                    {
                        [elementID: string]:
                        {
                            left: string, //These are left as a string for % values
                            top: string,
                            width: string,
                            height: string
                        }
                    }
                }
            }
        }
    }
}

interface ElementScript
{
    new(): ElementScript,
    AddElement(element: HTMLDivElement, width?: number, height?: number): void;
    UpdateMapData(data: MapData): void;
    UpdateLiveData(data: LiveData): void;
}