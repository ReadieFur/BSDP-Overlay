import { Main } from "./main.js";
import { LiveData, MapData, SampleData } from "./client.js";

export class DefaultUI
{
    private overlay: HTMLDivElement;
    private overlayThemeColours: HTMLStyleElement;

    private stats: HTMLTableElement;
    private time: HTMLTableDataCellElement;
    private score: HTMLTableDataCellElement;
    private accuracy: HTMLTableDataCellElement;
    private combo: HTMLTableDataCellElement;

    private modifiersAndHealth: HTMLTableElement;
    private modifiersAndHealthTR: HTMLTableRowElement;
    private healthColumn: HTMLTableDataCellElement;
    private health: HTMLDivElement;
    private modifiers:
    {
        noFailOn0Energy: HTMLTableDataCellElement,
        oneLife: HTMLTableDataCellElement,
        fourLives: HTMLTableDataCellElement,
        noBombs: HTMLTableDataCellElement,
        noWalls: HTMLTableDataCellElement,
        noArrows: HTMLTableDataCellElement,
        ghostNotes: HTMLTableDataCellElement,
        disappearingArrows: HTMLTableDataCellElement,
        smallNotes: HTMLTableDataCellElement,
        proMode: HTMLTableDataCellElement,
        strictAngles: HTMLTableDataCellElement,
        zenMode: HTMLTableDataCellElement,
        slowerSong: HTMLTableDataCellElement,
        fasterSong: HTMLTableDataCellElement,
        superFastSong: HTMLTableDataCellElement
    };

    private mapDetails: HTMLTableElement;
    private mapDetailsTR: HTMLTableRowElement;
    private mapCoverTD: HTMLTableDataCellElement;
    private preBSR: HTMLParagraphElement;
    private mapCoverContainer: HTMLTableDataCellElement;
    private mapCover: HTMLImageElement;
    private mapDetailsContainer: HTMLTableDataCellElement;
    private bsr: HTMLParagraphElement;
    private mapper: HTMLParagraphElement;
    private artistName: HTMLParagraphElement;
    private songName: HTMLParagraphElement;

    private mapData?: MapData;
    private liveData?: LiveData
    
