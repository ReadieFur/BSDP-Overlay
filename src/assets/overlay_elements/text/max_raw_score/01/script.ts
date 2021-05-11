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
            maxRawScore: Main.ThrowIfNullOrUndefined(element.querySelector(`.text.max_raw_score._01 > .maxRawScore`))
        };
    }

    public UpdateStyles(element: HTMLDivElement, styles: TCustomStyles): void
    {
        if (this.elements[element.id] === undefined) { return; }

        if (styles.fontSize !== undefined)
        {
            this.elements[element.id].maxRawScore.style.fontSize = `${styles.fontSize}px`;
        }
        else
        {
            this.elements[element.id].maxRawScore.style.removeProperty("fontSize");
        }
    }

    public RemoveElement(element: HTMLDivElement): void
    {
        delete this.elements[element.id];
    }

    public UpdateMapData(data: MapData): void
    {
    }

    public UpdateLiveData(data: LiveData): void
    {
        for (const key of Object.keys(this.elements))
        {
            var element = this.elements[key];
            element.maxRawScore.innerText = UI.SeperateNumber(data.MaxScore);
        }
    }
}

type Elements =
{
    [id: string]:
    {
        container: HTMLDivElement,
        maxRawScore: HTMLParagraphElement
    }
}