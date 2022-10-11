import * as WebData from "./web.js";

//#region Converters
export class Converter extends WebData.Converter
{
    public ConvertMapData(data: object): WebData.MapData
    {
        const source = data as MapData;
        const converted = new WebData.MapData();

        //#region AData
        converted.UnixTimestamp = source.UnixTimestamp;
        //#endregion

        //#region Level
        converted.InLevel = source.InLevel;
        converted.LevelPaused = source.LevelPaused;
        converted.LevelFinished = source.LevelFinished;
        converted.LevelFailed = source.LevelFailed;
        converted.LevelQuit = source.LevelQuit;
        //#endregion

        //#region Map
        converted.Hash = source.Hash;
        converted.SongName = source.SongName;
        converted.SongSubName = source.SongSubName;
        converted.SongAuthor = source.SongAuthor;
        converted.Mapper = source.Mapper;
        converted.BSRKey = source.BSRKey;
        converted.CoverImage = source.CoverImage;
        converted.Duration = source.Duration;
        //#endregion

        //#region Difficulty
        converted.MapType = source.MapType;
        converted.Difficulty = source.Difficulty;
        converted.CustomDifficultyLabel = source.CustomDifficultyLabel;
        converted.BPM = source.BPM;
        converted.NJS = source.NJS;
        converted.Modifiers = source.Modifiers;
        converted.ModifiersMultiplier = source.ModifiersMultiplier;
        converted.PracticeMode = source.PracticeMode;
        //#region PracticeModeModifiers
        converted.PracticeModeModifiers.SongSpeedMul = source.PracticeModeModifiers.SongSpeedMul;
        converted.PracticeModeModifiers.StartInAdvanceAndClearNotes = source.PracticeModeModifiers.StartInAdvanceAndClearNotes;
        converted.PracticeModeModifiers.SongStartTime = source.PracticeModeModifiers.SongStartTime;
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
        //#endregion

        return converted;
    }
    public ConvertLiveData(data: object): WebData.LiveData
    {
        const source = data as LiveData;
        const converted = new WebData.LiveData();

        //#region AData
        converted.UnixTimestamp = source.UnixTimestamp;
        //#endregion

        //#region Score
        converted.Score = source.Score;
        converted.ScoreWithMultipliers = source.ScoreWithMultipliers;
        converted.MaxScore = source.MaxScore;
        converted.MaxScoreWithMultipliers = source.MaxScoreWithMultipliers;
        converted.Rank = source.Rank;
        converted.FullCombo = source.FullCombo;
        converted.NotesSpawned = source.NotesSpawned;
        converted.Combo = source.Combo;
        converted.Misses = source.Misses;
        converted.Accuracy = source.Accuracy;
        converted.BlockHitScore = source.BlockHitScore;
        converted.PlayerHealth = source.PlayerHealth;
        converted.ColorType = source.ColorType;
        //#endregion

        //#region Misc
        converted.TimeElapsed = source.TimeElapsed;
        converted.EventTrigger = source.EventTrigger;
        //#endregion

        return converted;
    }
}
//#endregion

//#region Types
interface AData
{
    UnixTimestamp: number;
}

//#region MapData
interface MapData extends AData
{
    //Level.
    InLevel: boolean;
    LevelPaused: boolean;
    LevelFinished: boolean;
    LevelFailed: boolean;
    LevelQuit: boolean;

    //Map.
    Hash: string | null;
    SongName: string;
    SongSubName: string;
    SongAuthor: string;
    Mapper: string;
    BSRKey: string | null;
    CoverImage: string | null;
    Duration: number;

    //Difficulty.
    MapType: string;
    Difficulty: string;
    CustomDifficultyLabel: string | null;
    BPM: number;
    NJS: number;
    Modifiers: Modifiers;
    ModifiersMultiplier: number;
    PracticeMode: boolean;
    PracticeModeModifiers: PracticeModeModifiers;
    PP: number;
    Star: number;

    //Misc.
    GameVersion: string;
    PluginVersion: string;
    IsMultiplayer: boolean;
    PreviousRecord: number;
    PreviousBSR: string | null;
}

interface Modifiers
{
    NoFailOn0Energy: boolean;
    OneLife: boolean;
    FourLives: boolean;
    NoBombs: boolean;
    NoWalls: boolean;
    NoArrows: boolean;
    GhostNotes: boolean;
    DisappearingArrows: boolean;
    SmallNotes: boolean;
    ProMode: boolean;
    StrictAngles: boolean;
    ZenMode: boolean;
    SlowerSong: boolean;
    FasterSong: boolean;
    SuperFastSong: boolean;
}

interface PracticeModeModifiers
{
    SongSpeedMul: number;
    StartInAdvanceAndClearNotes: boolean;
    SongStartTime: number;
}
//#endregion

//#region LiveData
interface LiveData extends AData
{
    //Score.
    Score: number;
    ScoreWithMultipliers: number;
    MaxScore: number;
    MaxScoreWithMultipliers: number;
    Rank: string;
    FullCombo: boolean;
    NotesSpawned: number;
    Combo: number;
    Misses: number;
    Accuracy: number;
    BlockHitScore: BlockHitScore;
    PlayerHealth: number;
    ColorType: EColorType;

    //Misc.
    TimeElapsed: number;
    EventTrigger: EEventTrigger;
}

interface BlockHitScore
{
    PreSwing: number;
    PostSwing: number;
    CenterSwing: number;
}

enum EColorType
{
    ColorA = 0,
    ColorB = 1,
    None = -1
}

enum EEventTrigger
{
    Unknown = 0,
    TimerElapsed,
    NoteMissed,
    EnergyChange,
    ScoreChange
}
//#endregion
//#endregion
