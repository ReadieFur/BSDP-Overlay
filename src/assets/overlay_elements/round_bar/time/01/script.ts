import { Main } from "../../../../js/main";
import { MapData, LiveData } from "../../../../js/overlay/client";
import { UI } from "../../../../js/overlay/ui";

export class Script
{
    //For now these values will be the same for all elements.
    private size: number;
    private position: number; //This is also the radius?
    private strokeWidth: number;
    private radius: number;
    private circumference: number;

    private elements: Elements;

    //Store these in UI.ts not each individual script
    private MapLength?: number;

    public constructor()
    {
        this.size = 90;
        this.position = this.size / 2;
        this.strokeWidth = 4;
        this.radius = this.position - (this.strokeWidth * 2);
        this.circumference = this.radius * 2 * Math.PI;

        this.elements = {};
    }

    //Create add update and remove functions
    public AddElement(element: HTMLDivElement, width?: number, height?: number)
    {
        this.elements[element.id] =
        {
            container: element,
            element: Main.ThrowIfNullOrUndefined(element.querySelector(`.circle_bar.time_01`)),
            roundBar: Main.ThrowIfNullOrUndefined(element.querySelector(`.circle_bar.time_01 .roundBar`)),
            elapsed: Main.ThrowIfNullOrUndefined(element.querySelector(`.circle_bar.time_01 .elapsed`)),
            length: Main.ThrowIfNullOrUndefined(element.querySelector(`.circle_bar.time_01 .length`)),
            background: Main.ThrowIfNullOrUndefined(element.querySelector(`.circle_bar.time_01 .background`)),
            progress: Main.ThrowIfNullOrUndefined(element.querySelector(`.circle_bar.time_01 .progress`)),
            percentage: 0,
            mutationObserver: new MutationObserver((ev: MutationRecord[]) => { this.MutationEvent(element.id, ev); })
        };

        //This was orignally all set in SCSS but I moved it to here.
        this.elements[element.id].container.style.minWidth = `${this.size}px`;
        this.elements[element.id].container.style.minHeight = `${this.size}px`;
        this.elements[element.id].container.style.width = `${this.size}px`;
        this.elements[element.id].container.style.height = `${this.size}px`;
        this.elements[element.id].element.style.width = `${this.size}px`;
        this.elements[element.id].element.style.height = `${this.size}px`;
        this.elements[element.id].roundBar.style.width = `${this.size}px`;
        this.elements[element.id].roundBar.style.height = `${this.size}px`;
        this.elements[element.id].background.style.strokeWidth = this.strokeWidth.toString();
        this.elements[element.id].background.setAttribute("cx", this.position.toString());
        this.elements[element.id].background.setAttribute("cy", this.position.toString());
        this.elements[element.id].background.setAttribute("r", this.radius.toString());
        this.elements[element.id].progress.style.strokeWidth = this.strokeWidth.toString();
        this.elements[element.id].progress.setAttribute("cx", this.position.toString());
        this.elements[element.id].progress.setAttribute("cy", this.position.toString());
        this.elements[element.id].progress.setAttribute("r", this.radius.toString());
        this.elements[element.id].progress.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.elements[element.id].progress.style.strokeDashoffset = (this.circumference - this.elements[element.id].percentage / 100 * this.circumference).toString();

        if (width !== undefined) { this.Resize(element.id, width); }

        this.elements[element.id].mutationObserver.observe(this.elements[element.id].container, { attributes: true });
    }

    public UpdateMapData(data: MapData): void
    {
        this.MapLength = data.Length;

        for (const key of Object.keys(this.elements))
        {
            var value = this.elements[key];
            value.length.innerHTML = UI.SecondsToMinutes(data.Length);
        }
    }

    public UpdateLiveData(data: LiveData): void
    {
        for (const key of Object.keys(this.elements))
        {
            var value = this.elements[key];
            value.elapsed.innerHTML = UI.SecondsToMinutes(data.TimeElapsed);
            if (this.MapLength !== undefined) { this.SetProgress(key, data.TimeElapsed / this.MapLength * 100); }
        }
    }

    private MutationEvent(id: string, mutationRecord: MutationRecord[])
    {
        this.elements[id].container.style.height = this.elements[id].container.style.width;
        this.Resize(id, parseInt(this.elements[id].container.style.width.substr(0, this.elements[id].container.style.width.length - 2)));
    }

    //I had written a function to resize the element with different formulas but I will be using scale instead as it is easier to do for this element.
    private Resize(id: string, width: number)
    {
        this.elements[id].element.style.transform = `scale(${width / this.size})`;
    }

    private SetProgress(id: string, percentage: number)
    {
        this.elements[id].percentage = percentage;
        this.elements[id].progress.style.strokeDashoffset = `${this.circumference - percentage / 100 * this.circumference}`;
    }
}

type Elements =
{
    [id: string]:
    {
        container: HTMLDivElement,
        roundBar: SVGElement,
        element: HTMLDivElement,
        elapsed: HTMLParagraphElement,
        length: HTMLParagraphElement
        background: SVGAElement;
        progress: SVGAElement;
        percentage: number,
        mutationObserver: MutationObserver
    }
}