const urlParams = new URLSearchParams(location.search);

window.addEventListener("DOMContentLoaded", () => { if (!urlParams.has("id")) { window.location.replace("../browser"); } })

window.addEventListener("load", () =>
{
    if (urlParams.has("id"))
    {
        let queryString = JSON.stringify({id: urlParams.get("id")});
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
            if (data.result != null)
            {
                let overlayImage = document.querySelector("#overlayImage");
                let overlayName = document.querySelector("#overlayName");
                let overlayDescription = document.querySelector("#overlayDescription");
                let overlayButton = document.querySelector("#overlayButton");
                let overlayCreator = document.querySelector("#overlayCreator");
                let overlayID = document.querySelector("#overlayID");
                overlayImage.src = "data:image/png;base64," + btoa(
                    new Uint8Array(data.result.b64)
                    .reduce((bytedata, byte) => bytedata + String.fromCharCode(byte), '')
                );
                overlayName.innerHTML = data.result.oname;
                overlayDescription.innerHTML = data.result.comment;
                overlayButton.setAttribute("onclick", `window.location = "http://u-readie.global-gaming.co/bsdp-overlay/editor/?style=${data.result.id}";`);
                overlayCreator.innerHTML = data.result.username;
                overlayCreator.href = `../user/?unid=${data.result.unid}`;
                overlayID.innerHTML = data.result.id;
            }
            else { window.location.replace("../browser/"); }
        }
    }
})