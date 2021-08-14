import { Main } from "./main.js";
import { EventDispatcher } from "./eventDispatcher.js";
export class Client {
    protocol;
    IP;
    connections;
    constructor(_IP) {
        if (_IP === undefined || _IP === null) {
            this.IP = "127.0.0.1";
        }
        else if (RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(_IP)) {
            this.IP = _IP;
        }
        else {
            throw new SyntaxError("Invalid IP");
        }
        this.protocol = "ws";
        this.connections = {};
    }
    AddEndpoint(endpoint) {
        this.connections[endpoint] = new CustomWebSocket(this.protocol, this.IP, endpoint);
    }
    RemoveEndpoint(endpoint) {
        delete this.connections[endpoint];
    }
}
class CustomWebSocket {
    protocol;
    ip;
    endpoint;
    eventDispatcher;
    websocket;
    constructor(_protocol, _ip, _endpoint) {
        this.protocol = _protocol;
        this.ip = _ip;
        this.endpoint = _endpoint;
        this.eventDispatcher = new EventDispatcher();
        this.websocket = null;
    }
    Connect() {
        this.websocket = new WebSocket(`${this.protocol}://${this.ip}:2946/BSDataPuller/${this.endpoint}`);
        this.websocket.onopen = (ev) => { this.OnOpen(ev); };
        this.websocket.onclose = (ev) => { this.OnClose(ev); };
        this.websocket.onerror = (ev) => { this.OnError(ev); };
        this.websocket.onmessage = (ev) => { this.OnMessage(ev); };
    }
    AddEventListener(event, callback) {
        this.eventDispatcher.AddEventListener(event, callback);
    }
    RemoveEventListener(event, callback) {
        this.eventDispatcher.RemoveEventListener(event, callback);
    }
    OnOpen(ev) {
        this.eventDispatcher.DispatchEvent("open", ev);
    }
    OnClose(ev) {
        this.eventDispatcher.DispatchEvent("close", ev);
        setTimeout(() => { this.Connect(); }, 5000);
    }
    OnError(ev) {
        this.eventDispatcher.DispatchEvent("error", ev);
    }
    OnMessage(ev) {
        var jsonData = JSON.parse(ev.data);
        this.eventDispatcher.DispatchEvent("message", jsonData);
        if (Main.urlParams.has("debug")) {
            console.log(jsonData);
        }
    }
}
export class SampleData {
    static mapData = {
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
        Modifiers: {
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
        PracticeModeModifiers: {
            songSpeedMul: 1,
            startInAdvanceAndClearNotes: 0,
            startSongTime: 0
        },
        PP: 0,
        Star: 0,
        IsMultiplayer: false,
        PreviousRecord: 2714014,
        PreviousBSR: "123ba"
    };
    static liveData = {
        Score: 574728,
        ScoreWithMultipliers: 574728,
        MaxScore: 612835,
        MaxScoreWithMultipliers: 612835,
        Rank: "SS",
        FullCombo: false,
        Combo: 352,
        Misses: 2,
        Accuracy: 94.20143961906433,
        BlockHitScore: [
            70,
            30,
            14
        ],
        PlayerHealth: 87,
        TimeElapsed: 77
    };
}
//# sourceMappingURL=client.js.map