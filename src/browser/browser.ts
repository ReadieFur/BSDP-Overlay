import { Main } from "../assets/js/main";

class Browser
{
    private overlays: HTMLTableElement;
    private pages: HTMLDivElement;
    private search: HTMLFormElement;

    constructor()
    {
        new Main();
        this.overlays = Main.ThrowIfNullOrUndefined(document.querySelector("#overlays"));
        this.pages = Main.ThrowIfNullOrUndefined(document.querySelector("#pages"));
        this.search = Main.ThrowIfNullOrUndefined(document.querySelector("#search"));

        this.search.addEventListener("submit", (ev: Event) => { this.CustomSearch(ev); });
        this.GetOverlays(Main.urlParams.has("q") ? JSON.parse(decodeURIComponent(Main.urlParams.get("q")!)) : {page: 1});
    }

    //Rewrite this (piggybacking off of my old code).
    //Update this query type.
    private GetOverlays(query: { [key: string]: string | number })
    {
        var queryKey: string = Object.keys(query)[1];
        var pageOnly: boolean = queryKey == null || queryKey == "undefined";
        if (pageOnly) { delete query[queryKey]; }
        var queryString = JSON.stringify(query);

        jQuery.ajax(
        {
            url: `${Main.WEB_ROOT}/assets/php/overlay.php`,
            data:
            {
                "q": JSON.stringify(
                {
                    method: "List",
                    data: query
                })
            },
            type: "POST",
            dataType: "json",
            error: Main.ThrowAJAXJsonError,
            //Rewrite this object so it is type safe.
            success: (response: any) =>
            {
                if (response.error === null)
                {
                    var firstPush: boolean = true;

                    while (this.overlays.childElementCount > 1) { this.overlays.removeChild(this.overlays.lastChild!); }
                    while (this.pages.childElementCount > 0) { this.pages.removeChild(this.pages.lastChild!); }

                    //Add a short description, ending with elipsis after X characters?
                    response.data.forEach((result: any) =>
                    {
                        var tr: HTMLTableRowElement = document.createElement("tr");
                        var td1: HTMLTableDataCellElement = document.createElement("td");
                        var td2: HTMLTableDataCellElement = document.createElement("td");
                        var td3: HTMLTableDataCellElement = document.createElement("td");
                        var thumbnail: HTMLImageElement = document.createElement("img");
                        var name: HTMLAnchorElement = document.createElement("a");
                        var creator: HTMLAnchorElement = document.createElement("a");

                        thumbnail.src = result.data.data.thumbnail;
                        name.innerHTML = result.data.oname;
                        creator.innerHTML = result.data.username;
                        tr.onclick = () => { window.location.pathname = `${Main.WEB_ROOT}/preview/${result.data.id}`; };
                        
                        td1.appendChild(thumbnail);
                        td2.appendChild(name);
                        td3.appendChild(creator);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        tr.appendChild(td3);
                        this.overlays.appendChild(tr);
                    });
                
                    var bc: number = 1;
                    var pages: number = Math.ceil(response.totalResults / 15);
                    while (bc <= pages)
                    {
                        var pageBtn: HTMLButtonElement = document.createElement("button");
                        pageBtn.innerHTML = bc.toString();
                        pageBtn.className = "hollowButton";
                        if (bc == query.page) { pageBtn.classList.add("hover"); }
                        pageBtn.style.marginLeft = "10px";
                        pageBtn.onclick = () =>
                        {
                            if (pageOnly)
                            { this.GetOverlays({page: bc}); }
                            else
                            { this.GetOverlays({page: bc, queryKey: query[queryKey]}); }
                        };
                        this.pages.appendChild(pageBtn);
                        bc++;
                    }

                    if(!firstPush)
                    {
                        Main.urlParams.set("q", queryString);
                        window.history.pushState(queryString, `Browser | BSDP Overlay`, "?" + Main.urlParams.toString());
                    }
                    else { firstPush = false; }
                }
                else
                {
                    //Error.
                }
            }
        });
    }

    private CustomSearch(ev: Event)
    {
        ev.preventDefault();
        var searchQuery: string = (<HTMLInputElement>this.search.firstElementChild!).value; //Get if page is defined
        if (searchQuery.includes(":"))
        {
            var searchQuerySplit = searchQuery.split(":");
            this.GetOverlays({page: 1, [searchQuerySplit[0]]: searchQuerySplit[1]});
        }
        else if (searchQuery == "") { this.GetOverlays({page: 1}); }
        else { this.GetOverlays({page: 1, all: searchQuery}); }
    }
}
new Browser();