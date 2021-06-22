import { Main, ReturnData } from "../assets/js/main.js";
import { IOverlayData, OverlayHelper } from "../assets/js/overlay/overlayHelper.js";

class Preview
{
    
    private overlayImageContainer!: HTMLTableRowElement;
    private thumbnail!: HTMLImageElement;
    private name!: HTMLHeadingElement;
    private description!: HTMLParagraphElement;
    private overlayLink!: HTMLLinkElement;
    private overlayLinkContainer!: HTMLButtonElement;
    private editLink!: HTMLLinkElement;
    private editLinkContainer!: HTMLButtonElement;
    private deleteButton!: HTMLButtonElement;
    private username!: HTMLLinkElement;
    private id!: HTMLLinkElement;

    private path!: string[];
    private overlayID?: string;

    private deleteAlerted = false;

    public async Init()
    {
        new Main();

        this.overlayImageContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayImageContainer"));
        this.thumbnail = Main.ThrowIfNullOrUndefined(document.querySelector("#thumbnail"));
        this.name = Main.ThrowIfNullOrUndefined(document.querySelector("#name"));
        this.description = Main.ThrowIfNullOrUndefined(document.querySelector("#description"));
        this.overlayLink = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayLink"));
        this.overlayLinkContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayLinkContainer"));
        this.editLink = Main.ThrowIfNullOrUndefined(document.querySelector("#editLink"));
        this.editLinkContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#editLinkContainer"));
        this.deleteButton = Main.ThrowIfNullOrUndefined(document.querySelector("#deleteButton"));
        this.username = Main.ThrowIfNullOrUndefined(document.querySelector("#username"));
        this.id = Main.ThrowIfNullOrUndefined(document.querySelector("#id"));

        window.addEventListener("message", (ev) => { this.WindowMessageEvent(ev); })

        this.path = window.location.pathname.split('/').filter((part) => { return part != ""; });
        if (this.path[this.path.length - 1] === "preview" || this.path[this.path.length - 2] !== "preview" || this.path[this.path.length - 1].length != 13)
        {
            Main.Alert("Invalid ID.");
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }

        this.deleteButton.addEventListener("click", (ev) => { this.DeleteButtonClickEvent(ev); });

        this.GetOverlay();
    }

    private GetOverlay()
    {
        OverlayHelper.OverlayPHP({
            method: "getOverlayByID",
            data:
            {
                id: this.path[this.path.length - 1]
            },
            success: (response) => { this.GotOverlay(response); }
        });
    }

    private async GotOverlay(response: ReturnData)
    {
        if (response.error)
        {
            console.error(response);
            Main.Alert(Main.GetPHPErrorMessage(response.data));
            await Main.Sleep(1000);
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }

        var overlay = response.data as IOverlayData;
        if (overlay.thumbnail !== null) { this.thumbnail.src = overlay.thumbnail; }

        this.overlayID = overlay.id;

        if (Main.RetreiveCache("READIE_UID") === overlay.uid)
        {
            this.overlayLinkContainer.classList.remove("ignore");
            this.editLinkContainer.style.display = "block";
            this.deleteButton.style.display = "block";
        }
        else
        {
            this.overlayLinkContainer.classList.add("ignore");
            this.editLinkContainer.style.display = "none";
            this.deleteButton.style.display = "none";
        }

        this.name.innerText = overlay.name;
        this.description.innerText = overlay.description === null ? '' : overlay.description;
        this.overlayLink.href = `${Main.WEB_ROOT}/view/${overlay.id}/`;
        this.editLink.href = `${Main.WEB_ROOT}/edit/${overlay.id}/`;
        this.username.innerText = overlay.username;
        this.username.href = `${Main.WEB_ROOT}/browser/?q=${encodeURIComponent(JSON.stringify(
        {
            filter: "username",
            searchData: overlay.username,
            page: 1
        }))}`;
        this.id.innerText = overlay.id;
        this.id.href = `${Main.WEB_ROOT}/view/${overlay.id}/`;
    }

    //Look into ckecking if the user clicked elsewhere to then re-enable the saftey alert.
    private DeleteButtonClickEvent(ev: Event)
    {
        if (this.overlayID === null)
        {
            Main.Alert("Overlay ID not found.");
        }
        else
        {
            if (!this.deleteAlerted)
            {
                Main.Alert("Are you sure you want to delete this overlay?<br><small>This cannot be undone.<br>Click the button again to delete the overlay.</small>");
                this.deleteAlerted = true;
            }
            else
            {
                OverlayHelper.OverlayPHP(
                {
                    method: "deleteOverlay",
                    data:
                    {
                        id: this.overlayID
                    },
                    success: async (response) =>
                    {
                        if (response.error)
                        { Main.Alert(Main.GetPHPErrorMessage(response.data)); }
                        else if (response.data !== true)
                        { Main.Alert(Main.GetPHPErrorMessage(response.data)); }
                        else
                        {
                            Main.Alert("Overlay successfully deleted.");
                            await Main.Sleep(1000);
                            window.location.href = `${Main.WEB_ROOT}/browser/`;
                        }
                    }
                });
            }
        }
    }

    private WindowMessageEvent(ev: MessageEvent<any>)
    {
        var host = window.location.host.split('.');
        if (ev.origin.split('/')[2] == `api-readie.global-gaming.${host[host.length - 1]}`)
        {
            if (Main.TypeOfReturnData(ev.data))
            {
                switch (ev.data.data)
                {
                    case "LOGGED_IN":
                        this.GetOverlay();
                        break;
                    default:
                        //Not implemented.
                        break;
                }
            }
        }
    }
}
new Preview().Init();