import { Main } from "../../assets/js/main.js";
import { HeaderSlide } from "../../assets/js/headerSlide.js";
import { Client, MapData, LiveData } from "../../assets/js/overlay/client.js";
import { DefaultUI } from "./defaultUI.js"; //Due to the directory rewrite I need to put the file type onto the end

class Default
{
    private ui: DefaultUI;
    private client: Client;

    constructor()
    {
        setInterval(() => { console.clear(); }, 600000); //Try to clear some memory every 10 mins (mainly for clearing disconnected client errors)

        new Main();
        new HeaderSlide();
        this.ui = new DefaultUI();
        this.client = new Client(Main.urlParams.get("ip")); //Generate a UI where prefrences are stored on the server and not in the URL/cookies

        window.addEventListener("resize", () => { this.ConfigureWindow(); });
        this.ConfigureWindow();

        this.client.AddEndpoint("MapData");
        this.client.connections["MapData"].AddEventListener("message", (data: MapData) => { this.ui.MapDataUpdate(data); });
        this.client.connections["MapData"].AddEventListener("open", () => { this.ui.ClientConnected(); });
        this.client.connections["MapData"].AddEventListener("close", () => { this.ui.ClientDisconnected(); });
        this.client.connections["MapData"].Connect();
        this.client.AddEndpoint("LiveData");
        this.client.connections["LiveData"].AddEventListener("message", (data: LiveData) => { this.ui.LiveDataUpdate(data); });
        this.client.connections["LiveData"].AddEventListener("open", () => { this.ui.ClientConnected(); });
        this.client.connections["LiveData"].AddEventListener("close", () => { this.ui.ClientDisconnected(); });
        this.client.connections["LiveData"].Connect();
    }

    private ConfigureWindow(): void
    {
        const baseWidth = 1920;
        const baseHeight = 1080;

        this.ui.overlay.style.width = `${baseWidth}px`;
        this.ui.overlay.style.height = `${baseHeight}px`;
        
        const clientWidth = document.body.clientWidth;
        const clientHeight = document.body.clientHeight;
        var clientWiderThanTall = clientWidth >= clientHeight;

        var scale = clientWiderThanTall ? clientWidth / baseWidth : clientHeight / baseHeight;

        var userScale = parseFloat(Main.urlParams.get("scale") != null ? <string>Main.urlParams.get("scale") : "1");
        userScale = isNaN(userScale) ? 1 : userScale;

        if (userScale != 1)
        {
            this.ui.overlay.style.transform = `scale(${scale * userScale})`;
            this.ui.overlay.style[!clientWiderThanTall ? "width" : "height"] = `${(!clientWiderThanTall ? clientWidth : clientHeight) / scale / userScale}px`;
            this.ui.overlay.style[clientWiderThanTall ? "width" : "height"] = `${(clientWiderThanTall ? clientWidth : clientHeight) / (scale * userScale)}px`;
        }
        else
        {
            this.ui.overlay.style.transform = `scale(${scale})`;
            this.ui.overlay.style[!clientWiderThanTall ? "width" : "height"] = `${(!clientWiderThanTall ? clientWidth : clientHeight) / scale}px`;
        }
    }
}
new Default();