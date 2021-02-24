import { Main } from "../assets/js/main";

class Preview
{
    constructor()
    {
        new Main();
        
        if (!Main.urlParams.has("id"))
        {
            window.location.replace("../browser/");
        }

        if (Main.urlParams.has("id"))
        {
            let queryString = JSON.stringify({id: Main.urlParams.get("id")});
            $.ajax(
            {
                url: "../getOverlays.php",
                data: `q=${encodeURIComponent(queryString)}`,
                type: "GET",
                dataType: "json",
                error: (err) => { console.log(err); },
                success: sucess
            });
        
            function sucess(data: any)
            {
                if (data.result != null)
                {
                    let overlayImage = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayImage"));
                    let overlayName = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayName"));
                    let overlayDescription = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayDescription"));
                    let overlayButton = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayButton"));
                    let overlayCreator = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayCreator"));
                    let overlayID = Main.ThrowIfNullOrUndefined(document.querySelector("#overlayID"));
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
    }
}
new Preview();