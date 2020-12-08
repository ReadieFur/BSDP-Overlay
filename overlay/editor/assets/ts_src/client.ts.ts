import { main } from "./index.ts.js";
import { eventDispatcher } from "./eventDispatcher.ts.js";

export class client
{
    public IP: string;
    public websocketData: {[key: string]: IWebsocket};

    constructor(_IP: string | null)
    {
        if (typeof _IP !== "string") { throw new TypeError("IP is not a type of string"); }
        else if (!RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(_IP)) { throw new SyntaxError("Invalid IP"); }
        this.IP = _IP;
        this.websocketData = {};
    }

    public AddEndpoint(endpoint: string)
    {
        let socket: IWebsocket = this.websocketData[endpoint] = new IWebsocket(new WebSocket(`ws://${this.IP}:2946/BSDataPuller/${endpoint}`));
        socket.e = new eventDispatcher();

        socket.ws.onerror = (e) => { socket.e.dispatch("error"); this.Reconnect(endpoint); };
        socket.ws.onopen = (e) => { socket.e.dispatch("open"); };
        socket.ws.onmessage = (e) =>
        {
            let jsonData = JSON.parse(e.data);
            socket.e.dispatch("message");
            if (main.params.has("debug")) { console.log(jsonData); }
        };
    }

    private Reconnect(endpoint: string)
    {
        this.websocketData[endpoint].e.dispatch("reconnect");
        delete this.websocketData[endpoint];
        setTimeout(() => { this.AddEndpoint(endpoint); }, 1000);
    }
}

class IWebsocket
{
    e: eventDispatcher = new eventDispatcher();
    ws: WebSocket;
    constructor(_ws: WebSocket) { this.ws = _ws; }
}