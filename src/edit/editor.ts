import { Main, ReturnData } from "../assets/js/main.js";
import { HeaderSlide } from "../assets/js/headerSlide.js";
import { UI } from "../assets/js/overlay/ui.js";
import { Client } from "../assets/js/overlay/client.js";
import { SampleData } from "../assets/js/overlay/types/web.js";
import { DragElement } from "../assets/js/dragElement.js";
import { ElementsJSON, IOverlayData, IRGB, OverlayHelper, SavedElements, TCustomStyles } from "../assets/js/overlay/overlayHelper.js";

//The script I am using is named as 'domtoimage' not 'DomToImage'.
declare const domtoimage: DomToImage.DomToImage;

//Create alerts for all (most) errors.
class Editor
{
    private hideSplashscreen = true;

    private id!: string;
    private allowUnload!: boolean;
    private splashScreen!: HTMLDivElement;
    private ssSubText!: HTMLHeadingElement;
    private ssProgressStage!: number;
    private ssProgress!: HTMLDivElement;
    private elementsTable!: HTMLTableElement;
    private saveMenuContainer!: HTMLDivElement;
    private title!: HTMLInputElement;
    private description!: HTMLTextAreaElement;
    private thumbnail!: HTMLImageElement;
    private overlayPrivate!: HTMLSpanElement;
    private overlayPrivateCheckbox!: HTMLInputElement;
    private publishButton!: HTMLButtonElement;
    private imageRendererContainer!: HTMLDivElement;
    private ui!: UI;
    private overlayContainer!: HTMLTableCellElement;
    private client!: Client;
    private dataSet!: 1 | 2 | 3;

    private optionsMenu!:
    {
        button: HTMLButtonElement,
        container: HTMLDivElement,
        data:
        {
            // editorSize:
            // {
            //     autoLabel: HTMLLabelElement,
            //     manual:
            //     {
            //         label: HTMLLabelElement,
            //         widthInput: HTMLInputElement,
            //         heightInput: HTMLInputElement
            //     }
            // },
            editorBackground:
            {
                defaultBackground: HTMLLabelElement,
                customBackground: HTMLLabelElement,
                customBackgroundRadio: HTMLInputElement,
                customBackgroundInput: HTMLInputElement
            },
            placeholderData: HTMLLabelElement,
            sampleData: HTMLLabelElement,
            gameData: HTMLLabelElement,
            ipLabel: HTMLParagraphElement,
            gameIP: HTMLInputElement
        }
    }

    private walkthroughContainer!: HTMLDivElement;

    private activeElement?: HTMLDivElement;
    private activeElementFocused!: boolean;
    private editorPropertiesTab!:
    {
        optionsRow: HTMLTableRowElement,
        tabs: HTMLDivElement,
        position:
        {
            tabButton: HTMLButtonElement,
            tbody: HTMLTableSectionElement,
            top: HTMLInputElement,
            left: HTMLInputElement,
            bottom: HTMLInputElement,
            right: HTMLInputElement
        },
        size:
        {
            tabButton: HTMLButtonElement,
            tbody: HTMLTableSectionElement,
            width: HTMLInputElement,
            height: HTMLInputElement
        },
        colour:
        {
            tabButton: HTMLButtonElement,
            tbody: HTMLTableSectionElement,
            foregroundColourGroup: HTMLTableRowElement,
            foregroundColour: HTMLInputElement
            backgroundColourGroup: HTMLTableRowElement,
            backgroundColour: HTMLInputElement
            altColourGroup: HTMLTableRowElement,
            altColour: HTMLInputElement
        },
        font:
        {
            tabButton: HTMLButtonElement,
            tbody: HTMLTableSectionElement,
            fontSize: HTMLInputElement
        },
        alignment:
        {
            tabButton: HTMLButtonElement,
            tbody: HTMLTableSectionElement,
            horizontalGroup: HTMLTableRowElement,
            horizontal: HTMLSelectElement,
            verticalGroup: HTMLTableRowElement,
            vertical: HTMLSelectElement,
            bothGroup: HTMLTableRowElement,
            both: HTMLSelectElement
        },
        misc:
        {
            tabButton: HTMLButtonElement,
            tbody: HTMLTableSectionElement,
            textGroup: HTMLTableRowElement,
            text: HTMLInputElement
        }
    };

