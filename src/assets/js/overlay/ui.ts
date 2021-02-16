import { MapData, LiveData } from "./client.js";
import { main } from "../../../edit/assets/js/index.js";

export class UI
{
    public ImportedElements: ElementsJSON = {};
    public ActiveElements?: activeElements;

    public async init(id?: string): Promise<UI>
    {
        await this.importElements();
        if (this.importElements === undefined) { throw new TypeError("ImportedElements is undefined"); }
        this.ActiveElements = new activeElements().init(id);
        return this;
    }

    private async importElements(): Promise<void>
    {
        let elements: ElementsJSON = await jQuery.ajax(
        {
            type: "GET",
            url: "assets/elements/elements.json",
            dataType: "json"
        });

        if (typeof(elements) !== 'object') { throw new TypeError("elements is not a type of object"); }
        this.ImportedElements = elements;

        for (const type of Object.keys(this.ImportedElements))
        {
            for (const category of Object.keys(this.ImportedElements[type]))
            {
                for (const name of Object.keys(this.ImportedElements[type][category]))
                {
                    let elementPath: string = `${type}/${category}/${name}`;

                    let elementHTML: string = await jQuery.ajax(
                    {
                        type: "GET",
                        url: `assets/elements/${elementPath}/html.html`,
                        dataType: "html"
                    });
                    this.ImportedElements[type][category][name].data = elementHTML.replace("ELEMENTPATH", elementPath);

                    this.ImportedElements[type][category][name].script = await import(`../elements/${elementPath}/script.js`);
                }
            }
        }
    }

    public updateUIElements(jsonData: MapData | LiveData | any): void
    {
        if (this.ActiveElements !== undefined)
        {
            function isStaticData(data: MapData | LiveData): data is MapData { return (data as MapData).GameVersion !== undefined; }
            if (isStaticData(jsonData)) { for (let i = 0; i < this.ActiveElements.scripts.length; i++) { this.ActiveElements.scripts[i].updateStaticData(jsonData); } }
            else { for (let i = 0; i < this.ActiveElements.scripts.length; i++) { this.ActiveElements.scripts[i].updateLiveData(jsonData); } }
        }
    }
}

class activeElements
{
    public count: number = 0;
    public elements: OverlayElements = {};
    public scripts: elementScript[] = [];

    public init(_id?: string): activeElements
    {
        if (_id === undefined)
        {
            //Dont load any elements into the UI
        }
        else
        {
            //Get the stored elements
        }

        if (main.useEditor)
        {
            //Load all UI scripts
        }
        else
        {
            //Only load the nessicary scripts
        }
        
        return this;
    }

    /**
     * Add/Update a value within the Elements object
     * @param _path The location within the object you want to write to
     * @param value The value you want to assign to the given path
     */
    public setElements(_path: string[], value: string): void
    {
        let j: any[] = [this.elements];
        for (let i = 0; i < _path.length; i++)
        {
            if (i == _path.length - 1) { j.push(j[i][_path[i]] = value); }
            else if (j[i][_path[i]] === undefined) { j.push(j[i][_path[i]] = {}); }
            else { j.push(j[i][_path[i]]); };
        }
    }
}

export type ElementsJSON =
{
    [type: string]:
    {
        [category: string]:
        {
            [name: string]:
            {
                showInEditor: boolean,
                data?: string,
                script?: elementScript
            }
        }
    }
}

export type OverlayElements =
{
    [type: string]:
    {
        [category: string]:
        {
            [id: string]:
            {
                name?: string,
                styles?: string
            }
        }
    }
}

interface elementScript
{
    init(): elementScript;
    updateStaticData(data: MapData): void;
    updateLiveData(data: LiveData): void;
}