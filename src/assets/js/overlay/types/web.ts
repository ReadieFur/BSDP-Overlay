export abstract class Converter
{
    public abstract ConvertMapData(data: object): MapData;
    public abstract ConvertLiveData(data: object): LiveData;
}

export class Version
{
    public static FromString(version: string): Version
    {
        let splitVersion = version.split(".");
        if (splitVersion.length < 3) throw new Error("Invalid version format.");
        return new Version(parseInt(splitVersion[0]), parseInt(splitVersion[1]), parseInt(splitVersion[2]));
    }

    private readonly major: number;
    private readonly minor: number;
    private readonly patch: number;

    constructor(major: number, minor: number, patch: number)
    {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    public GetMajor(): number
    {
        return this.major;
    }

    public GetMinor(): number
    {
        return this.minor;
    }

    public GetPatch(): number
    {
        return this.patch;
    }

    public ToString(fieldCount: Number = 3): string
    {
        switch (fieldCount)
        {
            case 1:
                return `${this.major}`;
            case 2:
                return `${this.major}.${this.minor}`;
            case 3:
                return `${this.major}.${this.minor}.${this.patch}`;
            default:
                throw new Error("Invalid field count.");
        }
    }
}

/*IDE Comment structure:
/**
 * SUMMARY?
 *
 * REMARKS?
 *
 * Default is VALUE.
 *
 * VERSIONS?
 */
//*/

//#region Game types
export abstract class AData
{
    /**
     * The time that the data was serialized.
     */
    public UnixTimestamp: number = 0;
}

//#region MapData
export class MapData extends AData
{
    //#region Level
    /**
     * This can remain false even if LevelFailed is true, when Modifiers.NoFailOn0Energy is true.
     *
     * Default is false.
     */
    public InLevel: boolean = false;
    /**
     * Default is false.
     */
    public LevelPaused: boolean = false;
    /**
     * Default is false.
     */
    public LevelFinished: boolean = false;
    /**
     * Default is false.
     */
    public LevelFailed: boolean = false;
    /**
     * Default is false.
     */
    public LevelQuit: boolean = false;
    //#endregion

    //#region Map
    /**
     * The hash ID for the current map.
     *
     * null if the hash could not be determined (e.g. if the map is not a custom level).
     *
     * Default is null.
     */
    public Hash: string | null = null;

    /**
     * The name of the current map.
     *
     * Default is "".
     */
    public SongName: string = "";

    /**
     * The sub-name of the current map.
     *
     * Default is "".
     */
    public SongSubName: string = "";

    /**
     * The author of the song.
     *
     * Default is "".
     */
    public SongAuthor: string = "";

    /**
     * The mapper of the current chart.
     *
     * Default is "".
     */
    public Mapper: string = "";

    /**
     * The BSR key of the current map.
     *
     * null if the BSR key could not be obtained.
     *
     * Default is null.
     */
    public BSRKey: string | null = null;

    /**
     * The cover image of the current map.
     *
     * null if the cover image could not be obtained.
     *
     * Default is null.
     */
    public CoverImage: string | null = null;

    /**
     * The duration of the map in seconds.
     *
     * Default is 0.
     */
    public Duration: number = 0;
    //#endregion

    //#region Difficulty
    /**
     * The type of map.
     *
     * i.e. Standard, 360, OneSaber, etc.
     *
     * Default is "".
     */
    public MapType: string = "";

    /**
     * The standard difficulty label of the map.
     *
     * i.e. Easy, Normal, Hard, etc.
     *
     * Default is "".
     */
    public Difficulty: string = "";

    /**
     * The custom difficulty label set by the mapper.
     *
     * null if there is none.
     *
     * Default is null.
     */
    public CustomDifficultyLabel: string | null = null;

    /**
     * The beats per minute of the current map.
     *
     * Default is 0.
     */
    public BPM: number = 0;

    /**
     * The note jump speed of the current map.
     *
     * Default is 0.
     */
    public NJS: number = 0;

