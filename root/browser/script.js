const urlParams = new URLSearchParams(location.search);
let searchBox;
let firstPush = true;

window.addEventListener("load", () =>
{
    searchBox = document.querySelector("#search");
    searchBox.addEventListener("submit", customSearch);

    getOverlays(urlParams.has("q") ? JSON.parse(decodeURIComponent(urlParams.get("q"))) : {page: 1});
})

function getOverlays(query)
{
    let queryKey = Object.keys(query)[1];
    let pageOnly = queryKey == null || queryKey == "undefined";
    if (pageOnly) { delete query[queryKey]; }
    let queryString = JSON.stringify(query);

    $.ajax(
    {
        url: "../getOverlays.php",
        data: `q=${encodeURIComponent(queryString)}`,
        type: "GET",
        dataType: "json",
        error: (err) => { console.log(err); },
        success: sucess
    });

    function sucess(data)
    {
        if (data.results != null)
        {
            let overlayList = document.querySelector("#overlays");
            let pagesContainer = document.querySelector("#pages");

            while (overlayList.childElementCount > 1) { overlayList.removeChild(overlayList.lastChild); }
            while (pagesContainer.childElementCount > 0) { pagesContainer.removeChild(pagesContainer.lastChild); }

            //Add a short description, ending with elipsis after X characters?
            data.results.forEach(result =>
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
                let pageBtn = document.createElement("button");
                pageBtn.innerHTML = bc;
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
                urlParams.set("q", queryString);
                window.history.pushState(queryString, `BSDP Overlay | Browser`, "?" + urlParams.toString());
            }
            else { firstPush = false; }
        }
    }
}

function customSearch(e)
{
    e.preventDefault();
    let searchQuery = searchBox.firstElementChild.value; //Get if page is defined
    if (searchQuery.includes(":"))
    {
        searchQuery = searchQuery.split(":");
        getOverlays({page: 1, [searchQuery[0]]: searchQuery[1]});
    }
    else if (searchQuery == "") { getOverlays({page: 1}); }
    else { getOverlays({page: 1, all: searchQuery}); }
}