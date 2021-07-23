import { Dictionary, Main } from "../main.js";
import { EventDispatcher } from "../eventDispatcher.js";

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

    private OnMessage(ev: MessageEvent<any>): void
    {
        var jsonData: MapData | LiveData = JSON.parse(ev.data);
        this.eventDispatcher.DispatchEvent("message", jsonData);
        if (Main.urlParams.has("debug")) { console.log(jsonData); }
    }
}

//Get new data types for these (null)
export type MapData =
{
    //Level
    InLevel: boolean,
    LevelPaused: boolean,
    LevelFinished: boolean,
    LevelFailed: boolean,
    LevelQuit: boolean,

    //Map
    Hash: string | null,
    SongName: string | null,
    SongSubName: string | null,
    SongAuthor: string,
    Mapper: string | null,
    BSRKey: string | null,
    coverImage: string | null,
    Length: number,
    TimeScale: number,

    //Difficulty
    MapType: string | null,
    Difficulty: string | null,
    CustomDifficultyLabel: string | null,
    BPM: number,
    NJS: number,
    Modifiers:
    {
        noFailOn0Energy: boolean,
        oneLife: boolean,
        fourLives: boolean,
        noBombs: boolean,
        noWalls: boolean,
        noArrows: boolean,
        ghostNotes: boolean,
        disappearingArrows: boolean,
        smallNotes: boolean,
        proMode: boolean,
        strictAngles: boolean,
        zenMode: boolean,
        slowerSong: boolean,
        fasterSong: boolean,
        superFastSong: boolean
    },
    ModifiersMultiplier: number,
    PracticeMode: boolean,
    PracticeModeModifiers:
    {
        songSpeedMul: number,
        startInAdvanceAndClearNotes: number,
        startSongTime: number
    },
    PP: number,
    Star: number,

    //Misc
    GameVersion: string,
    PluginVersion: string,
    IsMultiplayer: boolean,
    PreviousRecord: number,
    PreviousBSR: string | null
}

export type LiveData =
{
    //Score
    Score: number,
    ScoreWithMultipliers: number,
    MaxScore: number,
    MaxScoreWithMultipliers: number,
    Rank: string | null,
    FullCombo: boolean,
    Combo: number,
    Misses: number,
    Accuracy: number,
    BlockHitScore: number[] | null,
    PlayerHealth: number,

    //Misc
    TimeElapsed: number
}

export class SampleData
{
    public static readonly mapData: MapData =
    {
        GameVersion: "1.13.2",
        PluginVersion: "2.0.2.0",
        InLevel: true,
        LevelPaused: false,
        LevelFinished: false,
        LevelFailed: false,
        LevelQuit: false,
        Hash: "648B6FE961C398DE638FA1E614878F1194ADF92E",
        SongName: "Tera I/O",
        SongSubName: "[200 Step]",
        SongAuthor: "Camellia",
        Mapper: "cerret",
        BSRKey: "11a27",
        coverImage: "https://cdn.global-gaming.co/images/TeraIO.jpg",
        Length: 336,
        TimeScale: 0,
        MapType: "Standard",
        Difficulty: "ExpertPlus",
        CustomDifficultyLabel: "Normal",
        BPM: 200,
        NJS: 23,
        Modifiers:
        {
            noFailOn0Energy: false,
            oneLife: false,
            fourLives: false,
            noBombs: false,
            noWalls: false,
            noArrows: false,
            ghostNotes: false,
            disappearingArrows: true,
            smallNotes: false,
            proMode: false,
            strictAngles: true,
            zenMode: false,
            slowerSong: false,
            fasterSong: false,
            superFastSong: false
        },
        ModifiersMultiplier: 1,
        PracticeMode: false,
        PracticeModeModifiers:
        {
            songSpeedMul: 1,
            startInAdvanceAndClearNotes: 0,
            startSongTime: 0
        },
        PP: 0,
        Star: 0,
        IsMultiplayer: false,
        PreviousRecord: 2714014,
        PreviousBSR: "123ba"
    }

    public static readonly liveData: LiveData =
    {
        Score: 574728,
        ScoreWithMultipliers: 574728,
        MaxScore: 612835,
        MaxScoreWithMultipliers: 612835,
        Rank: "SS",
        FullCombo: false,
        Combo: 352,
        Misses: 2,
        Accuracy: 94.20143961906433,
        BlockHitScore:
        [
            70,
            30,
            14
        ],
        PlayerHealth: 87,
        TimeElapsed: 77
    }
}