    public async Init(): Promise<Editor>
    {
        new Main();
        new HeaderSlide();

        this.ssProgressStage = 0;
        this.ssSubText = Main.ThrowIfNullOrUndefined(document.querySelector("#ssSubText"));
        this.ssProgress = Main.ThrowIfNullOrUndefined(document.querySelector("#ssProgress"));

        this.SSProgressUpdate(false, "Checking for overlay");
        await this.CheckForOverlay();
        this.SSProgressUpdate();

        //Set varables.
        this.SSProgressUpdate(false, "Loading elements");
        this.allowUnload = true;
        this.ui = Main.ThrowIfNullOrUndefined(await new UI().Init());
        this.SSProgressUpdate();

        this.SSProgressUpdate(false, "Enviroment setup");
        this.overlayContainer = Main.ThrowIfNullOrUndefined(this.ui.overlay.parentElement);
        this.splashScreen = Main.ThrowIfNullOrUndefined(document.querySelector("#splashScreen"));
        this.elementsTable = Main.ThrowIfNullOrUndefined(document.querySelector("#elementsTable"));
        this.saveMenuContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#saveMenuContainer"));
        this.title = Main.ThrowIfNullOrUndefined(document.querySelector("#title"));
        this.description = Main.ThrowIfNullOrUndefined(document.querySelector("#description"));
        this.thumbnail = Main.ThrowIfNullOrUndefined(document.querySelector("#thumbnail"));
        this.overlayPrivate = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayPrivate"));
        this.overlayPrivateCheckbox = Main.ThrowIfNullOrUndefined(this.overlayPrivate.querySelector("input[type=checkbox]"));
        this.publishButton = Main.ThrowIfNullOrUndefined(document.querySelector("#publishButton"));
        this.imageRendererContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#imageRendererContainer"));

        this.optionsMenu =
        {
            button: Main.ThrowIfNullOrUndefined(document.querySelector("#showOptionsContainer")),
            container: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsMenuContainer")),
            data:
            {
                // editorSize:
                // {
                //     autoLabel: Main.ThrowIfNullOrUndefined(document.querySelector("#autoSizeRadio")),
                //     manual:
                //     {
                //         label: Main.ThrowIfNullOrUndefined(document.querySelector("#manualSizeRadio")),
                //         widthInput: Main.ThrowIfNullOrUndefined(document.querySelector("#manualSizeWidthInput")),
                //         heightInput: Main.ThrowIfNullOrUndefined(document.querySelector("#manualSizeHeightInput"))
                //     }
                // },
                editorBackground:
                {
                    defaultBackground: Main.ThrowIfNullOrUndefined(document.querySelector("#defaultBackgroundRadio")),
                    customBackground: Main.ThrowIfNullOrUndefined(document.querySelector("#customBackgroundRadio")),
                    customBackgroundRadio: Main.ThrowIfNullOrUndefined(document.querySelector("#customBackgroundRadio > input[type='radio']")),
                    customBackgroundInput: Main.ThrowIfNullOrUndefined(document.querySelector("#customBackgroundInput"))
                },
                placeholderData: Main.ThrowIfNullOrUndefined(document.querySelector("#placeholderDataRadio")),
                sampleData: Main.ThrowIfNullOrUndefined(document.querySelector("#sampleDataRadio")),
                gameData: Main.ThrowIfNullOrUndefined(document.querySelector("#gameDataRadio")),
                ipLabel: Main.ThrowIfNullOrUndefined(document.querySelector("#ipLabel")),
                gameIP: Main.ThrowIfNullOrUndefined(document.querySelector("#gameIP"))
            }
        };

        this.walkthroughContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#walkthroughContainer"));

        this.editorPropertiesTab = 
        {
            optionsRow: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsRow")),
            tabs: Main.ThrowIfNullOrUndefined(document.querySelector("#optionTabs")),
            position:
            {
                tabButton: Main.ThrowIfNullOrUndefined(document.querySelector("#optionPositionButton")),
                tbody: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsPosition")),
                top: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsTop")),
                left: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsLeft")),
                bottom: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsBottom")),
                right: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsRight")),
            },
            size:
            {
                tabButton: Main.ThrowIfNullOrUndefined(document.querySelector("#optionSizeButton")),
                tbody: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsSize")),
                width: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsWidth")),
                height: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsHeight")),
            },
            colour:
            {
                tabButton: Main.ThrowIfNullOrUndefined(document.querySelector("#optionColourButton")),
                tbody: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsColour")),
                foregroundColourGroup: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsForegroundColourGroup")),
                foregroundColour: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsForegroundColour")),
                backgroundColourGroup: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsBackgroundColourGroup")),
                backgroundColour: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsBackgroundColour")),
                altColourGroup: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsAltColourGroup")),
                altColour: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsAltColour"))
            },
            font:
            {
                tabButton: Main.ThrowIfNullOrUndefined(document.querySelector("#optionFontButton")),
                tbody: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsFont")),
                fontSize: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsFontSize"))
            },
            alignment:
            {
                tabButton: Main.ThrowIfNullOrUndefined(document.querySelector("#optionAlignmentButton")),
                tbody: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsAlignment")),
                horizontalGroup: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsHorizontalAlignmentGroup")),
                horizontal: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsHorizontalAlignment")),
                verticalGroup: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsVerticalAlignmentGroup")),
                vertical: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsVerticalAlignment")),
                bothGroup: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsBothAlignmentGroup")),
                both: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsBothAlignment"))
            },
            misc:
            {
                tabButton: Main.ThrowIfNullOrUndefined(document.querySelector("#optionMiscButton")),
                tbody: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsMisc")),
                textGroup: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsTextGroup")),
                text: Main.ThrowIfNullOrUndefined(document.querySelector("#optionsText"))
            }
        }

        window.addEventListener("resize", () => { this.ConfigureEditorWindow(); });
        this.ConfigureEditorWindow();
        await this.LoadElementsIntoEditor(this.ui.importedElements);

        //Setup UI events (open save menus etc).
        window.addEventListener("beforeunload", (ev) => { this.WindowBeforeUnloadEvent(ev); });
        this.overlayPrivate.addEventListener("click", () => { this.overlayPrivateCheckbox.checked = !this.overlayPrivateCheckbox.checked; });
        this.publishButton.addEventListener("click", () => { this.PublishOverlay(); });
        document.body.addEventListener("click", (ev) =>
        {
            if (ev.target === this.ui.overlay)
            { 
                this.activeElement = undefined;
                this.activeElementFocused = false;
                this.editorPropertiesTab.optionsRow.style.display = "none";
            }
            else if (!(this.activeElement !== undefined && ev.target !== null && this.activeElement.contains(<HTMLElement>ev.target)))
            {
                //This could lead to a race condition I believe.
                this.activeElementFocused = false;
            }
        });
        document.body.addEventListener("keydown", (ev) =>
        {
            if (
                this.activeElementFocused &&
                this.activeElement !== undefined &&
                (
                    ev.key === "ArrowLeft" ||
                    ev.key === "ArrowRight" ||
                    ev.key === "ArrowUp" ||
                    ev.key === "ArrowDown"
                )
            )
            {
                switch (ev.key)
                {
                    case "ArrowLeft":
                        this.activeElement.style.left = `${this.activeElement.offsetLeft - 1}px`;
                        break;
                    case "ArrowRight":
                        this.activeElement.style.left = `${this.activeElement.offsetLeft + 1}px`;
                        break;
                    case "ArrowUp":
                        this.activeElement.style.top = `${this.activeElement.offsetTop - 1}px`;
                        break;
                    case "ArrowDown":
                        this.activeElement.style.top = `${this.activeElement.offsetTop + 1}px`;
                        break;
                }

                if (this.activeElement.offsetLeft + this.activeElement.clientWidth / 2 > this.ui.overlay.clientWidth / 2)
                {
                    this.activeElement.style.right = `${this.ui.overlay.clientWidth - this.activeElement.offsetLeft - this.activeElement.clientWidth}px`;
                    this.activeElement.style.left = "unset";
                }

                if (this.activeElement.offsetTop + this.activeElement.clientHeight / 2 > this.ui.overlay.clientHeight / 2)
                {
                    this.activeElement.style.bottom = `${this.ui.overlay.clientHeight - this.activeElement.offsetTop - this.activeElement.clientHeight}px`;
                    this.activeElement.style.top = "unset";
                }

                this.UpdateSavedElementProperties(this.activeElement);
            }
        });
        this.activeElementFocused = false;

        Main.ThrowIfNullOrUndefined(document.querySelector("#showSaveContainer")).addEventListener("click", () => { this.ShowSaveContainerClickEvent(); });
        Main.ThrowIfNullOrUndefined(document.querySelector("#saveMenuBackground")).addEventListener("click", () => { this.MinimiseSaveMenu(); });

        Main.ThrowIfNullOrUndefined(document.querySelector("#showOptionsContainer")).addEventListener("click", () =>
        {
            this.optionsMenu.container.style.display = "block";
            this.optionsMenu.container.classList.remove("fadeOut");
            this.optionsMenu.container.classList.add("fadeIn");
        });
        Main.ThrowIfNullOrUndefined(this.optionsMenu.container.querySelector(".background")).addEventListener("click", () =>
        {
            this.optionsMenu.container.classList.remove("fadeIn");
            this.optionsMenu.container.classList.add("fadeOut");
            setTimeout(() => { this.optionsMenu.container.style.display = "none"; }, 399);
        });
        this.optionsMenu.data.placeholderData.addEventListener("click", () =>
            { if ((<HTMLInputElement>this.optionsMenu.data.placeholderData.querySelector("input[type=radio]")).checked) { this.ToggleDataSet(1); } });
        this.optionsMenu.data.sampleData.addEventListener("click", () =>
            { if ((<HTMLInputElement>this.optionsMenu.data.sampleData.querySelector("input[type=radio]")).checked) { this.ToggleDataSet(2); } });
        this.optionsMenu.data.gameData.addEventListener("click", () =>
            { if ((<HTMLInputElement>this.optionsMenu.data.gameData.querySelector("input[type=radio]")).checked) { this.ToggleDataSet(3); } });
        (<HTMLFormElement>Main.ThrowIfNullOrUndefined(document.querySelector("#ipForm"))).addEventListener("submit", (e) => { e.preventDefault(); });
        this.optionsMenu.data.gameIP.addEventListener("change", () => { if (this.dataSet == 3) { this.ToggleDataSet(3); } });
        this.optionsMenu.data.editorBackground.defaultBackground.addEventListener("click", () =>
        {
            this.ui.overlay.style.backgroundImage = `url("${Main.WEB_ROOT}/assets/images/beat-saber.jpg")`;
            this.optionsMenu.data.editorBackground.customBackgroundInput.disabled = true;
            this.optionsMenu.data.editorBackground.customBackgroundInput.value = "";
        });
        this.optionsMenu.data.editorBackground.defaultBackground.click();
        this.optionsMenu.data.editorBackground.customBackground.addEventListener("click", () =>
            { this.optionsMenu.data.editorBackground.customBackgroundInput.disabled = false; });
        this.optionsMenu.data.editorBackground.customBackgroundInput.addEventListener("input", (e) =>
        {
            if (
                !this.optionsMenu.data.editorBackground.customBackgroundRadio.checked &&
                this.optionsMenu.data.editorBackground.customBackgroundInput.files !== null &&
                this.optionsMenu.data.editorBackground.customBackgroundInput.files[0] !== undefined &&
                this.optionsMenu.data.editorBackground.customBackgroundInput.files[0].type.startsWith("image/")
            ) { return; }
            
            const reader = new FileReader();
            reader.onloadend = (file) =>
            {
                if (file.target == null) { return; }
                this.ui.overlay.style.backgroundImage = `url("${file.target.result}")`;
            };
            reader.readAsDataURL(this.optionsMenu.data.editorBackground.customBackgroundInput.files![0]);
        });

        Main.ThrowIfNullOrUndefined(document.querySelector("#walkthroughButton")).addEventListener("click", () => { this.ShowWalkthroughContainer(); });
        Main.ThrowIfNullOrUndefined(this.walkthroughContainer.querySelector(".background")).addEventListener("click", () =>
        {
            this.walkthroughContainer.classList.remove("fadeIn");
            this.walkthroughContainer.classList.add("fadeOut");
            setTimeout(() => { this.walkthroughContainer.style.display = "none"; }, 399);
        });

        this.editorPropertiesTab.position.tabButton.addEventListener("click", () => { this.SetActivePropertiesTab("position"); });
        this.editorPropertiesTab.position.top.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.position.left.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.position.bottom.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.position.right.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });

        this.editorPropertiesTab.size.tabButton.addEventListener("click", () => { this.SetActivePropertiesTab("size"); });
        this.editorPropertiesTab.size.width.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.size.height.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });

        this.editorPropertiesTab.colour.tabButton.addEventListener("click", () => { this.SetActivePropertiesTab("colour"); });
        this.editorPropertiesTab.colour.foregroundColour.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.colour.backgroundColour.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.colour.altColour.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        
        this.editorPropertiesTab.font.tabButton.addEventListener("click", () => { this.SetActivePropertiesTab("font"); });
        this.editorPropertiesTab.font.fontSize.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });

        this.editorPropertiesTab.alignment.tabButton.addEventListener("click", () => { this.SetActivePropertiesTab("alignment"); });
        this.editorPropertiesTab.alignment.both.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.alignment.horizontal.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });
        this.editorPropertiesTab.alignment.vertical.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });

        this.editorPropertiesTab.misc.tabButton.addEventListener("click", () => { this.SetActivePropertiesTab("misc"); });
        this.editorPropertiesTab.misc.text.addEventListener("input", (ev) => { this.UpdateElementPropertiesFromTab(ev); });

        var imageRendererContainerCSS = document.createElement("style")
        imageRendererContainerCSS.id = "imageRendererContainerCSS";
        imageRendererContainerCSS.innerHTML = `
            #imageRendererContainer .container *
            {
                --overlayForegroundColour: ${UI.defaultStyles.foregroundColour!.R}, ${UI.defaultStyles.foregroundColour!.G}, ${UI.defaultStyles.foregroundColour!.B};
                --overlayBackgroundColour: ${UI.defaultStyles.backgroundColour!.R}, ${UI.defaultStyles.backgroundColour!.G}, ${UI.defaultStyles.backgroundColour!.B};
                --overlayAltColour: ${UI.defaultStyles.altColour!.R}, ${UI.defaultStyles.altColour!.G}, ${UI.defaultStyles.altColour!.B};
            }
        `;
        document.head.appendChild(imageRendererContainerCSS);

        this.SSProgressUpdate();
        
        this.SSProgressUpdate(false, "Loading overlay");
        await this.LoadOverlay();
        this.SSProgressUpdate();

        this.allowUnload = true;

        // Setup the client.
        const urlIP = Main.urlParams.get("ip");
        const cachedIP = Main.RetreiveCache("GAME_IP");
        var ip: string;
        if (urlIP !== null && RegExp(Client.ipRegex).test(urlIP)) { ip = urlIP; }
        else if (cachedIP != "" && RegExp(Client.ipRegex).test(cachedIP)) { ip = cachedIP; }
        else { ip = "127.0.0.1"; }
        this.ClientInit(ip);
        this.optionsMenu.data.placeholderData.click();

        this.SSProgressUpdate();

        //Hide splash screen if the user is allowed to use the editor or if the editor is ready for use.
        if (this.hideSplashscreen)
        {
            await Main.Sleep(250);
            this.splashScreen.classList.add("fadeOut");
            setTimeout(() => { this.splashScreen.style.display = "none"; }, 399);
        }

        if (Main.RetreiveCache("EDITOR_FIRST_LOAD") != "true")
        {
            this.ShowWalkthroughContainer();
            Main.SetCache("EDITOR_FIRST_LOAD", "true", 365); //Set to expire 1 year after the first use.
        }

        return this;
    }

    private ClientInit(ip: string | null | undefined): void
    {
        if (ip == null || ip == undefined || !RegExp(Client.ipRegex).test(ip)) { ip = "127.0.0.1"; }
        this.optionsMenu.data.gameIP.value = ip;
        Main.SetCache("GAME_IP", ip, 365);
        if (ip !== "127.0.0.1" && window.location.protocol !== "http:")
        {
            //An error is thrown when the replace state comes from a secure source to an insecure source so I shall just redirect the user without replacing the history state. I will try to fix this in the future.
            // history.replaceState(null, "", `http://${window.location.hostname}${window.location.pathname}${window.location.search}`);
            window.location.href = `http://${window.location.hostname}${window.location.pathname}${window.location.search}`;
            // history.replaceState(null, "",
            //     window.location.href.replace(`http://${window.location.hostname}${window.location.pathname}${window.location.search}`, ""));
        }
        this.client = new Client(ip);
        this.client.AddEndpoint("MapData");
        this.client.AddEndpoint("LiveData");
        this.client.connections["MapData"].AddEventListener("message", (data) => { this.ui.UpdateMapData(data); });
        this.client.connections["LiveData"].AddEventListener("message", (data) => { this.ui.UpdateLiveData(data); });
    }

    private SSProgressUpdate(progress: boolean = true, message?: string)
    {
        const references = 5;
        this.ssSubText.innerText = message === undefined ? "Loading..." : message;
        if (progress)
        {
            this.ssProgress.style.width = `${(++this.ssProgressStage/references)*100}%`;
            if (this.ssProgressStage >= references) { this.ssSubText.innerText = "Loaded!" }
        }
    }

    private ToggleDataSet(set: 1 | 2 | 3)
    {
        this.dataSet = set;
        switch (set)
        {
            case 1:
                //Placeholder data.
                this.optionsMenu.data.ipLabel.style.color = "#cccccc";
                this.optionsMenu.data.gameIP.disabled = true;
                this.client.connections["MapData"].Disconnect();
                this.client.connections["LiveData"].Disconnect();
                for (const category of Object.keys(this.ui.createdElements.elements))
                {
                    for (const type of Object.keys(this.ui.createdElements.elements[category]))
                    {
                        for (const id of Object.keys(this.ui.createdElements.elements[category][type]))
                        {
                            this.ui.createdElements.elements[category][type][id].script.ResetData();
                        }
                    }
                }
                break;
            case 2:
                //Sample data.
                this.optionsMenu.data.ipLabel.style.color = "#cccccc";
                this.optionsMenu.data.gameIP.disabled = true;
                this.client.connections["MapData"].Disconnect();
                this.client.connections["LiveData"].Disconnect();
                this.ui.UpdateMapData(SampleData.GetMapData());
                this.ui.UpdateLiveData(SampleData.GetLiveData());
                break;
            case 3:
                //Game data.
                this.optionsMenu.data.ipLabel.style.removeProperty("color");
                this.optionsMenu.data.gameIP.disabled = false;
                //This IP switching is not working as intended and opens multiple connectiosn when they should be disposed.
                this.client.Dispose();
                this.ClientInit(this.optionsMenu.data.gameIP.value);
                this.client.connections["MapData"].Connect();
                this.client.connections["LiveData"].Connect();
                break;
        }
    }

    //Use this as the long term solution for making sure the overlays display properly on all display sizes, have the editor be one size and scale to the appropriate size.
    private ConfigureEditorWindow(): void
    {
        const baseWidth = 1920;
        const baseHeight = 1080;

        this.ui.overlay.style.width = `${baseWidth}px`;
        this.ui.overlay.style.height = `${baseHeight}px`;
        
        const clientWidth = this.overlayContainer.clientWidth;
        const clientHeight = this.overlayContainer.clientHeight;
        var clientWiderThanTall = clientWidth >= clientHeight;

        var scale = clientWiderThanTall ? clientWidth / baseWidth : clientHeight / baseHeight;

        this.ui.overlay.style.transform = `translate(-50%, -50%) scale(${scale})`;
        this.ui.overlay.style[!clientWiderThanTall ? "width" : "height"] = `${(!clientWiderThanTall ? clientWidth : clientHeight) / scale}px`;
    }

    private WindowBeforeUnloadEvent(ev: BeforeUnloadEvent): void
    {
        if (!this.allowUnload)
        {
            ev.preventDefault();
            ev.returnValue = "false";
        }
    }

    //Create a new overlay if allowed/none is specified in the URL.
    private async CheckForOverlay(): Promise<void>
    {
        if (Main.RetreiveCache("READIE_UID").length != 22 || Main.RetreiveCache("READIE_SID") === '')
        {
            this.hideSplashscreen = false;
            Main.Alert(Main.GetPHPErrorMessage("NOT_LOGGED_IN"));
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }

        var path = window.location.pathname.split('/').filter((part) => { return part != ""; });
        if (path[path.length - 1].length != 13 && path[path.length - 1] === "edit")
        {
            //Create a new overlay.
            var response: ReturnData = await OverlayHelper.OverlayPHP({ method: "createOverlay" });

            if (response.error || response.data.toString().length !== 13)
            {
                this.hideSplashscreen = false;
                Main.Alert(response.data === 'QUOTA_EXCEEDED' ? 'Quota exceeded.' : Main.GetPHPErrorMessage(response.data));
                await Main.Sleep(1000);
                window.location.href = `${Main.WEB_ROOT}/browser/`;
            }
            else
            {
                history.replaceState({id: response.data}, document.title, `${Main.WEB_ROOT}/edit/${response.data}/`);
                this.id = response.data;
            }
        }
        else if (path[path.length - 1].length === 13 && path[path.length - 2] === "edit") { this.id = path[path.length - 1]; }
        else
        {
            this.hideSplashscreen = false;
            Main.Alert("Invalid path.");
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }
    }

    //It is possible for public overlays to be ripped here if the user can interperate this script before the ownership check.
    private async LoadOverlay(): Promise<void>
    {
        var response: ReturnData = await OverlayHelper.OverlayPHP(
        {
            method: "getOverlayByID",
            data:
            {
                id: this.id
            }
        });

        if (response.error)
        {
            this.hideSplashscreen = false;
            Main.Alert(Main.GetPHPErrorMessage(response.data));
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }
        else if ((<IOverlayData>response.data).uid !== Main.RetreiveCache("READIE_UID"))
        {
            this.hideSplashscreen = false;
            Main.Alert(Main.GetPHPErrorMessage("INVALID_CREDENTIALS"));
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }
        
        var overlay: IOverlayData = response.data;

        this.title.value = overlay.name;
        this.description.value = overlay.description === null ? '' : overlay.description;
        this.overlayPrivateCheckbox.checked = overlay.isPrivate == '1' ? true : false;

        var elements: SavedElements = JSON.parse(overlay.elements === null ? '{}' : overlay.elements);
        for (const category of Object.keys(elements))
        {
            for (const type of Object.keys(elements[category]))
            {
                for (const id of Object.keys(elements[category][type]))
                {
                    for (const element of elements[category][type][id])
                    {
                        if (element.zIndex > this.ui.createdElements.zIndex) { this.ui.createdElements.zIndex = element.zIndex; }
                        var container: HTMLDivElement = this.CreateElement(category, type, id, element.zIndex);
                        //Things were being really weird here so I've had to load the properties in certain orders depending on their position.
                        if (element.position.top !== undefined)
                        {
                            container.style.top = element.position.top;
                            container.style.height = `${element.height}px`;
                        }
                        else
                        {
                            container.style.height = `${element.height}px`;
                            container.style.bottom = element.position.bottom!;
                        }
                        if (element.position.left !== undefined)
                        {
                            container.style.left = element.position.left;
                            container.style.width = `${element.width}px`;
                        }
                        else
                        {
                            container.style.width = `${element.width}px`;
                            container.style.right = element.position.right!;
                        }

                        this.ui.createdElements.elements[category][type][id].elements[container.id].customStyles = element.customStyles;
                        this.ui.createdElements.elements[category][type][id].script.UpdateStyles(container, element.customStyles);

                        this.ui.overlay.appendChild(container);
                        this.UpdateSavedElementProperties(container);
                    }
                }
            }
        }
    }

    private async LoadElementsIntoEditor(importedElements: ElementsJSON)
    {
        //All this extra mess JUST so I could set the size of elements when they are hidden/shown.
        var editorElements:
        {
            [category: string]:
            {
                [type: string]:
                {
                    [id: string]:
                    {
                        td: HTMLTableCellElement,
                        container: HTMLDivElement,
                        mutationObserver?: MutationObserver
                    }
                }
            }
        } = {};

        for (const category of Object.keys(importedElements))
        {
            //Work on a way to keep the height of the row the same for each element data cell (get the tallest element from when it is created).
            var tr: HTMLTableRowElement = document.createElement("tr");

            for (const type of Object.keys(importedElements[category]))
            {
                for (const id of Object.keys(importedElements[category][type]))
                {
                    if (importedElements[category][type][id].showInEditor)
                    {
                        if (editorElements[category] === undefined) { editorElements[category] = {}; }
                        if (editorElements[category][type] === undefined) { editorElements[category][type] = {}; }

                        editorElements[category][type][id] =
                        {
                            td: document.createElement("td"),
                            container: this.ui.CreateElement(category, type, id)
                        };

                        //There was a problem with these and elements that have the mutation observers, when the elements size is set but the container is hidden the values set get rendered useless.
                        //Consider making these readonly properties static.
                        if (this.ui.createdElements.elements[category][type][id].script.initialWidth !== undefined || this.ui.createdElements.elements[category][type][id].script.initialHeight !== undefined)
                        {
                            editorElements[category][type][id].mutationObserver = new MutationObserver(() =>
                            {
                                if (this.ui.createdElements.elements[category][type][id].script.initialWidth !== undefined)
                                { editorElements[category][type][id].container.style.width = `${this.ui.createdElements.elements[category][type][id].script.initialWidth}px`; }
                                if (this.ui.createdElements.elements[category][type][id].script.initialHeight !== undefined)
                                { editorElements[category][type][id].container.style.height = `${this.ui.createdElements.elements[category][type][id].script.initialHeight}px`; }
                            });
                            editorElements[category][type][id].mutationObserver!.observe(editorElements[category][type][id].td, { attributes: true });
                        }

                        //Haven't quite got this to work for drag clicks yet.
                        // editorElements[category][type][id].container.addEventListener("click", (ev) => { Main.Tooltip("Double click to create", ev, "top"); });

                        editorElements[category][type][id].container.addEventListener("dblclick", () =>
                        {
                            var _element = this.CreateElement(category, type, id);
                            this.ui.overlay.appendChild(_element);
                            this.SetActiveElement(_element);
                            switch (this.dataSet)
                            {
                                case 1:
                                    //Placeholder data.
                                    this.ui.createdElements.elements[category][type][id].script.ResetData();
                                    break;
                                case 2:
                                    //Sample data.
                                    this.ui.UpdateMapData(SampleData.GetMapData());
                                    this.ui.UpdateLiveData(SampleData.GetLiveData());
                                    break;
                                case 3:
                                    //Game data.
                                    this.client.connections["MapData"].AddEventListener("message", (data) => { this.ui.UpdateMapData(data); });
                                    this.client.connections["LiveData"].AddEventListener("message", (data) => { this.ui.UpdateLiveData(data); });
                                    break;
                            }
                        });

                        editorElements[category][type][id].container.addEventListener("mouseenter", (ev) =>
                            { Main.Tooltip(`${(type.substr(0, 1).toUpperCase() + type.substr(1, type.length)).replace(/_/g, ' ')}`, ev, "top"); });

                        editorElements[category][type][id].td.appendChild(editorElements[category][type][id].container);
                        tr.appendChild(editorElements[category][type][id].td);
                    }
                }
            }

            if (tr.firstChild !== null) { (<HTMLTableCellElement>tr.firstChild).classList.add("visible"); }

            var backward: HTMLTableCellElement = document.createElement("td");
            var forward: HTMLTableCellElement = document.createElement("td");
            if (tr.childNodes.length > 1)
            {
                var backwardText: HTMLHeadingElement = document.createElement("h3");
                var forwardText: HTMLHeadingElement = document.createElement("h3");

                backwardText.innerText = "<";
                backward.appendChild(backwardText);
                forwardText.innerText = ">";
                forward.appendChild(forwardText);

                backward.addEventListener("click", (ev: Event) => { this.ChangeElementPage(ev, false); });
                forward.addEventListener("click", (ev: Event) => { this.ChangeElementPage(ev, true); });
            }
            else
            {
                backward.style.cursor = "default";
                forward.style.cursor = "default";
            }
            tr.prepend(backward);
            tr.appendChild(forward);

            this.elementsTable.tBodies[0].appendChild(tr);
        }
    }

    private ChangeElementPage(ev: Event, forward: boolean): void
    {
        var index: number = 1;
        var container: HTMLTableRowElement =
            (<HTMLTableCellElement>ev.target).nodeName === "TD" ?
            (<HTMLTableCellElement>ev.target).parentElement as HTMLTableRowElement : //User clicked on the TD
            (<HTMLTableCellElement>ev.target).parentElement!.parentElement as HTMLTableRowElement; //User clicked on the H3

        for (let i = 0; i < container.childNodes.length; i++)
        {
            var element: HTMLTableCellElement = <HTMLTableCellElement>container.childNodes[i];
            if (element.classList.contains("visible"))
            { index = forward ? i + 1 : i - 1; }
            element.classList.remove("visible");
        }

        if (index <= 0)
        { index = container.childNodes.length - 2; }
        else if (index >= container.childNodes.length - 1)
        { index = 1; }

        (<HTMLTableCellElement>container.childNodes[index]).classList.add("visible");
    }

    private CreateElement(category: string, type: string, id: string, zIndex?: number): HTMLDivElement
    {
        var container: HTMLDivElement = this.ui.CreateElement(category, type, id, zIndex);

        if (this.ui.createdElements.elements[category][type][id].script.resizeMode !== 0) { container.style.resize = "both"; }
        if (this.ui.createdElements.elements[category][type][id].script.initialWidth !== undefined) { container.style.width = `${this.ui.createdElements.elements[category][type][id].script.initialWidth}px`; }
        if (this.ui.createdElements.elements[category][type][id].script.initialHeight !== undefined) { container.style.height = `${this.ui.createdElements.elements[category][type][id].script.initialHeight}px`; }

        //Press 'ctrl' + 'alt' + 'click' to delete the element.
        container.addEventListener("mousedown", (ev: MouseEvent) =>
        {
            if (ev.ctrlKey && ev.altKey) { this.DeleteElement(container); }
            else { this.SetActiveElement(container); }
        });
        container.addEventListener("mousemove", (ev) =>
        {
            if (ev.ctrlKey && ev.altKey) { container.classList.add("boxShadowRed"); }
            else { container.classList.remove("boxShadowRed"); }
        });
        container.addEventListener("mouseleave", () => { container.classList.remove("boxShadowRed"); });
        container.addEventListener("mouseup", () => { this.UpdateSavedElementProperties(container); });
        this.ui.createdElements.elements[category][type][id].elements[container.id].dragElement = new DragElement(container, this.ui.overlay);
        this.ui.createdElements.locations[container.id] = [category, type, id, container.id];
        this.allowUnload = false;
        return container;
    }


    private SetActiveElement(element: HTMLDivElement)
    {
        this.activeElementFocused = true;

        if (element !== this.activeElement)
        {
            var buttonDisplayStyle = "inline-block";

            this.activeElement = element;
            var location: [string, string, string, string] = this.ui.createdElements.locations[element.id];

            //#region Reset tabs to default styles
            //TODO Loop this
            this.editorPropertiesTab.position.tabButton.style.display = buttonDisplayStyle;
            this.editorPropertiesTab.position.tabButton.classList.remove("ignore");
            this.editorPropertiesTab.position.tabButton.classList.remove("curveLeft");
            this.editorPropertiesTab.position.tabButton.classList.remove("curveRight");

            this.editorPropertiesTab.size.tabButton.style.display = "none";
            this.editorPropertiesTab.size.tabButton.classList.remove("curveLeft");
            this.editorPropertiesTab.size.tabButton.classList.remove("curveRight");

            this.editorPropertiesTab.colour.tabButton.style.display = "none";
            this.editorPropertiesTab.colour.tabButton.classList.remove("curveLeft");
            this.editorPropertiesTab.colour.tabButton.classList.remove("curveRight");
            this.editorPropertiesTab.colour.foregroundColourGroup.style.display = "none";
            this.editorPropertiesTab.colour.backgroundColourGroup.style.display = "none";
            this.editorPropertiesTab.colour.altColourGroup.style.display = "none";

            this.editorPropertiesTab.font.tabButton.style.display = "none";
            this.editorPropertiesTab.font.tabButton.classList.remove("curveLeft");
            this.editorPropertiesTab.font.tabButton.classList.remove("curveRight");

            this.editorPropertiesTab.alignment.tabButton.style.display = "none";
            this.editorPropertiesTab.alignment.tabButton.classList.remove("curveLeft");
            this.editorPropertiesTab.alignment.tabButton.classList.remove("curveRight");
            this.editorPropertiesTab.alignment.bothGroup.style.display = "none";
            this.editorPropertiesTab.alignment.horizontalGroup.style.display = "none";
            this.editorPropertiesTab.alignment.verticalGroup.style.display = "none";

            this.editorPropertiesTab.misc.tabButton.style.display = "none";
            this.editorPropertiesTab.misc.tabButton.classList.remove("curveLeft");
            this.editorPropertiesTab.misc.tabButton.classList.remove("curveRight");
            this.editorPropertiesTab.misc.textGroup.style.display = "none";

            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.foregroundColour !== undefined)
            {
                this.editorPropertiesTab.colour.foregroundColour.value = this.RGBToHex(this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.foregroundColour!);
            }
            else
            { this.editorPropertiesTab.colour.foregroundColour.value = this.RGBToHex(UI.defaultStyles.foregroundColour!); }
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.backgroundColour !== undefined)
            {
                this.editorPropertiesTab.colour.backgroundColour.value = this.RGBToHex(this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.backgroundColour!);
            }
            else
            { this.editorPropertiesTab.colour.backgroundColour.value = this.RGBToHex(UI.defaultStyles.backgroundColour!); }
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.altColour !== undefined)
            {
                this.editorPropertiesTab.colour.altColour.value = this.RGBToHex(this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.altColour!);
            }
            else
            { this.editorPropertiesTab.colour.altColour.value = this.RGBToHex(UI.defaultStyles.altColour!); }

            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.fontSize !== undefined)
            {
                this.editorPropertiesTab.font.fontSize.value = this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.fontSize!.toString();
            }
            else
            { this.editorPropertiesTab.font.fontSize.value = "16"; }

            this.editorPropertiesTab.alignment.both.value =
                this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.align !== undefined ?
                this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.align! :
                "center";
            this.editorPropertiesTab.alignment.horizontal.value =
                this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.horizontalAlign !== undefined ?
                this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.horizontalAlign! :
                "center";
            this.editorPropertiesTab.alignment.vertical.value =
                this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.verticalAlign !== undefined ?
                this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.verticalAlign! :
                "center";

            this.editorPropertiesTab.misc.text.value =
                this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.content !== undefined ?
                this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.content! :
                "";
            //#endregion

            //#region Position tab
            if (
                Object.keys(this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles).length == 0 &&
                this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.resizeMode == 0
            )
            { this.editorPropertiesTab.position.tabButton.classList.add("ignore"); }
            //#endregion

            //#region Size tab
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.resizeMode != 0)
            {
                this.editorPropertiesTab.size.tabButton.style.display = buttonDisplayStyle;
            }
            //#endregion
            

            //#region Colour tab
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.foregroundColour === true)
            {
                this.editorPropertiesTab.colour.tabButton.style.display = buttonDisplayStyle;
                this.editorPropertiesTab.colour.foregroundColourGroup.style.display = "table-row";
            }
    
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.backgroundColour === true)
            {
                this.editorPropertiesTab.colour.tabButton.style.display = buttonDisplayStyle;
                this.editorPropertiesTab.colour.backgroundColourGroup.style.display = "table-row";
            }
    
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.altColour === true)
            {
                this.editorPropertiesTab.colour.tabButton.style.display = buttonDisplayStyle;
                this.editorPropertiesTab.colour.altColourGroup.style.display = "table-row";
            }
            //#endregion
    
            //#region Font size tab
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.fontSize === true)
            {
                this.editorPropertiesTab.font.tabButton.style.display = buttonDisplayStyle;
            }
            //#endregion

            //#region Alignment tab
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.align !== undefined)
            {
                this.editorPropertiesTab.alignment.tabButton.style.display = buttonDisplayStyle;
                this.editorPropertiesTab.alignment.bothGroup.style.display = "table-row";
            }
            else
            {
                if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.horizontalAlign !== undefined)
                {
                    this.editorPropertiesTab.alignment.tabButton.style.display = buttonDisplayStyle;
                    this.editorPropertiesTab.alignment.verticalGroup.style.display = "table-row";
                }

                if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.verticalAlign !== undefined)
                {
                    this.editorPropertiesTab.alignment.tabButton.style.display = buttonDisplayStyle;
                    this.editorPropertiesTab.alignment.verticalGroup.style.display = "table-row";
                }
            }
            //#endregion

            //#region Misc tab
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.content === true)
            {
                this.editorPropertiesTab.misc.tabButton.style.display = buttonDisplayStyle;
                this.editorPropertiesTab.misc.textGroup.style.display = "table-row";
            }
            //#endregion

            var firstButton: HTMLButtonElement | null = null;
            var lastButton: HTMLButtonElement | null = null;
            for (const iterator of this.editorPropertiesTab.tabs.querySelectorAll("button"))
            {
                if (iterator.style.display === "inline-block")
                {
                    if (firstButton === null) { firstButton = iterator; }
                    lastButton = iterator;
                }
            }
            if (firstButton !== null) { firstButton.classList.add("curveLeft"); }
            if (lastButton !== null) { lastButton.classList.add("curveRight"); }

            this.SetActivePropertiesTab("position");
            this.editorPropertiesTab.optionsRow.style.display = "table-row";
        }
    }

    private SetActivePropertiesTab(tab: "position" | "size" | "colour" | "font" | "alignment" | "misc")
    {
        this.editorPropertiesTab.position.tabButton.classList.remove("active");
        this.editorPropertiesTab.position.tbody.style.display = "none";

        this.editorPropertiesTab.size.tabButton.classList.remove("active");
        this.editorPropertiesTab.size.tbody.style.display = "none";

        this.editorPropertiesTab.colour.tabButton.classList.remove("active");
        this.editorPropertiesTab.colour.tbody.style.display = "none";
        
        this.editorPropertiesTab.font.tabButton.classList.remove("active");
        this.editorPropertiesTab.font.tbody.style.display = "none";

        this.editorPropertiesTab.alignment.tabButton.classList.remove("active");
        this.editorPropertiesTab.alignment.tbody.style.display = "none";

        this.editorPropertiesTab.misc.tabButton.classList.remove("active");
        this.editorPropertiesTab.misc.tbody.style.display = "none";

        var activeTab;
        switch (tab)
        {
            case "position":
                activeTab = this.editorPropertiesTab.position;
                break;
            case "size":
                activeTab = this.editorPropertiesTab.size;
                break;
            case "colour":
                activeTab = this.editorPropertiesTab.colour;
                break;
            case "font":
                activeTab = this.editorPropertiesTab.font;
                break;
            case "alignment":
                activeTab = this.editorPropertiesTab.alignment;
                break;
            case "misc":
                activeTab = this.editorPropertiesTab.misc;
                break;
        }

        activeTab.tabButton.classList.add("active");
        activeTab.tbody.style.display = "table-row-group";
    }

    private UpdateElementPropertiesFromTab(ev: Event)
    {
        if (this.activeElement !== undefined)
        {
            var location: [string, string, string, string] = this.ui.createdElements.locations[this.activeElement.id];
            var inputTarget = <HTMLInputElement>ev.target;

            //This is all quite messy as I never indended for this when orignally creating it.
            var styles: TCustomStyles = {};
            //I don't want to edit the orignal object here, that should be done by 'UpdateSavedElementProperties'.
            Object.assign(styles, this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles);

            //I don't know whats better, having two if statments means I'll have to type things out twice very similarly
            //whereas having ?: (forgot what its called) means I type less but more checks are done resulting in higher resource usage.
            //I think I will stick to ?: as the peformance gain from multiple if statments in this case is minor.
            if (inputTarget.id === "optionsTop" || inputTarget.id === "optionsBottom")
            {
                var inputElement = inputTarget.id === "optionsTop" ? this.editorPropertiesTab.position.top : this.editorPropertiesTab.position.bottom;
                var inputValue = parseInt(inputElement.value);

                if (isNaN(inputValue)) { ev.preventDefault(); return; }
                else if (inputValue + this.activeElement.clientHeight / 2 > this.ui.overlay.clientHeight / 2 - 1) //-1 is a fix for when UpdateElementProperties flips the side the element is on when in the middle, the consequence of this is that 1px is list either side of the center.
                { inputElement.value = (this.ui.overlay.clientHeight / 2 - this.activeElement.clientHeight / 2 - 1).toString(); }
                else if (inputValue < 0)
                { inputElement.value = "0"; }

                (inputTarget.id === "optionsTop" ? this.editorPropertiesTab.position.bottom : this.editorPropertiesTab.position.top).value = "";
                this.activeElement.style[inputTarget.id === "optionsTop" ? "top" : "bottom"] = `${inputElement.value}px`;
                this.activeElement.style[inputTarget.id === "optionsTop" ? "bottom" : "top"] = "unset";
            }
            else if (inputTarget.id === "optionsLeft" || inputTarget.id === "optionsRight")
            {
                var inputElement = inputTarget.id === "optionsLeft" ? this.editorPropertiesTab.position.left : this.editorPropertiesTab.position.right;
                var inputValue = parseInt(inputElement.value);

                if (isNaN(inputValue)) { ev.preventDefault(); return; }
                else if (inputValue + this.activeElement.clientWidth / 2 > this.ui.overlay.clientWidth / 2 - 1)
                { inputElement.value = (this.ui.overlay.clientWidth / 2 - this.activeElement.clientWidth / 2 - 1).toString() }
                else if (inputValue < 0)
                { inputElement.value = "0"; }

                (inputTarget.id === "optionsLeft" ? this.editorPropertiesTab.position.right : this.editorPropertiesTab.position.left).value = "";
                this.activeElement.style[inputTarget.id === "optionsLeft" ? "left" : "right"] = `${inputElement.value}px`;
                this.activeElement.style[inputTarget.id === "optionsLeft" ? "right" : "left"] = "unset";
            }
            else if (inputTarget.id === "optionsWidth" || inputTarget.id === "optionsHeight")
            {
                var inputElement = inputTarget.id === "optionsWidth" ? this.editorPropertiesTab.size.width : this.editorPropertiesTab.size.height;
                var inputValue = parseInt((inputTarget.id === "optionsWidth" ? this.editorPropertiesTab.size.width : this.editorPropertiesTab.size.height).value);
                if (isNaN(inputValue)) { ev.preventDefault(); return; }
                else if (inputValue < parseInt(this.activeElement.style.minWidth.substr(0, this.activeElement.style.minWidth.length - 2)))
                { inputElement.value = this.activeElement.style.minWidth.substr(0, this.activeElement.style.minWidth.length - 2); }
                else if (inputValue < parseInt(this.activeElement.style.minWidth.substr(0, this.activeElement.style.maxWidth.length - 2)))
                { inputElement.value = this.activeElement.style.minWidth.substr(0, this.activeElement.style.maxWidth.length - 2); }

                this.activeElement.style[inputTarget.id === "optionsWidth" ? "width" : "height"] = `${inputElement.value}px`;
            }
            else if (inputTarget.id === "optionsForegroundColour" || inputTarget.id === "optionsBackgroundColour" || inputTarget.id === "optionsAltColour")
            {
                var defaultStyle: IRGB;
                switch (inputTarget.id)
                {
                    case "optionsForegroundColour":
                        defaultStyle = UI.defaultStyles.foregroundColour!;
                        break;
                    case "optionsBackgroundColour":
                        defaultStyle = UI.defaultStyles.backgroundColour!;
                        break;
                    case "optionsAltColour":
                        defaultStyle = UI.defaultStyles.altColour!;
                        break;
                }

                var colour: IRGB | undefined;
                var RGB = this.HexToRGB(inputTarget.value);
                if (RGB === false) { ev.preventDefault(); return; }
                colour = RGB.R == defaultStyle.R && RGB.G == defaultStyle.G && RGB.B == defaultStyle.B ? undefined : RGB;

                switch (inputTarget.id)
                {
                    case "optionsForegroundColour":
                        styles.foregroundColour = colour;
                        break;
                    case "optionsBackgroundColour":
                        styles.backgroundColour = colour;
                        break;
                    case "optionsAltColour":
                        styles.altColour = colour;
                        break;
                }
            }
            else if (inputTarget.id === "optionsFontSize")
            {
                var inputElement = this.editorPropertiesTab.font.fontSize;
                var inputValue = parseInt(inputElement.value);

                if (isNaN(inputValue)) { ev.preventDefault(); return; }
                else if (inputValue > 100) { inputElement.value = "100"; }
                else if (inputValue < 16) { inputElement.value = "16"; }

                styles.fontSize = parseInt(inputElement.value);
            }
            else if (inputTarget.id == "optionsBothAlignment" || inputTarget.id == "optionsHorizontalAlignment" || inputTarget.id == "optionsVerticalAlignment")
            {
                switch (inputTarget.id)
                {
                    case "optionsBothAlignment":
                        styles.align =
                            this.editorPropertiesTab.alignment.both.value === "topLeft" ||
                            this.editorPropertiesTab.alignment.both.value === "bottomRight" ||
                            this.editorPropertiesTab.alignment.both.value === "center" ?
                            this.editorPropertiesTab.alignment.both.value :
                            undefined;
                        break;
                    case "optionsHorizontalAlignment":
                        styles.horizontalAlign =
                            this.editorPropertiesTab.alignment.both.value === "left" ||
                            this.editorPropertiesTab.alignment.both.value === "right" ||
                            this.editorPropertiesTab.alignment.both.value === "center" ?
                            this.editorPropertiesTab.alignment.both.value :
                            undefined;
                        break;
                    case "optionsVerticalAlignment":
                        styles.verticalAlign =
                            this.editorPropertiesTab.alignment.both.value === "top" ||
                            this.editorPropertiesTab.alignment.both.value === "bottom" ||
                            this.editorPropertiesTab.alignment.both.value === "center" ?
                            this.editorPropertiesTab.alignment.both.value :
                            undefined;
                        break;
                }
            }
            else if (inputTarget.id == "optionsText")
            {
                var content = this.editorPropertiesTab.misc.text.value.split(' ').filter(part => part !== '').join(' ');
                styles.content = content !== '' ? content.substr(0, 32) : "Text";
            }
            else { return; }

            this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.UpdateStyles(this.activeElement, styles);
            this.UpdateSavedElementProperties(this.activeElement, styles);
        }
    }

    //I should tidy this up a bit as I'm doing the same thing in multiple places.
    private UpdateSavedElementProperties(element: HTMLDivElement, styles?: TCustomStyles): void
    {
        var location: [string, string, string, string] = this.ui.createdElements.locations[element.id];
        var _position: { top?: string; left?: string; bottom?: string; right?: string; } = {};

        if (element.offsetLeft + element.clientWidth / 2 > this.ui.overlay.clientWidth / 2)
        {
            var right = this.ui.overlay.clientWidth - element.offsetLeft - element.clientWidth
            this.editorPropertiesTab.position.left.value = "";
            this.editorPropertiesTab.position.right.value = right.toString();
            _position.right = `${right}px`;
        }
        else
        {
            this.editorPropertiesTab.position.left.value = element.offsetLeft.toString();
            this.editorPropertiesTab.position.right.value = "";
            _position.left = `${element.offsetLeft}px`;
        }
        if (element.offsetTop + element.clientHeight / 2 > this.ui.overlay.clientHeight / 2)
        {
            var bottom = this.ui.overlay.clientHeight - element.offsetTop - element.clientHeight;
            this.editorPropertiesTab.position.top.value = "";
            this.editorPropertiesTab.position.bottom.value = bottom.toString();
            _position.bottom = `${bottom}px`;
        }
        else
        {
            this.editorPropertiesTab.position.top.value = element.offsetTop.toString();
            this.editorPropertiesTab.position.bottom.value = "";
            _position.top = `${element.offsetTop}px`;
        }

        this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position = _position;
        if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.resizeMode != 0)
        {
            this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].width = element.clientWidth.toString();
            this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].height = element.clientHeight.toString();
        }
        this.editorPropertiesTab.size.width.value = element.clientWidth.toString();
        this.editorPropertiesTab.size.height.value = element.clientHeight.toString();

        if (styles !== undefined)
        {
            this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles = {};

            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.foregroundColour === true)
            { this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.foregroundColour = styles.foregroundColour; }
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.backgroundColour === true)
            { this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.backgroundColour = styles.backgroundColour; }
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.altColour === true)
            { this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.altColour = styles.altColour; }
    
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.fontSize === true)
            { this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.fontSize = styles.fontSize; }

            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.align !== undefined)
            { this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.align = styles.align; }
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.horizontalAlign !== undefined)
            { this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.horizontalAlign = styles.horizontalAlign; }
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.verticalAlign !== undefined)
            { this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.verticalAlign = styles.verticalAlign; }

            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.editableStyles.content !== undefined)
            { this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles.content = styles.content; }
        }

        this.allowUnload = false;
    }

    //https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    private HexToRGB(hex: string): false | IRGB
    {
        var HexSplit = new RegExp(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);
        
        if (HexSplit === null) { return false; }

        var RGB: IRGB =
        {
            R: parseInt(HexSplit[1], 16),
            G: parseInt(HexSplit[2], 16),
            B: parseInt(HexSplit[3], 16)
        }

        if (isNaN(RGB.R) || isNaN(RGB.G) || isNaN(RGB.B)) { return false; }

        return RGB;
    }

    private RGBToHex(RGB: IRGB): string
    {
        return "#" + this.ComponentToHex(RGB.R) + this.ComponentToHex(RGB.G) + this.ComponentToHex(RGB.B);
    }

    private ComponentToHex(component: any): string
    {
        var hex: string = component.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    private DeleteElement(element: HTMLDivElement): void
    {
        this.editorPropertiesTab.optionsRow.style.display = "none";
        var location: [string, string, string, string] = this.ui.createdElements.locations[element.id];
        this.ui.createdElements.elements[location[0]][location[1]][location[2]].script.RemoveElement(element);
        /*if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].mutationObserver !== undefined)
        { this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].mutationObserver!.disconnect(); }*/
        delete this.ui.createdElements.locations[element.id];
        delete this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]];
        this.ui.overlay.removeChild(Main.ThrowIfNullOrUndefined(this.ui.overlay.querySelector(`#${element.id}`)));
        if (Object.keys(this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements).length === 0)
        {
            delete this.ui.createdElements.elements[location[0]][location[1]][location[2]];
            document.head.removeChild(Main.ThrowIfNullOrUndefined(document.head.querySelector(`#style_${location[0]}_${location[1]}_${location[2]}`)));
            if (Object.keys(this.ui.createdElements.elements[location[0]][location[1]]).length === 0)
            {
                delete this.ui.createdElements.elements[location[0]][location[1]];
                if (Object.keys(this.ui.createdElements.elements[location[0]]).length === 0)
                { delete this.ui.createdElements.elements[location[0]]; }
            }
        }
        this.allowUnload = false;
    }

    //Could copying all the elements here be a problem with the duplicated IDs?
    private async RenderImage(
        target: HTMLElement,
        options?:
        {
            dimensions?:
            {
                width: number,
                height: number,
                baseWidth?: number,
                baseHeight?: number
            },
            css?: string
        }
    ): Promise<string>
    {
        var result: string;

        if (options !== undefined)
        {
            this.imageRendererContainer.style.display = "block";
            this.imageRendererContainer.innerHTML = target.innerHTML;

            var width: number; 
            var height: number; 
            if (options.dimensions !== undefined)
            {
                width = options.dimensions.width;
                height = options.dimensions.height;

                var baseWidth: number;
                var baseHeight: number;

                if (options.dimensions.baseWidth !== undefined && options.dimensions.baseHeight !== undefined)
                {
                    baseWidth = options.dimensions.baseWidth;
                    baseHeight = options.dimensions.baseHeight;
                }
                else
                {
                    baseWidth = target.clientWidth;
                    baseHeight = target.clientHeight;
                }

                this.imageRendererContainer.style.width = `${baseWidth}px`;
                this.imageRendererContainer.style.height = `${baseHeight}px`;

                var widerThanTall = width >= height;

                var scale = widerThanTall ? width / baseWidth : height / baseHeight;

                this.imageRendererContainer.style.transform = `scale(${scale})`;
                this.imageRendererContainer.style[!widerThanTall ? "width" : "height"] = `${(!widerThanTall ? width : height) / scale}px`;
            }
            else
            {
                this.imageRendererContainer.style.width = `${target.clientWidth}px`;
                this.imageRendererContainer.style.height = `${target.clientHeight}px`;
                width = target.clientWidth;
                height = target.clientHeight;
            }

            if (options.css !== undefined)
            {
                var css = document.createElement("style");
                css.innerText = `#imageRendererContainer { ${options.css} }`;
                this.imageRendererContainer.appendChild(css);
            }

            result = await domtoimage.toPng(this.imageRendererContainer, { width: width, height: height });
        }
        else
        { result = await domtoimage.toPng(target); }

        this.imageRendererContainer.innerHTML = "";
        this.imageRendererContainer.style.width = "0";
        this.imageRendererContainer.style.height = "0";
        this.imageRendererContainer.style.display = "none";

        return result;
    }

    private ShowWalkthroughContainer()
    {
        this.walkthroughContainer.style.display = "block";
        this.walkthroughContainer.classList.remove("fadeOut");
        this.walkthroughContainer.classList.add("fadeIn");
    }

    //I'm not going to await for the image to render here, when saving the overlay I will render the overlay again and await for that one.
    private ShowSaveContainerClickEvent(): void
    {
        this.RenderImage(this.ui.overlay,
        {
            dimensions:
            {
                width: 1280,
                height: 720,
                baseWidth: 1920,
                baseHeight: 1080
            },
            // css: `background-image: url(${Main.WEB_ROOT}/assets/images/beat-saber.jpg);`
        })
        .then((dataURL: string) => { this.thumbnail.src = dataURL; });
        this.saveMenuContainer.style.display = "block";
        this.saveMenuContainer.classList.remove("fadeOut");
        this.saveMenuContainer.classList.add("fadeIn");
    }

    //Add checks and overlay creation limits.
    private async PublishOverlay(): Promise<void>
    {
        Main.Alert("Please wait...");

        //I figured it would be easier to just get all of the elements when the overlay is going to be saved, instead of storing the elements as I go along. Im not using the createelements object as it has data I don't need.
        var savedElements: SavedElements = {};
        for (const key of Object.keys(this.ui.createdElements.locations))
        {
            const location: [string, string, string, string] = this.ui.createdElements.locations[key];
            if (savedElements[location[0]] === undefined) { savedElements[location[0]] = {}; }
            if (savedElements[location[0]][location[1]] === undefined) { savedElements[location[0]][location[1]] = {}; }
            if (savedElements[location[0]][location[1]][location[2]] === undefined) { savedElements[location[0]][location[1]][location[2]] = []; }

            var _position: { top?: string; left?: string; bottom?: string;  right?: string; } = {};
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.top !== undefined) { _position.top = this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.top; }
            else { _position.bottom = this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.bottom; }
            if (this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.left !== undefined) { _position.left = this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.left; }
            else { _position.right = this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].position.right; }

            savedElements[location[0]][location[1]][location[2]].push(
            {
                zIndex: this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].zIndex,
                position: _position,
                width: this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].width,
                height: this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].height,
                customStyles: this.ui.createdElements.elements[location[0]][location[1]][location[2]].elements[location[3]].customStyles
            });
        }

        if (Object.keys(savedElements).length < 1) { Main.Alert("This overlay does not have enough elements to be saved.<br>You must have at least 1 element."); }
        else
        {
            var response: ReturnData = await OverlayHelper.OverlayPHP(
            {
                method: "saveOverlay",
                data:
                {
                    id: this.id,
                    name: this.title.value,
                    description: this.description.value,
                    isPrivate: this.overlayPrivateCheckbox.checked ? 1 : 0,
                    //Check if the client is connected to the game here, if they are not then use the sample data for the thumbnail.
                    thumbnail: await this.RenderImage(this.ui.overlay,
                    {
                        dimensions:
                        {
                            width: 480,
                            height: 270,
                            baseWidth: 1920,
                            baseHeight: 1080
                        }
                    }),
                    elements: savedElements
                }
            });
    
            if (response.error)
            {
                Main.Alert(Main.GetPHPErrorMessage(response.data));
            }
            else
            {
                Main.Alert("Saved!");
                //this.MinimiseSaveMenu();
                this.allowUnload = true;
            }
        }
    }

    private MinimiseSaveMenu(): void
    {
        this.saveMenuContainer.classList.remove("fadeIn");
        this.saveMenuContainer.classList.add("fadeOut");
        setTimeout(() =>
        {
            this.saveMenuContainer.style.display = "none";
            this.thumbnail.src = "";
        }, 399); //Changing the display 1ms before the animation finishes to help prevent flickering.
    }
}
new Editor().Init();