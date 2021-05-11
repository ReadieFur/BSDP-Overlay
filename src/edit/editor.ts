import { Main, ReturnData } from "../assets/js/main.js";
import { HeaderSlide } from "../assets/js/headerSlide.js";
import { ElementsJSON, SavedElements, UI } from "../assets/js/overlay/ui.js";
import { Client, SampleData } from "../assets/js/overlay/client.js";
import { DragElement } from "../assets/js/dragElement.js";
import { IOverlayData, IRGB, OverlayHelper, TCustomStyles } from "../assets/js/overlay/overlayHelper.js";

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
    private resizeCanvas!: HTMLCanvasElement;
    private resizeCanvas2D!: CanvasRenderingContext2D;
    private ui!: UI;
    private client!: Client;

    private activeElement?: HTMLDivElement;
    private editorPropertiesTab!:
    {
        optionsRow: HTMLTableRowElement,
        tabs: HTMLDivElement,
        position:
        {
            tabButton: HTMLButtonElement,
            tbody: HTMLTableSectionElement,
            top: HTMLInputElement,
            left: HTMLInputElement,
            bottom: HTMLInputElement,
            right: HTMLInputElement
        },
        size:
        {
            tabButton: HTMLButtonElement,
            tbody: HTMLTableSectionElement,
            width: HTMLInputElement,
            height: HTMLInputElement
        },
        colour:
        {
            tabButton: HTMLButtonElement,
            tbody: HTMLTableSectionElement,
            foregroundColourGroup: HTMLTableRowElement,
            foregroundColour: HTMLInputElement
            backgroundColourGroup: HTMLTableRowElement,
            backgroundColour: HTMLInputElement
            accentColourGroup: HTMLTableRowElement,
            accentColour: HTMLInputElement
        },
        font:
        {
            tabButton: HTMLButtonElement,
            tbody: HTMLTableSectionElement,
            fontSize: HTMLInputElement
        }
    };

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
        this.resizeCanvas = Main.ThrowIfNullOrUndefined(document.querySelector("#resizeCanvas"));
        this.resizeCanvas2D = Main.ThrowIfNullOrUndefined(this.resizeCanvas.getContext("2d"));
        this.ui = Main.ThrowIfNullOrUndefined(await new UI().Init());

        this.editorPropertiesTab = 
        {
            optionsRow: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsRow")),
            tabs: Main.ThrowIfNullOrUndefined(document.querySelector("#optionTabs")),
            position:
            {
                tabButton: Main.ThrowIfNullOrUndefined(document.querySelector("#optionPositionButton")),
                tbody: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsPosition")),
                top: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsTop")),
                left: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsLeft")),
                bottom: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsBottom")),
                right: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsRight")),
            },
            size:
            {
                tabButton: Main.ThrowIfNullOrUndefined(document.querySelector("#optionSizeButton")),
                tbody: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsSize")),
                width: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsWidth")),
                height: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsHeight")),
            },
            colour:
            {
                tabButton: Main.ThrowIfNullOrUndefined(document.querySelector("#optionColourButton")),
                tbody: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsColour")),
                foregroundColourGroup: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsForegroundColourGroup")),
                foregroundColour: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsForegroundColour")),
                backgroundColourGroup: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsBackgroundColourGroup")),
                backgroundColour: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsBackgroundColour")),
                accentColourGroup: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsAccentColourGroup")),
                accentColour: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsAccentColour"))
            },
            font:
            {
                tabButton: Main.ThrowIfNullOrUndefined(document.querySelector("#optionFontButton")),
                tbody: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsFont")),
                fontSize: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsFontSize"))
            }
        }

        this.ConfigureEditorWindow();
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
        this.ui.overlay.addEventListener("click", (ev) =>
        {
            if (ev.target === this.ui.overlay)
            { 
                this.activeElement = undefined;
                this.editorPropertiesTab.optionsRow.style.display = "none";
            }
        });
        Main.ThrowIfNullOrUndefined(document.querySelector("#showSaveContainer")).addEventListener("click", () => { this.ShowSaveContainerClickEvent(); });
        this.editorPropertiesTab.position.tabButton.addEventListener("click", () => { this.SetActivePropertiesTab("position"); });
        this.editorPropertiesTab.position.top.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.position.left.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.position.bottom.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.position.right.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.size.tabButton.addEventListener("click", () => { this.SetActivePropertiesTab("size"); });
        this.editorPropertiesTab.size.width.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.size.height.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.colour.tabButton.addEventListener("click", () => { this.SetActivePropertiesTab("colour"); });
        this.editorPropertiesTab.colour.foregroundColour.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.colour.backgroundColour.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.colour.accentColour.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.font.tabButton.addEventListener("click", () => { this.SetActivePropertiesTab("font"); });
        this.editorPropertiesTab.font.fontSize.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        
        await this.LoadOverlay();

        this.allowUnload = true;

        //Hide splash screen if the user is allowed to use the editor or if the editor is ready for use.
        if (this.hideSplashscreen)
        {
            //await Main.Sleep(500);
            let splashScreen: HTMLDivElement = Main.ThrowIfNullOrUndefined(document.querySelector("#splashScreen"));
            splashScreen.classList.add("fadeOut");
            setTimeout(() => { splashScreen.style.display = "none"; }, 399);
        }

        return this;
    }

    private ConfigureEditorWindow(): void
    {
        //Use this as the long term solution for making sure the overlays display properly on all display sizes, have the editor be one size and scale to the appropriate size.
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

                        if (elementProperties.customStyles.foregroundColour !== undefined) { container.setAttribute(this.editorPropertiesTab.colour.foregroundColour.id, this.RGBToHex(elementProperties.customStyles.foregroundColour)); }
                        if (elementProperties.customStyles.backgroundColour !== undefined) { container.setAttribute(this.editorPropertiesTab.colour.backgroundColour.id, this.RGBToHex(elementProperties.customStyles.backgroundColour)); }
                        if (elementProperties.customStyles.accentColour !== undefined) { container.setAttribute(this.editorPropertiesTab.colour.accentColour.id, this.RGBToHex(elementProperties.customStyles.accentColour)); }

                        this.ui.createdElements.elements[category][type][id].script.UpdateStyles(container, elementProperties.customStyles);

                        this.ui.overlay.appendChild(container);
                        this.UpdateSavedElementProperties(container);
                    }
                }
            }
        }
    }

    private LoadElementsIntoEditor(importedElements: ElementsJSON): void
    {
        var editorElementStyles = document.createElement("style");
        editorElementStyles.id = "editorElementStyles";
        editorElementStyles.innerHTML = `
            #elementsRow *
            {
                --overlayForegroundColour: var(--foregroundColour);
            }
        `;
        document.head.appendChild(editorElementStyles);

        for (const category of Object.keys(importedElements))
        {
            //Work on a way to keep the height of the row the same for each element data cell (get the tallest element from when it is created).
            var tr: HTMLTableRowElement = document.createElement("tr");

            for (const type of Object.keys(importedElements[category]))
            {
                for (const name of Object.keys(importedElements[category][type]))
                {
                    if (importedElements[category][type][name].showInEditor)
                    {
                        var td: HTMLTableDataCellElement = document.createElement("td");
                        var element: HTMLDivElement = this.ui.CreateElement(category, type, name);
                        element.addEventListener("dblclick", () =>
                        {
                            var _element = this.CreateElement(category, type, name);
                            this.ui.overlay.appendChild(_element);
                            this.SetActiveElement(_element);
                        });
                        td.appendChild(element);
                        tr.appendChild(td);
                    }
                }
            }

            (<HTMLTableDataCellElement>tr.firstChild!).classList.add("visible");

            var backward: HTMLTableDataCellElement = document.createElement("td");
            var forward: HTMLTableDataCellElement = document.createElement("td");
            if (tr.childNodes.length > 1)
            {
                var backwardText: HTMLHeadingElement = document.createElement("h3");
                var forwardText: HTMLHeadingElement = document.createElement("h3");

                backwardText.innerText = "<";
                backward.appendChild(backwardText);
                forwardText.innerText = ">";
                forward.appendChild(forwardText);

                backward.addEventListener("click", (ev: Event) => { this.ChangeElementPage(ev, false); });
                forward.addEventListener("click", (ev: Event) => { this.ChangeElementPage(ev, true); });
            }
            else
            {
                backward.style.cursor = "default";
                forward.style.cursor = "default";
            }
            tr.prepend(backward);
            tr.appendChild(forward);

            this.elementsTable.tBodies[0].appendChild(tr);
        }
    }

    private ChangeElementPage(ev: Event, forward: boolean): void
    {
        var index: number = 1;
        var container: HTMLTableRowElement =
            (<HTMLTableDataCellElement>ev.target).nodeName === "TD" ?
            (<HTMLTableDataCellElement>ev.target).parentElement as HTMLTableRowElement : //User clicked on the TD
            (<HTMLTableDataCellElement>ev.target).parentElement!.parentElement as HTMLTableRowElement; //User clicked on the H3

        for (let i = 0; i < container.childNodes.length; i++)
        {
            var element: HTMLTableDataCellElement = <HTMLTableDataCellElement>container.childNodes[i];
            if (element.classList.contains("visible"))
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

        if (this.ui.createdElements.elements[category][type][id].script.resizeMode !== 0) { container.style.resize = "both"; }

        //Press 'ctrl' + 'alt' + 'click' to delete the element.
        container.addEventListener("mousedown", (ev: MouseEvent) =>
        {
            if (ev.ctrlKey && ev.altKey) { this.DeleteElement(container); }
            else { this.SetActiveElement(container); }
        });
        /*container.addEventListener("mousemove", (ev) =>
        {
            if (ev.ctrlKey && ev.altKey) { container.style.boxShadow = "0 0 0 1px rgba(255, 0, 0, 1)"; }
            else { container.style.removeProperty("boxShadow"); }
        });*/
        container.addEventListener("mouseup", () => { this.UpdateSavedElementProperties(container); });
        /*this.ui.createdElements.elements[category][type][id].elements[container.id].mutationObserver = new MutationObserver((ev: MutationRecord[]) => { this.UpdateElementProperties(container); });
        this.ui.createdElements.elements[category][type][id].elements[container.id].mutationObserver!.observe(container, { attributes: true });*/
        this.ui.createdElements.elements[category][type][id].elements[container.id].dragElement = new DragElement(container, this.ui.overlay);
        this.ui.createdElements.locations[container.id] = [category, type, id, container.id];
        this.allowUnload = false;
        return container;
    }


    private SetActiveElement(element: HTMLDivElement)
    {
        if (element !== this.activeElement)
        {
            var buttonDisplayStyle = "inline-block";

            this.activeElement = element;
            var location: [string, string, string, string] = this.ui.createdElements.locations[element.id];

            //#region Reset tabs to default styles
            this.editorPropertiesTab.position.tabButton.style.display = buttonDisplayStyle;
            this.editorPropertiesTab.position.tabButton.classList.remove("ignore");
            this.editorPropertiesTab.size.tabButton.style.display = "none";
            this.editorPropertiesTab.colour.tabButton.style.display = "none";
            this.editorPropertiesTab.colour.foregroundColourGroup.style.display = "none";
            this.editorPropertiesTab.colour.backgroundColourGroup.style.display = "none";
            this.editorPropertiesTab.colour.accentColourGroup.style.display = "none";

            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.foregroundColour !== undefined)
            {
                this.editorPropertiesTab.colour.foregroundColour.value = this.RGBToHex(this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.foregroundColour!);
            }
            else
            { this.editorPropertiesTab.colour.foregroundColour.value = this.RGBToHex(UI.defaultStyles.foregroundColour!); }
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.backgroundColour !== undefined)
            {
                this.editorPropertiesTab.colour.backgroundColour.value = this.RGBToHex(this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.backgroundColour!);
            }
            else
            { this.editorPropertiesTab.colour.backgroundColour.value = this.RGBToHex(UI.defaultStyles.backgroundColour!); }
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.accentColour !== undefined)
            {
                this.editorPropertiesTab.colour.accentColour.value = this.RGBToHex(this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.accentColour!);
            }
            else
            { this.editorPropertiesTab.colour.accentColour.value = this.RGBToHex(UI.defaultStyles.accentColour!); }

            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.fontSize !== undefined)
            {
                this.editorPropertiesTab.font.fontSize.value = this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.fontSize!.toString();
            }
            else
            { this.editorPropertiesTab.font.fontSize.value = "16"; }
            //#endregion

            //#region Position tab
            if (
                Object.keys(this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles).length == 0 &&
                this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.resizeMode == 0
            )
            { this.editorPropertiesTab.position.tabButton.classList.add("ignore"); }
            //#endregion

            //#region Size tab
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.resizeMode != 0)
            {
                this.editorPropertiesTab.size.tabButton.style.display = buttonDisplayStyle;
            }
            //#endregion
            

            //#region Colour tab
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.foregroundColour === true)
            {
                this.editorPropertiesTab.colour.tabButton.style.display = buttonDisplayStyle;
                this.editorPropertiesTab.colour.foregroundColourGroup.style.display = "table-row";
            }
    
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.backgroundColour === true)
            {
                this.editorPropertiesTab.colour.tabButton.style.display = buttonDisplayStyle;
                this.editorPropertiesTab.colour.backgroundColourGroup.style.display = "table-row";
            }
    
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.accentColour === true)
            {
                this.editorPropertiesTab.colour.tabButton.style.display = buttonDisplayStyle;
                this.editorPropertiesTab.colour.accentColourGroup.style.display = "table-row";
            }
            //#endregion
    
            //#region Font size tab
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.fontSize === true)
            {
                this.editorPropertiesTab.font.tabButton.style.display = buttonDisplayStyle;
            }
            //#endregion

            this.SetActivePropertiesTab("position");
            this.editorPropertiesTab.optionsRow.style.display = "table-row";
        }
    }

    private SetActivePropertiesTab(tab: "position" | "size" | "colour" | "font")
    {
        this.editorPropertiesTab.position.tabButton.classList.remove("active");
        this.editorPropertiesTab.position.tbody.style.display = "none";
        this.editorPropertiesTab.size.tabButton.classList.remove("active");
        this.editorPropertiesTab.size.tbody.style.display = "none";
        this.editorPropertiesTab.colour.tabButton.classList.remove("active");
        this.editorPropertiesTab.colour.tbody.style.display = "none";
        this.editorPropertiesTab.font.tabButton.classList.remove("active");
        this.editorPropertiesTab.font.tbody.style.display = "none";

        var activeTab;
        switch (tab)
        {
            case "position":
                activeTab = this.editorPropertiesTab.position;
                break;
            case "size":
                activeTab = this.editorPropertiesTab.size;
                break;
            case "colour":
                activeTab = this.editorPropertiesTab.colour;
                break;
            case "font":
                activeTab = this.editorPropertiesTab.font;
        }

        activeTab.tabButton.classList.add("active");
        activeTab.tbody.style.display = "table-row-group";
    }

    private UpdateElementPropertiesFromTab(ev: Event)
    {
        if (this.activeElement !== undefined)
        {
            var location: [string, string, string, string] = this.ui.createdElements.locations[this.activeElement.id];
            var inputTarget = <HTMLInputElement>ev.target;

            //I don't know whats better, having two if statments means I'll have to type things out twice very similarly
            //whereas having ?: (forgot what its called) means I type less but more checks are done resulting in higher resource usage.
            //I think I will stick to ?: as the peformance gain from multiple if statments in this case is minor.
            if (inputTarget.id === "optionsTop" || inputTarget.id === "optionsBottom")
            {
                var inputElement = inputTarget.id === "optionsTop" ? this.editorPropertiesTab.position.top : this.editorPropertiesTab.position.bottom;
                var inputValue = parseInt(inputElement.value);

                if (isNaN(inputValue)) { ev.preventDefault(); return; }
                else if (inputValue + this.activeElement.clientHeight / 2 > this.ui.overlay.clientHeight / 2 - 1) //-1 is a fix for when UpdateElementProperties flips the side the element is on when in the middle, the consequence of this is that 1px is list either side of the center.
                { inputElement.value = (this.ui.overlay.clientHeight / 2 - this.activeElement.clientHeight / 2 - 1).toString(); }
                else if (inputValue < 0)
                { inputElement.value = "0"; }

                (inputTarget.id === "optionsTop" ? this.editorPropertiesTab.position.bottom : this.editorPropertiesTab.position.top).value = "";
                this.activeElement.style[inputTarget.id === "optionsTop" ? "top" : "bottom"] = `${inputElement.value}px`;
                this.activeElement.style[inputTarget.id === "optionsTop" ? "bottom" : "top"] = "unset";
            }
            else if (inputTarget.id === "optionsLeft" || inputTarget.id === "optionsRight")
            {
                var inputElement = inputTarget.id === "optionsLeft" ? this.editorPropertiesTab.position.left : this.editorPropertiesTab.position.right;
                var inputValue = parseInt(inputElement.value);

                if (isNaN(inputValue)) { ev.preventDefault(); return; }
                else if (inputValue + this.activeElement.clientWidth / 2 > this.ui.overlay.clientWidth / 2 - 1)
                { inputElement.value = (this.ui.overlay.clientWidth / 2 - this.activeElement.clientWidth / 2 - 1).toString() }
                else if (inputValue < 0)
                { inputElement.value = "0"; }

                (inputTarget.id === "optionsLeft" ? this.editorPropertiesTab.position.right : this.editorPropertiesTab.position.left).value = "";
                this.activeElement.style[inputTarget.id === "optionsLeft" ? "left" : "right"] = `${inputElement.value}px`;
                this.activeElement.style[inputTarget.id === "optionsLeft" ? "right" : "left"] = "unset";
            }
            else if (inputTarget.id === "optionsWidth" || inputTarget.id === "optionsHeight")
            {
                var inputElement = inputTarget.id === "optionsWidth" ? this.editorPropertiesTab.size.width : this.editorPropertiesTab.size.height;
                var inputValue = parseInt((inputTarget.id === "optionsWidth" ? this.editorPropertiesTab.size.width : this.editorPropertiesTab.size.height).value);
                if (isNaN(inputValue)) { ev.preventDefault(); return; }
                else if (inputValue < parseInt(this.activeElement.style.minWidth.substr(0, this.activeElement.style.minWidth.length - 2)))
                { inputElement.value = this.activeElement.style.minWidth.substr(0, this.activeElement.style.minWidth.length - 2); }
                else if (inputValue < parseInt(this.activeElement.style.minWidth.substr(0, this.activeElement.style.maxWidth.length - 2)))
                { inputElement.value = this.activeElement.style.minWidth.substr(0, this.activeElement.style.maxWidth.length - 2); }

                this.activeElement.style[inputTarget.id === "optionsWidth" ? "width" : "height"] = `${inputElement.value}px`;
            }
            else if (inputTarget.id === "optionsForegroundColour" || inputTarget.id === "optionsBackgroundColour" || inputTarget.id === "optionsAccentColour")
            {
                //This is all quite messy as I never indended for this when orignally creating it.
                var styles: TCustomStyles = {};
                //I don't want to edit the orignal object here, that should be done by 'UpdateSavedElementProperties'.
                Object.assign(styles, this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles);

                var defaultStyle: IRGB;
                switch (inputTarget.id)
                {
                    case "optionsForegroundColour":
                        defaultStyle = UI.defaultStyles.foregroundColour!;
                        break;
                    case "optionsBackgroundColour":
                        defaultStyle = UI.defaultStyles.backgroundColour!;
                        break;
                    case "optionsAccentColour":
                        defaultStyle = UI.defaultStyles.accentColour!;
                        break;
                }

                var colour: IRGB | undefined;

                var RGB = this.HexToRGB(inputTarget.value);
                if (RGB === false) { ev.preventDefault(); return; }
                else if (RGB.R == defaultStyle.R && RGB.G == defaultStyle.G && RGB.B == defaultStyle.B)
                {
                    this.activeElement.removeAttribute(inputTarget.id);
                    colour = undefined;
                }
                else
                {
                    this.activeElement.setAttribute(inputTarget.id, inputTarget.value);
                    colour = RGB;
                }

                switch (inputTarget.id)
                {
                    case "optionsForegroundColour":
                        styles.foregroundColour = colour;
                        break;
                    case "optionsBackgroundColour":
                        styles.backgroundColour = colour;
                        break;
                    case "optionsAccentColour":
                        styles.accentColour = colour;
                        break;
                }

                this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.UpdateStyles(this.activeElement, styles);
            }
            else if (inputTarget.id === "optionsFontSize")
            {
                var styles: TCustomStyles = {};
                Object.assign(styles, this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles);

                var inputElement = this.editorPropertiesTab.font.fontSize;
                var inputValue = parseInt(inputElement.value);

                if (isNaN(inputValue)) { ev.preventDefault(); return; }
                else if (inputValue > 100)
                {
                    inputElement.value = "100";
                    this.activeElement.setAttribute(inputTarget.id, inputElement.value);
                }
                else if (inputValue < 16)
                {
                    inputElement.value = "16";
                    this.activeElement.removeAttribute(inputTarget.id);
                }
                else
                {
                    this.activeElement.setAttribute(inputTarget.id, inputElement.value);
                }

                styles.fontSize = parseInt(inputElement.value);
                this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.UpdateStyles(this.activeElement, styles);
            }
            else { return; }

            this.UpdateSavedElementProperties(this.activeElement);
        }
    }

    //I should tidy this up a bit as im doing the same thng in multiple places.
    //Run checks here on the values?
    private UpdateSavedElementProperties(element: HTMLDivElement): void
    {
        var location: [string, string, string, string] = this.ui.createdElements.locations[element.id];
        var _position: { top?: string; left?: string; bottom?: string; right?: string; } = {};

        if (element.offsetLeft + element.clientWidth / 2 > this.ui.overlay.clientWidth / 2)
        {
            var right = this.ui.overlay.clientWidth - element.offsetLeft - element.clientWidth
            this.editorPropertiesTab.position.left.value = "";
            this.editorPropertiesTab.position.right.value = right.toString();
            _position.right = `${right}px`;
        }
        else
        {
            this.editorPropertiesTab.position.left.value = element.offsetLeft.toString();
            this.editorPropertiesTab.position.right.value = "";
            _position.left = `${element.offsetLeft}px`;
        }
        if (element.offsetTop + element.clientHeight / 2 > this.ui.overlay.clientHeight / 2)
        {
            var bottom = this.ui.overlay.clientHeight - element.offsetTop - element.clientHeight
            this.editorPropertiesTab.position.top.value = "";
            this.editorPropertiesTab.position.bottom.value = bottom.toString();
            _position.bottom = `${bottom}px`;
        }
        else
        {
            this.editorPropertiesTab.position.top.value = element.offsetTop.toString();
            this.editorPropertiesTab.position.bottom.value = "";
            _position.top = `${element.offsetTop}px`;
        }

        this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position = _position;
        this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].width = element.clientWidth.toString();
        this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].height = element.clientHeight.toString();
        this.editorPropertiesTab.size.width.value = element.clientWidth.toString();
        this.editorPropertiesTab.size.height.value = element.clientHeight.toString();

        if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.foregroundColour === true)
        {
            var colour: IRGB | undefined;
            
            var hex = element.getAttribute(this.editorPropertiesTab.colour.foregroundColour.id);
            if (hex !== null)
            {
                var RGB = this.HexToRGB(hex);
                if (RGB !== false)
                { colour = RGB; }
            }
            else
            { colour = undefined; }

            this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.foregroundColour = colour;
        }
        if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.backgroundColour === true)
        {
            var colour: IRGB | undefined;
            
            var hex = element.getAttribute(this.editorPropertiesTab.colour.backgroundColour.id);
            if (hex !== null)
            {
                var RGB = this.HexToRGB(hex);
                if (RGB !== false)
                { colour = RGB; }
            }
            else
            { colour = undefined; }

            this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.backgroundColour = colour;
        }
        if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.accentColour === true)
        {
            var colour: IRGB | undefined;
            
            var hex = element.getAttribute(this.editorPropertiesTab.colour.accentColour.id);
            if (hex !== null)
            {
                var RGB = this.HexToRGB(hex);
                if (RGB !== false)
                { colour = RGB; }
            }
            else
            { colour = undefined; }

            this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.accentColour = colour;
        }

        if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.fontSize === true)
        {
            var fontSizeAttribute = element.getAttribute(this.editorPropertiesTab.font.fontSize.id);
            var fontSize = fontSizeAttribute !== null && !isNaN(parseInt(fontSizeAttribute)) ? parseInt(fontSizeAttribute) : undefined;
            this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.fontSize = fontSize;
        }

        this.allowUnload = false;
    }

    //https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    private HexToRGB(hex: string): false | IRGB
    {
        var HexSplit = new RegExp(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);
        
        if (HexSplit === null) { return false; }

        var RGB: IRGB =
        {
            R: parseInt(HexSplit[1], 16),
            G: parseInt(HexSplit[2], 16),
            B: parseInt(HexSplit[3], 16)
        }

        if (isNaN(RGB.R) || isNaN(RGB.G) || isNaN(RGB.B)) { return false; }

        return RGB;
    }

    private RGBToHex(RGB: IRGB): string
    {
        return "#" + this.ComponentToHex(RGB.R) + this.ComponentToHex(RGB.G) + this.ComponentToHex(RGB.B);
    }

    private ComponentToHex(component: any): string
    {
        var hex: string = component.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    private DeleteElement(element: HTMLDivElement): void
    {
        this.editorPropertiesTab.optionsRow.style.display = "none";
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

    //Needs tweaking, look at: https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly.
    private ResizeImage(source: string, width: number, height: number): string
    {
        this.resizeCanvas.style.display = "block";

        var image = new Image();
        image.src = source;

        this.resizeCanvas.style.width = `${width}px`;
        this.resizeCanvas.style.height = `${height}px`;
        this.resizeCanvas.width = width;
        this.resizeCanvas.height = height;

        this.resizeCanvas2D.drawImage(image, 0, 0, width, height);

        var resizedImage = this.resizeCanvas.toDataURL("image/png");

        this.resizeCanvas.style.display = "none";

        return resizedImage;
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
        })
        .then((dataURL: string) =>
        {
            this.thumbnail.src = dataURL;
            //console.log(this.ResizeImage(dataURL, 480, 270));
        });
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
                height: this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].height,
                customStyles: this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles
            });
        }

        if (Object.keys(savedElements).length < 1) { Main.Alert("This overlay does not have enough elements to be saved.<br>You must have at least 1 element."); }
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