    constructor()
    {
        //Should I be doing this when DOM content is loaded to prevent errors?
        this.overlay = Main.ThrowIfNullOrUndefined(document.querySelector("#overlay"));
        this.overlayThemeColours = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayThemeColours"));

        this.stats = Main.ThrowIfNullOrUndefined(document.querySelector("#stats"));
        this.time = Main.ThrowIfNullOrUndefined(document.querySelector("#time"));
        this.score = Main.ThrowIfNullOrUndefined(document.querySelector("#score"));
        this.accuracy = Main.ThrowIfNullOrUndefined(document.querySelector("#accuracy"));
        this.combo = Main.ThrowIfNullOrUndefined(document.querySelector("#combo"));

        this.modifiersAndHealth = Main.ThrowIfNullOrUndefined(document.querySelector("#modifiersAndHealth"));
        this.modifiersAndHealthTR = Main.ThrowIfNullOrUndefined(document.querySelector("#modifiersAndHealthTR"));
        this.healthColumn = Main.ThrowIfNullOrUndefined(document.querySelector("#healthColumn"));
        this.health = Main.ThrowIfNullOrUndefined(document.querySelector("#health"));
        this.modifiers =
        {
            noFailOn0Energy: Main.ThrowIfNullOrUndefined(document.querySelector("#NF")),
            oneLife: Main.ThrowIfNullOrUndefined(document.querySelector("#OL")),
            fourLives: Main.ThrowIfNullOrUndefined(document.querySelector("#FL")),
            noBombs: Main.ThrowIfNullOrUndefined(document.querySelector("#NB")),
            noWalls: Main.ThrowIfNullOrUndefined(document.querySelector("#NW")),
            noArrows: Main.ThrowIfNullOrUndefined(document.querySelector("#NA")),
            ghostNotes: Main.ThrowIfNullOrUndefined(document.querySelector("#GN")),
            disappearingArrows: Main.ThrowIfNullOrUndefined(document.querySelector("#DA")),
            smallNotes: Main.ThrowIfNullOrUndefined(document.querySelector("#SN")),
            proMode: Main.ThrowIfNullOrUndefined(document.querySelector("#PM")),
            strictAngles: Main.ThrowIfNullOrUndefined(document.querySelector("#SA")),
            zenMode: Main.ThrowIfNullOrUndefined(document.querySelector("#ZM")),
            slowerSong: Main.ThrowIfNullOrUndefined(document.querySelector("#SS")),
            fasterSong: Main.ThrowIfNullOrUndefined(document.querySelector("#FS")),
            superFastSong: Main.ThrowIfNullOrUndefined(document.querySelector("#SF"))
        };

        this.mapDetails = Main.ThrowIfNullOrUndefined(document.querySelector("#mapDetails"));
        this.mapDetailsTR = Main.ThrowIfNullOrUndefined(document.querySelector("#mapDetailsTR"));
        this.mapCoverTD = Main.ThrowIfNullOrUndefined(document.querySelector("#mapCoverTD"));
        this.preBSR = Main.ThrowIfNullOrUndefined(document.querySelector("#preBSR"));
        this.mapCoverContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#mapCoverContainer"));
        this.mapCover = Main.ThrowIfNullOrUndefined(document.querySelector("#mapCover"));
        this.mapDetailsContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#mapDetailsContainer"));
        this.bsr = Main.ThrowIfNullOrUndefined(document.querySelector("#bsr"));
        this.mapper = Main.ThrowIfNullOrUndefined(document.querySelector("#mapper"));
        this.artistName = Main.ThrowIfNullOrUndefined(document.querySelector("#artistName"));
        this.songName = Main.ThrowIfNullOrUndefined(document.querySelector("#songName"));

        this.overlayThemeColours.innerHTML = `
            :root
            {
                --overlayForeground: ${Main.urlParams.has("overlayForeground") ? Main.urlParams.get("overlayForeground") : "255, 255, 255"};
                --overlayBackground: ${Main.urlParams.has("overlayBackground") ? Main.urlParams.get("overlayBackground") : "40, 40, 40"};
                --overlayAlt: ${Main.urlParams.has("overlayAlt") ? Main.urlParams.get("overlayAlt") : "80, 80, 80"};
            }
        `;

        //Try to replace this in the client.ts event dispatcher.
        if (Main.urlParams.has("debug"))
        {
            this.MapDataUpdate(SampleData.mapData);
            this.LiveDataUpdate(SampleData.liveData);
        }

        document.body.style.zoom = Main.urlParams.has("scale") ? Main.urlParams.get("scale")! : "1";

        if (Main.urlParams.has("flipVerti"))
        {
            this.overlay.classList.add("top");
            this.mapCoverTD.appendChild(this.preBSR);
            this.mapDetailsContainer.appendChild(this.songName);
            this.mapDetailsContainer.appendChild(this.artistName);
            this.mapDetailsContainer.appendChild(this.mapper);
            this.mapDetailsContainer.appendChild(this.bsr);
        }
        else { this.overlay.classList.add("bottom"); }

        if (Main.urlParams.has("flipHori"))
        {
            this.overlay.classList.add("right");

            this.modifiersAndHealthTR.appendChild(this.healthColumn);
            this.mapDetailsTR.appendChild(this.mapCoverTD);
        }
        else { this.overlay.classList.add("left"); }

        if (Main.urlParams.has("hideStats")) { this.stats.style.display = "none"; }
        if (Main.urlParams.has("hideModifiersHealth")) { this.modifiersAndHealth.style.display = "none"; }
        if (Main.urlParams.has("hideMapDetails")) { this.mapDetails.style.display = "none"; }

        if (Main.urlParams.has("hideInactive")) { this.overlay.style.opacity = "0"; }
    }

    //These two functions will be called twice due to the multiple websocket connections but it should be fine.
    public ClientConnected()
    {
        this.overlay.style.opacity = "1";
    }

    public ClientDisconnected()
    {
        if (Main.urlParams.has("hideInactive")) { this.overlay.style.opacity = "0"; }
    }

