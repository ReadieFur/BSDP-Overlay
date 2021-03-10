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
        this.client = new Client(Main.urlParams.get("ip")); //Generate a UI where prefrences are stored on the server and not in the URL/cookies

        this.client.AddEndpoint("MapData");
        this.client.websocketData["MapData"].e.addListener("message", (data: MapData) => { this.ui.MapDataUpdate(data); });
        this.client.AddEndpoint("LiveData");
        this.client.websocketData["LiveData"].e.addListener("message", (data: LiveData) => { this.ui.LiveDataUpdate(data); });
    }
}
new Default();