import { Main } from "../main"
import { EventDispatcher } from "../eventDispatcher";

export class Client
{
    private protocol: "wss" | "ws";
    public IP: string;
    public websocketData!: {[key: string]: eventWebsocket};

    constructor(_IP?: string | null)
    {
        if (_IP === undefined || _IP === null)
        {
            this.protocol = "wss";
            this.IP = "127.0.0.1";
        }
        else if (RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(_IP))
        {
            //WIP
            /*if (_IP !== "127.0.0.1" && window.location.protocol !== "http:")
            {
                window.location.protocol = "http:";
                window.location.reload();
            }*/
            this.protocol = "ws";
            this.IP = _IP;
        }
        else
        {
            throw new SyntaxError("Invalid IP");
        }

        //For now the protocol will be overriden and set to WS
        this.protocol = "ws";

        this.websocketData = {};
    }

    public AddEndpoint(endpoint: string, reconnect?: boolean): void
    {
        let socket: eventWebsocket = this.websocketData[endpoint] = new eventWebsocket(new WebSocket(`${this.protocol}://${this.IP}:2946/BSDataPuller/${endpoint}`));
        socket.e = new EventDispatcher();

        socket.ws.onerror = (e) => { socket.e.dispatch("error"); this.Reconnect(endpoint); };
        socket.ws.onclose = (e) => { socket.e.dispatch("close"); this.Reconnect(endpoint); };
        socket.ws.onopen = (e) => { socket.e.dispatch("open"); };
        socket.ws.onmessage = (e) =>
        {
            let jsonData: MapData | LiveData = JSON.parse(e.data);
            socket.e.dispatch("message", jsonData);
            if (Main.urlParams.has("debug")) { console.log(jsonData); }
        };

        //This is blocked out for now because of the way functions are added to the event listener, this is fired before any function can be added so whats the point in having it for now.
        /*if (Main.urlParams.has("debug") && reconnect !== true)
        {
            for (const [key, value] of Object.entries(sampleData))
            {
                if (key.toLowerCase() == endpoint.toLowerCase())
                {
                    socket.e.dispatch("message", value);
                }
            }
        }*/
    }

    private Reconnect(endpoint: string): void
    {
        if (this.websocketData[endpoint] !== undefined)
        {
            this.websocketData[endpoint].e.dispatch("reconnect");
            delete this.websocketData[endpoint];
            setTimeout(() => { this.AddEndpoint(endpoint, true); }, 1000);
        }
    }
}

class eventWebsocket
{
    e: EventDispatcher = new EventDispatcher();
    ws: WebSocket;
    constructor(_ws: WebSocket) { this.ws = _ws; }
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
        batteryEnergy: boolean,
        disappearingArrows: boolean,
        fasterSong: boolean,
        ghostNotes: boolean,
        instaFail: boolean,
        noArrows: boolean,
        noBombs: boolean,
        noFail: boolean,
        noObstacles: boolean,
        slowerSong: boolean
    } | null,
    ModifiersMultiplier: number,
    PracticeMode: boolean,
    PracticeModeModifiers:
    {
        songSpeedMul: number
    } | null,
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

export class sampleData
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
        coverImage: "https://beatsaver.com/cdn/11a27/648b6fe961c398de638fa1e614878f1194adf92e.jpg",
        Length: 336,
        TimeScale: 0,
        MapType: "Standard",
        Difficulty: "ExpertPlus",
        CustomDifficultyLabel: "Normal",
        BPM: 200,
        NJS: 23,
        Modifiers:
        {
            instaFail: false,
            batteryEnergy: true,
            disappearingArrows: true,
            ghostNotes: false,
            fasterSong: false,
            noFail: false,
            noObstacles: false,
            noBombs: false,
            slowerSong: false,
            noArrows: false
        },
        ModifiersMultiplier: 1,
        PracticeMode: false,
        PracticeModeModifiers:
        {
            songSpeedMul: 1
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