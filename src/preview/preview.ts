import { Main, ReturnData } from "../assets/js/main";
import { IOverlayData, OverlayHelper } from "../assets/js/overlay/overlayHelper";

class Preview
{
    private overlayImageContainer: HTMLTableRowElement;
    private thumbnail: HTMLImageElement;
    private name: HTMLHeadingElement;
    private description: HTMLParagraphElement;
    private overlayLink: HTMLLinkElement;
    private username: HTMLLinkElement;
    private id: HTMLLinkElement;

    constructor()
    {
        new Main();

        this.overlayImageContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayImageContainer"));
        this.thumbnail = Main.ThrowIfNullOrUndefined(document.querySelector("#thumbnail"));
        this.name = Main.ThrowIfNullOrUndefined(document.querySelector("#name"));
        this.description = Main.ThrowIfNullOrUndefined(document.querySelector("#description"));
        this.overlayLink = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayLink"));
        this.username = Main.ThrowIfNullOrUndefined(document.querySelector("#username"));
        this.id = Main.ThrowIfNullOrUndefined(document.querySelector("#id"));

        var path = window.location.pathname.split('/').filter((part) => { return part != ""; });
        if (path[path.length - 1] === "preview" || path[path.length - 2] !== "preview" || path[path.length - 1].length != 13) { window.location.href = `${Main.WEB_ROOT}/browser/`; }

        OverlayHelper.OverlayPHP({
            method: "getOverlayByID",
            data:
            {
                id: path[path.length - 1]
            },
            success: (response) => { this.GotOverlay(response); }
        });
    }

    private GotOverlay(response: ReturnData)
    {
        if (response.error)
        {
            //Alert error.
            window.location.href = `${Main.WEB_ROOT}/browser/`;
        }

        var overlay = response.data as IOverlayData;
        if (overlay.thumbnail === null) { this.overlayImageContainer.style.display = "none"; }
        else { this.thumbnail.src = overlay.thumbnail; }
        this.name.innerText = overlay.name;
        this.description.innerText = overlay.description === null ? '' : overlay.description;
        this.overlayLink.href = `${Main.WEB_ROOT}/view/${overlay.id}/`;
        this.username.innerText = overlay.username;
        this.username.href = `${Main.WEB_ROOT}/browser/#GENERATE_QUERY_HERE`;
        this.id.innerText = overlay.id;
        this.id.href = `${Main.WEB_ROOT}/view/${overlay.id}/`;
    }
}
new Preview();