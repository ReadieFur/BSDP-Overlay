import { Main } from "../../../../js/main";
import { MapData, LiveData } from "../../../../js/overlay/client";

export class Script
{
    private height: number;
    private elements: Elements;

    constructor()
    {
        this.height = 15;
        this.elements = {};
    }

    public AddElement(element: HTMLDivElement, width?: number, height?: number): void
    {
        this.elements[element.id] =
        {
            container: element,
            element: Main.ThrowIfNullOrUndefined(element.querySelector(".text.health._01")),
            text: Main.ThrowIfNullOrUndefined(element.querySelector(".text.health._01 > .text")),
            mutationObserver: new MutationObserver((ev: MutationRecord[]) => { this.MutationEvent(element.id, ev); })
        }

        this.elements[element.id].mutationObserver.observe(this.elements[element.id].container, { attributes: true });
    }

    public RemoveElement(element: HTMLDivElement): void
    {

    }

    public UpdateMapData(data: MapData): void
    {

    }
    
    public UpdateLiveData(data: LiveData): void
    {
        
    }

    private MutationEvent(id: string, mutationRecord: MutationRecord[])
    {
        this.elements[id].container.style.width = "max-content";
        this.Resize(id, parseInt(this.elements[id].container.style.height.substr(0, this.elements[id].container.style.height.length - 2)));
    }

    private Resize(id: string, height: number)
    {
        this.elements[id].element.style.transform = `scale(${height / this.height})`;
    }
}

type Elements =
{
    [id: string]:
    {
        container: HTMLDivElement,
        element: HTMLDivElement,
        text: HTMLHeadingElement,
        mutationObserver: MutationObserver
    }
}