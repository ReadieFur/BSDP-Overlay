import { Main } from "../../../../js/main.js";
import { MapData, LiveData } from "../../../../js/overlay/client.js";
import { TEditableStyles, TCustomStyles } from "../../../../js/overlay/overlayHelper.js";

export class Script
{
    public readonly resizeMode = 0;
    public readonly editableStyles: TEditableStyles =
    {

    }

    private elements: Elements;

    public constructor()
    {
        this.elements = {};
    }

    //Create add update and remove functions
    public AddElement(element: HTMLDivElement): void
    {
        this.elements[element.id] =
        {
            container: element,
            element: Main.ThrowIfNullOrUndefined(element.querySelector(`.CATEGORY.DATA_TYPE._INDEX`)),
        };
    }

    public UpdateStyles(element: HTMLDivElement, styles: TCustomStyles): void
    {
        if (this.elements[element.id] === undefined) { return; }
    }

    public RemoveElement(element: HTMLDivElement): void
    {
        delete this.elements[element.id];
    }

    public ResetData(): void
    {
        for (const key of Object.keys(this.elements))
        {
            var element = this.elements[key];
        }
    }

    public UpdateMapData(data: MapData): void
    {
        for (const key of Object.keys(this.elements))
        {
            var element = this.elements[key];
        }
    }

    public UpdateLiveData(data: LiveData): void
    {
        for (const key of Object.keys(this.elements))
        {
            var element = this.elements[key];
        }
    }
}

type Elements =
{
    [id: string]:
    {
        container: HTMLDivElement,
        element: HTMLDivElement
    }
}