    /**
     * The modifiers selected by the player for the current level.
     *
     * i.e. No fail, No arrows, Ghost notes, etc.
     *
     * Default is new Modifiers().
     */
    public Modifiers: Modifiers = new Modifiers();

    /**
     * The score multiplier set by the users selection of modifiers.
     *
     * Default is 1.0.
     */
    public ModifiersMultiplier: number = 1.0;

    /**
     * Default is false.
     */
    public PracticeMode: boolean = false;

    /**
     * The modifiers selected by the user that are specific to practice mode.
     *
     * Default is new PracticeModeModifiers().
     */
    public PracticeModeModifiers: PracticeModeModifiers = new PracticeModeModifiers();

    /**
     * The amount Play Points this map is worth.
     *
     * 0 if the map is unranked or the value was undetermined.
     *
     * Default is 0.
     */
    public PP: number = 0;

    /**
     * 0 if the value was undetermined.
     *
     * Default is 0.
     */
    public Star: number = 0;
    //#endregion

    //#region Misc
    /**
     * Will be the current game version, e.g. 1.20.0.
     */
    public GameVersion: string = "";

    /**
     * Will be the current version of the plugin, e.g. 2.1.0.
     */
    public PluginVersion: string = "";

    /**
     * Default is false.
     */
    public IsMultiplayer: boolean = false;

    /**
     * The previous local record set by the player for this map specific mode and difficulty.
     *
     * 0 if the map variant hasn't never been played before.
     *
     * Default is 0.
     */
    public PreviousRecord: number = 0;

    /**
     * The BSR key fore the last played map.
     *
     * null if there was no previous map or the previous maps BSR key was undetermined.
     *
     * This value won't be updated if the current map is the same as the last.
     *
     * Default is null.
     */
    public PreviousBSR: string | null = null;
    //#endregion
}

export class Modifiers
{
    public NoFailOn0Energy: boolean = false;
    public OneLife: boolean = false;
    public FourLives: boolean = false;
    public NoBombs: boolean = false;
    public NoWalls: boolean = false;
    public NoArrows: boolean = false;
    public GhostNotes: boolean = false;
    public DisappearingArrows: boolean = false;
    public SmallNotes: boolean = false;
    public ProMode: boolean = false;
    public StrictAngles: boolean = false;
    public ZenMode: boolean = false;
    public SlowerSong: boolean = false;
    public FasterSong: boolean = false;
    public SuperFastSong: boolean = false;
}

export class PracticeModeModifiers
{
    public SongSpeedMul: number = 1;
    public StartInAdvanceAndClearNotes: boolean = false;
    public SongStartTime: number = 0;
}
//#endregion

//#region LiveData
export class LiveData extends AData
{
    //#region Score
    /**
     * The current raw score.
     *
     * Default is 0.
     */
    public Score: number = 0;

    /**
     * The current score with the player selected multipliers applied.
     *
     * Default is 0.
     */
    public ScoreWithMultipliers: number = 0;

    /**
     * The maximum possible raw score for the current number of cut notes.
     *
     * Default is 0.
     */
    public MaxScore: number = 0;

    /**
     * The maximum possible score with the player selected multipliers applied for the current number of cut notes.
     *
     * Default is 0.
     */
    public MaxScoreWithMultipliers: number = 0;

    /**
     * The string rank label for the current score.
     *
     * i.e. SS, S, A, B, etc.
     *
     * Default is SSS.
     */
    public Rank: string = "SSS";

    /**
     * Default is true.
     */
    public FullCombo: boolean = true;

    /**
     * The total number of notes spawned since the start position of the song until the current position in the song.
     *
     * Default is 0.
     *
     * **Not available in versions prior to 2.1.**
     */
    public NotesSpawned: number = 0;

    /**
     * The current note cut combo count without error.
     *
     * Resets back to 0 when the player: misses a note, hits a note incorrectly, takes damage or hits a bomb.
     *
     * Default is 0.
     */
    public Combo: number = 0;

    /**
     * The total number of missed and incorrectly hit notes since the start position of the song until the current position in the song.
     *
     * Default is 0.
     */
    public Misses: number = 0;

    /**
     * Default is 100.
     */
    public Accuracy: number = 100;

