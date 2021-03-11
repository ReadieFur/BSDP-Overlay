import { Main } from "./main.js";
import { Client, MapData, LiveData } from "./client.js";
import { DefaultUI } from "./defaultUI.js";

class Default
{
    private ui: DefaultUI;
    private client: Client;

    constructor()
    {
        setInterval(() => { console.clear(); }, 600000); //Try to clear some memory every 10 mins (mainly for clearing disconnected client errors)

        new Main();
        this.ui = new DefaultUI();
        this.client = new Client(Main.urlParams.get("ip"));

        this.client.AddEndpoint("MapData");
        this.client.connections["MapData"].AddEventListener("message", (data: MapData) => { this.ui.MapDataUpdate(data); });
        this.client.connections["MapData"].Connect();
        this.client.AddEndpoint("LiveData");
        this.client.connections["LiveData"].AddEventListener("message", (data: LiveData) => { this.ui.LiveDataUpdate(data); });
        this.client.connections["LiveData"].Connect();
    }
}
new Default();