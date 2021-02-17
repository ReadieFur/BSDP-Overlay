import { Main } from "../../../assets/js/main";
import { HeaderSlide } from "../../../assets/js/headerSlide";
import { Client, MapData, LiveData } from "../../../assets/js/overlay/client";
import { UI } from "./ui.js"; //Due to the directory rewrite I need to put the file type onto the end

class Default
{
    private ui: UI;
    private client: Client;

    constructor()
    {
        setInterval(() => { console.clear(); }, 600000); //Try to clear some memory every 10 mins (mainly for clearing disconnected client errors)

        new Main();
        new HeaderSlide();
        this.ui = new UI();
        this.client = new Client(Main.urlParams.get("ip")); //Generate a UI where prefrences are stored on the server and not in the URL/cookies

        this.client.AddEndpoint("MapData");
        this.client.websocketData["MapData"].e.addListener("message", (data: MapData) => { this.ui.MapDataUpdate(data); });
        this.client.AddEndpoint("LiveData");
        this.client.websocketData["LiveData"].e.addListener("message", (data: LiveData) => { this.ui.LiveDataUpdate(data); });
    }
}
new Default();