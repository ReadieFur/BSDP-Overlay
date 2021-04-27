import { Main, ReturnData } from "../assets/js/main";
import { HeaderSlide } from "../assets/js/headerSlide";
import { ElementsJSON, OverlayPOSTResponse, SavedElements, UI } from "../assets/js/overlay/ui";
import { Client, SampleData } from "../assets/js/overlay/client";
import { DragElement } from "../assets/js/dragElement";
import { IOverlayData, OverlayHelper } from "../assets/js/overlay/overlayHelper";

//The script I am using is named as 'domtoimage' not 'DomToImage'.
declare const domtoimage: DomToImage.DomToImage;

//Create alerts for all (most) errors.
class Editor
{
    private hideSplashscreen = true;

    private id!: string;
    private allowUnload!: boolean;
    private elementsTable!: HTMLTableElement;
    private saveMenuContainer!: HTMLDivElement;
    private saveMenuBackground!: HTMLDivElement;
    private title!: HTMLInputElement;
    private description!: HTMLTextAreaElement;
    private thumbnail!: HTMLImageElement;
    private overlayPrivate!: HTMLSpanElement;
    private overlayPrivateCheckbox!: HTMLInputElement;
    private publishButton!: HTMLButtonElement;
    private imageRendererContainer!: HTMLDivElement;
    private ui!: UI;
    private client!: Client;

    public async Init(): Promise<Editor>
    {
        new Main();
        new HeaderSlide();

        await this.CheckForOverlay();

        //Set varables.
        this.allowUnload = true;
        this.elementsTable = Main.ThrowIfNullOrUndefined(document.querySelector("#elementsTable"));
        this.saveMenuContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#saveMenuContainer"));
        this.saveMenuBackground = Main.ThrowIfNullOrUndefined(document.querySelector("#saveMenuBackground"));
        this.title = Main.ThrowIfNullOrUndefined(document.querySelector("#title"));
        this.description = Main.ThrowIfNullOrUndefined(document.querySelector("#description"));
        this.thumbnail = Main.ThrowIfNullOrUndefined(document.querySelector("#thumbnail"));
        this.overlayPrivate = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayPrivate"));
        this.overlayPrivateCheckbox = Main.ThrowIfNullOrUndefined(this.overlayPrivate.querySelector("input[type=checkbox]"));
        this.publishButton = Main.ThrowIfNullOrUndefined(document.querySelector("#publishButton"));
        this.imageRendererContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#imageRendererContainer"));
        this.ui = Main.ThrowIfNullOrUndefined(await new UI().Init());

        this.LoadElementsIntoEditor(this.ui.importedElements);

        //Load sample data.
        this.ui.UpdateMapData(SampleData.mapData);
        this.ui.UpdateLiveData(SampleData.liveData);

        //Setup the client.
        /*this.client = new Client(Main.urlParams.get("ip"));
        this.client.AddEndpoint("MapData");
        this.client.websocketData["MapData"].e.addListener("message", (data) => { this.ui.UpdateMapData(data); });
        this.client.AddEndpoint("LiveData");
        this.client.websocketData["LiveData"].e.addListener("message", (data) => { this.ui.UpdateLiveData(data); });*/

        //Setup UI events (open save menus etc).
        window.addEventListener("beforeunload", (ev) => { this.WindowBeforeUnloadEvent(ev); });
        this.saveMenuBackground.addEventListener("click", () => { this.MinimiseSaveMenu(); });
        this.overlayPrivate.addEventListener("click", () => { this.overlayPrivateCheckbox.checked = !this.overlayPrivateCheckbox.checked; });
        this.publishButton.addEventListener("click", () => { this.PublishOverlay(); });
        Main.ThrowIfNullOrUndefined(document.querySelector("#showSaveContainer")).addEventListener("click", () => { this.ShowSaveContainerClickEvent(); });
        
        await this.LoadOverlay();

        this.allowUnload = true;

        //Hide splash screen if the user is allowed to use the editor or if the editor is ready for use.
        if (this.hideSplashscreen)
        {
            let splashScreen: HTMLDivElement = Main.ThrowIfNullOrUndefined(document.querySelector("#splashScreen"));
            splashScreen.classList.add("fadeOut");
            setTimeout(() => { splashScreen.style.display = "none"; }, 399);
        }

        return this;
    }

    private WindowBeforeUnloadEvent(ev: BeforeUnloadEvent): void
    {
        if (!this.allowUnload)
        {
            ev.preventDefault();
            ev.returnValue = "false";
        }
    }