    /**
     * The individual scores for the last hit note.
     *
     * Default is new BlockHitScore().
     */
    public BlockHitScore: BlockHitScore = new BlockHitScore();

    /**
     * Default is 50.
     */
    public PlayerHealth: number = 50;

    /**
     * The individual scores for the last hit note.
     *
     * ColorType.None if no note was previously hit or a bomb was hit.
     *
     * Default is EColorType.None.
     */
    public ColorType: EColorType = EColorType.None;
    //#endregion

    //#region Misc
    /**
     * The total amount of time in seconds since the start of the map.
     *
     * Default is 0.
     */
    public TimeElapsed: number = 0;

    /**
     * The event that caused the update trigger to be fired.
     *
     * Default is EEventTrigger.Unknown.
     */
    public EventTrigger: EEventTrigger = EEventTrigger.Unknown;
    //#endregion
}

export class BlockHitScore
{
    /**
     * 0 to 70.
     */
    public PreSwing: number = 0;

    /**
     * 0 to 30.
     */
    public PostSwing: number = 0;

    /**
     * 0 to 15.
     */
    public CenterSwing: number = 0;
}

export enum EColorType
{
    ColorA = 0,
    ColorB = 1,
    None = -1
}

export enum EEventTrigger
{
    Unknown = 0,
    TimerElapsed,
    NoteMissed,
    EnergyChange,
    ScoreChange
}
//#endregion
//#endregion

//#region Sample data
export class SampleData
{
    //Using old data (should still be valid).
    //https://github.com/ReadieFur/BSDataPuller/blob/master/README.md#dev-docs-wip

    public static GetMapData(): MapData
    {
        let mapData = new MapData();

        //#region AData
        mapData.UnixTimestamp = 1631935482036;
        //#endregion

        //#region Level
        mapData.InLevel = true;
        mapData.LevelPaused = false;
        mapData.LevelFinished = false;
        mapData.LevelFailed = false;
        mapData.LevelQuit = false;
        //#endregion

        //#region Map
        mapData.Hash = "648B6FE961C398DE638FA1E614878F1194ADF92E";
        mapData.SongName = "Tera I/O";
        mapData.SongSubName = "[200 Step]";
        mapData.Mapper = "cerret";
        mapData.BSRKey = "11a27";
        mapData.CoverImage = "https://eu.cdn.beatsaver.com/2b090f3bae36acdcff6197cddf95ff2290cfb487.jpg";
        mapData.Duration = 336;
        //#endregion

        //#region Difficulty
        mapData.MapType = "Standard";
        mapData.Difficulty = "ExpertPlus";
        mapData.CustomDifficultyLabel = "Normal";
        mapData.BPM = 200;
        mapData.NJS = 23;
        mapData.Modifiers = new Modifiers();
        mapData.Modifiers.DisappearingArrows = true;
        mapData.ModifiersMultiplier = 1;
        mapData.PracticeMode = false;
        mapData.PracticeModeModifiers = new PracticeModeModifiers();
        mapData.PP = 0;
        mapData.Star = 0;
        //#endregion

        //#region Misc
        mapData.GameVersion = "1.13.2";
        mapData.PluginVersion = "2.0.12";
        mapData.SongAuthor = "Camellia";
        mapData.IsMultiplayer = false;
        mapData.PreviousRecord = 2714014;
        mapData.PreviousBSR = null;
        //#endregion

        return mapData;
    }

