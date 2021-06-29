import { Main } from "../main.js";
import { MapData, LiveData } from "./client.js";
import { CreatedElements, ElementsJSON, TCustomStyles } from "./overlayHelper.js";

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
            R: 40,
            G: 40,
            B: 40
        },
        altColour:
        {
            R: 255,
            G: 255,
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
            #overlay .container *
            {
                --overlayForegroundColour: ${UI.defaultStyles.foregroundColour!.R}, ${UI.defaultStyles.foregroundColour!.G}, ${UI.defaultStyles.foregroundColour!.B};
                --overlayBackgroundColour: ${UI.defaultStyles.backgroundColour!.R}, ${UI.defaultStyles.backgroundColour!.G}, ${UI.defaultStyles.backgroundColour!.B};
                --overlayAltColour: ${UI.defaultStyles.altColour!.R}, ${UI.defaultStyles.altColour!.G}, ${UI.defaultStyles.altColour!.B};
            }

            #overlay .preview
            {
                display: none;
            }
        `;
        //Append to the overlay?
        document.head.appendChild(defaultStyles);

        return this;
    }

    public static SecondsToMinutes(_seconds: number): string
    {
        let mins: string = Math.floor(_seconds / 60).toString().padStart(2, "0");
        let seconds: string = (_seconds - (Math.floor(_seconds / 60) * 60)).toString().padStart(2, "0");
        return `${mins}:${seconds}`;
    }

    public static SeperateNumber(number: number | string, seperator?: string): string
    {
        return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, seperator !== undefined ? seperator : ",");
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