    //Create a new overlay if allowed/none is specified in the URL.
    private async CheckForOverlay(): Promise<void>
    {
        if (Main.RetreiveCache("READIE_UID").length != 22 || Main.RetreiveCache("READIE_SID") === '')
        {
            this.hideSplashscreen = false;
            Main.Alert(Main.GetPHPErrorMessage("NOT_LOGGED_IN"));
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }

        var path = window.location.pathname.split('/').filter((part) => { return part != ""; });
        if (path[path.length - 1].length != 13 && path[path.length - 1] === "edit")
        {
            //Create a new overlay.
            var response: ReturnData = await OverlayHelper.OverlayPHP({ method: "createOverlay" });

            if (response.error || response.data.toString().length !== 13)
            {
                this.hideSplashscreen = false;
                Main.Alert(response.data === 'QUOTA_EXCEEDED' ? 'Quota exceeded.' : Main.GetPHPErrorMessage(response.data));
                await Main.Sleep(1000);
                window.location.href = `${Main.WEB_ROOT}/browser/`;
            }
            else
            {
                history.replaceState({id: response.data}, "Editor | BSDP Overlay", `${Main.WEB_ROOT}/edit/${response.data}/`);
                this.id = response.data;
            }
        }
        else if (path[path.length - 1].length === 13 && path[path.length - 2] === "edit") { this.id = path[path.length - 1]; }
        else
        {
            this.hideSplashscreen = false;
            Main.Alert("Invalid path.");
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }
    }

    //It is possible for public overlays to be ripped here if the user can interperate this script before the ownership check.
    private async LoadOverlay(): Promise<void>
    {
        var response: ReturnData = await OverlayHelper.OverlayPHP(
        {
            method: "getOverlayByID",
            data:
            {
                id: this.id
            }
        });

        if (response.error)
        {
            this.hideSplashscreen = false;
            Main.Alert(Main.GetPHPErrorMessage(response.data));
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }
        else if ((<IOverlayData>response.data).uid !== Main.RetreiveCache("READIE_UID"))
        {
            this.hideSplashscreen = false;
            Main.Alert(Main.GetPHPErrorMessage("INVALID_CREDENTIALS"));
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }
        
        var overlay: IOverlayData = response.data;

        this.title.value = overlay.name;
        this.description.value = overlay.description === null ? '' : overlay.description;
        this.overlayPrivateCheckbox.checked = overlay.isPrivate == '1' ? true : false;

        var elements: SavedElements = JSON.parse(overlay.elements);
        for (const category of Object.keys(elements))
        {
            for (const type of Object.keys(elements[category]))
            {
                for (const id of Object.keys(elements[category][type]))
                {
                    for (let i = 0; i < elements[category][type][id].length; i++)
                    {
                        const elementProperties = elements[category][type][id][i];
                        var container: HTMLDivElement = this.CreateElement(category, type, id);
                        //Things were being really weird here so I've had to load the properties in certain orders depending on their position.
                        if (elementProperties.position.top !== undefined)
                        {
                            container.style.top = elementProperties.position.top;
                            container.style.height = `${elementProperties.height}px`;
                        }
                        else
                        {
                            container.style.height = `${elementProperties.height}px`;
                            container.style.bottom = elementProperties.position.bottom!;
                        }
                        if (elementProperties.position.left !== undefined)
                        {
                            container.style.left = elementProperties.position.left;
                            container.style.width = `${elementProperties.width}px`;
                        }
                        else
                        {
                            container.style.width = `${elementProperties.width}px`;
                            container.style.right = elementProperties.position.right!;
                        }
                        this.ui.overlay.appendChild(container);
                        this.UpdateElementProperties(container);
                    }
                }
            }
        }
    }

    private LoadElementsIntoEditor(importedElements: ElementsJSON): void
    {
        for (const category of Object.keys(importedElements))
        {
            var hasOneElement: boolean = false;
            //Work on a way to keep the height of the row the same for each element data cell (get the tallest element from when it is created).
            var tr: HTMLTableRowElement = document.createElement("tr");

            for (const type of Object.keys(importedElements[category]))
            {
                for (const name of Object.keys(importedElements[category][type]))
                {
                    if (importedElements[category][type][name].showInEditor)
                    {
                        hasOneElement = true;
                        var td: HTMLTableDataCellElement = document.createElement("td");
                        var element: HTMLDivElement = this.ui.CreateElement(category, type, name);
                        element.addEventListener("dblclick", (ev: MouseEvent) => { this.ui.overlay.appendChild(this.CreateElement(category, type, name)); });
                        td.appendChild(element);
                        tr.appendChild(td);
                    }
                }
            }

            if (hasOneElement)
            {
                (<HTMLTableDataCellElement>tr.firstChild!).classList.add("visible");

                if (tr.childNodes.length > 1)
                {
                    var backward: HTMLTableDataCellElement = document.createElement("td");
                    var backwardText: HTMLHeadingElement = document.createElement("h3");
                    var forward: HTMLTableDataCellElement = document.createElement("td");
                    var forwardText: HTMLHeadingElement = document.createElement("h3");
    
                    backwardText.innerText = "<";
                    backward.appendChild(backwardText);
                    forwardText.innerText = ">";
                    forward.appendChild(forwardText);
    
                    backward.addEventListener("click", (ev: Event) => { this.ChangeElementPage(ev, tr, false); });
                    forward.addEventListener("click", (ev: Event) => { this.ChangeElementPage(ev, tr, true); });
    
                    tr.prepend(backward);
                    tr.appendChild(forward);
                }

                this.elementsTable.tBodies[0].appendChild(tr);
            }
        }
    }

