import { Main, ReturnData } from "../assets/js/main.js";
import { HeaderSlide } from "../assets/js/headerSlide.js";
import { UI } from "../assets/js/overlay/ui.js";
import { Client } from "../assets/js/overlay/client.js";
import { IOverlayData, OverlayHelper, SavedElements } from "../assets/js/overlay/overlayHelper.js";

class View
{
    private ui!: UI;
    private client!: Client;
    private path!: string[];
    private ssSubText!: HTMLHeadingElement;
    private ssProgressStage!: number;
    private ssProgress!: HTMLDivElement;
    private optionsContainer!:
    {
        show: HTMLDivElement;
        parent: HTMLDivElement;
        options:
        {
            ip: HTMLInputElement;
            scale: HTMLInputElement;
        }
    };

    public async Init(): Promise<View>
    {
        new Main();
        new HeaderSlide();

        if (Main.urlParams.has("debug")) { document.body.style.backgroundColor = "black"; } //Purely for firefox (transparent results in a white background).

        this.ssProgressStage = 0;
        this.ssSubText = Main.ThrowIfNullOrUndefined(document.querySelector("#ssSubText"));
        this.ssProgress = Main.ThrowIfNullOrUndefined(document.querySelector("#ssProgress"));
        this.optionsContainer =
        {
            show: Main.ThrowIfNullOrUndefined(document.querySelector("#showOptionsContainer")),
            parent: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsContainer")),
            options:
            {
                ip: Main.ThrowIfNullOrUndefined(document.querySelector("#gameIP")),
                scale: Main.ThrowIfNullOrUndefined(document.querySelector("#scale"))
            }
        }

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

        (<HTMLSpanElement>Main.ThrowIfNullOrUndefined(document.querySelector(".slideMenu"))).addEventListener("mouseenter", (e) => { Main.Tooltip("Click to show the header", e, "bottom"); });

        this.optionsContainer.show.addEventListener("click", (e) => { Main.SingleTooltip("Double click to show options", e.clientX, e.clientY, 1000, "top"); });
        this.optionsContainer.show.addEventListener("dblclick", () => { this.ToggleOptionsContainer(true); });
        (<HTMLDivElement>Main.ThrowIfNullOrUndefined(this.optionsContainer.parent.querySelector(".background"))).addEventListener("click", () => { this.ToggleOptionsContainer(false); });
        this.optionsContainer.options.ip.addEventListener("change", () =>
        {
            this.client.Dispose();
            this.ClientInit(this.optionsContainer.options.ip.value);
        });

        //UI Scale
        window.addEventListener("resize", () => { this.ConfigureWindow(parseFloat(this.optionsContainer.options.scale.value)); });
        this.optionsContainer.options.scale.addEventListener("input", (e) => { this.ConfigureWindow(parseFloat(this.optionsContainer.options.scale.value)); });
        const urlScale = Main.urlParams.get("scale") != null ? parseFloat(<string>Main.urlParams.get("scale")) : null;
        const cachedScale = Main.RetreiveCache("OVERLAY_SCALE");
        var scale: number;
        if (urlScale !== null && !isNaN(urlScale)) { scale = urlScale * 100; }
        else if (cachedScale != "") { scale = parseFloat(cachedScale); }
        else { scale = 100; }
        this.ConfigureWindow(scale);
        
        // Setup the client.
        const urlIP = Main.urlParams.get("ip");
        const cachedIP = Main.RetreiveCache("GAME_IP");
        var ip: string;
        if (urlIP !== null && RegExp(Client.ipRegex).test(urlIP)) { ip = urlIP; }
        else if (cachedIP != "" && RegExp(Client.ipRegex).test(cachedIP)) { ip = cachedIP; }
        else { ip = "127.0.0.1"; }
        this.ClientInit(ip);

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

    private ClientInit(ip: string | null | undefined): void
    {
        if (ip == null || ip == undefined || !RegExp(Client.ipRegex).test(ip)) { ip = "127.0.0.1"; }
        this.optionsContainer.options.ip.value = ip;
        Main.SetCache("GAME_IP", ip, 365);
        this.client = new Client(ip);
        this.client.AddEndpoint("MapData");
        this.client.AddEndpoint("LiveData");
        this.client.connections["MapData"].AddEventListener("message", (data) => { this.ui.UpdateMapData(data); });
        this.client.connections["LiveData"].AddEventListener("message", (data) => { this.ui.UpdateLiveData(data); });
        this.client.connections["MapData"].Connect();
        this.client.connections["LiveData"].Connect();
    }

    private ToggleOptionsContainer(show: boolean): void
    {
        if (show)
        {
            this.optionsContainer.parent.style.display = "block";
            this.optionsContainer.parent.classList.remove("fadeOut");
            this.optionsContainer.parent.classList.add("fadeIn");
            Main.Unfocus(); //I tried using this to make the option elements not selected, but it didn't work.
        }
        else
        {
            this.optionsContainer.parent.classList.remove("fadeIn");
            this.optionsContainer.parent.classList.add("fadeOut");
            setTimeout(() => { this.optionsContainer.parent.style.display = "none"; }, 399);
        }
    }

    private ConfigureWindow(userScale: number = 100): void
    {
        const baseWidth = 1920;
        const baseHeight = 1080;

        this.ui.overlay.style.width = `${baseWidth}px`;
        this.ui.overlay.style.height = `${baseHeight}px`;
        
        const clientWidth = document.body.clientWidth;
        const clientHeight = document.body.clientHeight;
        var clientWiderThanTall = clientWidth >= clientHeight;

        var scale = clientWiderThanTall ? clientWidth / baseWidth : clientHeight / baseHeight;

        if (isNaN(userScale)) { userScale = 100; }
        else if (userScale <= 25) { userScale = 25; }
        else if (userScale >= 200) { userScale = 200; }
        Main.SetCache("OVERLAY_SCALE", userScale.toString(), 365);
        this.optionsContainer.options.scale.value = userScale.toString();
        const userScaleCorrected = userScale / 100;

        if (userScaleCorrected != 1)
        {
            this.ui.overlay.style.transform = `scale(${scale * userScaleCorrected})`;
            this.ui.overlay.style[!clientWiderThanTall ? "width" : "height"] = `${(!clientWiderThanTall ? clientWidth : clientHeight) / scale / userScaleCorrected}px`;
            this.ui.overlay.style[clientWiderThanTall ? "width" : "height"] = `${(clientWiderThanTall ? clientWidth : clientHeight) / (scale * userScaleCorrected)}px`;
        }
        else
        {
            this.ui.overlay.style.transform = `scale(${scale})`;
            this.ui.overlay.style[!clientWiderThanTall ? "width" : "height"] = `${(!clientWiderThanTall ? clientWidth : clientHeight) / scale}px`;
        }
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
                    for (const elementProperties of Object.values(elements[category][type][id]))
                    {
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