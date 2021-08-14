import { Main } from "./main.js";
import { Client } from "./client.js";
import { DefaultUI } from "./defaultUI.js";
class Default {
    ui;
    client;
    constructor() {
        setInterval(() => { console.clear(); }, 600000);
        new Main();
        this.ui = new DefaultUI();
        this.client = new Client(Main.urlParams.get("ip"));
        this.client.AddEndpoint("MapData");
        this.client.connections["MapData"].AddEventListener("message", (data) => { this.ui.MapDataUpdate(data); });
        this.client.connections["MapData"].AddEventListener("open", () => { this.ui.ClientConnected(); });
        this.client.connections["MapData"].AddEventListener("close", () => { this.ui.ClientDisconnected(); });
        this.client.connections["MapData"].Connect();
        this.client.AddEndpoint("LiveData");
        this.client.connections["LiveData"].AddEventListener("message", (data) => { this.ui.LiveDataUpdate(data); });
        this.client.connections["LiveData"].AddEventListener("open", () => { this.ui.ClientConnected(); });
        this.client.connections["LiveData"].AddEventListener("close", () => { this.ui.ClientDisconnected(); });
        this.client.connections["LiveData"].Connect();
    }
}
new Default();
//# sourceMappingURL=default.js.map