import { Main } from "../../../../js/main.js";
import { MapData, LiveData } from "../../../../js/overlay/client.js";
import { TEditableStyles, TCustomStyles } from "../../../../js/overlay/overlayHelper.js";

export class Script
{
    public readonly initialWidth = 90;
    public readonly initialHeight = 25;
    public readonly resizeMode = 1;
    public readonly editableStyles: TEditableStyles =
    {
        backgroundColour: true
    }

    private minWidth: number;
    private minHeight: number;

    private elements: Elements;

    public constructor()
    {
        this.elements = {};
        this.minWidth = 16;
        this.minHeight = 16;
    }

    //Create add update and remove functions
    public AddElement(element: HTMLDivElement): void
    {
        this.elements[element.id] =
        {
            container: element,
            element: Main.ThrowIfNullOrUndefined(element.querySelector(`.shape.rectangle._01`)),
            mutationObserver: new MutationObserver((ev: MutationRecord[]) => { this.MutationEvent(element.id, ev); })
        };

        this.elements[element.id].container.style.minWidth = `${this.minWidth}px`;
        this.elements[element.id].container.style.minHeight = `${this.minHeight}px`;
        this.elements[element.id].container.style.width = `${this.minWidth}px`;
        this.elements[element.id].container.style.height = `${this.minHeight}px`;
        this.elements[element.id].mutationObserver.observe(this.elements[element.id].container, { attributes: true });
    }

    public UpdateStyles(element: HTMLDivElement, styles: TCustomStyles): void
    {
        if (this.elements[element.id] === undefined) { return; }

        if (styles.backgroundColour !== undefined)
        { this.elements[element.id].element.style.backgroundColor = `rgba(${styles.backgroundColour.R}, ${styles.backgroundColour.G}, ${styles.backgroundColour.B}, 0.5)`; }
        else
        { this.elements[element.id].element.style.removeProperty("background-color"); }
    }

    public RemoveElement(element: HTMLDivElement): void
    {
        this.elements[element.id].mutationObserver.disconnect();
        delete this.elements[element.id];
    }

    public UpdateMapData(data: MapData): void
    {
    }

    public UpdateLiveData(data: LiveData): void
    {
    }

    private MutationEvent(id: string, mutationRecord: MutationRecord[])
    {
        if (this.elements[id].container.clientWidth <= this.minWidth) { this.elements[id].container.style.width = `${this.minWidth}px`; }
        if (this.elements[id].container.clientHeight <= this.minHeight) { this.elements[id].container.style.height = `${this.minHeight}px`; }
        this.elements[id].element.style.width = this.elements[id].container.style.width;
        this.elements[id].element.style.height = this.elements[id].container.style.height;
    }
}

type Elements =
{
    [id: string]:
    {
        container: HTMLDivElement,
        element: HTMLDivElement,
        mutationObserver: MutationObserver
    }
}