import { Main } from "../assets/js/main";
import { HeaderSlide } from "../assets/js/headerSlide";
import { OverlayPOSTResponse, SavedElements, UI } from "../assets/js/overlay/ui";
import { Client } from "../assets/js/overlay/client";

class View
{
    private ui!: UI;
    private client!: Client;

    public async Init(): Promise<View>
    {
        new Main();
        new HeaderSlide();

        this.ui = Main.ThrowIfNullOrUndefined(await new UI().Init());

        this.client = new Client(Main.urlParams.get("ip"));
        this.client.AddEndpoint("MapData");
        this.client.connections["MapData"].AddEventListener("message", (data) => { this.ui.UpdateMapData(data); });
        this.client.connections["MapData"].Connect();
        this.client.AddEndpoint("LiveData");
        this.client.connections["LiveData"].AddEventListener("message", (data) => { this.ui.UpdateLiveData(data); });
        this.client.connections["LiveData"].Connect();

        await this.LoadOverlay();

        //Hide splash screen.
        let splashScreen: HTMLDivElement = Main.ThrowIfNullOrUndefined(document.querySelector("#splashScreen"));
        splashScreen.style.opacity = "0";
        setTimeout(() => { splashScreen!.style.display = "none"; }, 400);

        return this;
    }

    private async LoadOverlay(): Promise<void>
    {
        var path: string[] = window.location.pathname.split("/");
        var response: OverlayPOSTResponse = await jQuery.ajax(
        {
            type: "POST",
            url: `${Main.WEB_ROOT}/assets/php/overlay.php`,
            dataType: "json",
            error: Main.ThrowAJAXJsonError,
            data:
            {
                "q": JSON.stringify(
                {
                    method: "GetByID",
                    data:
                    {
                        id: path[path.length - 1]
                    }
                })
            }
        });

        if (response.error === null)
        {
            var elements: SavedElements = response.data.elements;

            //TMP
            if (parseInt(response.data.isPrivate) === 1 && response.data.unid !== Main.RetreiveCache("READIE-UI"))
            {
                //User does not have permission to view the overlay.
                window.location.pathname = `${Main.WEB_ROOT}/browser/`;
            }

            for (const category of Object.keys(elements))
            {
                for (const type of Object.keys(elements[category]))
                {
                    for (const id of Object.keys(elements[category][type]))
                    {
                        for (let i = 0; i < elements[category][type][id].length; i++)
                        {
                            const elementProperties = elements[category][type][id][i];
                            var container: HTMLDivElement = this.ui.CreateElement(category, type, id);
                            if (elementProperties.position.top !== undefined)
                            {
                                container.style.top = elementProperties.position.top;
                                container.style.height = `${elementProperties.height}px`;
                            }
                            else
                            {
                                container.style.height = `${elementProperties.height}px`;
                                container.style.bottom = elementProperties.position.bottom!;
                            }
                            if (elementProperties.position.left !== undefined)
                            {
                                container.style.left = elementProperties.position.left;
                                container.style.width = `${elementProperties.width}px`;
                            }
                            else
                            {
                                container.style.width = `${elementProperties.width}px`;
                                container.style.right = elementProperties.position.right!;
                            }
                            this.ui.overlay.appendChild(container);
                        }
                    }
                }
            }
        }
        else
        {
            //INVALID_SQL_RESPONSE || MISSING_PARAMETERS || INVALID_PERMISSIONS || INVALID_CREDENTIALS.
            window.location.pathname = `${Main.WEB_ROOT}/browser/`;
        }
    }
}
new View().Init();