import { DragElement } from "../dragElement";
import { Main } from "../main";
import { MapData, LiveData } from "./client";
import { TCustomStyles, TEditableStyles } from "./overlayHelper";

export class UI
{
    public overlay!: HTMLDivElement;
    public importedElements!: ElementsJSON;
    public createdElements!: CreatedElements;

    //This isn't ideal using :TCustomStyles as the peoperties can be undefined but for when im checking this they should all be defined (at least the ones im looking for). 
    //Store this information on the element instead so different elements can have different defaults.
    public static readonly defaultStyles: TCustomStyles =
    {
        foregroundColour:
        {
            R: 255,
            G: 255,
            B: 255
        },
        backgroundColour:
        {
            R: 255,
            G: 255,
            B: 255
        },
        accentColour:
        {
            R: 100,
            G: 0,
            B: 255
        }
    }

    public async Init(): Promise<UI>
    {
        this.overlay = Main.ThrowIfNullOrUndefined(document.querySelector("#overlay"));
        this.importedElements = await this.ImportElements();
        this.createdElements =
        {
            idCount: 0,
            locations: {},
            elements: {}
        };

        var defaultStyles = document.createElement("style");
        defaultStyles.id = "overlayDefaultStyles";
        defaultStyles.innerHTML = `
            #overlay *
            {
                --overlayForegroundColour: ${UI.defaultStyles.foregroundColour!.R}, ${UI.defaultStyles.foregroundColour!.B}, ${UI.defaultStyles.foregroundColour!.B};
            }
        `;
        document.head.appendChild(defaultStyles);

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
        for (const category of Object.keys(this.createdElements.elements))
        {
            for (const type of Object.keys(this.createdElements.elements[category]))
            {
                for (const id of Object.keys(this.createdElements.elements[category][type]))
                {
                    this.createdElements.elements[category][type][id].script.UpdateMapData(data);
                }
            }
        }
    }

    public UpdateLiveData(data: LiveData): void
    {
        for (const category of Object.keys(this.createdElements.elements))
        {
            for (const type of Object.keys(this.createdElements.elements[category]))
            {
                for (const id of Object.keys(this.createdElements.elements[category][type]))
                {
                    this.createdElements.elements[category][type][id].script.UpdateLiveData(data);
                }
            }
        }
    }

    public CreateElement(category: string, type: string, id: string): HTMLDivElement
    {
        if (this.importedElements[category][type][id] === undefined)
        { throw new TypeError(`${type}_${category}_${id} was not found in the imported elements list.`); } //Or return an error message

        if (this.createdElements.elements[category] === undefined) { this.createdElements.elements[category] = {}; }
        if (this.createdElements.elements[category][type] === undefined) { this.createdElements.elements[category][type] = {}; }
        if (this.createdElements.elements[category][type][id] === undefined)
        {
            var style: HTMLStyleElement = document.createElement("style");
            style.id = `style_${category}_${type}_${id}`;
            style.innerHTML = this.importedElements[category][type][id].css;
            document.head.appendChild(style);

            this.createdElements.elements[category][type][id] =
            {
                script: new this.importedElements[category][type][id].script(),
                elements: {}
            };
        }
        
        var container: HTMLDivElement = document.createElement("div");
        container.id = `element_${++this.createdElements.idCount}`;
        container.classList.add("container");
        container.innerHTML = this.importedElements[category][type][id].html;
        
        this.createdElements.elements[category][type][id].script.AddElement(container);
        //It would be better if I stored all hte properties in the element script and then asked for them when I needed it.
        //I cannot use computed styles or client/offset values here because the element does not exist on the DOM yet.
        this.createdElements.elements[category][type][id].elements[container.id] =
        {
            position:
            {
                top: "0px",
                left: "0px"
            },
            width: container.style.height,
            height: container.style.height,
            customStyles: {}
        };

        return container;
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
                    elements[category][type][name].html = await jQuery.ajax(
                    {
                        type: "GET",
                        url: `${Main.WEB_ROOT}/assets/overlay_elements/${category}/${type}/${name}/html.html`,
                        dataType: "html"
                    });

                    elements[category][type][name].css = await jQuery.ajax(
                    {
                        type: "GET",
                        url: `${Main.WEB_ROOT}/assets/overlay_elements/${category}/${type}/${name}/css.css`,
                        dataType: "html" //CSS
                    });

                    elements[category][type][name].script = (await import(`${Main.WEB_ROOT}/assets/overlay_elements/${category}/${type}/${name}/script.js`)).Script;
                }
            }
        }

        return elements;
    }

    private IsMapData(data: MapData | LiveData): data is MapData
    {
        return (data as MapData).PluginVersion !== undefined;
    }
}

export type ElementsJSON =
{
    [category: string]:
    {
        [type: string]:
        {
            [id: string]:
            {
                showInEditor: boolean,
                html: string,
                css: string,
                script: ElementScript
            }
        }
    }
}

export type SavedElements =
{
    [category: string]:
    {
        [type: string]:
        {
            [id: string]:
            {
                position:
                {
                    top?: string,
                    left?: string,
                    bottom?: string,
                    right?: string,
                }
                width: string,
                height: string,
                customStyles: TCustomStyles
            }[];
        }
    }
}

type CreatedElements =
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
                            position:
                            {
                                //These are left as a string for % values
                                top?: string,
                                left?: string,
                                bottom?: string,
                                right?: string,
                            }
                            width: string,
                            height: string,
                            customStyles: TCustomStyles,
                            //mutationObserver?: MutationObserver,
                            dragElement?: DragElement
                        }
                    }
                }
            }
        }
    }
}

interface ElementScript
{
    readonly resizeMode: 0 | 1 | 2 | 3, //0 = No resize, 1 = Both, 2 = Width, 3 = Height
    readonly editableStyles: TEditableStyles;
    new(): ElementScript;
    AddElement(element: HTMLDivElement): void;
    UpdateStyles(element: HTMLDivElement, styles: TCustomStyles): void;
    RemoveElement(element: HTMLDivElement): void;
    UpdateMapData(data: MapData): void;
    UpdateLiveData(data: LiveData): void;
}