import { Main } from "../main"
import { EventDispatcher } from "../eventDispatcher";

export class Client
{
    public IP: string;
    public websocketData!: {[key: string]: eventWebsocket};

    constructor(_IP?: string | null)
    {
        if (_IP === undefined || _IP === null) { this.IP = "127.0.0.1"; }
        else if (RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(_IP)) { this.IP = _IP; }
        else { throw new SyntaxError("Invalid IP"); }

        this.websocketData = {};
    }

    public AddEndpoint(endpoint: string): void
    {
        let socket: eventWebsocket = this.websocketData[endpoint] = new eventWebsocket(new WebSocket(`ws://${this.IP}:2946/BSDataPuller/${endpoint}`));
        socket.e = new EventDispatcher();

        socket.ws.onerror = (e) => { socket.e.dispatch("error"); this.Reconnect(endpoint); };
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
        this.websocketData[endpoint].e.dispatch("reconnect");
        delete this.websocketData[endpoint];
        setTimeout(() => { this.AddEndpoint(endpoint); }, 1000);
    }
}

class eventWebsocket
{
    e: EventDispatcher = new EventDispatcher();
    ws: WebSocket;
    constructor(_ws: WebSocket) { this.ws = _ws; }
}

export type MapData =
{
    GameVersion: string,
    PluginVersion: string,

    //Map
    Hash: string | null,
    SongName: string | null,
    SongSubName: string | null,
    SongAuthor: string | null,
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
        batteryEnergy: boolean
        disappearingArrows: boolean
        fasterSong: boolean
        ghostNotes: boolean
        instaFail: boolean
        noArrows: boolean
        noBombs: boolean
        noFail: boolean
        noObstacles: boolean
        slowerSong: boolean
    },
    PracticeMode: boolean,
    PracticeModeModifiers:
    {
        songSpeedMul: number
    },
    PP: number,
    Star: number,

    //Misc
    PreviousRecord: number,
    PreviousBSR: string | null
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
    ScoreWithMultipliers: number,
    MaxScore: number,
    MaxScoreWithMultipliers: number,
    FullCombo: boolean,
    Combo: number,
    Misses: number,
    Accuracy: number,
    BlockHitScores: number[],
    PlayerHealth: number,
    Rank: string

    //Misc
    TimeElapsed: number
}

export class sampleData
{
    public static mapData: MapData =
    {
        GameVersion: "1.13.0",
        PluginVersion: "1.1.1.0",
        Hash: "919801A45C4BCFDC075CF6976D20B9B4315013DB",
        SongName: "Introduction - Xursed divinitiY",
        SongSubName: "<NONE FOR THIS MAP>",
        SongAuthor: "Camellia",
        Mapper: "Schwank & Jabob",
        BSRKey: "123ba",
        coverImage: "https://beatsaver.com/cdn/123ba/919801a45c4bcfdc075cf6976d20b9b4315013db.jpg",
        Length: 220,
        TimeScale: 0,
        MapType: "Standard",
        Difficulty: "ExpertPlus",
        CustomDifficultyLabel: "Swaks COLD BREW",
        BPM: 222,
        NJS: 22,
        Modifiers:
        {
            batteryEnergy: true,
            disappearingArrows: true,
            fasterSong: false,
            ghostNotes: false,
            instaFail: false,
            noArrows: false,
            noBombs: false,
            noFail: false,
            noObstacles: false,
            slowerSong: false
        },
        PracticeMode: false,
        PracticeModeModifiers:
        {
            songSpeedMul: 1
        },
        PP: 408,
        Star: 0,
        PreviousRecord: 1323492,
        PreviousBSR: "11bca"
    }

    public static liveData: LiveData =
    {
        InLevel: false,
        LevelPaused: false,
        LevelFinished: false,
        LevelFailed: true,
        LevelQuit: false,
        Score: 0,
        ScoreWithMultipliers: 0,
        MaxScore: 1495,
        MaxScoreWithMultipliers: 1495,
        FullCombo: false,
        Combo: 0,
        Misses: 6,
        Accuracy: 0,
        BlockHitScores: [115, 110, 107, 56, 95, 4, 102],
        PlayerHealth: 0,
        Rank: "E",
        TimeElapsed: 19
    }
}