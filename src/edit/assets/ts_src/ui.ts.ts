import { StaticData, LiveData } from "./client.ts.js";

export class ui
{
    public ImportedElements!: ElementsJSON;
    public ActiveElements = new activeElements();

    constructor()
    {
        this.importElements();
    }

    private importElements()
    {
        jQuery.ajax(
        {
            async: false,
            type: "GET",
            url: "assets/elements/elements.json",
            dataType: "json",
            success: (response: ElementsJSON) =>
            {
                if (typeof(response) !== 'object') { throw new TypeError("elements is not a type of object"); }
                Object.keys(response).forEach(type =>
                {
                    Object.keys(response[type]).forEach(category =>
                    {
                        Object.keys(response[type][category]).forEach(name =>
                        {
                            let elementPath: string = `${type}/${category}/${name}`;
                            jQuery.ajax(
                            {
                                async: false,
                                type: "GET",
                                url: `assets/elements/${elementPath}/html.html`,
                                dataType: "html",
                                success: (elementData: string) => { response[type][category][name].data = elementData.replace("ELEMENTPATH", elementPath); }
                            });
                        });
                    });
                });
                this.ImportedElements = response;
            }
        });
    }

    public updateStaticData(data: StaticData)
    {
        
    }

    public updateLiveData(data: LiveData)
    {
        
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
                data?: string
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

class activeElements
{
    public count: number = 0;
    public elements: OverlayElements = { };

    constructor(_count?: number, _elements?: OverlayElements)
    {
        if (_count !== undefined) { this.count = _count; }
        if (_elements !== undefined) { this.elements = _elements; }
    }

    /**
     * Add/Update a value within the Elements object
     * @param _path The location within the object you want to write to
     * @param value The value you want to assign to the given path
     */
    public setElements(_path: string[], value: string)
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