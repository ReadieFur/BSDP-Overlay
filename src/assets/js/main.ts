declare var WEB_ROOT: string;

export class Main
{
    public static WEB_ROOT: string;
    public static header: HTMLElement;
    public static footer: HTMLElement;
    public static urlParams: URLSearchParams;
    public static zoom: number;

    constructor()
    {
        Main.WEB_ROOT = WEB_ROOT;
        Main.urlParams = new URLSearchParams(location.search);
        Main.header = Main.ThrowIfNullOrUndefined(document.querySelector("#header"));
        Main.footer = Main.ThrowIfNullOrUndefined(document.querySelector("#footer"));

        window.addEventListener("resize", () => { this.WindowResizeEvent(); });
        this.WindowResizeEvent();

        if (Main.RetreiveCache("READIE-DARK") != "false") { Main.DarkTheme(true); }
        else { Main.DarkTheme(false); }
        Main.ThrowIfNullOrUndefined(document.querySelector("#darkMode")).addEventListener("click", () =>
        {
            var cachedValue = Main.RetreiveCache("READIE-DARK");
            if (cachedValue == undefined || cachedValue == "false") { Main.DarkTheme(true); }
            else { Main.DarkTheme(false); }
        });

        this.HighlightActivePage();

        let staticStyles = document.createElement("style");
        staticStyles.innerHTML = `
            *
            {
                transition:
                    background 400ms ease 0s,
                    background-color 400ms ease 0s,
                    color 100ms ease 0s;
            }
        `;
        document.head.appendChild(staticStyles);
    }

    private WindowResizeEvent(): void
    {
        if (window.innerWidth < 1280) { Main.zoom = 0.75; }
        else { Main.zoom = 1; }
    }

    private HighlightActivePage(): void
    {
        let path = window.location.pathname.split("/").filter((el) => { return el != ""; });
        for (let i = 0; i < path.length; i++) { path[i] = path[i].replace("_", ""); }
        
        Main.ThrowIfNullOrUndefined(document.querySelector("#header")).querySelectorAll("a").forEach((element: HTMLLinkElement) =>
        {
            if (element.href == window.location.href)
            {
                element.classList.add("accentText");
                let whyIsThisSoFarBack = element.parentElement?.parentElement?.parentElement;
                if (whyIsThisSoFarBack !== null || whyIsThisSoFarBack !== undefined)
                {
                    if (whyIsThisSoFarBack!.classList.contains("naviDropdown")) { whyIsThisSoFarBack!.firstElementChild!.classList.add("accentText"); }
                }
            }
        });
    }

    public static ThrowIfNullOrUndefined(variable: any): any
    {
        if (variable === null || variable === undefined) { throw new TypeError(`${variable} is null or undefined`); }
        return variable;
    }

    public static DarkTheme(dark: boolean): void
    {
        Main.SetCache("READIE-DARK", dark ? "true" : "false", 365);
        var darkButton: HTMLInputElement = Main.ThrowIfNullOrUndefined(document.querySelector("#darkMode"));
        var themeColours: HTMLStyleElement = Main.ThrowIfNullOrUndefined(document.querySelector("#themeColours"));
        if (dark) { darkButton.classList.add("accentText"); }
        else { darkButton.classList.remove("accentText"); }
        themeColours!.innerHTML = `
            :root
            {
                --foregroundColour: ${dark ? "255, 255, 255" : "0, 0, 0"};
                --backgroundColour: ${dark ? "13, 17, 23" : "255, 255, 255"};
                --backgroundAltColour: ${dark ? "22, 27, 34" : "225, 225, 225"};
                --accentColour: 100, 0, 255;
                --accentColourAlt: 255, 120, 0;
            }
        `;
    }

    //I did not realise that PHP could also get the cookies, look into getting cookies from PHP instead for better security.
    public static RetreiveCache(cookie_name: string): string
    {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++)
        {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == cookie_name) { return unescape(y); }
        }
        return "";
    }

    public static SetCache(cookie_name: string, value: string, time: number, path: string = '/'): void
    {
        var hostSplit = window.location.host.split("."); //Just for localhost testing
        var domain = `readie.global-gaming.${hostSplit[hostSplit.length - 1]}`; 
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + time);
        document.cookie = `${cookie_name}=${value}; expires=${expDate.toUTCString()}; path=${path}; domain=${domain};`;
    }

    public static ThrowAJAXJsonError(data: any) { throw new TypeError(`${data} could not be steralised`); }

    public static Alert(message: string): void
    {
        //Alert box popup.
        //Make a UI for this
        window.alert(message);
    }
}