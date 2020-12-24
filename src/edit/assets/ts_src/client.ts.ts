import { main } from "./index.ts.js";
import { eventDispatcher } from "./eventDispatcher.ts.js";

export class client
{
    public IP: string;
    public websocketData: {[key: string]: eventWebsocket};

    constructor(_IP: string | null)
    {
        if (typeof _IP !== "string") { throw new TypeError("IP is not a type of string"); }
        else if (!RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(_IP)) { throw new SyntaxError("Invalid IP"); }
        this.IP = _IP;
        this.websocketData = {};
    }

    public AddEndpoint(endpoint: string)
    {
        let socket: eventWebsocket = this.websocketData[endpoint] = new eventWebsocket(new WebSocket(`ws://${this.IP}:2946/BSDataPuller/${endpoint}`));
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

class eventWebsocket
{
    e: eventDispatcher = new eventDispatcher();
    ws: WebSocket;
    constructor(_ws: WebSocket) { this.ws = _ws; }
}

export type StaticData =
{
    GameVersion: string,
    PluginVersion: string,

    //Map
    Hash: string,
    SongName: string,
    SongSubName: string,
    SongAuthor: string,
    Mapper: string,
    BSRKey: string,
    coverImage: string,
    Length: number,
    TimeScale: number,

    //Difficulty
    MapType: string,
    Difficulty: string,
    CustomDifficultyLabel: string,
    BPM: number,
    NJS: number,
    Modifiers: { [key: string]: boolean },
    PracticeMode: boolean,
    PracticeModeModifiers: { [key: string]: number },
    PP: number,
    Star: number,

    //Misc
    PreviousRecord: number,
    PreviousBSR: string
}

export type LiveData =
{
    //Level
    InLevel: boolean,
    LevelPaused: boolean,
    LevelFinished: boolean,
    LevelFailed: boolean,
    LevelQuit: boolean,

    //Score
    Score: number,
    FullCombo: boolean,
    Combo: number,
    Misses: number,
    Accuracy: number,
    BlockHitScores: number[],
    PlayerHealth: number,

    //Misc
    TimeElapsed: number
}