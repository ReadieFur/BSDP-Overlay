import { Main } from "../../../../js/main";
import { MapData, LiveData } from "../../../../js/overlay/client";

export class Script
{
    private size: number;
    private position: number;
    private strokeWidth: number;
    private radius: number;
    private circumference: number;

    private elements: Elements;

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
    public AddElement(element: HTMLDivElement): void
    {
        this.elements[element.id] =
        {
            container: element,
            element: Main.ThrowIfNullOrUndefined(element.querySelector(`.circle_bar.accuracy._01`)),
            roundBar: Main.ThrowIfNullOrUndefined(element.querySelector(`.circle_bar.accuracy._01 .roundBar`)),
            accuracy: Main.ThrowIfNullOrUndefined(element.querySelector(`.circle_bar.accuracy._01 .accuracy`)),
            background: Main.ThrowIfNullOrUndefined(element.querySelector(`.circle_bar.accuracy._01 .background`)),
            progress: Main.ThrowIfNullOrUndefined(element.querySelector(`.circle_bar.accuracy._01 .progress`)),
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

        this.elements[element.id].mutationObserver.observe(this.elements[element.id].container, { attributes: true });
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
        for (const key of Object.keys(this.elements))
        {
            var value = this.elements[key];
            value.accuracy.innerHTML = `${Math.round(data.Accuracy)}%`;
            this.SetProgress(key, data.Accuracy);
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
        accuracy: HTMLParagraphElement,
        background: SVGAElement,
        progress: SVGAElement,
        percentage: number,
        mutationObserver: MutationObserver
    }
}