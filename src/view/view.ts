import { Main, ReturnData } from "../assets/js/main.js";
import { HeaderSlide } from "../assets/js/headerSlide.js";
import { SavedElements, UI } from "../assets/js/overlay/ui.js";
import { Client } from "../assets/js/overlay/client.js";
import { IOverlayData, OverlayHelper } from "../assets/js/overlay/overlayHelper.js";

class View
{
    private ui!: UI;
    private client!: Client;
    private path!: string[];
    private ssSubText!: HTMLHeadingElement;
    private ssProgressStage!: number;
    private ssProgress!: HTMLDivElement;

    public async Init(): Promise<View>
    {
        new Main();
        new HeaderSlide();

        this.ssProgressStage = 0;
        this.ssSubText = Main.ThrowIfNullOrUndefined(document.querySelector("#ssSubText"));
        this.ssProgress = Main.ThrowIfNullOrUndefined(document.querySelector("#ssProgress"));

        this.SSProgressUpdate(false, "Checking for overlay");
        this.path = window.location.pathname.split('/').filter((part) => { return part != ""; });
        if (this.path[this.path.length - 1] === "view" || this.path[this.path.length - 2] !== "view" || this.path[this.path.length - 1].length != 13)
        {
            Main.Alert("Invalid ID.");
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }
        this.SSProgressUpdate();

        this.SSProgressUpdate(false, "Loading elements");
        this.ui = Main.ThrowIfNullOrUndefined(await new UI().Init());
        this.SSProgressUpdate();

        this.SSProgressUpdate(false, "Enviroment setup");
        window.addEventListener("resize", () => { this.ConfigureEditorWindow(); });
        this.ConfigureEditorWindow();
        this.client = new Client(Main.urlParams.get("ip"));
        this.client.AddEndpoint("MapData");
        this.client.connections["MapData"].AddEventListener("message", (data) => { this.ui.UpdateMapData(data); });
        this.client.connections["MapData"].Connect();
        this.client.AddEndpoint("LiveData");
        this.client.connections["LiveData"].AddEventListener("message", (data) => { this.ui.UpdateLiveData(data); });
        this.client.connections["LiveData"].Connect();
        this.SSProgressUpdate();

        this.SSProgressUpdate(false, "Loading overlay");
        await this.LoadOverlay();
        this.SSProgressUpdate();

        //Hide splash screen.
        await Main.Sleep(1000);
        var splashScreen: HTMLDivElement = Main.ThrowIfNullOrUndefined(document.querySelector("#splashScreen"));
        splashScreen.style.opacity = "0";
        setTimeout(() => { splashScreen.style.display = "none"; }, 400);

        return this;
    }

    private ConfigureEditorWindow(): void
    {
        const baseWidth = 1920;
        const baseHeight = 1080;

        this.ui.overlay.style.width = `${baseWidth}px`;
        this.ui.overlay.style.height = `${baseHeight}px`;
        
        const clientWidth = document.body.clientWidth;
        const clientHeight = document.body.clientHeight;
        var clientWiderThanTall = clientWidth >= clientHeight;

        var scale = clientWiderThanTall ? clientWidth / baseWidth : clientHeight / baseHeight;

        this.ui.overlay.style.transform = `scale(${scale})`;
        this.ui.overlay.style[!clientWiderThanTall ? "width" : "height"] = `${(!clientWiderThanTall ? clientWidth : clientHeight) / scale}px`;
    }

    private SSProgressUpdate(progress: boolean = true, message?: string)
    {
        const references = 4;
        this.ssSubText.innerText = message === undefined ? "Loading..." : message;
        if (progress)
        {
            this.ssProgress.style.width = `${(++this.ssProgressStage/references)*100}%`;
            if (this.ssProgressStage >= references) { this.ssSubText.innerText = "Loaded!" }
        }
    }

    private async LoadOverlay()
    {
        var response: ReturnData = await OverlayHelper.OverlayPHP({
            method: "getOverlayByID",
            data:
            {
                id: this.path[this.path.length - 1]
            }
        });

        if (response.error)
        {
            console.error(response);
            Main.Alert(Main.GetPHPErrorMessage(response.data));
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }

        var overlay: IOverlayData = response.data;
        var elements: SavedElements = JSON.parse(overlay.elements);

        (<HTMLSpanElement>Main.ThrowIfNullOrUndefined(document.querySelector("#ssName"))).innerText = overlay.name;
        (<HTMLSpanElement>Main.ThrowIfNullOrUndefined(document.querySelector("#ssUsername"))).innerText = overlay.username;
        (<HTMLHeadElement>Main.ThrowIfNullOrUndefined(document.querySelector("#ssDetails"))).style.display = "block";
        if (overlay.thumbnail !== null) { (<HTMLImageElement>Main.ThrowIfNullOrUndefined(document.querySelector("#ssThumbnail"))).src = overlay.thumbnail; }

        for (const category of Object.keys(elements))
        {
            for (const type of Object.keys(elements[category]))
            {
                for (const id of Object.keys(elements[category][type]))
                {
                    for (let i = 0; i < elements[category][type][id].length; i++)
                    {
                        const elementProperties = elements[category][type][id][i];
                        var container: HTMLDivElement = this.ui.CreateElement(category, type, id);
                        if (elementProperties.position.top !== undefined)
                        {
                            container.style.top = elementProperties.position.top;
                            container.style.height = `${elementProperties.height}px`;
                        }
                        else
                        {
                            container.style.height = `${elementProperties.height}px`;
                            container.style.bottom = elementProperties.position.bottom!;
                        }
                        if (elementProperties.position.left !== undefined)
                        {
                            container.style.left = elementProperties.position.left;
                            container.style.width = `${elementProperties.width}px`;
                        }
                        else
                        {
                            container.style.width = `${elementProperties.width}px`;
                            container.style.right = elementProperties.position.right!;
                        }
                        this.ui.createdElements.elements[category][type][id].script.UpdateStyles(container, elementProperties.customStyles);
                        this.ui.overlay.appendChild(container);
                    }
                }
            }
        }
    }
}
new View().Init();