    private ChangeElementPage(ev: Event, container: HTMLTableRowElement, forward: boolean): void
    {
        var index: number = 1;

        for (let i = 0; i < container.childNodes.length; i++)
        {
            var element: HTMLTableDataCellElement = <HTMLTableDataCellElement>container.childNodes[i];
            if (element.className.includes("visible"))
            { index = forward ? i + 1 : i - 1; }
            element.classList.remove("visible");
        }

        if (index <= 0)
        { index = container.childNodes.length - 2; }
        else if (index >= container.childNodes.length - 1)
        { index = 1; }

        (<HTMLTableDataCellElement>container.childNodes[index]).classList.add("visible");
    }

    private CreateElement(category: string, type: string, id: string): HTMLDivElement
    {
        var container: HTMLDivElement = this.ui.CreateElement(category, type, id);

        //Press 'ctrl' + 'alt' + 'click' to delete the element.
        container.addEventListener("mousedown", (ev: MouseEvent) => { if (ev.ctrlKey && ev.altKey) { this.DeleteElement(container); } });
        container.addEventListener("mouseup", () => { this.UpdateElementProperties(container); });
        /*this.ui.createdElements.elements[category][type][id].elements[container.id].mutationObserver = new MutationObserver((ev: MutationRecord[]) => { this.UpdateElementProperties(container); });
        this.ui.createdElements.elements[category][type][id].elements[container.id].mutationObserver!.observe(container, { attributes: true });*/
        this.ui.createdElements.elements[category][type][id].elements[container.id].dragElement = new DragElement(container, this.ui.overlay);
        this.ui.createdElements.locations[container.id] = [category, type, id, container.id];
        this.allowUnload = false;
        return container;
    }

