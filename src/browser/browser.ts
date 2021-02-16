import { Main } from "../assets/js/main";

class Browser
{
    private searchBox!: HTMLFormElement;

    constructor()
    {
        new Main();
        window.addEventListener("DOMContentLoaded", () => { this.DOMContentLoadedEvent(); });
        window.addEventListener("load", () => { this.WindowLoadEvent(); });
    }

    private DOMContentLoadedEvent()
    {
        this.searchBox = Main.ThrowIfNullOrUndefined(document.querySelector("#search"));
        this.searchBox.addEventListener("submit", (ev: Event) => { this.CustomSearch(ev); });
    }

    private WindowLoadEvent()
    {
        this.GetOverlays(Main.urlParams.has("q") ? JSON.parse(decodeURIComponent(Main.urlParams.get("q")!)) : {page: 1});
    }

    //Update this query type
    private GetOverlays(query: { [key: string]: string | number })
    {
        let queryKey = Object.keys(query)[1];
        let pageOnly = queryKey == null || queryKey == "undefined";
        if (pageOnly) { delete query[queryKey]; }
        let queryString = JSON.stringify(query);

        $.ajax(
        {
            url: `${Main.WEB_ROOT}/assets/php/getOverlays.php`,
            data: `q=${encodeURIComponent(queryString)}`,
            type: "GET",
            dataType: "json",
            error: Main.ThrowAJAXJsonError,
            success: (data: any) => { success(data); }
        });

        function success(data: any) //Rewrite this object so it is type safe
        {
            if (data.results != null)
            {
                let firstPush: boolean = true;
                let overlayList = Main.ThrowIfNullOrUndefined(document.querySelector("#overlays"));
                let pagesContainer = Main.ThrowIfNullOrUndefined(document.querySelector("#pages"));

                while (overlayList.childElementCount > 1) { overlayList.removeChild(overlayList.lastChild); }
                while (pagesContainer.childElementCount > 0) { pagesContainer.removeChild(pagesContainer.lastChild); }

                //Add a short description, ending with elipsis after X characters?
                data.results.forEach((result: any) =>
                {
                    let tr = document.createElement("tr");
                    let td1 = document.createElement("td");
                    let td2 = document.createElement("td");
                    let td3 = document.createElement("td");
                    let b64 = document.createElement("img");
                    let oname = document.createElement("a");
                    let creator = document.createElement("a");

                    b64.src = "data:image/png;base64," + btoa(
                        new Uint8Array(result.b64)
                        .reduce((bytedata, byte) => bytedata + String.fromCharCode(byte), '')
                    );
                    oname.innerHTML = result.oname;
                    oname.href = `../overlay/?id=${result.id}`;
                    creator.innerHTML = result.username;
                    creator.href = `../user/?unid=${result.unid}`;
        
                    td1.appendChild(b64);
                    td2.appendChild(oname);
                    td3.appendChild(creator);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    overlayList.appendChild(tr);
                });
            
                let bc = 1;
                let pages = Math.ceil(data.totalResults / 15);
                while (bc <= pages)
                {
                    let pageBtn: HTMLButtonElement = document.createElement("button");
                    pageBtn.innerHTML = bc.toString();
                    pageBtn.className = "hollowButton";
                    if (bc == query.page) { pageBtn.classList.add("hover"); }
                    pageBtn.style.marginLeft = "10px";
                    let btnFunction = pageOnly ? `getOverlays({page: ${bc}})`: `getOverlays({page: ${bc}, ${queryKey}: "${query[queryKey]}"})`;
                    pageBtn.setAttribute("onclick", btnFunction);
                    pagesContainer.appendChild(pageBtn);
                    bc++;
                }

                if(!firstPush)
                {
                    Main.urlParams.set("q", queryString);
                    window.history.pushState(queryString, `BSDP Overlay | Browser`, "?" + Main.urlParams.toString());
                }
                else { firstPush = false; }
            }
        }
    }

    private CustomSearch(ev: Event)
    {
        ev.preventDefault();
        let searchQuery: string = (<HTMLInputElement>this.searchBox.firstElementChild!).value; //Get if page is defined
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