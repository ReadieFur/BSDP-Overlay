declare var WEB_ROOT: string;

export class Main
{
    public static WEB_ROOT: string;
    public static header: HTMLElement;
    public static footer: HTMLElement;
    public static urlParams: URLSearchParams;
    public static zoom: number;
    public static accountContainer: HTMLIFrameElement;

    constructor()
    {
        Main.WEB_ROOT = WEB_ROOT;
        Main.urlParams = new URLSearchParams(location.search);
        Main.header = Main.ThrowIfNullOrUndefined(document.querySelector("#header"));
        Main.footer = Main.ThrowIfNullOrUndefined(document.querySelector("#footer"));
        Main.accountContainer = Main.ThrowIfNullOrUndefined(Main.header.querySelector("#accountContainer"));
        
        window.addEventListener("message", (ev) => { this.WindowMessageEvent(ev); });
        window.addEventListener("resize", () => { this.WindowResizeEvent(); });
        Main.ThrowIfNullOrUndefined(document.querySelector("#accountButton")).addEventListener("click", () => { Main.AccountMenuToggle(true); });
        this.WindowResizeEvent();

        if (Main.RetreiveCache("READIE_DARK") != "false") { Main.DarkTheme(true); }
        else { Main.DarkTheme(false); }
        Main.ThrowIfNullOrUndefined(document.querySelector("#darkMode")).addEventListener("click", () =>
        {
            var cachedValue = Main.RetreiveCache("READIE_DARK");
            if (cachedValue == undefined || cachedValue == "false") { Main.DarkTheme(true); }
            else { Main.DarkTheme(false); }
            //CBA to do the dynamic url thing I normally do, nothing sensitive is being sent over anyway.
            if (Main.accountContainer.contentWindow != null) { Main.accountContainer.contentWindow.postMessage("UPDATE_THEME", "*" /*Main.accountContainer.contentWindow?.location.href*/ /*Main.accountContainer.src*/); }
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

    private WindowMessageEvent(ev: MessageEvent<any>): void
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
                        case "BACKGROUND_CLICK":
                            Main.AccountMenuToggle(false);
                            break;
                        case "LOGGED_IN":
                            Main.AccountMenuToggle(false);
                            break;
                        case "LOGGED_OUT":
                            window.location.reload();
                            break;
                        case "ACCOUNT_DELETED":
                            window.location.reload();
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

    public static AccountMenuToggle(show: boolean)
    {
        if (show) { if (Main.accountContainer.contentWindow != null) { Main.accountContainer.contentWindow.postMessage("UPDATE_THEME", "*"); } Main.accountContainer.style.display = "block"; }
        Main.accountContainer.classList.remove(show ? "fadeOut" : "fadeIn");
        Main.accountContainer.classList.add(show ? "fadeIn" : "fadeOut");
        if (!show) { setTimeout(() => { Main.accountContainer.style.display = "none"; }, 399); }
    }

    public static TypeOfReturnData(data: any): data is ReturnData
    {
        return (data as ReturnData).error !== undefined && (data as ReturnData).data !== undefined;
    }

    public static ThrowIfNullOrUndefined(variable: any): any
    {
        if (variable === null || variable === undefined) { throw new TypeError(`${variable} is null or undefined`); }
        return variable;
    }

    public static DarkTheme(dark: boolean): void
    {
        Main.SetCache("READIE_DARK", dark ? "true" : "false", 365);
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
        var hostSplit = window.location.host.split(".");
        var domain = `.${hostSplit[hostSplit.length - 2]}.${hostSplit[hostSplit.length - 1]}`;
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

export interface ReturnData
{
    error: boolean,
    data: any
}