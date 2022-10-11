import * as WebData from "./web.js";

//#region Converters
export class Converter extends WebData.Converter
{
    public ConvertMapData(data: object): WebData.MapData
    {
        const source = data as MapData;
        const converted = new WebData.MapData();

        //#region Level
        converted.InLevel = source.InLevel;
        converted.LevelPaused = source.LevelPaused;
        converted.LevelFinished = source.LevelFinished;
        converted.LevelFailed = source.LevelFailed;
        converted.LevelQuit = source.LevelQuit;
        //#endregion

        //#region Map
        converted.Hash = source.Hash;
        converted.SongName = source.SongName ?? converted.SongName;
        converted.SongSubName = source.SongSubName ?? converted.SongSubName;
        converted.SongAuthor = source.SongAuthor;
        converted.Mapper = source.Mapper ?? converted.Mapper;
        converted.BSRKey = source.BSRKey;
        converted.CoverImage = source.coverImage;
        converted.Duration = source.Length;
        //#endregion

        //#region Difficulty
        converted.MapType = source.MapType ?? converted.MapType ;
        converted.Difficulty = source.Difficulty ?? converted.Difficulty;
        converted.CustomDifficultyLabel = source.CustomDifficultyLabel;
        converted.BPM = source.BPM;
        converted.NJS = source.NJS;
        //#region Modifiers
        converted.Modifiers.NoFailOn0Energy = source.Modifiers.noFailOn0Energy;
        converted.Modifiers.OneLife = source.Modifiers.oneLife;
        converted.Modifiers.FourLives = source.Modifiers.fourLives;
        converted.Modifiers.NoBombs = source.Modifiers.noBombs;
        converted.Modifiers.NoWalls = source.Modifiers.noWalls;
        converted.Modifiers.NoArrows = source.Modifiers.noArrows;
        converted.Modifiers.GhostNotes = source.Modifiers.ghostNotes;
        converted.Modifiers.DisappearingArrows = source.Modifiers.disappearingArrows;
        converted.Modifiers.SmallNotes = source.Modifiers.smallNotes;
        converted.Modifiers.ProMode = source.Modifiers.proMode;
        converted.Modifiers.StrictAngles = source.Modifiers.strictAngles;
        converted.Modifiers.ZenMode = source.Modifiers.zenMode;
        converted.Modifiers.SlowerSong = source.Modifiers.slowerSong;
        converted.Modifiers.FasterSong = source.Modifiers.fasterSong;
        converted.Modifiers.SuperFastSong = source.Modifiers.superFastSong;
        //#endregion
        converted.ModifiersMultiplier = source.ModifiersMultiplier;
        converted.PracticeMode = source.PracticeMode;
        //#region PracticeModeModifiers
        converted.PracticeModeModifiers.SongSpeedMul = source.PracticeModeModifiers.songSpeedMul;
        converted.PracticeModeModifiers.StartInAdvanceAndClearNotes = source.PracticeModeModifiers.startInAdvanceAndClearNotes == 1.0;
        converted.PracticeModeModifiers.SongStartTime = source.PracticeModeModifiers.startSongTime;
        //#endregion
        converted.PP = source.PP;
        converted.Star = source.Star;
        //#endregion

        //#region Misc
        converted.GameVersion = source.GameVersion;
        converted.PluginVersion = source.PluginVersion;
        converted.IsMultiplayer = source.IsMultiplayer;
        converted.PreviousRecord = source.PreviousRecord;
        converted.PreviousBSR = source.PreviousBSR;
        converted.UnixTimestamp = source.unixTimestamp;
        //#endregion

        return converted;
    }
    public ConvertLiveData(data: object): WebData.LiveData
    {
        const source = data as LiveData;
        const converted = new WebData.LiveData();

        //#region Score
        converted.Score = source.Score;
        converted.ScoreWithMultipliers = source.ScoreWithMultipliers;
        converted.MaxScore = source.MaxScore;
        converted.MaxScoreWithMultipliers = source.MaxScoreWithMultipliers;
        converted.Rank = source.Rank ?? converted.Rank;
        converted.FullCombo = source.FullCombo;
        //converted.NotesSpawned = source.NotesSpawned; //Property didn't exist on this version.
        converted.Combo = source.Combo;
        converted.Misses = source.Misses;
        converted.Accuracy = source.Accuracy;
        //#region BlockHitScore
        if (source.BlockHitScore != null)
        {
            converted.BlockHitScore.PreSwing = source.BlockHitScore[0];
            converted.BlockHitScore.PostSwing = source.BlockHitScore[1];
            converted.BlockHitScore.CenterSwing = source.BlockHitScore[2];
        }
        //#endregion
        converted.PlayerHealth = source.PlayerHealth;
        //#region ColorType
        switch (source.ColorType)
        {
            case ColorType.None:
                converted.ColorType = WebData.EColorType.None;
                break;
            case ColorType.ColorA:
                converted.ColorType = WebData.EColorType.ColorA;
                break;
            case ColorType.ColorB:
                converted.ColorType = WebData.EColorType.ColorB;
                break;
        }
        //#endregion
        //#endregion

        //#region Misc.
        converted.TimeElapsed = source.TimeElapsed;
        converted.UnixTimestamp = source.unixTimestamp;
        //#region EventTrigger
        switch (source.EventTrigger)
        {
            case LiveDataEventTriggers.TimerElapsed:
                converted.EventTrigger = WebData.EEventTrigger.TimerElapsed;
                break;
            case LiveDataEventTriggers.NoteMissed:
                converted.EventTrigger = WebData.EEventTrigger.NoteMissed;
                break;
            case LiveDataEventTriggers.EnergyChange:
                converted.EventTrigger = WebData.EEventTrigger.EnergyChange;
                break;
            case LiveDataEventTriggers.ScoreChange:
                converted.EventTrigger = WebData.EEventTrigger.ScoreChange;
                break;
        }
        //#endregion
        //#endregion

        return converted;
    }
}
//#endregion

//#region Types
//#region MapData
type MapData =
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
    PreviousBSR: string | null,
    unixTimestamp: number
}
//#endregion

//#region LiveData
type LiveData =
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
    ColorType: ColorType,

    //Misc
    TimeElapsed: number,
    unixTimestamp: number,
    EventTrigger: LiveDataEventTriggers | null;
}

enum ColorType
{
    ColorA = 0,
    ColorB = 1,
    None = -1
}

enum LiveDataEventTriggers
{
    TimerElapsed,
    NoteMissed,
    EnergyChange,
    ScoreChange
}
//#endregion
//#endregion
