import { Main } from "../../assets/js/main.js";
import { LiveData, MapData, SampleData } from "../../assets/js/overlay/types/web.js";

export class DefaultUI
{
    public overlay: HTMLDivElement;
    private overlayThemeColours: HTMLStyleElement;

    private stats: HTMLTableElement;
    private time: HTMLTableCellElement;
    private score: HTMLTableCellElement;
    private accuracy: HTMLTableCellElement;
    private combo: HTMLTableCellElement;

    private modifiersAndHealth: HTMLTableElement;
    private modifiersAndHealthTR: HTMLTableRowElement;
    private healthColumn: HTMLTableCellElement;
    private healthContainer: HTMLTableCellElement;
    private health: HTMLDivElement;
    private modifiers:
    {
        noFailOn0Energy: HTMLTableCellElement,
        oneLife: HTMLTableCellElement,
        fourLives: HTMLTableCellElement,
        noBombs: HTMLTableCellElement,
        noWalls: HTMLTableCellElement,
        noArrows: HTMLTableCellElement,
        ghostNotes: HTMLTableCellElement,
        disappearingArrows: HTMLTableCellElement,
        smallNotes: HTMLTableCellElement,
        proMode: HTMLTableCellElement,
        strictAngles: HTMLTableCellElement,
        zenMode: HTMLTableCellElement,
        slowerSong: HTMLTableCellElement,
        fasterSong: HTMLTableCellElement,
        superFastSong: HTMLTableCellElement
    };

    private mapDetails: HTMLTableElement;
    private mapDetailsTR: HTMLTableRowElement;
    private mapCoverTD: HTMLTableCellElement;
    private preBSR: HTMLParagraphElement;
    private mapCoverContainer: HTMLTableCellElement;
    private mapCover: HTMLImageElement;
    private mapDetailsContainer: HTMLTableCellElement;
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
        this.healthContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#healthColumn > .healthContainer"));
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
            this.MapDataUpdate(SampleData.GetMapData());
            this.LiveDataUpdate(SampleData.GetLiveData());
        }

        // document.body.style.zoom = Main.urlParams.has("scale") ? Main.urlParams.get("scale")! : "1";

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

        //Healthbar resize (the css seems to be fine on chromium browsers but not firefox)
        // window.getComputedStyle(temp0).height.substring(0, window.getComputedStyle(temp0).height.length - 2)
        this.FixHealthBar();
        window.addEventListener("load", () => { this.FixHealthBar(); });
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
            var mapLength: string = this.SecondsToMins(data.Duration);
            if (timeSplit.length == 2) { this.time.innerHTML = `${timeSplit[0]}/${mapLength}`; }
            else { this.time.innerHTML = `00:00/${mapLength}`; }

            //Modifiers
            if (data.Modifiers !== null)
            {
                for (var [key, value] of Object.entries(data.Modifiers))
                {
                    var element: HTMLTableCellElement;

                    switch (key)
                    {
                        case "NoFailOn0Energy": element = this.modifiers.noFailOn0Energy; break;
                        case "OneLife": element = this.modifiers.oneLife; break;
                        case "FourLives": element = this.modifiers.fourLives; break;
                        case "NoBombs": element = this.modifiers.noBombs; break;
                        case "NoWalls": element = this.modifiers.noWalls; break;
                        case "NoArrows": element = this.modifiers.noArrows; break;
                        case "GhostNotes": element = this.modifiers.ghostNotes; break;
                        case "DisappearingArrows": element = this.modifiers.disappearingArrows; break;
                        case "SmallNotes": element = this.modifiers.smallNotes; break;
                        case "ProMode": element = this.modifiers.proMode; break;
                        case "StrictAngles": element = this.modifiers.strictAngles; break;
                        case "ZenMode": element = this.modifiers.zenMode; break;
                        case "SlowerSong": element = this.modifiers.slowerSong; break;
                        case "FasterSong": element = this.modifiers.fasterSong; break;
                        case "SuperFastSong": element = this.modifiers.superFastSong; break;
                        default: continue;
                    }

                    if (value === true) { element.classList.add("active"); }
                    else { element.classList.remove("active"); }
                }
            }

            //Cover image
            this.mapCover.src = data.CoverImage !== null ? data.CoverImage : "../../assets/images/BeatSaberIcon.jpg";

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
        this.time.innerHTML = `${this.SecondsToMins(data.TimeElapsed)}/${this.mapData !== undefined ? this.SecondsToMins(this.mapData.Duration) : "00:00"}`;
        this.score.innerHTML = this.SeperateNumber(data.ScoreWithMultipliers);
        this.accuracy.innerHTML = `${Math.round(data.Accuracy * 10) / 10}%`;
        this.combo.innerHTML = this.SeperateNumber(data.Combo);
        this.health.style.height = `${data.PlayerHealth}%`;
    }

    private FixHealthBar(): void
    {
        var containerHeightStr = window.getComputedStyle(this.healthColumn).height;
        var containerHeight = parseInt(containerHeightStr.substring(0, containerHeightStr.length - 2));
        this.healthContainer.style.height = isNaN(containerHeight) ? "80%" : `${containerHeight * 0.8}px`;
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