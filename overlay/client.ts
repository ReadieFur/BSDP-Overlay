import { Main } from "./main.js"
import { EventDispatcher } from "./eventDispatcher.js";

export class Client
{
    public IP: string;
    public websocketData!: {[key: string]: EventWebsocket};

    constructor(_IP?: string | null)
    {
        if (_IP === undefined || _IP === null)
        {
            this.IP = "127.0.0.1";
        }
        else if (RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(_IP))
        {
            this.IP = _IP;
        }
        else
        {
            throw new SyntaxError("Invalid IP");
        }

        this.websocketData = {};
    }

    public AddEndpoint(endpoint: string, reconnect?: boolean): void
    {
        let socket: EventWebsocket = this.websocketData[endpoint] = new EventWebsocket(new WebSocket(`ws://${this.IP}:2946/BSDataPuller/${endpoint}`));
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

class EventWebsocket
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