    public MapDataUpdate(data: MapData): void
    {
        this.mapData = data;

        //Check if the game has just opened.
        if (!(!data.InLevel && !data.LevelFailed && !data.LevelFinished && !data.LevelQuit))
        {
            //Time
            var timeSplit: string[] = this.time.innerHTML.split("/");
            var mapLength: string = this.SecondsToMins(data.Length);
            if (timeSplit.length == 2) { this.time.innerHTML = `${timeSplit[0]}/${mapLength}`; }
            else { this.time.innerHTML = `00:00/${mapLength}`; }

            //Modifiers
            if (data.Modifiers !== null)
            {
                for (var [key, value] of Object.entries(data.Modifiers))
                {
                    var element: HTMLTableDataCellElement;

                    switch (key)
                    {
                        case "noFailOn0Energy": element = this.modifiers.noFailOn0Energy; break;
                        case "oneLife": element = this.modifiers.oneLife; break;
                        case "fourLives": element = this.modifiers.fourLives; break;
                        case "noBombs": element = this.modifiers.noBombs; break;
                        case "noWalls": element = this.modifiers.noWalls; break;
                        case "noArrows": element = this.modifiers.noArrows; break;
                        case "ghostNotes": element = this.modifiers.ghostNotes; break;
                        case "disappearingArrows": element = this.modifiers.disappearingArrows; break;
                        case "smallNotes": element = this.modifiers.smallNotes; break;
                        case "proMode": element = this.modifiers.proMode; break;
                        case "strictAngles": element = this.modifiers.strictAngles; break;
                        case "zenMode": element = this.modifiers.zenMode; break;
                        case "slowerSong": element = this.modifiers.slowerSong; break;
                        case "fasterSong": element = this.modifiers.fasterSong; break;
                        case "superFastSong": element = this.modifiers.superFastSong; break;
                        default: continue;
                    }

                    if (value === true) { element.classList.add("active"); }
                    else { element.classList.remove("active"); }
                }
            }

            //Cover image
            this.mapCover.src = data.coverImage !== null ? data.coverImage : "./BeatSaberIcon.jpg";

            //Map details
            this.HideOnNull(data.BSRKey, this.bsr, "BSR: ");
            this.HideOnNull(data.Mapper, this.mapper);
            this.HideOnNull(data.SongAuthor, this.artistName);
            this.HideOnNull(data.SongName, this.songName);

            //Misc
            this.HideOnNull(data.PreviousBSR, this.preBSR, "Pre BSR: ");

            //Style map details
            //Pre BSR
            if (this.preBSR.style.display === "block") { this.mapCoverContainer.classList.remove("topLeftRadius"); }
            else { this.mapCoverContainer.classList.add("topLeftRadius"); }

            var mapDetailElements: HTMLParagraphElement[] = [];
            var mapDetailRows: NodeListOf<HTMLParagraphElement> = this.mapDetailsContainer.querySelectorAll("p");
            for (let i = 0; i < mapDetailRows.length; i++)
            {
                mapDetailRows[i].classList.remove("topRightRadius", "topLeftRadius", "bottomRightRadius", "bottomLeftRadius");
                if (mapDetailRows[i].style.display !== "none") { mapDetailElements.push(mapDetailRows[i]); }
            }
            for (let i = 0; i < mapDetailElements.length; i++)
            {
                //This is assuming that the layout is in the bottom left config, the CSS changes the properties for other layouts so this is the only layout block of code needed.
                if (mapDetailElements[i - 1] === undefined) { mapDetailElements[i].classList.add("topRightRadius"); }
                else if (mapDetailElements[i].clientWidth > mapDetailElements[i - 1].clientWidth) { mapDetailElements[i].classList.add("topRightRadius"); }
                else if (mapDetailElements[i].clientWidth < mapDetailElements[i - 1].clientWidth) { mapDetailElements[i - 1].classList.add("bottomRightRadius"); }

                if (mapDetailElements[i + 1] === undefined) { mapDetailElements[i].classList.add("bottomRightRadius"); }
            }
        }
        //Else don't do anything, the UI can look all weird when first loaded as it hides a lot of elements
    }

    public LiveDataUpdate(data: LiveData): void
    {
        this.liveData = data;

        //I should probably store the map length elsewhere so this calculation does not need to be made really frequently.
        this.time.innerHTML = `${this.SecondsToMins(data.TimeElapsed)}/${this.mapData !== undefined ? this.SecondsToMins(this.mapData.Length) : "00:00"}`;
        this.score.innerHTML = this.SeperateNumber(data.Score);
        this.accuracy.innerHTML = `${Math.round(data.Accuracy * 10) / 10}%`;
        this.combo.innerHTML = this.SeperateNumber(data.Combo);
        this.health.style.height = `${data.PlayerHealth}%`;
    }

    private SeperateNumber(number: number | string, seperator?: string): string
    {
        return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, seperator !== undefined ? seperator : ",");
    }

    private HideOnNull(data: string | null, element: HTMLElement, prefix?: string, suffix?: string)
    {
        var displayMode: "block" | "none" = "none";

        if (data !== null)
        {
            displayMode = "block";
            element.innerHTML = (prefix !== undefined ? prefix : "") + data + (suffix !== undefined ? suffix : "");
        }

        element.style.display = displayMode;
    }

    private SecondsToMins(seconds: number)
    {
        let Mins = Math.floor(seconds / 60).toString().padStart(2, "0");
        let Seconds = (seconds - (Math.floor(seconds / 60) * 60)).toString().padStart(2, "0");
        return `${Mins}:${Seconds}`;
    }
}