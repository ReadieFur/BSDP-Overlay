import { Main } from "../../../../js/main.js";
import { MapData, LiveData } from "../../../../js/overlay/types/web.js";
import { TEditableStyles, TCustomStyles } from "../../../../js/overlay/overlayHelper.js";

export class Script
{
    public readonly initialWidth = 90;
    public readonly initialHeight = 15;
    public readonly resizeMode = 1;
    public readonly editableStyles: TEditableStyles =
    {
        foregroundColour: true,
        backgroundColour: true,
        //altColour: true,
        align:
        {
            left: true,
            right: true,
            center: true
        }
    }

    private minWidth: number;
    private minHeight: number;

    private elements: Elements;

    public constructor()
    {
        this.elements = {};
        this.minWidth = 15;
        this.minHeight = 15;
    }

    //Create add update and remove functions
    public AddElement(element: HTMLDivElement): void
    {
        this.elements[element.id] =
        {
            container: element,
            element: Main.ThrowIfNullOrUndefined(element.querySelector(`.bar.accuracy._01`)),
            background: Main.ThrowIfNullOrUndefined(element.querySelector(`.bar.accuracy._01 .background`)),
            track: Main.ThrowIfNullOrUndefined(element.querySelector(`.bar.accuracy._01 .track`)),
            bar: Main.ThrowIfNullOrUndefined(element.querySelector(`.bar.accuracy._01 .bar`)),
            mutationObserver: new MutationObserver((ev: MutationRecord[]) => { this.MutationEvent(element.id, ev); }),
            progress: 100
        };

        this.elements[element.id].container.style.minWidth = `${this.minWidth}px`;
        this.elements[element.id].container.style.minHeight = `${this.minHeight}px`;
        this.elements[element.id].container.style.width = `${this.minWidth}px`;
        this.elements[element.id].container.style.height = `${this.minHeight}px`;
        this.elements[element.id].background.style.width = `${this.minWidth}px`;
        this.elements[element.id].background.style.height = `${this.minHeight}px`;

        this.elements[element.id].mutationObserver.observe(this.elements[element.id].container, { attributes: true });
    }

    public UpdateStyles(element: HTMLDivElement, styles: TCustomStyles): void
    {
        if (this.elements[element.id] === undefined) { return; }

        //#region Colours.
        if (styles.foregroundColour !== undefined)
        { this.elements[element.id].bar.style.backgroundColor = `rgba(${styles.foregroundColour.R}, ${styles.foregroundColour.G}, ${styles.foregroundColour.B}, 1)`; }
        else
        { this.elements[element.id].bar.style.removeProperty("backgroundColor"); }

        /*if (styles.backgroundColour !== undefined)
        { this.elements[element.id].background.style.backgroundColor = `rgba(${styles.backgroundColour.R}, ${styles.backgroundColour.G}, ${styles.backgroundColour.B}, 0.5)`; }
        else
        { this.elements[element.id].background.style.removeProperty("backgroundColor"); }

        if (styles.altColour !== undefined)
        { this.elements[element.id].track.style.backgroundColor = `rgba(${styles.altColour.R}, ${styles.altColour.G}, ${styles.altColour.B}, 0.5)`; }
        else
        { this.elements[element.id].track.style.removeProperty("backgroundColor"); }*/

        if (styles.backgroundColour !== undefined)
        { this.elements[element.id].track.style.backgroundColor = `rgba(${styles.backgroundColour.R}, ${styles.backgroundColour.G}, ${styles.backgroundColour.B}, 0.5)`; }
        else
        { this.elements[element.id].track.style.removeProperty("backgroundColor"); }
        //#endregion

        //#region Alignment.
        this.elements[element.id].bar.style.removeProperty("top");
        this.elements[element.id].bar.style.removeProperty("left");
        this.elements[element.id].bar.style.removeProperty("bottom");
        this.elements[element.id].bar.style.removeProperty("right");
        this.elements[element.id].bar.style.removeProperty("transform");
        switch (styles.align)
        {
            case "bottomRight":
                this.elements[element.id].bar.style.bottom = "0";
                this.elements[element.id].bar.style.right = "0";
                break;
            case "center":
                this.elements[element.id].bar.style.left = "50%";
                this.elements[element.id].bar.style.top = "50%";
                this.elements[element.id].bar.style.transform = "translate(-50%, -50%)";
                break;
            default:
                this.elements[element.id].bar.style.top = "0";
                this.elements[element.id].bar.style.left = "0";
                break;
        }
        //#endregion
    }

    public RemoveElement(element: HTMLDivElement): void
    {
        this.elements[element.id].mutationObserver.disconnect();
        delete this.elements[element.id];
    }

    public UpdateMapData(data: MapData): void
    {
    }

    public ResetData(): void
    {
        for (const key of Object.keys(this.elements))
        {
            this.elements[key].progress = 0;
            this.UpdateProgress(key);
        }
    }

    public UpdateLiveData(data: LiveData): void
    {
        for (const key of Object.keys(this.elements))
        {
            this.elements[key].progress = data.Accuracy;
            this.UpdateProgress(key);
        }
    }

    private UpdateProgress(id: string)
    {
        if (this.elements[id].container.clientWidth >= this.elements[id].container.clientHeight)
        {
            this.elements[id].bar.style.width = `${this.elements[id].progress}%`;
            this.elements[id].bar.style.height = "100%";
        }
        else
        {
            this.elements[id].bar.style.width = "100%";
            this.elements[id].bar.style.height = `${this.elements[id].progress}%`;
        }
    }

    private MutationEvent(id: string, mutationRecord: MutationRecord[])
    {
        if (this.elements[id].container.clientWidth <= this.minWidth) { this.elements[id].container.style.width = `${this.minWidth}px`; }
        if (this.elements[id].container.clientHeight <= this.minHeight) { this.elements[id].container.style.height = `${this.minHeight}px`; }
        this.elements[id].element.style.width = this.elements[id].container.style.width;
        this.elements[id].background.style.width = this.elements[id].element.style.width;
        this.elements[id].element.style.height = this.elements[id].container.style.height;
        this.elements[id].background.style.height = this.elements[id].element.style.height;
        this.UpdateProgress(id);
    }
}

type Elements =
{
    [id: string]:
    {
        container: HTMLDivElement,
        element: HTMLDivElement,
        background: HTMLDivElement,
        track: HTMLDivElement,
        bar: HTMLDivElement,
        mutationObserver: MutationObserver,
        progress: number
    }
}