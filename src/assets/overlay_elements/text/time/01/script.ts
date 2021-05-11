import { Main } from "../../../../js/main.js";
import { MapData, LiveData } from "../../../../js/overlay/client.js";
import { TEditableStyles, TCustomStyles } from "../../../../js/overlay/overlayHelper.js";
import { UI } from "../../../../js/overlay/ui.js";

export class Script
{
    public readonly resizeMode = 0;
    public readonly editableStyles: TEditableStyles =
    {
        fontSize: true
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
            textContainer: Main.ThrowIfNullOrUndefined(element.querySelector(`.text.time._01 > .textContainer`)),
            elapsed: Main.ThrowIfNullOrUndefined(element.querySelector(`.text.time._01 > .textContainer > .elapsed`)),
            length: Main.ThrowIfNullOrUndefined(element.querySelector(`.text.time._01 > .textContainer > .length`))
        };
    }

    public UpdateStyles(element: HTMLDivElement, styles: TCustomStyles): void
    {
        if (this.elements[element.id] === undefined) { return; }

        if (styles.fontSize !== undefined)
        {
            this.elements[element.id].textContainer.style.fontSize = `${styles.fontSize}px`;
        }
        else
        {
            this.elements[element.id].textContainer.style.removeProperty("fontSize");
        }
    }

    public RemoveElement(element: HTMLDivElement): void
    {
        delete this.elements[element.id];
    }

    public UpdateMapData(data: MapData): void
    {
        for (const key of Object.keys(this.elements))
        {
            var element = this.elements[key];
            element.length.innerText = UI.SecondsToMinutes(data.Length);
        }
    }

    public UpdateLiveData(data: LiveData): void
    {
        for (const key of Object.keys(this.elements))
        {
            var element = this.elements[key];
            element.elapsed.innerText = UI.SecondsToMinutes(data.TimeElapsed);
        }
    }
}

type Elements =
{
    [id: string]:
    {
        container: HTMLDivElement,
        textContainer: HTMLParagraphElement,
        elapsed: HTMLSpanElement,
        length: HTMLSpanElement
    }
}