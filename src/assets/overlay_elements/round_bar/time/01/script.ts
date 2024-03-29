import { Main } from "../../../../js/main.js";
import { MapData, LiveData } from "../../../../js/overlay/types/web.js";
import { TEditableStyles, TCustomStyles } from "../../../../js/overlay/overlayHelper.js";
import { UI } from "../../../../js/overlay/ui.js";

//Consider making a style for each category/type so ts is not duplicated.
export class Script
{
    public readonly resizeMode = 1;
    public readonly editableStyles: TEditableStyles =
    {
        foregroundColour: true,
        backgroundColour: true,
        altColour: true
    }

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
    public AddElement(element: HTMLDivElement): void
    {
        this.elements[element.id] =
        {
            container: element,
            element: Main.ThrowIfNullOrUndefined(element.querySelector(`.round_bar.time._01`)),
            roundBar: Main.ThrowIfNullOrUndefined(element.querySelector(`.round_bar.time._01 .roundBar`)),
            elapsed: Main.ThrowIfNullOrUndefined(element.querySelector(`.round_bar.time._01 .elapsed`)),
            length: Main.ThrowIfNullOrUndefined(element.querySelector(`.round_bar.time._01 .length`)),
            background: Main.ThrowIfNullOrUndefined(element.querySelector(`.round_bar.time._01 .background`)),
            progress: Main.ThrowIfNullOrUndefined(element.querySelector(`.round_bar.time._01 .progress`)),
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

    public UpdateStyles(element: HTMLDivElement, styles: TCustomStyles): void
    {
        if (this.elements[element.id] === undefined) { return; }

        if (styles.foregroundColour !== undefined)
        {
            this.elements[element.id].elapsed.style.color = `rgba(${styles.foregroundColour.R}, ${styles.foregroundColour.G}, ${styles.foregroundColour.B}, 1)`;
            this.elements[element.id].length.style.color = `rgba(${styles.foregroundColour.R}, ${styles.foregroundColour.G}, ${styles.foregroundColour.B}, 1)`;
        }
        else
        {
            this.elements[element.id].elapsed.style.removeProperty("color");
            this.elements[element.id].length.style.removeProperty("color");
        }

        if (styles.backgroundColour !== undefined)
        {
            this.elements[element.id].background.style.stroke = `rgba(${styles.backgroundColour.R}, ${styles.backgroundColour.G}, ${styles.backgroundColour.B}, 0.5)`;
        }
        else
        {
            this.elements[element.id].background.style.removeProperty("stroke");
        }

        if (styles.altColour !== undefined)
        {
            this.elements[element.id].progress.style.stroke = `rgba(${styles.altColour.R}, ${styles.altColour.G}, ${styles.altColour.B}, 1)`;
        }
        else
        {
            this.elements[element.id].progress.style.removeProperty("stroke");
        }
    }

    public RemoveElement(element: HTMLDivElement): void
    {
        this.elements[element.id].mutationObserver.disconnect();
        delete this.elements[element.id];
    }

    public ResetData(): void
    {
        for (const key of Object.keys(this.elements))
        {
            this.elements[key].elapsed.innerText = UI.SecondsToMinutes(0);
            this.elements[key].length.innerText = UI.SecondsToMinutes(0);
            this.SetProgress(key, 0);
        }
    }

    public UpdateMapData(data: MapData): void
    {
        this.MapLength = data.Duration;

        for (const key of Object.keys(this.elements))
        {
            var value = this.elements[key];
            value.length.innerHTML = UI.SecondsToMinutes(data.Duration);
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
        if (this.elements[id].container.clientWidth <= this.size) { return; }
        this.elements[id].container.style.height = this.elements[id].container.style.width;
        this.elements[id].element.style.transform = `scale(${parseInt(this.elements[id].container.style.width.substr(0, this.elements[id].container.style.width.length - 2)) / this.size})`;
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
        length: HTMLParagraphElement,
        background: SVGAElement,
        progress: SVGAElement;
        percentage: number,
        mutationObserver: MutationObserver
    }
}