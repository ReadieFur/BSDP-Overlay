import { Main } from "./main.js";
import { EventDispatcher } from "./eventDispatcher.js";
export class Client {
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
        this.websocketData = {};
    }
    AddEndpoint(endpoint, reconnect) {
        let socket = this.websocketData[endpoint] = new EventWebsocket(new WebSocket(`ws://${this.IP}:2946/BSDataPuller/${endpoint}`));
        socket.e = new EventDispatcher();
        socket.ws.onerror = (e) => { socket.e.dispatch("error"); this.Reconnect(endpoint); };
        socket.ws.onclose = (e) => { socket.e.dispatch("close"); this.Reconnect(endpoint); };
        socket.ws.onopen = (e) => { socket.e.dispatch("open"); };
        socket.ws.onmessage = (e) => {
            let jsonData = JSON.parse(e.data);
            socket.e.dispatch("message", jsonData);
            if (Main.urlParams.has("debug")) {
                console.log(jsonData);
            }
        };
    }
    Reconnect(endpoint) {
        if (this.websocketData[endpoint] !== undefined) {
            this.websocketData[endpoint].e.dispatch("reconnect");
            delete this.websocketData[endpoint];
            setTimeout(() => { this.AddEndpoint(endpoint, true); }, 1000);
        }
    }
}
class EventWebsocket {
    constructor(_ws) {
        this.e = new EventDispatcher();
        this.ws = _ws;
    }
}
export class SampleData {
}
SampleData.mapData = {
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
SampleData.liveData = {
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
//# sourceMappingURL=client.js.map