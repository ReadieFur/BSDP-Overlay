import { Main } from "./main.js";
import { Client } from "./client.js";
import { DefaultUI } from "./defaultUI.js";
class Default {
    constructor() {
        setInterval(() => { console.clear(); }, 600000);
        new Main();
        this.ui = new DefaultUI();
        this.client = new Client(Main.urlParams.get("ip"));
        this.client.AddEndpoint("MapData");
        this.client.websocketData["MapData"].e.addListener("message", (data) => { this.ui.MapDataUpdate(data); });
        this.client.AddEndpoint("LiveData");
        this.client.websocketData["LiveData"].e.addListener("message", (data) => { this.ui.LiveDataUpdate(data); });
    }
}
new Default();
//# sourceMappingURL=default.js.map