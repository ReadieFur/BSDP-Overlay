import { Main } from "../../../assets/js/main";
import { HeaderSlide } from "../../../assets/js/headerSlide";
import { ElementsJSON, UI } from "../../../assets/js/overlay/ui";
import { Client, SampleData } from "../../../assets/js/overlay/client";

class Editor
{
    public static allowUnload: boolean;

    private ui!: UI;
    private client!: Client;
    private elementsTable!: HTMLTableElement;

    public async init(): Promise<Editor>
    {
        new Main();
        new HeaderSlide();

        Editor.allowUnload = true;
        this.elementsTable = Main.ThrowIfNullOrUndefined(document.querySelector("#elementsTable"));

        window.addEventListener("beforeunload", (ev) => { this.WindowBeforeUnloadEvent(ev); });

        this.ui = Main.ThrowIfNullOrUndefined(await new UI().Init());

        this.LoadElementsIntoEditor(this.ui.importedElements);

        this.ui.UpdateMapData(SampleData.mapData);
        this.ui.UpdateLiveData(SampleData.liveData);

        this.client = new Client(Main.urlParams.get("ip"));
        this.client.AddEndpoint("MapData");
        this.client.websocketData["MapData"].e.addListener("message", (data) => { this.ui.UpdateMapData(data); });
        this.client.AddEndpoint("LiveData");
        this.client.websocketData["LiveData"].e.addListener("message", (data) => { this.ui.UpdateLiveData(data); });

        //Hide splash screen.
        let splashScreen: HTMLDivElement = Main.ThrowIfNullOrUndefined(document.querySelector("#splashScreen"));
        splashScreen.style.opacity = "0";
        setTimeout(() => { splashScreen!.style.display = "none"; }, 400);

        return this;
    }

    private LoadElementsIntoEditor(importedElements: ElementsJSON)
    {
        for (const category of Object.keys(importedElements))
        {
            var hasOneElement: boolean = false;
            //Work on a way to keep the height of the row the same for each element data cell (get the tallest element from when it is created).
            var tr: HTMLTableRowElement = document.createElement("tr");

            for (const type of Object.keys(importedElements[category]))
            {
                for (const name of Object.keys(importedElements[category][type]))
                {
                    if (importedElements[category][type][name].showInEditor)
                    {
                        hasOneElement = true;
                        var td: HTMLTableDataCellElement = document.createElement("td");
                        var element: HTMLDivElement = this.ui.CreateElement(category, type, name, true);
                        element.addEventListener("dblclick", (ev: MouseEvent) => { this.ui.CreateElement(category, type, name); });
                        td.appendChild(element);
                        tr.appendChild(td);
                    }
                }
            }

            if (hasOneElement)
            {
                (<HTMLTableDataCellElement>tr.firstChild!).classList.add("visible");

                if (tr.childNodes.length > 1)
                {
                    var backward: HTMLTableDataCellElement = document.createElement("td");
                    var backwardText: HTMLHeadingElement = document.createElement("h3");
                    var forward: HTMLTableDataCellElement = document.createElement("td");
                    var forwardText: HTMLHeadingElement = document.createElement("h3");
    
                    backwardText.innerText = "<";
                    backward.appendChild(backwardText);
                    forwardText.innerText = ">";
                    forward.appendChild(forwardText);
    
                    backward.addEventListener("click", (ev: Event) => { this.ChangeElementPage(ev, tr, false); });
                    forward.addEventListener("click", (ev: Event) => { this.ChangeElementPage(ev, tr, true); });
    
                    tr.prepend(backward);
                    tr.appendChild(forward);
                }

                this.elementsTable.tBodies[0].appendChild(tr);
            }
        }
    }

    private ChangeElementPage(ev: Event, container: HTMLTableRowElement, forward: boolean)
    {
        var index: number = 1;

        for (let i = 0; i < container.childNodes.length; i++)
        {
            var element: HTMLTableDataCellElement = <HTMLTableDataCellElement>container.childNodes[i];
            if (element.className.includes("visible"))
            { index = forward ? i + 1 : i - 1; }
            element.classList.remove("visible");
        }

        if (index <= 0)
        { index = container.childNodes.length - 2; }
        else if (index >= container.childNodes.length - 1)
        { index = 1; }

        (<HTMLTableDataCellElement>container.childNodes[index]).classList.add("visible");
    }

    private WindowBeforeUnloadEvent(ev: BeforeUnloadEvent)
    {
        if (!Editor.allowUnload)
        {
            ev.preventDefault();
            ev.returnValue = "false";
        }
    }
}
new Editor().init();