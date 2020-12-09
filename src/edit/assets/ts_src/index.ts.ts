import { client } from "./client.ts.js";
import { ui } from "./ui.ts.js";

export class main
{
    public static params: URLSearchParams = new URLSearchParams(window.location.search);

    private _ui: ui = new ui();
    private _client = new client(main.params.has("ip") ? main.params.get("ip") : "127.0.0.1");

    constructor()
    {
        //setInterval(() => { console.clear(); }, 300000); //Try to clear some memory every 5 mins (mainly for errors)
        this.initModules();
    }

    private initModules()
    {
        this._client.AddEndpoint("StaticData");
        this._client.websocketData["StaticData"].e.addListener("message", this._ui.staticData);
        this._client.AddEndpoint("LiveData");
        this._client.websocketData["LiveData"].e.addListener("message", this._ui.staticData);
    }
}
new main();