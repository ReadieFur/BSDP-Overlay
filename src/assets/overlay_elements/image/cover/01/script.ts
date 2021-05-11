import { Main } from "../../../../js/main.js";
import { MapData, LiveData } from "../../../../js/overlay/client.js";
import { TEditableStyles, TCustomStyles } from "../../../../js/overlay/overlayHelper.js";

export class Script
{
    public readonly resizeMode = 1;
    public readonly editableStyles: TEditableStyles =
    {

    }

    private size: number;

    private elements: Elements;

    public constructor()
    {
        this.size = 90;

        this.elements = {};
    }

    //Create add update and remove functions
    public AddElement(element: HTMLDivElement): void
    {
        this.elements[element.id] =
        {
            container: element,
            element: Main.ThrowIfNullOrUndefined(element.querySelector(`.image.cover._01`)),
            image: Main.ThrowIfNullOrUndefined(element.querySelector(`.image.cover._01 > img`)),
            mutationObserver: new MutationObserver((ev: MutationRecord[]) => { this.MutationEvent(element.id, ev); })
        };

        this.elements[element.id].container.style.minWidth = `${this.size}px`;
        this.elements[element.id].container.style.minHeight = `${this.size}px`;
        this.elements[element.id].container.style.width = `${this.size}px`;
        this.elements[element.id].container.style.height = `${this.size}px`;
        this.elements[element.id].element.style.width = `${this.size}px`;
        this.elements[element.id].element.style.height = `${this.size}px`;
        this.elements[element.id].image.style.width = `${this.size}px`;
        this.elements[element.id].image.style.height = `${this.size}px`;

        this.elements[element.id].mutationObserver.observe(this.elements[element.id].container, { attributes: true });
    }

    public UpdateStyles(element: HTMLDivElement, styles: TCustomStyles): void
    {
        if (this.elements[element.id] === undefined) { return; }
    }

    public RemoveElement(element: HTMLDivElement): void
    {
        this.elements[element.id].mutationObserver.disconnect();
        delete this.elements[element.id];
    }

    public UpdateMapData(data: MapData): void
    {
        for (const key of Object.keys(this.elements))
        {
            var container = this.elements[key];
            container.image.src = data.coverImage !== null ? data.coverImage : `${Main.WEB_ROOT}/assets/images/BeatSaberIcon.jpg`;
        }
    }

    public UpdateLiveData(data: LiveData): void
    {
    }

    private MutationEvent(id: string, mutationRecord: MutationRecord[])
    {
        this.elements[id].container.style.height = this.elements[id].container.style.width;
        this.Resize(id, parseInt(this.elements[id].container.style.width.substr(0, this.elements[id].container.style.width.length - 2)));
    }

    private Resize(id: string, width: number)
    {
        this.elements[id].element.style.transform = `scale(${width / this.size})`;
    }
}

type Elements =
{
    [id: string]:
    {
        container: HTMLDivElement,
        element: HTMLDivElement,
        image: HTMLImageElement,
        mutationObserver: MutationObserver
    }
}