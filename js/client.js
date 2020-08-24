let urlParams = new URLSearchParams(location.search);
let IP = urlParams.has("ip") ? urlParams.get("ip") : "127.0.0.1";

let DataPuller;

window.addEventListener("load", () =>
{
    console.log("If you don't have the BSDataPuller mod then download the latest relaese from here and place it in your BS mods folder: https://github.com/kOFReadie/DataPuller/releases/latest");
    //https://github.com/kOFReadie/DataPuller/releases/latest/download/DataPuller.dll
    DataPuller = new DataPullerWebsocket();
    DataPuller.AddEndpoint("StaticData");
    DataPuller.AddEndpoint("LiveData");
})

class DataPullerWebsocket
{
    constructor() { this.ws = []; }

    AddEndpoint(Endpoint)
    {
        this.ws[Endpoint] = new WebSocket(`ws://${IP}:2946/BSDataPuller/${Endpoint}`);

        this.ws[Endpoint].onerror = () => { this.Reconnect(); };
        this.ws[Endpoint].onclosing = () => { this.Reconnect(); };
        this.ws[Endpoint].onclose = () => { this.Reconnect(); };
        this.ws[Endpoint].onmessage = (e) =>
        {
            window.dispatchEvent(new CustomEvent(`${Endpoint}Updated`, { detail: JSON.parse(e.data) }));
            //console.log(e.data);
        };
    }

    Reconnect()
    {
        let Endpoints = Object.keys(this.ws);
        this.ws = [];
        setTimeout(() => { for (let Endpoint of Endpoints) { this.AddEndpoint(Endpoint); } }, 5000); //5 second reconnect timeout
    }
}