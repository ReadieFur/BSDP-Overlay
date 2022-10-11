import { Main } from "../../../../js/main.js";
import { MapData, LiveData } from "../../../../js/overlay/types/web.js";
import { TEditableStyles, TCustomStyles } from "../../../../js/overlay/overlayHelper.js";

export class Script
{
    public readonly resizeMode = 0;
    public readonly editableStyles: TEditableStyles =
    {
        foregroundColour: true,
        fontSize: true,
        content: true
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
            element: Main.ThrowIfNullOrUndefined(element.querySelector(`.misc.text._01`)),
            text: Main.ThrowIfNullOrUndefined(element.querySelector(`.misc.text._01 .text`))
        };
    }

    public UpdateStyles(element: HTMLDivElement, styles: TCustomStyles): void
    {
        if (this.elements[element.id] === undefined) { return; }

        if (styles.foregroundColour !== undefined)
        { this.elements[element.id].text.style.color = `rgba(${styles.foregroundColour.R}, ${styles.foregroundColour.G}, ${styles.foregroundColour.B}, 1)`; }
        else
        { this.elements[element.id].text.style.removeProperty("color"); }

        if (styles.fontSize !== undefined)
        { this.elements[element.id].text.style.fontSize = `${styles.fontSize}px`; }
        else
        { this.elements[element.id].text.style.removeProperty("fontSize"); }

        this.elements[element.id].text.innerText = styles.content !== undefined ? styles.content : "Text";
    }

    public RemoveElement(element: HTMLDivElement): void
    {
        delete this.elements[element.id];
    }

    public ResetData(): void
    {
    }

    public UpdateMapData(data: MapData): void
    {
    }

    public UpdateLiveData(data: LiveData): void
    {
    }
}

type Elements =
{
    [id: string]:
    {
        container: HTMLDivElement,
        element: HTMLDivElement,
        text: HTMLParagraphElement
    }
}