    //I should tidy this up a bit as im doing the same thng in multiple places.
    private UpdateElementProperties(element: HTMLDivElement): void
    {
        var location: [string, string, string, string] = this.ui.createdElements.locations[element.id];
        var _position: { top?: string; left?: string; bottom?: string;  right?: string; } = {};

        if (element.offsetLeft + element.clientWidth / 2 > this.ui.overlay.clientWidth / 2) { _position.right = `${this.ui.overlay.clientWidth - element.offsetLeft - element.clientWidth}px`; }
        else { _position.left = `${element.offsetLeft}px`; }
        if (element.offsetTop + element.clientHeight / 2 > this.ui.overlay.clientHeight / 2) { _position.bottom = `${this.ui.overlay.clientHeight - element.offsetTop - element.clientHeight}px`; }
        else { _position.top = `${element.offsetTop}px`; }

        this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position = _position;
        this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].width = element.clientWidth.toString();
        this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].height = element.clientHeight.toString();

        this.allowUnload = false;
    }

    private DeleteElement(element: HTMLDivElement): void
    {
        var location: [string, string, string, string] = this.ui.createdElements.locations[element.id];
        this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.RemoveElement(element);
        /*if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].mutationObserver !== undefined)
        { this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].mutationObserver!.disconnect(); }*/
        delete this.ui.createdElements.locations[element.id];
        delete this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]];
        this.ui.overlay.removeChild(Main.ThrowIfNullOrUndefined(this.ui.overlay.querySelector(`#${element.id}`)));
        if (Object.keys(this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements).length === 0)
        {
            delete this.ui.createdElements.elements[location[0]][location[1]][location[2]];
            document.head.removeChild(Main.ThrowIfNullOrUndefined(document.head.querySelector(`#style_${location[0]}_${location[1]}_${location[2]}`)));
            if (Object.keys(this.ui.createdElements.elements[location[0]][location[1]]).length === 0)
            {
                delete this.ui.createdElements.elements[location[0]][location[1]];
                if (Object.keys(this.ui.createdElements.elements[location[0]]).length === 0)
                { delete this.ui.createdElements.elements[location[0]]; }
            }
        }
        this.allowUnload = false;
    }

    private async RenderImage(element: HTMLElement, options: { width?: number, height?: number, scale?: number, background?: string } = {}): Promise<string>
    {
        var result: string;

        this.imageRendererContainer.style.display = "block";
        this.imageRendererContainer.innerHTML = element.innerHTML;

        //Replace with scale transform in the future.
        if (options.scale !== undefined)
        {
            for (let i = 0; i < this.imageRendererContainer.children.length; i++)
            {
                (<HTMLElement>this.imageRendererContainer.children[i]).style.zoom = options.scale.toString();
            }
        }

        if (options.background !== undefined) { this.imageRendererContainer.style.backgroundImage = `url("${options.background}")`; }

        //I want to use an SVG here but the output contains too much data resulting in it being larger than the png, look into this: https://github.com/felixfbecker/dom-to-svg
        if (options.width !== undefined && options.height !== undefined)
        {
            this.imageRendererContainer.style.width = `${options.width}px`;
            this.imageRendererContainer.style.height = `${options.height}px`;
            result = await domtoimage.toPng(this.imageRendererContainer, { width: options.width, height: options.height });
        }
        else { result = await domtoimage.toPng(this.imageRendererContainer); }

        this.imageRendererContainer.innerHTML = "";
        this.imageRendererContainer.style.backgroundImage = "none";
        this.imageRendererContainer.style.width = "0";
        this.imageRendererContainer.style.height = "0";
        this.imageRendererContainer.style.display = "none";

        return result;
    }

    //I'm not going to await for the image to render here, when saving the overlay I will render the overlay again and await for that one.
    private ShowSaveContainerClickEvent(): void
    {
        this.RenderImage(this.ui.overlay,
        {
            width: 1280,
            height: 720,
            scale: 720 / this.ui.overlay.clientHeight,
            background: `${Main.WEB_ROOT}/assets/images/beat-saber.jpg`
        }).then((dataURL: string) => { this.thumbnail.src = dataURL; });
        this.saveMenuContainer.style.display = "block";
        this.saveMenuContainer.classList.remove("fadeOut");
        this.saveMenuContainer.classList.add("fadeIn");
    }

    //Add checks and overlay creation limits.
    private async PublishOverlay(): Promise<void>
    {
        Main.Alert("Please wait...");

        //I figured it would be easier to just get all of the elements when the overlay is going to be saved, instead of storing the elements as I go along. Im not using the createelements object as it has data I don't need.
        var savedElements: SavedElements = {};
        for (const key of Object.keys(this.ui.createdElements.locations))
        {
            const location: [string, string, string, string] = this.ui.createdElements.locations[key];
            if (savedElements[location[0]] === undefined) { savedElements[location[0]] = {}; }
            if (savedElements[location[0]][location[1]] === undefined) { savedElements[location[0]][location[1]] = {}; }
            if (savedElements[location[0]][location[1]][location[2]] === undefined) { savedElements[location[0]][location[1]][location[2]] = []; }

            var _position: { top?: string; left?: string; bottom?: string;  right?: string; } = {};
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.top !== undefined) { _position.top = this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.top; }
            else { _position.bottom = this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.bottom; }
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.left !== undefined) { _position.left = this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.left; }
            else { _position.right = this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.right; }

            savedElements[location[0]][location[1]][location[2]].push(
            {
                position: _position,
                width: this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].width,
                height: this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].height
            });
        }

        if (Object.keys(savedElements).length < 1) { Main.Alert("This overlay does not have enough elements to be saved."); }
        else
        {
            var response: ReturnData = await OverlayHelper.OverlayPHP(
            {
                method: "saveOverlay",
                data:
                {
                    id: this.id,
                    name: this.title.value,
                    description: this.description.value,
                    isPrivate: this.overlayPrivateCheckbox.checked ? 1 : 0,
                    //Check if the client is connected to the game here, if they are not then use the sample data for the thumbnail.
                    thumbnail: await this.RenderImage(this.ui.overlay, { width: 480, height: 270, scale: 480 / this.ui.overlay.clientHeight }), //I may do a manual scale as scaling like below makes the preview very hard to see.
                    elements: savedElements
                }
            });
    
            if (response.error)
            {
                Main.Alert(Main.GetPHPErrorMessage(response.data));
            }
            else
            {
                Main.Alert("Saved!");
                //this.MinimiseSaveMenu();
                this.allowUnload = true;
            }
        }
    }

    private MinimiseSaveMenu(): void
    {
        this.saveMenuContainer.classList.remove("fadeIn");
        this.saveMenuContainer.classList.add("fadeOut");
        setTimeout(() =>
        {
            this.saveMenuContainer.style.display = "none";
            this.thumbnail.src = "";
        }, 399); //Changing the display 1ms before the animation finishes to help prevent flickering.
    }
}
new Editor().Init();