    public static GetLiveData(): LiveData
    {
        const liveData = new LiveData();

        //#region AData
        liveData.UnixTimestamp = 1631935485375;
        //#endregion

        //#region Score
        liveData.Score = 574728;
        liveData.ScoreWithMultipliers = 574728;
        liveData.MaxScore = 612835;
        liveData.MaxScoreWithMultipliers = 612835;
        liveData.Rank = "SS";
        liveData.FullCombo = false;
        liveData.NotesSpawned = 612;
        liveData.Combo = 352;
        liveData.Misses = 2;
        liveData.Accuracy = 94.20143961906433;
        liveData.BlockHitScore = new BlockHitScore();
        liveData.BlockHitScore.PreSwing = 70;
        liveData.BlockHitScore.PostSwing = 30;
        liveData.BlockHitScore.CenterSwing = 14;
        liveData.PlayerHealth = 100;
        liveData.ColorType = EColorType.ColorA;
        //#endregion

        //#region Misc
        liveData.TimeElapsed = 77;
        liveData.EventTrigger = EEventTrigger.ScoreChange;
        //#endregion

        return liveData;
    }
}
//#endregion

export class Parser
{
    private static readonly LATEST_KNOWN_PLUGIN_VERSION = Version.FromString("2.1.0");
    private static readonly KNOWN_VERSION_KEYS = ["PluginVersion"];
    private static pluginVersion: Version | null = null;
    private static importedConverters: Map<string, Converter> = new Map<string, Converter>();

    public static GetPluginVersion(): Version
    {
        return this.pluginVersion ?? this.LATEST_KNOWN_PLUGIN_VERSION;
    }

    /**
     * This can also be used to check if the data type is MapData.
     */
    public static GetPluginVersionFromData(data: string): Version
    {
        return this.GetPluginVersionFromDataObj(JSON.parse(data));
    }

    /**
     * This can also be used to check if the data type is MapData.
     */
    public static GetPluginVersionFromDataObj(data: object): Version
    {
        const deserializedData = data as any;

        let pluginVersionStr: string | null = null;
        for (const key of this.KNOWN_VERSION_KEYS)
        {
            if (deserializedData[key] != undefined)
            {
                pluginVersionStr = deserializedData[key];
                break;
            }
        }
        if (pluginVersionStr === null) throw new Error("Invalid map data.");

        return Version.FromString(pluginVersionStr);
    }

    public static async ParseMapData(data: string): Promise<MapData>
    {
        return this.ParseMapDataObj(JSON.parse(data));
    }

    public static async ParseMapDataObj(data: object): Promise<MapData>
    {
        const deserializedData = data as any;

        //We can use the GetPluginVersionFromDataObj wrapped in a try/catch clause to determine if the data is MapData or LiveData.
        let pluginVersion: Version;
        try { pluginVersion = this.GetPluginVersionFromDataObj(deserializedData); }
        catch { throw new Error("Invalid MapData."); }

        await this.LoadConverter(pluginVersion);

        const converter = await this.GetConverter(this.pluginVersion!);

        return converter.ConvertMapData(deserializedData);
    }

    public static async ParseLiveData(data: string): Promise<LiveData>
    {
        return this.ParseLiveDataObj(JSON.parse(data));
    }

    public static async ParseLiveDataObj(data: object): Promise<LiveData>
    {
        const deserializedData = data as any;

        let isLiveData = false;
        try { this.GetPluginVersionFromDataObj(deserializedData); }
        catch { isLiveData = true; }
        finally { if (!isLiveData) throw new Error("Invalid LiveData."); }

        //If the pluginVersion is null for some reason (it shouldn't be here). Assume the data is for the latest known version.
        const pluginVersion = this.pluginVersion ?? this.LATEST_KNOWN_PLUGIN_VERSION;

        await this.LoadConverter(pluginVersion);

        const converter = await this.GetConverter(pluginVersion);

        return converter.ConvertLiveData(deserializedData);
    }

    public static async LoadConverter(pluginVersion: Version): Promise<void>
    {
        const pluginVersionMajorMinor = pluginVersion.ToString(2);
        if (this.importedConverters.has(pluginVersionMajorMinor)) return;

        const script = await import(`./${pluginVersionMajorMinor}.js`);
        const converter: Converter = new script.Converter();

        this.importedConverters.set(pluginVersionMajorMinor, converter);

        this.pluginVersion = pluginVersion;
    }

    public static async GetConverter(pluginVersion: Version): Promise<Converter>
    {
        const majorMinorString = pluginVersion.ToString(2);
        if (!this.importedConverters.has(majorMinorString)) throw new Error("Converter not found.");
        return this.importedConverters.get(majorMinorString)!;
    }
}
