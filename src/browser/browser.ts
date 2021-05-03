import { Main, ReturnData } from "../assets/js/main.js";
import { IOverlayData, OverlayHelper } from "../assets/js/overlay/overlayHelper.js";

class Browser
{
    private overlays: HTMLTableElement;
    private pages: HTMLDivElement;
    private resultsText: HTMLParagraphElement;
    private search: HTMLFormElement;
    private searchText: HTMLInputElement;

    private filter: string /*"none" | "name" | "username"*/;
    private searchData: string;
    private page: number;

    constructor()
    {
        new Main();

        this.overlays = Main.ThrowIfNullOrUndefined(document.querySelector("#overlays"));
        this.pages = Main.ThrowIfNullOrUndefined(document.querySelector("#pages"));
        this.resultsText = Main.ThrowIfNullOrUndefined(document.querySelector("#resultsText"));
        this.search = Main.ThrowIfNullOrUndefined(document.querySelector("#search"));
        this.searchText = Main.ThrowIfNullOrUndefined(document.querySelector("#searchText"));

        this.filter = "none";
        this.searchData = "";
        this.page = 1;

        if (Main.urlParams.has("q"))
        {
            try
            {
                var query = JSON.parse(Main.urlParams.get("q")!);
                if (
                    typeof(query.filter) === "string" &&
                    (
                        query.filter === "none" ||
                        query.filter === "name" ||
                        query.filter === "username"
                    ) &&
                    typeof(query.searchData) === "string" &&
                    typeof(query.page) === "number"
                )
                {
                    this.searchText.value = `${query.filter !== "none" ? `${query.filter}:` : ""}${query.searchData}`;
                    this.filter = query.filter;
                    this.searchData = query.searchData;
                    this.page = query.page;
                }
            }
            catch (ex) {}
        }

        window.addEventListener("message", (ev) => { this.WindowMessageEvent(ev); });
        this.search.addEventListener("submit", (ev) => { this.SearchOverlays(ev); });

        OverlayHelper.OverlayPHP(
        {
            method: "getOverlaysBySearch",
            data:
            {
                filter: this.filter,
                search: this.searchData,
                page: this.page
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
    }

    private SearchOverlays(ev: Event)
    {
        ev.preventDefault();
        ev.returnValue = false;

        var searchText = this.searchText.value.split(':');

        if (searchText[1] === "") { Main.Alert("Invalid search."); return; }

        if (searchText[0] === "" && searchText[1] === undefined)
        {
            //"none" is for listing all overlays that the user can see.
            this.filter = "none";
            this.searchData = "";
        }
        else if (
            (
                searchText[0] === "name" ||
                searchText[0] === "username"
            ) && (searchText[1] !== "" || searchText[1] !== undefined)
        )
        {
            this.filter = searchText[0].toLowerCase();
            this.searchData = searchText[1];
        }
        else
        {
            this.filter = "name";
            this.searchData = searchText[0];
        }

        OverlayHelper.OverlayPHP(
        {
            method: "getOverlaysBySearch",
            data:
            {
                filter: this.filter,
                search: this.searchData,
                page: 1
            },
            success: (response) => { this.GotOverlays(response); }
        });
    }

    private GotOverlays(response: ReturnData)
    {
        if (response.error)
        {
            console.error(response);
            Main.Alert(Main.GetPHPErrorMessage(response.data));
        }
        else
        {
            //#region Results text.
            this.resultsText.innerText = `Showing results: ${
                response.data.overlays.length === 0 ? 0 : response.data.startIndex + 1} - ${
                response.data.startIndex + response.data.overlays.length} of ${response.data.overlaysFound}`;
            //#endregion

            //#region Page buttons.
            var pageNumbers: number[] = [];
            if (response.data.overlaysFound > 15)
            {
                var pagesAroundCurrent = 2;
                var pages = response.data.overlaysFound / response.data.resultsPerPage;
                if (pages > 0 && pages < 1) { pages = 1; }
                else if (pages % 1 != 0) { pages = Math.trunc(pages) + 1; } //Can't have half a page, so make a new one.
        
                //I could simplify this but it would make it harder to read.
                this.page = (response.data.startIndex / response.data.resultsPerPage) + 1;
                var lowerPage = this.page - pagesAroundCurrent;
                var upperPage = this.page + pagesAroundCurrent;
        
                //Just in case something bad happens and I end up with decimals I don't want those to show as the page numbers (Math.trunc).

                pageNumbers.push(1);
        
                for (let i = lowerPage; i < this.page; i++)
                {
                    if (i <= 1) { continue; }
                    pageNumbers.push(Math.trunc(i));
                }
        
                if (this.page != 1 && this.page != pages) { pageNumbers.push(Math.trunc(this.page)); }
        
                for (let i = this.page + 1; i <= upperPage; i++)
                {
                    if (i >= pages) { break; }
                    pageNumbers.push(Math.trunc(i));
                }
        
                pageNumbers.push(pages);
            }
            else if (response.data.overlaysFound > 0) //&& response.data.overlaysFound <= 15
            {
                this.page = 1;
                pageNumbers.push(1);
            }
            else
            {
                this.page = 0;
            }

            this.pages.innerHTML = "";
            pageNumbers.forEach(page =>
            {
                var button = document.createElement("button");
                button.innerText = page.toString();

                //It's not ideal to run this if statment every loop but I don't want to rewrite this whole section for one less line.
                if (pageNumbers.length == 1) { button.classList.add("ignore"); }

                if (page == this.page) { button.classList.add("active"); }
                else
                {
                    button.onclick = () =>
                    {
                        OverlayHelper.OverlayPHP(
                        {
                            method: "getOverlaysBySearch",
                            data:
                            {
                                filter: this.filter,
                                search: this.searchData,
                                page: page
                            },
                            success: (_response) => { this.GotOverlays(_response); }
                        });
                    }
                }

                this.pages.appendChild(button);
            });
            //#endregion

            //#region Overlays.
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
            //#endregion

            //#region Save the search into the browser history
            var pageQueryString = JSON.stringify(
            {
                filter: this.filter,
                searchData: this.searchData,
                page: this.page
            });
            Main.urlParams.set("q", pageQueryString);
            window.history.pushState(pageQueryString, document.title, `?${Main.urlParams.toString()}`);
            //#endregion
        }
    }
}
new Browser();