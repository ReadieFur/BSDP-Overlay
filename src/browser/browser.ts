import { Main, ReturnData } from "../assets/js/main";
import { IOverlayData, OverlayHelper } from "../assets/js/overlay/overlayHelper";

class Browser
{
    private overlays: HTMLTableElement;
    private pages: HTMLDivElement;
    private resultsText: HTMLParagraphElement;
    private search: HTMLFormElement;

    constructor()
    {
        new Main();
        this.overlays = Main.ThrowIfNullOrUndefined(document.querySelector("#overlays"));
        this.pages = Main.ThrowIfNullOrUndefined(document.querySelector("#pages"));
        this.resultsText = Main.ThrowIfNullOrUndefined(document.querySelector("#resultsText"));
        this.search = Main.ThrowIfNullOrUndefined(document.querySelector("#search"));

        window.addEventListener("message", (ev) => { this.WindowMessageEvent(ev); });

        OverlayHelper.OverlayPHP(
        {
            method: "getOverlaysBySearch",
            data:
            {
                filter: "none",
                search: "",
                page: 1
            },
            success: (response) => { this.GotOverlays(response); }
        });
    }

    private WindowMessageEvent(ev: MessageEvent<any>)
    {
        var host = window.location.host.split('.');
        if (ev.origin.split('/')[2] == `api-readie.global-gaming.${host[host.length - 1]}`)
        {
            if (Main.TypeOfReturnData(ev.data))
            {
                if (ev.data.error)
                {
                    //Alert error.
                    Main.AccountMenuToggle(false);
                }
                else if (typeof(ev.data.data) === "string")
                {
                    switch (ev.data.data)
                    {
                        case "LOGGED_IN":
                            OverlayHelper.OverlayPHP(
                            {
                                method: "getOverlaysBySearch",
                                data:
                                {
                                    filter: "none",
                                    search: "",
                                    page: 1
                                },
                                success: (response) => { this.GotOverlays(response); }
                            });
                            break;
                        default:
                            //Not implemented.
                            break;
                    }
                }
                else
                {
                    //Alert unknown error/response.
                    console.log("Unknown response: ", ev);
                    Main.AccountMenuToggle(false);
                }
            }
            else
            {
                //Alert unknown error/response.
                console.log("Unknown response: ", ev);
                Main.AccountMenuToggle(false);
            }
        }
    }

    private GotOverlays(response: ReturnData)
    {
        if (response.error)
        {
            //Alert error.
            console.error(response);
        }
        else
        {
            var start: number = response.data.overlays.length === 0 ? 0 : response.data.startIndex + 1;
            var end: number = response.data.startIndex + response.data.overlays.length;
            this.resultsText.innerText = `Showing results: ${start} - ${end} of ${response.data.overlaysFound}`;

            this.overlays.tBodies[1]!.innerHTML = '';
            (<IOverlayData[]>response.data.overlays).forEach((overlay: IOverlayData) =>
            {
                var tableRow = document.createElement("tr");
                var previewContainer = document.createElement("td");
                var preview = document.createElement("img");
                var nameContainer = document.createElement("td");
                var usernameContainer = document.createElement("td");

                preview.src = overlay.thumbnail == null ? '' : overlay.thumbnail;
                previewContainer.appendChild(preview);
                nameContainer.innerText = overlay.name;
                usernameContainer.innerText = overlay.username;

                tableRow.classList.add("listItem");
                tableRow.onclick = () => { window.location.href = `//${window.location.host}${Main.WEB_ROOT}/preview/${overlay.id}/`; }
                tableRow.appendChild(previewContainer);
                tableRow.appendChild(nameContainer);
                tableRow.appendChild(usernameContainer);

                this.overlays.tBodies[1]!.appendChild(tableRow);
            });
        }
    }
}
new Browser();