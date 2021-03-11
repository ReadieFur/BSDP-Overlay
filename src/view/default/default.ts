import { Main } from "../../assets/js/main";
import { HeaderSlide } from "../../assets/js/headerSlide";
import { Client, MapData, LiveData } from "../../assets/js/overlay/client";
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

        this.client.AddEndpoint("MapData");
        this.client.connections["MapData"].AddEventListener("message", (data: MapData) => { this.ui.MapDataUpdate(data); });
        this.client.connections["MapData"].Connect();
        this.client.AddEndpoint("LiveData");
        this.client.connections["LiveData"].AddEventListener("message", (data: LiveData) => { this.ui.LiveDataUpdate(data); });
        this.client.connections["LiveData"].Connect();
    }
}
new Default();