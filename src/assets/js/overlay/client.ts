import { Dictionary, Main } from "../main.js";
import { EventDispatcher } from "../eventDispatcher.js";
import { Parser, MapData, LiveData } from "./types/web.js";

export class Client
{
    public static readonly ipRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    private protocol: "wss" | "ws";
    public IP: string;
    public connections: Dictionary<CustomWebSocket>;

    constructor(_IP?: string | null)
    {
        if (_IP === undefined || _IP === null) { this.IP = "127.0.0.1"; }
        else if (RegExp(Client.ipRegex).test(_IP)) { this.IP = _IP; }
        else { throw new SyntaxError("Invalid IP"); }

        // this.protocol = window.location.protocol === "https:" ? "wss" : "ws";
        this.protocol = "ws"; //Currently forced to ws.
        this.connections = {};
    }

    public AddEndpoint(endpoint: string): void
    {
        this.connections[endpoint] = new CustomWebSocket(this.protocol, this.IP, endpoint);
    }

    public RemoveEndpoint(endpoint: string): void
    {
        if (this.connections[endpoint] !== undefined)
        {
            this.connections[endpoint].Disconnect();
            delete this.connections[endpoint];
        }
    }

    public Dispose(): void
    {
        for (var endpoint in this.connections)
        {
            this.connections[endpoint].Disconnect();
            delete this.connections[endpoint];
        }
    }
}

class CustomWebSocket
{
    private close: boolean;
    private protocol: string;
    private ip: string;
    private endpoint: string;
    private eventDispatcher: EventDispatcher;
    private websocket: WebSocket | null;

    constructor(_protocol: string, _ip: string, _endpoint: string)
    {
        this.close = false;
        this.protocol = _protocol;
        this.ip = _ip;
        this.endpoint = _endpoint;
        this.eventDispatcher = new EventDispatcher();
        this.websocket = null;
    }

    public Connect(): void
    {
        this.close = false;
        this.websocket = new WebSocket(`${this.protocol}://${this.ip}:2946/BSDataPuller/${this.endpoint}`);
        this.websocket.onopen = (ev: Event) => { this.OnOpen(ev); };
        this.websocket.onclose = (ev: Event) => { this.OnClose(ev); };
        this.websocket.onerror = (ev: Event) => { this.OnError(ev); };
        this.websocket.onmessage = (ev: MessageEvent<any>) => { this.OnMessage(ev); };
    }

    public Disconnect(): void
    {
        this.close = true;
        if (this.websocket !== null) { this.websocket.close(1000); } //I can't seem to read this properly on the event.
        this.websocket = null;
    }

    public AddEventListener(event: "open" | "close" | "error" | "message", callback: (data?: any) => any): void
    {
        this.eventDispatcher.AddEventListener(event, callback);
    }

    public RemoveEventListener(event: "open" | "close" | "error" | "message", callback: (data?: any) => any): void
    {
        this.eventDispatcher.RemoveEventListener(event, callback);
    }

    private OnOpen(ev: Event): void
    {
        this.eventDispatcher.DispatchEvent("open", ev);
    }

    private OnClose(ev: Event): void
    {
        this.eventDispatcher.DispatchEvent("close", ev);
        if (!this.close) { setTimeout(() => { this.Connect(); }, 5000); }
    }

    private OnError(ev: Event): void
    {
        this.eventDispatcher.DispatchEvent("error", ev);
        //setTimeout(() => { this.Connect(); }, 5000); //This is causing the websocket to fill up memory.
    }

    private async OnMessage(ev: MessageEvent<any>): Promise<void>
    {
        const deserializedData: object = JSON.parse(ev.data);

        //This has been put together in a somewhat sort of hacky way to be compatible with the old (existing) website.
        //I would rewrite parts of the site but I can't be bothered to do that right now.
        let parsedData: MapData | LiveData | null = null;
        try
        {
            //This will fail if the data does not contain a "PluginVersion" property/
            parsedData = await Parser.ParseMapDataObj(deserializedData);
        }
        catch
        {
            //If it fails, we can assume the data is a type of LiveData.
            //However we still want to try/catch this becuase it could fail if a converter hasn't been loaded yet.
            try { parsedData = await Parser.ParseLiveDataObj(deserializedData); }
            catch {}
        }

        if (parsedData == null)
        {
            //If we failed to parse the data, log an error to the console with the input data and return early (drop the message).
            console.error("Failed to parse data from websocket.", deserializedData);
            return;
        }

        this.eventDispatcher.DispatchEvent("message", parsedData);
        if (Main.urlParams.has("debug")) { console.log(parsedData); }
    }
}
